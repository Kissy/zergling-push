import * as Phaser from "phaser";

class RemoteSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        /*this.name = event.id();

        this.currentSnapshot = event;
        this.targetSnapshot = event;*/
    }

    update (time, delta) {
        // Network reconciliation
        const targetAngle = Phaser.Math.Angle.Wrap(this.targetSnapshot.rotation() - this.currentSnapshot.rotation());
        this.rotation = this.currentSnapshot.rotation() + targetAngle * this.scene.getSnapshotCurrentTime();
        this.x = Phaser.Math.Linear(this.currentSnapshot.x(), this.targetSnapshot.x(), this.scene.getSnapshotCurrentTime());
        this.y = Phaser.Math.Linear(this.currentSnapshot.y(), this.targetSnapshot.y(), this.scene.getSnapshotCurrentTime());
    }

    updateTargetSnapshot (playerSnapshot) {
        this.currentSnapshot = this.targetSnapshot;
        this.targetSnapshot = playerSnapshot;
    }

    getId() {
        return this.currentSnapshot.id();
    }
}

export default RemoteSprite
