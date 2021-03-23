module deep.games.dropper {

    export class Lives extends createjs.Container {

        private label:createjs.Bitmap;
        private field:createjs.BitmapText;

        constructor () {
            super();

            this.label = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/lives"));
            this.label.regY = this.label.getBounds().height;
            this.addChild(this.label);

            this.field = sdk.text.BitmapTextFactory.make(Constants.FONT1,"0");
            this.field.scaleX = this.field.scaleY = 0.75;
            this.field.x = 10;
            this.addChild(this.field);
        }

        public updateLives = ( lives:number ) : void => {
            this.field.text = lives.toString();
        };

    }

}