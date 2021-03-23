module deep.games.dropper {

    export class Preview extends sdk.games.AbstractCreateJSPreview {

        constructor () {
            super();
        }

        protected start () : void {
            ObjectFactory.init();
            var dropper:DropAndCatch = new DropAndCatch(undefined,undefined);
            dropper.startPreview();
            this.stage.addChild(dropper);
        }
    }
}