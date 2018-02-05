import Player from "./Player";
import * as Phaser from "phaser";

class RemotePlayer extends Player {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        /*this.currentSnapShotDebug = this.scene.add.sprite(x, y, texture);
        this.currentSnapShotDebug.alpha = 0.3;
        this.targetSnapShotDebug = this.scene.add.sprite(x, y, texture);
        this.targetSnapShotDebug.alpha = 0.6;*/
    }

    update(time, delta) {
        super.update(time, delta);

        // Network reconciliation
        const targetAngle = Phaser.Math.Angle.Wrap(this.targetSnapshot.rotation() - this.currentSnapshot.rotation());
        this.rotation = this.currentSnapshot.rotation() + targetAngle * this.scene.getSnapshotCurrentTime();
        this.x = Phaser.Math.Linear(this.currentSnapshot.x(), this.targetSnapshot.x(), this.scene.getSnapshotCurrentTime());
        this.y = Phaser.Math.Linear(this.currentSnapshot.y(), this.targetSnapshot.y(), this.scene.getSnapshotCurrentTime());

        /*this.currentSnapShotDebug.x = this.currentSnapshot.x();
        this.currentSnapShotDebug.y = this.currentSnapshot.y();
        this.currentSnapShotDebug.rotation = this.currentSnapshot.rotation();
        this.targetSnapShotDebug.x = this.targetSnapshot.x();
        this.targetSnapShotDebug.y = this.targetSnapshot.y();
        this.targetSnapShotDebug.rotation = this.targetSnapshot.rotation();*/


        this.alpha = this.currentSnapshot.shields() / 3;
    }

    receiveSnapshot(playerSnapshot) {
        this.currentSnapshot = this.targetSnapshot;
        this.targetSnapshot = playerSnapshot;
    }

    getId() {
        return this.currentSnapshot.id();
    }
}

export default RemotePlayer
