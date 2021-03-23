module deep.games.dropper {

    export class BonusGame extends createjs.Container {

        private boxes:createjs.Container[] = [];
        private layout:ILayout;
        private instructions:createjs.Bitmap;
        private instructionsContainer:createjs.Container;
        private picksRemainingText:createjs.BitmapText;
        private picksRemaining:number;
        private icons:createjs.Container[] = [];
        constructor ( private bonusPicks:number, private complete:Function ) {
            super();

            this.layout = deep.Bridge.GameLayout;

            this.picksRemaining = bonusPicks;


            this.instructionsContainer = new createjs.Container();
            this.addChild(this.instructionsContainer);

            this.instructions = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/bonusroundinstructions"));
            sdk.utils.CreateJSUtils.setReg(this.instructions,sdk.layout.Registration.BottomCenter);
            this.instructions.x = 200;
            this.instructionsContainer.addChild(this.instructions);

            this.picksRemainingText = sdk.text.BitmapTextFactory.make(Constants.FONT1,this.picksRemaining.toString());
            sdk.utils.LayoutUtils.applyProps(this.picksRemainingText,this.layout.bonusRound.picks);
            this.instructionsContainer.addChild(this.picksRemainingText);

            sdk.utils.CreateJSUtils.centerRegX(this.instructionsContainer);
            this.instructionsContainer.x = 200;
            this.instructionsContainer.y = deep.Bridge.DisplayInfo.StageHeight + this.instructionsContainer.getBounds().height;

            createjs.Tween.get(this.instructionsContainer)
                .wait(800)
                .to({ y:deep.Bridge.DisplayInfo.StageHeight }, 500, createjs.Ease.quadOut);


            this.boxes = [];
            for (var i:number=0; i<6; i++) {
                var box:createjs.Container = new createjs.Container();
                this.addChild(box);

                var boxImage:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("bonus"));
                sdk.utils.CreateJSUtils.resizeToFit(boxImage,Constants.BONUS_BOX_SIZE,Constants.BONUS_BOX_SIZE);
                box.addChild(boxImage);

                var hitArea:createjs.Shape = new createjs.Shape();
                hitArea.graphics
                    .f("#000")
                    .dr(0,0,Constants.BONUS_BOX_SIZE,Constants.BONUS_BOX_SIZE)
                    .ef();
                box.hitArea = hitArea;

                sdk.utils.CreateJSUtils.centerReg(box);
                box.addEventListener("click", this.onBoxClick);
                box.name = i.toString();
                this.boxes.push(box);
            }

            this.boxes[0].x = this.layout.bonusRound.boxLoc[0].x;
            this.boxes[0].y = -200;

            this.boxes[1].x = this.layout.bonusRound.boxLoc[1].x;
            this.boxes[1].y = -200;

            this.boxes[2].x = this.layout.bonusRound.boxLoc[2].x;
            this.boxes[2].y = -200;

            this.boxes[3].x = this.layout.bonusRound.boxLoc[3].x;
            this.boxes[3].y = -200;

            this.boxes[4].x = this.layout.bonusRound.boxLoc[4].x;
            this.boxes[4].y = -200;

            this.boxes[5].x = this.layout.bonusRound.boxLoc[5].x;
            this.boxes[5].y = -200;

            deep.Bridge.Sound.play("sound/bonusround");

            createjs.Tween.get(this.boxes[0])
                .wait(300)
                .to({ y:this.layout.bonusRound.boxLoc[0].y }, 500, createjs.Ease.quadOut);

            createjs.Tween.get(this.boxes[1])
                .wait(500)
                .to({ y:this.layout.bonusRound.boxLoc[1].y }, 500, createjs.Ease.quadOut);

            createjs.Tween.get(this.boxes[2])
                .wait(700)
                .to({ y:this.layout.bonusRound.boxLoc[2].y }, 500, createjs.Ease.quadOut);

            createjs.Tween.get(this.boxes[3])
                .wait(200)
                .to({ y:this.layout.bonusRound.boxLoc[3].y }, 500, createjs.Ease.quadOut);

            createjs.Tween.get(this.boxes[4])
                .wait(400)
                .to({ y:this.layout.bonusRound.boxLoc[4].y }, 500, createjs.Ease.quadOut);

            createjs.Tween.get(this.boxes[5])
                .wait(600)
                .to({ y:this.layout.bonusRound.boxLoc[5].y }, 500, createjs.Ease.quadOut);
        }

        private onBoxClick = ( event:createjs.Event ) : void => {
            if(!createjs.Ticker.paused) {
                event.currentTarget.removeAllEventListeners();

                // Figure out if this pick is a winner or a loser.
                var winner:boolean;
                if ((this.picksRemaining > 1 && this.picksRemaining === this.bonusPicks) || gPlayResult.Result === sdk.gameplay.PlayResult.LOSE) {
                    // This player has more than 1 pick and hasn't made any picks yet. Force a loser just so they don't pick right on the first pick.
                    // OR
                    // This player will never win.
                    winner = false;
                } else {
                    // This player will win.

                    // If this is the last pick, they need to win now. Otherwise make it random.
                    if (this.picksRemaining === 1) {
                        winner = true;
                    } else {
                        // Flip a coin to determine if it's on this pick or not.
                        winner = (Math.floor(Math.random() * 2) === 0);
                    }
                }

                // Decrement the number of picks remaining.
                this.picksRemaining--;
                this.picksRemainingText.text = this.picksRemaining.toString();

                var bonusRoundComplete:boolean = this.picksRemaining === 0 || winner;

                createjs.Tween.get(event.target)
                    .to({scaleX: 0, scaleY: 0}, 300, createjs.Ease.quartIn)
                    .call(() => {
                        var iconContainer:createjs.Container = new createjs.Container();
                        iconContainer.x = event.target.x;
                        iconContainer.y = event.target.y;
                        iconContainer.scaleX = iconContainer.scaleY = 0;
                        this.addChild(iconContainer);

                        this.icons.push(iconContainer);

                        var icon:createjs.Bitmap;
                        var sound:string;
                        if (winner) {
                            icon = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/bonuswinicon"));
                            sound = "sound/bonuswin";
                        } else {
                            icon = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/bonuswrongicon"));
                            sound = "sound/bonuslose";
                        }

                        sdk.utils.CreateJSUtils.resizeToFit(icon, Constants.BONUS_OBJECT_SIZE, Constants.BONUS_OBJECT_SIZE);
                        sdk.utils.CreateJSUtils.centerReg(icon);
                        iconContainer.addChild(icon);

                        deep.Bridge.Sound.play(sound);

                        createjs.Tween.get(iconContainer)
                            .to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.quartOut)
                            .call(() => {
                                if (bonusRoundComplete) {

                                    // Animate the title off screen
                                    createjs.Tween.get(this.instructionsContainer)
                                        .wait(300)
                                        .to({y: deep.Bridge.DisplayInfo.StageHeight + this.instructionsContainer.getBounds().height}, 500, createjs.Ease.quadOut);

                                    // Add a continue button and animate it on-screen.
                                    var continueContainer = sdk.utils.CreateJSUtils.makeResizedWrapper(
                                        new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/continue")),
                                        this.layout.bonusRound.continueMaxArea.width,
                                        this.layout.bonusRound.continueMaxArea.height,
                                        true,
                                        true
                                    );

                                    sdk.utils.CreateJSUtils.centerReg(continueContainer);
                                    continueContainer.x = this.layout.bonusRound.continue.x;
                                    continueContainer.y = this.layout.bonusRound.continue.y;

                                    continueContainer.addEventListener("click", () => {
                                        if(!createjs.Ticker.paused) {
                                            continueContainer.removeAllEventListeners();
                                            // Stop all the animations on the icons
                                            for (var i = 0; i < this.icons.length; i++) {
                                                createjs.Tween.removeTweens(this.icons[i]);
                                            }

                                            this.complete.apply(null);
                                        }
                                    });

                                    continueContainer.alpha = 0;

                                    this.addChild(continueContainer);

                                    createjs.Tween.get(continueContainer)
                                        .wait(1000)
                                        .to({alpha: 1}, 500);
                                }

                                createjs.Tween.get(iconContainer, {loop: -1})
                                    .to({scaleX: 0.9, scaleY: 0.9}, 800, createjs.Ease.quadInOut)
                                    .to({scaleX: 1, scaleY: 1}, 800, createjs.Ease.quadInOut);
                            });
                    });

                // If the bonus round is done, remove all event listeners on all boxes to make sure none are active.
                if (bonusRoundComplete) {
                    for (var i:number = 0; i < this.boxes.length; i++) {
                        var box:createjs.Container = this.boxes[i];
                        box.removeAllEventListeners();
                    }
                }
            }
        };

    }

}