
   /*
    * Copyright 2012 The Netty Project
    *
    * The Netty Project licenses this file to you under the Apache License,
    * version 2.0 (the "License"); you may not use this file except in compliance
    * with the License. You may obtain a copy of the License at:
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
   * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
   * License for the specific language governing permissions and limitations
   * under the License.
   */
   package fr.kissy.zergling_push.infrastructure;
  
  import io.netty.buffer.Unpooled;
  import io.netty.channel.ChannelFuture;
  import io.netty.channel.ChannelFutureListener;
  import io.netty.channel.ChannelHandlerContext;
  import io.netty.channel.DefaultFileRegion;
  import io.netty.channel.SimpleChannelInboundHandler;
  import io.netty.handler.codec.http.DefaultFullHttpResponse;
  import io.netty.handler.codec.http.DefaultHttpResponse;
  import io.netty.handler.codec.http.FullHttpRequest;
  import io.netty.handler.codec.http.FullHttpResponse;
  import io.netty.handler.codec.http.HttpChunkedInput;
  import io.netty.handler.codec.http.HttpHeaderNames;
  import io.netty.handler.codec.http.HttpUtil;
  import io.netty.handler.codec.http.HttpHeaderValues;
  import io.netty.handler.codec.http.HttpResponse;
  import io.netty.handler.codec.http.HttpResponseStatus;
  import io.netty.handler.codec.http.LastHttpContent;
  import io.netty.handler.ssl.SslHandler;
  import io.netty.handler.stream.ChunkedFile;
  import io.netty.util.CharsetUtil;

  import javax.activation.MimetypesFileTypeMap;
  import java.io.File;
  import java.io.FileNotFoundException;
  import java.io.RandomAccessFile;
  import java.io.UnsupportedEncodingException;
  import java.net.URLDecoder;
  import java.text.SimpleDateFormat;
  import java.util.Calendar;
  import java.util.Date;
  import java.util.GregorianCalendar;
  import java.util.Locale;
  import java.util.TimeZone;

  import static io.netty.handler.codec.http.HttpMethod.*;
  import static io.netty.handler.codec.http.HttpResponseStatus.*;
  import static io.netty.handler.codec.http.HttpVersion.*;
  
  /**
   * A simple handler that serves incoming HTTP requests to send their respective
   * HTTP responses.  It also implements {@code 'If-Modified-Since'} header to
   * take advantage of browser cache, as described in
   * <a href="http://tools.ietf.org/html/rfc2616#section-14.25">RFC 2616</a>.
   *
   * <h3>How Browser Caching Works</h3>
   *
   * Web browser caching works with HTTP headers as illustrated by the following
   * sample:
   * <ol>
   * <li>Request #1 returns the content of {@code /file1.txt}.</li>
   * <li>Contents of {@code /file1.txt} is cached by the browser.</li>
   * <li>Request #2 for {@code /file1.txt} does return the contents of the
   *     file again. Rather, a 304 Not Modified is returned. This tells the
   *     browser to use the contents stored in its cache.</li>
   * <li>The server knows the file has not been modified because the
   *     {@code If-Modified-Since} date is the same as the file's last
   *     modified date.</li>
   * </ol>
   *
   * <pre>
   * Request #1 Headers
   * ===================
   * GET /file1.txt HTTP/1.1
   *
   * Response #1 Headers
   * ===================
   * HTTP/1.1 200 OK
   * Date:               Tue, 01 Mar 2011 22:44:26 GMT
   * Last-Modified:      Wed, 30 Jun 2010 21:36:48 GMT
   * Expires:            Tue, 01 Mar 2012 22:44:26 GMT
   * Cache-Control:      private, max-age=31536000
   *
   * Request #2 Headers
   * ===================
   * GET /file1.txt HTTP/1.1
   * If-Modified-Since:  Wed, 30 Jun 2010 21:36:48 GMT
   *
  * Response #2 Headers
  * ===================
  * HTTP/1.1 304 Not Modified
  * Date:               Tue, 01 Mar 2011 22:44:28 GMT
  *
  * </pre>
  */
 public class HttpStaticFileServerHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
 
     private static final String HTTP_DATE_FORMAT = "EEE, dd MMM yyyy HH:mm:ss zzz";
     private static final String HTTP_DATE_GMT_TIMEZONE = "GMT";

     @Override
     public void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
         if (!request.decoderResult().isSuccess()) {
             sendError(ctx, BAD_REQUEST);
             return;
         }
 
         if (request.method() != GET) {
             sendError(ctx, METHOD_NOT_ALLOWED);
             return;
         }
 
         final String uri = request.uri();
         final String path = sanitizeUri(uri);
         File file = new File(path);
         if (file.isHidden() || !file.exists()) {
             sendError(ctx, NOT_FOUND);
             return;
         }
 
         if (!file.isFile()) {
             sendError(ctx, FORBIDDEN);
             return;
         }
 
         RandomAccessFile raf;
         try {
             raf = new RandomAccessFile(file, "r");
         } catch (FileNotFoundException ignore) {
             sendError(ctx, NOT_FOUND);
             return;
         }
         long fileLength = raf.length();
 
         HttpResponse response = new DefaultHttpResponse(HTTP_1_1, OK);
         HttpUtil.setContentLength(response, fileLength);
         setContentTypeHeader(response, file);
         setDateAndCacheHeaders(response, file);
         if (HttpUtil.isKeepAlive(request)) {
             response.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.KEEP_ALIVE);
         }
 
         // Write the initial line and the header.
         ctx.write(response);
 
         // Write the content.
         ChannelFuture lastContentFuture;
         if (ctx.pipeline().get(SslHandler.class) == null) {
             ctx.write(new DefaultFileRegion(raf.getChannel(), 0, fileLength), ctx.newProgressivePromise());
             lastContentFuture = ctx.writeAndFlush(LastHttpContent.EMPTY_LAST_CONTENT);
         } else {
             lastContentFuture =
                     ctx.writeAndFlush(new HttpChunkedInput(new ChunkedFile(raf, 0, fileLength, 8192)),
                             ctx.newProgressivePromise());
         }
 
         // Decide whether to close the connection or not.
         if (!HttpUtil.isKeepAlive(request)) {
             // Close the connection when the whole content is written out.
             lastContentFuture.addListener(ChannelFutureListener.CLOSE);
         }
     }
 
     @Override
     public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
         cause.printStackTrace();
         if (ctx.channel().isActive()) {
             sendError(ctx, INTERNAL_SERVER_ERROR);
         }
     }

      private static String sanitizeUri(String uri) {
         // Decode the path.
         try {
             uri = URLDecoder.decode(uri, "UTF-8");
         } catch (UnsupportedEncodingException e) {
             throw new Error(e);
         }
 
         if (uri.isEmpty() || uri.charAt(0) != '/' || uri.equals("/")) {
             uri = "/index.html";
         }

         uri = uri.replace('/', File.separatorChar);
         return "src" + File.separator + "main" + File.separator + "webapp"  + uri;
     }

      private static void sendError(ChannelHandlerContext ctx, HttpResponseStatus status) {
         FullHttpResponse response = new DefaultFullHttpResponse(
                 HTTP_1_1, status, Unpooled.copiedBuffer("Failure: " + status + "\r\n", CharsetUtil.UTF_8));
         response.headers().set(HttpHeaderNames.CONTENT_TYPE, "text/plain; charset=UTF-8");
 
         // Close the connection as soon as the error message is sent.
         ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
     }

      /**
      * Sets the Date and Cache headers for the HTTP Response
      *
      * @param response
      *            HTTP response
      * @param fileToCache
      *            file to extract content type
      */
     private static void setDateAndCacheHeaders(HttpResponse response, File fileToCache) {
         SimpleDateFormat dateFormatter = new SimpleDateFormat(HTTP_DATE_FORMAT, Locale.US);
         dateFormatter.setTimeZone(TimeZone.getTimeZone(HTTP_DATE_GMT_TIMEZONE));
 
         // Date header
         Calendar time = new GregorianCalendar();
         response.headers().set(HttpHeaderNames.DATE, dateFormatter.format(time.getTime()));
 
         // Add cache headers
         response.headers().set(HttpHeaderNames.EXPIRES, dateFormatter.format(time.getTime()));
         response.headers().set(HttpHeaderNames.CACHE_CONTROL, "no-store");
         response.headers().set(HttpHeaderNames.LAST_MODIFIED, dateFormatter.format(new Date(fileToCache.lastModified())));
     }
 
     /**
      * Sets the content type header for the HTTP Response
      *
      * @param response
      *            HTTP response
      * @param file
      *            file to extract content type
      */
     private static void setContentTypeHeader(HttpResponse response, File file) {
         MimetypesFileTypeMap mimeTypesMap = new MimetypesFileTypeMap();
         response.headers().set(HttpHeaderNames.CONTENT_TYPE, mimeTypesMap.getContentType(file.getPath()));
     }
 }
