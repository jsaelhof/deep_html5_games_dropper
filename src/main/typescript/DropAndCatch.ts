module deep.games.dropper {

    export class DropAndCatch extends createjs.Container {

        private layout:ILayout;
        private logo:createjs.Bitmap;
        private dropsView:createjs.Container;
        private cart:Cart;
        private activeDrops:any = {};
        private score:number = 0;
        private drops:number = 0;
        private bombs:number = 0;
        private bombCatches:number = 0;
        private catches:number = 0;
        private bonusPicks:number = 1;
        private dropper:Dropper;
        private pointsView:Points;
        private scoreView:Score;
        private livesView:Lives;
        private bonusGame:BonusGame;
        private summary:Summary;
        private cartLevel:number;
        private lives:number;
        private flasher:Flasher;
        private bonusPickView:BonusPick;

        constructor ( private leaderboardEnabled:boolean, private prizesEnabled:boolean ) {
            super();

            createjs.MotionGuidePlugin.install();

            this.layout = deep.Bridge.GameLayout;

            this.cartLevel = parseInt(deep.Bridge.GameInfo.GameDescriptor.getProperty("cartLevel"));

            this.lives = Constants.LIVES;

            this.dropper = new Dropper ();

            var background:createjs.Bitmap = new createjs.Bitmap( deep.Bridge.GameAssets.getAsset("background") );
            sdk.utils.CreateJSUtils.centerReg(background);
            sdk.utils.CreateJSUtils.centerStage(background);
            this.addChild(background);

            if (deep.Bridge.GameAssets.hasAsset("logo")) {
                var logo:createjs.Container = sdk.utils.CreateJSUtils.makeResizedWrapper(
                    new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("logo")),
                    this.layout.logoArea.width,
                    this.layout.logoArea.height
                );

                sdk.utils.CreateJSUtils.centerRegX(logo);
                sdk.utils.CreateJSUtils.centerStageX(logo);
                this.addChild(logo);
            }

            this.bonusPickView = new BonusPick();
            // If the logo is enabled, move the bonus pick view down below it.
            if (deep.Bridge.GameAssets.hasAsset("logo")) this.bonusPickView.y = logo.getTransformedBounds().height;
            this.addChild(this.bonusPickView);

            this.dropsView = new createjs.Container();

            this.cart = new Cart();

            if (deep.Bridge.GameInfo.GameDescriptor.getProperty("cartPosition") === "front") {
                this.addChild(this.dropsView);
                this.addChild(this.cart);
            } else {
                this.addChild(this.cart);
                this.addChild(this.dropsView);
            }

            this.cart.alpha = 0;

            this.scoreView = new Score();
            sdk.utils.LayoutUtils.applyProps( this.scoreView, this.layout.score );
            this.addChild(this.scoreView);
            this.scoreView.alpha = 0;
            this.scoreView.updateScore(0);

            this.livesView = new Lives();
            sdk.utils.LayoutUtils.applyProps( this.livesView, this.layout.lives );
            this.addChild(this.livesView);
            this.livesView.alpha = 0;
            this.livesView.updateLives(this.lives);

            this.pointsView = new Points();
            this.addChild(this.pointsView);

            this.flasher = new Flasher();
            this.addChild(this.flasher);
        }

        public startPreview () : void {
            this.cart.alpha = 1;
            this.scoreView.alpha = 1;
            this.livesView.alpha = 1;

            var dropObj1:DropObject = new DropObject(ObjectFactory.getObject(Constants.OBJECTS.object1.id),Constants.OBJECTS.object1,80,230,Constants.DROP_BOUNDS.bottom);
            this.addChild(dropObj1);

            if (deep.Bridge.GameAssets.hasAsset( Constants.OBJECTS.object2.id )) {
                var dropObj2:DropObject = new DropObject(ObjectFactory.getObject(Constants.OBJECTS.object2.id),Constants.OBJECTS.object2,200,290,Constants.DROP_BOUNDS.bottom);
                this.addChild(dropObj2);
            }

            if (deep.Bridge.GameAssets.hasAsset( Constants.OBJECTS.object3.id )) {
                var dropObj3:DropObject = new DropObject(ObjectFactory.getObject(Constants.OBJECTS.object3.id),Constants.OBJECTS.object3,320,350,Constants.DROP_BOUNDS.bottom);
                this.addChild(dropObj3);
            }

            if (deep.Bridge.GameAssets.hasAsset("bomb")) {
                var bomb:DropObject = new DropObject(ObjectFactory.getObject(Constants.OBJECTS.bomb.id),Constants.OBJECTS.bomb,120,410,Constants.DROP_BOUNDS.bottom);
                this.addChild(bomb);
            }
        }

        public start () : void {

            // Mark the last played time. This is used on startup to know whether the player should see the tutorial again.
            deep.Bridge.saveGameItem("lastPlayed",Date.now().toString());

            createjs.Tween.get(this.cart)
                .to( {alpha:1}, 500 );

            createjs.Tween.get(this.scoreView)
                .to( {alpha:1}, 500 );

            createjs.Tween.get(this.livesView)
                .to( {alpha:1}, 500 );

            var countdown:sdk.component.Countdown = new sdk.component.Countdown();
            this.addChild(countdown);
            sdk.utils.CreateJSUtils.centerStage(countdown);
            countdown.start({
                onComplete: () => {
                    if (gPlayResult) {
                        this.dropper.start(this.drop);
                        createjs.Ticker.addEventListener("tick",this.onGameTick);
                        this.removeChild(countdown);
                    } else {
                        deep.Bridge.showError("No Prize Result");
                    }
                }
            });

            if (createjs.Touch.isSupported()) {
                createjs.Touch.enable(this.stage);
                this.stage.addEventListener("stagemousemove",this.onTouchMove);
            }

            document.onmousemove = ( event:MouseEvent ) : void => {
                var stagePoint:createjs.Point = sdk.utils.CreateJSUtils.windowToStage(new createjs.Point(event.clientX, event.clientY));
                this.onMouseMove(stagePoint);
            };
        }

        private onTouchMove = (event:createjs.MouseEvent) : void => {
            var stagePoint:createjs.Point = sdk.utils.CreateJSUtils.canvasToStage(new createjs.Point(event.rawX, event.rawY));
            this.onMouseMove(stagePoint);
        };


        private onMouseMove = ( localPoint:createjs.Point ) : void => {
            if (!createjs.Ticker.paused) {
                var newX:number = localPoint.x;
                if (localPoint.x < this.cart.CatchZoneWidth/2) {
                    newX = this.cart.CatchZoneWidth/2
                } else if (localPoint.x > deep.Bridge.DisplayInfo.StageWidth - this.cart.CatchZoneWidth/2) {
                    newX = deep.Bridge.DisplayInfo.StageWidth - this.cart.CatchZoneWidth/2;
                }
                this.cart.x = newX;
            }
        };

        private drop = ( dropObjData:IObject, point:createjs.Point, duration:number ) : void => {
            // Create the drop object
            var dropObj:DropObject = new DropObject(ObjectFactory.getObject(dropObjData.id),dropObjData,point.x,point.y,Constants.DROP_BOUNDS.bottom,duration);

            // Track this drop throughout its lifespan
            this.activeDrops[dropObj.id] = dropObj;

            // Track the total number of drops
            if (dropObj.isBomb()) {
                this.bombs++;
            } else {
                this.drops++;
            }

            // Add it to the layer for dropped objects
            this.dropsView.addChild(dropObj);
        };

        private removeDropObject ( dropObj:DropObject, completed:boolean ) : void {
            // If the drop is not complete, the stop method fades it out (since it is still visible as opposed to completed drops which just need to be removed off screen or in the bucket)
            dropObj.stop( completed, () => {
                this.dropsView.removeChild(dropObj);
            } );
            delete this.activeDrops[dropObj.id];
        }

        private onGameTick = ( event:createjs.Event ) : void => {
            if(!event.paused) {
                // Counts the number of active drops for this tick.
                // This is used later in the loop to stop the game at the right time.
                var dropCount:number = 0;

                // Check for catches
                for (var a in this.activeDrops) {
                    var dropObj:DropObject = this.activeDrops[a];

                    dropCount++;

                    // If the drop has reached its destination, it was never caught.
                    // Remove it.
                    // Due to a precision issue within the tween, some of the objects finish at
                    // 660.000000001 instead of 660. Likewise they sometimes finish at 659.99999999.
                    // Because of this, I'm rounding them to the nearest whole pixel. Anything within
                    // 659.5 and 660.5 will round to 660 and be treated as caught.
                    // I'm also checking for >= instead of just == so that if an object goes beyond
                    // 660.5 it will still be caught.
                    // These precision issues usually occur when an item bounces off the cart.
                    if (Math.round(dropObj.y) >= Constants.DROP_BOUNDS.bottom) {
                        // If this is not a bomb, then it counts as a miss if it hits the bottom. Bombs are ok to miss or bounce off.
                        if (!dropObj.isBomb()) {
                            this.decrementLives();
                        }
                        this.removeDropObject(dropObj, true);
                        continue;
                    }

                    // Efficient sanity check.
                    // We know that the object can't collide until it's near the bottom of the screen.
                    // If it's not near the bottom, don't even bother to check it.
                    //
                    // NOTE: The dropObj.State is important to prevent the same object from triggering
                    // collisions on subsequent frames. This was first noticed when the object bounces
                    // off the catcher. In that case the intersection would flag 3 times and this.onBounce
                    // would end up getting called three times.
                    if (dropObj.y >= this.cartLevel && dropObj.State == DropObjectState.FALLING) {
                        // Check for a collision

                        // Get a rect of both the object and the cart's area within this coordinate space
                        var dR:createjs.Rectangle = dropObj.Rect;
                        var cR:createjs.Rectangle = this.cart.Rect;

                        // Check if the two intersect at all. If not, the object is passing completely
                        // by on the left or the right and not overlapping with the cart at all.
                        if (!(dR.x + dR.width < cR.x || cR.x + cR.width < dR.x)) {
                            // There was an overlap between the two rectangles in the x dimension.
                            // If the point of the object (centered) is between the left and right coords of
                            // cart's rect, then it counts as caught (at least 50% of the object is inside the
                            // catch zone). If not, bounce it off. The bounce hanlder will figure out where to
                            // bounce it.
                            if (dropObj.x >= cR.x && dropObj.x <= cR.x + cR.width) {
                                dropObj.State = DropObjectState.CAUGHT;
                                this.onCatch(dropObj);
                            } else {
                                dropObj.State = DropObjectState.BOUNCED;
                                this.onBounce(dropObj);
                            }
                        }
                    }
                }

                // Is the game over?
                if (this.lives <= 0) {
                    // Stop any new drops.
                    this.dropper.stop();

                    // Stop the active drops. Any incomplete drops are removed and faded out.
                    document.onmousemove = undefined;
                    this.stage.removeEventListener("stagemousemove", this.onTouchMove);

                    createjs.Ticker.removeEventListener("tick", this.onGameTick);

                    for (var a in this.activeDrops) {
                        this.removeDropObject(this.activeDrops[a], false);
                    }

                    // End Game Paths
                    sdk.utils.TickerTimeout.setTimeout(() => {
                        this.showSummary();
                    }, 2000);
                }
            }
        };


        private onCatch ( dropObj:DropObject ) : void {
            if (!dropObj.isBomb()) {

                this.pointsView.addPoints(dropObj.Points, new createjs.Point(dropObj.x,dropObj.y));

                this.score += dropObj.Points;
                this.catches++;
                if (this.prizesEnabled && this.bonusPicks < Constants.MAX_BONUS_PICKS && this.catches >= Constants.CATCHES_FOR_BONUS_PICK[0]) {
                    Constants.CATCHES_FOR_BONUS_PICK.shift();
                    this.bonusPicks++;
                    deep.Bridge.Sound.play("sound/catchbonus");
                    this.bonusPickView.showBonusPick(this.bonusPicks, dropObj.Points, new createjs.Point(dropObj.x,dropObj.y));
                } else {
                    deep.Bridge.Sound.play("sound/catch");
                }
            } else {
                this.bombCatches++;
                this.decrementLives();
            }
            if (this.score < 0) this.score = 0;
            this.scoreView.updateScore(this.score);
            this.removeDropObject(dropObj,true);
        }

        private onBounce ( dropObj:DropObject ) : void {
            createjs.Tween.removeTweens(dropObj);

            var controlPoint:number = ( dropObj.x < this.cart.x ) ? dropObj.x - 60 : dropObj.x + 60;
            var bounceX:number = ( dropObj.x < this.cart.x ) ? dropObj.x - 100 : dropObj.x + 100;

            // Figure out the duration based on the objects current position (how much does it have
            // left to go to reach the bottom from where it is) and how fast its currently going.
            var duration:number = (Constants.DROP_BOUNDS.bottom - dropObj.y) / 0.6;

            createjs.Tween.get(dropObj)
                .to({
                    guide: {
                        path:[ dropObj.x,dropObj.y, controlPoint,dropObj.y,bounceX,Constants.DROP_BOUNDS.bottom ],
                        orient:"fixed"
                    }
                }, duration );

            deep.Bridge.Sound.play("sound/bounce");
        }

        private showSummary () : void {
            if (this.leaderboardEnabled) {
                deep.Bridge.sendGameRequest(new sdk.messaging.GameResultRequest(this.score));
            }

            this.summary = new Summary(this.score, this.prizesEnabled, this.bonusPicks, this.onContinue);
            sdk.utils.LayoutUtils.applyProps(this.summary,this.layout.summary.container);
            sdk.utils.CreateJSUtils.centerReg(this.summary);
            this.addChild(this.summary);

            this.summary.x = deep.Bridge.DisplayInfo.StageWidth/2;
            this.summary.y = -400;
            createjs.Tween.get(this.summary)
                .to({ y:(this.layout.summary.container.y !== undefined) ? this.layout.summary.container.y : deep.Bridge.DisplayInfo.StageHeight/2 }, 500, createjs.Ease.quadOut);

            sdk.utils.TickerTimeout.setTimeout(() => {
                deep.Bridge.Sound.play("sound/summary");
            },250);

            createjs.Tween.get(this.cart)
                .to({alpha: 0}, 250);

            createjs.Tween.get(this.scoreView)
                .to({alpha: 0}, 250);

            createjs.Tween.get(this.livesView)
                .to({alpha: 0}, 250);
        }

        private onContinue = () : void => {
            if (this.prizesEnabled) {
                this.showBonusRound();
            } else {
                deep.Bridge.exitGame();
            }
        };

        private decrementLives () : void {
            deep.Bridge.Sound.play("sound/bomb");
            this.lives--;
            this.livesView.updateLives(this.lives);
            this.flasher.flash();
        }

        private showBonusRound () : void {
            createjs.Tween.get(this.summary)
                .wait(200)
                .to({y: deep.Bridge.DisplayInfo.StageHeight + 400}, 500, createjs.Ease.quadIn)
                .call(() => {
                    this.bonusGame = new BonusGame(this.bonusPicks, this.onBonusGameComplete);
                    this.addChild(this.bonusGame);
                });
        }

        private onBonusGameComplete = () : void => {
            deep.Bridge.exitGame();
        }
    }
}