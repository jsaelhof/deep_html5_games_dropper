module deep.games.dropper {

    export class Score extends createjs.Container {

        private label:createjs.Bitmap;
        private field:createjs.BitmapText;

        constructor () {
            super();

            this.label = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/score"));
            this.label.regX = this.label.getBounds().width;
            this.label.regY = this.label.getBounds().height;
            this.addChild(this.label);

            this.field = sdk.text.BitmapTextFactory.make(Constants.FONT1,"0");
            this.field.scaleX = this.field.scaleY = 0.75;
            this.field.x = -10;
            this.addChild(this.field);
        }

        public updateScore = ( points:number ) : void => {
            this.field.text = points.toString();
            this.field.regX = this.field.getBounds().width;
        };

    }

}