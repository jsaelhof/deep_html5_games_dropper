module deep.games.dropper {

    export enum DropObjectState {
        FALLING,CAUGHT,BOUNCED
    }

    export class DropObject extends createjs.Container {

        private state:DropObjectState = DropObjectState.FALLING;
        private rawWidth:number;
        private rawHeight:number;

        constructor (
            source:createjs.Shape,
            private dropObjData:IObject,
            private origX:number,
            private origY:number,
            private destY:number,
            private duration?:number
        ) {
            super();

            var bounds:createjs.Rectangle = source.getBounds();

            // The width and height of the image, after scaling, but before drop shadows are applied.
            // This is used for determining how much of the object intersects with the cart
            // which determines whether it is caught or bounces off.
            this.rawWidth = bounds.width;
            this.rawHeight = bounds.height;

            // Set the regY to the bottom of the image.
            source.regY = bounds.height;

            // Center the image on the 0 of this container.
            source.regX = bounds.width/2;

            source.filters = [
                new createjs.DropShadowFilter(10,45,0x000000,0.3,20,20)
            ];

            source.cache(0,0,bounds.width,bounds.height);
            this.addChild(source);

            // Position the object for dropping
            this.x = origX;
            this.y = origY;

            // Drop the object
            // Note: If duration is undefined the object doesn't tween. This is used by the preview when we want to show stationary items.
            if (duration) {
                createjs.Tween.get(this)
                    .to( {y:destY}, duration );
            }
        }

        public get Points () : number { return this.dropObjData.points * this.dropObjData.scoreMultiplier; }
        public get State () : DropObjectState { return this.state; }
        public set State ( val:DropObjectState ) { this.state = val; }
        public get Rect () : createjs.Rectangle {
            return new createjs.Rectangle(this.x - this.rawWidth/2,this.y - this.rawHeight,this.rawWidth,this.rawHeight);
        }

        public isBomb () : boolean { return this.dropObjData.bomb; }

        public stop ( completedDrop:boolean, complete:Function ) : void {
            if (completedDrop) {
                createjs.Tween.removeTweens(this);
                complete.apply(null);
            } else {
                createjs.Tween.get(this)
                    .to({alpha: 0}, 500)
                    .call(() => {
                        complete.apply(null);
                    });
            }
        }
    }

}