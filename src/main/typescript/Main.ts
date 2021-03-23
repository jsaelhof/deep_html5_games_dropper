///<reference path="DropAndCatch.ts"/>
///<reference path="ILayout.ts"/>
///<reference path="DropObject.ts"/>
///<reference path="Score.ts"/>
///<reference path="Lives.ts"/>
///<reference path="Dropper.ts"/>
///<reference path="Points.ts"/>
///<reference path="Help.ts"/>
///<reference path="Constants.ts"/>
///<reference path="IObject.ts"/>
///<reference path="Summary.ts"/>
///<reference path="Cart.ts"/>
///<reference path="ObjectFactory.ts"/>

module deep.games.dropper {

    export var gPlayResult:sdk.messaging.PlayResultResponse;

    export class Main extends sdk.games.AbstractCreateJSGame {

        private dropAndCatch:DropAndCatch;
        private help:Help;
        private started:boolean = false;
        private pauseManager:sdk.pause.PauseManager;

        constructor() {
            super();
        }

        protected start():void {
            this.pauseManager = new sdk.pause.PauseManager();

            sdk.text.BitmapTextFactory.setDefaultProps(Constants.FONT1,{ letterSpacing:2 });

            // Handling displaying the Help
            deep.Bridge.addEventListener(sdk.events.HelpEvent.HELP, () => {
                if (!this.stage.contains(this.help)) {
                    this.stage.addChild(this.help);
                }
            });

            ObjectFactory.init();

            this.dropAndCatch = new DropAndCatch( deep.Bridge.LeaderboardInfo.LeaderboardEnabled, deep.Bridge.PrizeInfo.PrizesEnabled );
            this.stage.addChild(this.dropAndCatch);

            var lastPlayed:string = deep.Bridge.getGameItem("lastPlayed");
            if (lastPlayed !== undefined && Date.now() - parseInt(lastPlayed) < 432000000) {
                this.started = true;
                this.dropAndCatch.start();
            } else {
                //this.whackamole.startTutorial();
                this.help = new Help();

                // Handle closing the help
                this.help.addEventListener("play",() => {
                    this.stage.removeChild(this.help);

                    this.pauseManager.closeHelp();

                    // If the game is not started, call start.
                    // Otherwise, unpausing the ticker is enough to resume.
                    if (!this.started) {
                        this.started = true;
                        this.dropAndCatch.start();
                    }
                });
                this.stage.addChild(this.help);
            }

            deep.Bridge.sendGameReady();
        }

        protected onPlayResult (response:sdk.messaging.PlayResultResponse) : void {
            gPlayResult = response;
        }
    }
}