module deep.games.dropper {

    export class Summary extends createjs.Container {

        constructor ( score:number, prizesEnabled:boolean, bonusPicks:number, continueCallback:Function ) {
            super();

            var layout:ILayout = deep.Bridge.GameLayout;

            var summaryBackground:createjs.Bitmap = new createjs.Bitmap(
                deep.Bridge.GameAssets.getAsset(
                    prizesEnabled ? "lang/summarybonus" : "lang/summary"
                )
            );
            this.addChild(summaryBackground);

            var scoreContainer:createjs.BitmapText = sdk.text.BitmapTextFactory.make(
                Constants.FONT1,
                score.toString(),
                prizesEnabled ? layout.summary.scoreBonus : layout.summary.scoreNoBonus,
                sdk.layout.Registration.TopCenter
            );
            this.addChild(scoreContainer);


            if (prizesEnabled) {
                var bonusPicksContainer:createjs.BitmapText = sdk.text.BitmapTextFactory.make(
                    Constants.FONT1,
                    bonusPicks.toString(),
                    layout.summary.bonusPicks,
                    sdk.layout.Registration.TopCenter
                );
                this.addChild(bonusPicksContainer);
            }


            sdk.utils.TickerTimeout.setTimeout(() => {
                var continueContainer = sdk.utils.CreateJSUtils.makeResizedWrapper(
                    new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/continue")),
                    layout.summary.continueMaxArea.width,
                    layout.summary.continueMaxArea.height,
                    true,
                    true
                );

                sdk.utils.CreateJSUtils.centerReg(continueContainer);
                continueContainer.x = layout.summary.continue.x;
                continueContainer.y = layout.summary.continue.y;

                continueContainer.addEventListener("click",() => {
                    if(!createjs.Ticker.paused) {
                        continueContainer.removeAllEventListeners();
                        continueCallback.apply(null);
                    }
                });

                continueContainer.alpha = 0;

                this.addChild(continueContainer);

                createjs.Tween.get(continueContainer)
                    .to( { alpha:1 }, 500 );
            }, 1000);

        }

    }

}