module deep.games.dropper {

    export class Cart extends createjs.Container {

        private cart:createjs.Bitmap;
        private catchZoneWidth:number;
        private catchZoneHeight:number;
        private offsetLeft:number;
        private offsetRight:number;
        private offsetTop:number;

        constructor () {
            super();

            this.offsetLeft = parseInt(deep.Bridge.GameInfo.GameDescriptor.getProperty("cartLeftOffset"));
            this.offsetRight = parseInt(deep.Bridge.GameInfo.GameDescriptor.getProperty("cartRightOffset"));
            this.offsetTop = parseInt(deep.Bridge.GameInfo.GameDescriptor.getProperty("cartTopOffset"));

            this.cart = new createjs.Bitmap( deep.Bridge.GameAssets.getAsset("cart") );
            var cartBounds:createjs.Rectangle = this.cart.getBounds();
            this.addChild(this.cart);

            this.catchZoneWidth = cartBounds.width - (this.offsetLeft + this.offsetRight);
            this.catchZoneHeight = 3;

            this.cart.filters = [
                new createjs.DropShadowFilter(10,45,0x000000,0.3,20,20)
            ];
            this.cart.cache(0,0,cartBounds.width,cartBounds.height);

            if (Bridge.Preview && Bridge.PreviewInfo.Skill === sdk.data.Skill.ADVANCED) {
                var zone:createjs.Shape = new createjs.Shape();
                zone.graphics
                    .f("rgba(0,0,0,0.4)")
                    .dr(0,0,this.catchZoneWidth,13)
                    .ef();
                zone.x = this.offsetLeft;
                zone.y = this.offsetTop;
                this.addChild(zone);

                let label:createjs.Text = new createjs.Text("Catch Area", undefined, "#FFF");
                sdk.utils.CreateJSUtils.centerReg(label);
                label.x = zone.x + (this.catchZoneWidth/2);
                label.y = zone.y + 5;
                this.addChild(label);
            }


            this.regX = this.offsetLeft + (this.catchZoneWidth/2);
            this.regY = this.offsetTop;

            this.x = deep.Bridge.DisplayInfo.StageWidth/2;
            this.y = parseInt(deep.Bridge.GameInfo.GameDescriptor.getProperty("cartLevel"));
        }

        public get Rect () : createjs.Rectangle {
            return new createjs.Rectangle(this.x - this.catchZoneWidth/2,this.y,this.catchZoneWidth,this.catchZoneHeight);
        }

        public get CatchZoneWidth () : number {
            return this.catchZoneWidth;
        }

    }

}
