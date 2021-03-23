module deep.games.dropper {

    export class Points extends createjs.Container {

        constructor () {
            super();
        }

        public addPoints ( points:number, loc:createjs.Point ) : void {
            var s:string = points.toString();
            if (points > 0) s = "+" + s;

            var pointsText:createjs.BitmapText = sdk.text.BitmapTextFactory.make(
                {
                    font: Constants.FONT1,
                    text: s,
                    reg: sdk.layout.Registration.Center
                }
            );

            pointsText.x = loc.x;
            pointsText.y = loc.y - 10;
            pointsText.scaleX = pointsText.scaleY = 0.6;
            pointsText.shadow = new createjs.Shadow("rgba(0,0,0,0.3)",4,4,0);

            createjs.Tween.get(pointsText)
                .to({ y: pointsText.y - 60 }, 400)
                .to({ y: pointsText.y - 75, alpha:0 }, 100)
                .call( () => {
                    this.removeChild(pointsText);
                });

            this.addChild(pointsText);
        }

    }

}