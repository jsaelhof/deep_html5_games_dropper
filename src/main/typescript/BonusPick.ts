module deep.games.dropper {

    export class BonusPick extends createjs.Container {

        private bonusPick:createjs.Bitmap;

        constructor () {
            super();
        }

        public showBonusPick ( bonusPicks:number, points:number, loc:createjs.Point ) : void {

            if (!this.bonusPick) {
                this.bonusPick = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/bonuspick"));
            } else {
                createjs.Tween.removeTweens(this.bonusPick);
                this.removeChild(this.bonusPick);
            }

            this.bonusPick.x = deep.Bridge.DisplayInfo.StageWidth + 10;
            this.bonusPick.y = 10;
            this.bonusPick.scaleX = this.bonusPick.scaleY = 0.5;

            createjs.Tween.get(this.bonusPick)
                .to( {x: deep.Bridge.DisplayInfo.StageWidth - (this.bonusPick.getTransformedBounds().width + 10)}, 400, createjs.Ease.quadOut );

            this.bonusPick.alpha = 0;

            createjs.Tween.get(this.bonusPick)
                .to( {alpha:1}, 200 )
                .wait(2100)
                .to( {alpha:0}, 200 )
                .call( () => {
                    createjs.Tween.removeTweens(this.bonusPick);
                    this.removeChild(this.bonusPick);
                } );

            this.addChild(this.bonusPick);
        }

    }

}