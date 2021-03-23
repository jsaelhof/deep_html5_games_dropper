module deep.games.dropper {

    export class Flasher extends createjs.Container {

        private screen:createjs.Shape;

        constructor () {
            super();
            this.screen = new createjs.Shape();
            this.screen.graphics
                .f("#F00")
                .dr(0,0,deep.Bridge.DisplayInfo.StageWidth,deep.Bridge.DisplayInfo.StageHeight)
                .ef();
        }

        public flash () : void {
            var instance:createjs.Shape = this.screen.clone();
            instance.alpha = 0;
            this.addChild(instance);

            createjs.Tween.get(instance)
                .to({ alpha:0.6 }, 75)
                .wait( 50 )
                .to({ alpha:0 }, 300)
                .call( () => {
                    createjs.Tween.removeTweens(instance);
                    this.removeChild(instance);
                } );
        }

    }

}