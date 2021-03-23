module deep.games.dropper {

    export class Help extends createjs.Container {

        private stack:createjs.Container[] = [];

        private createButton ( id:string ) : createjs.Container {
            var button:createjs.Container = sdk.utils.CreateJSUtils.makeResizedWrapper(
                new createjs.Bitmap(deep.Bridge.GameAssets.getAsset(id)),
                deep.Bridge.GameLayout.summary.continueMaxArea.width,
                deep.Bridge.GameLayout.summary.continueMaxArea.height,
                true,
                true
            );

            sdk.utils.CreateJSUtils.centerReg(button);
            button.x = 200;
            button.y = 595;

            return button;
        }

        constructor () {
            super();

            // Create the first screen
            this.stack.push(this.createScreen1());

            // Create the second screen
            this.stack.push(this.createScreen2());

            // Create the third screen.
            // This screen has a few conditions.
            // First, if prizes are enabled, there will be a fourth screen, so we'll need to show the "next" button
            // If not, then this is the last screen and we'll show the "play" button
            // Second, if bombs are enabled, there is an alternate version of the third screen that explains them
            var button:string;
            if (deep.Bridge.PrizeInfo.PrizesEnabled) {
                button = "lang/next";
            } else {
                button = "lang/play";
            }
            if (deep.Bridge.GameAssets.hasAsset("bomb")) {
                this.stack.push(this.createScreen3BadItems(button));
            } else {
                this.stack.push(this.createScreen3NoBadItems(button));
            }

            // If prizes are enabled, create the fourth screen.
            if (deep.Bridge.PrizeInfo.PrizesEnabled) {
                this.stack.push(this.createScreen4());
            }

            this.addEventListener("added",() => {
                this.nextScreen();
            });
        }

        private nextScreen () : void {
            if (this.stack.length > 0) {
                var screen:createjs.Container = this.stack.shift();
                screen.addEventListener("complete", () => {
                    this.removeChild(screen);
                    this.nextScreen();
                });
                this.addChild(screen);
            } else {
                this.dispatchEvent(new createjs.Event("play",false,false));
            }
        }

        private createScreen1() : createjs.Container {
            var background:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/helpbackground"));
            this.addChild(background);

            var screen1:createjs.Container = new createjs.Container();
            var help1:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help1"));
            sdk.utils.CreateJSUtils.centerRegX(help1);
            help1.x = 200;
            help1.y = 415;
            screen1.addChild( help1 );

            var cart:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("cart"));
            sdk.utils.CreateJSUtils.centerReg(cart);
            sdk.utils.CreateJSUtils.resizeHeightToFit(cart,190,true,true);
            var cartBounds:createjs.Rectangle = cart.getTransformedBounds();
            var cartOffset:number = 125 - cartBounds.width/2;
            var catcherStartX:number = deep.Bridge.DisplayInfo.StageWidth/2 + cartOffset;
            cart.x = catcherStartX;
            cart.y = 305;

            var hand:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("hand"));
            hand.regX = 44;
            hand.regY = 18;
            hand.alpha = 0.8;
            hand.x = cart.x;
            hand.y = cart.y + 30;
            hand.scaleX = hand.scaleY = 0.6;

            var button:createjs.Container = this.createButton("lang/next");
            button.removeAllEventListeners();
            button.addEventListener("click",() => {
                if(!createjs.Ticker.paused) {
                    createjs.Tween.removeTweens(cart);
                    createjs.Tween.removeTweens(hand);

                    screen1.dispatchEvent("complete");
                }
            });
            screen1.addChild( button );

            screen1.addEventListener("added",() => {
                cart.x = catcherStartX;
                hand.x = cart.x;
                createjs.Tween.get(cart, {loop:-1})
                    .to({ x:deep.Bridge.DisplayInfo.StageWidth/2 - cartOffset }, 800, createjs.Ease.quadInOut)
                    .wait(200)
                    .to({ x:catcherStartX }, 800, createjs.Ease.quadInOut)
                    .wait(200);
                createjs.Tween.get(hand, {loop:-1})
                    .to({ x:deep.Bridge.DisplayInfo.StageWidth/2 - cartOffset }, 800, createjs.Ease.quadInOut)
                    .wait(200)
                    .to({ x:catcherStartX }, 800, createjs.Ease.quadInOut)
                    .wait(200);
                screen1.addChild( cart );
                screen1.addChild( hand );
            });

            return screen1;
        }

        private createScreen2() : createjs.Container {
            var screen2:createjs.Container = new createjs.Container();

            var help2:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help2"));
            sdk.utils.CreateJSUtils.centerRegX(help2);
            help2.x = 200;
            help2.y = 260;
            screen2.addChild( help2 );

            var objects:createjs.Container = new createjs.Container();
            var lastX:number = 0;

            var object1:createjs.Shape = ObjectFactory.getObject("object1");
            sdk.utils.CreateJSUtils.resizeToFit(object1,Constants.HELP_OBJECT_SIZE,Constants.HELP_OBJECT_SIZE);
            objects.addChild(object1);
            lastX = object1.x + object1.getTransformedBounds().width;

            if (deep.Bridge.GameAssets.hasAsset("object2")) {
                var object2:createjs.Shape = ObjectFactory.getObject("object2");
                sdk.utils.CreateJSUtils.resizeToFit(object2, Constants.HELP_OBJECT_SIZE, Constants.HELP_OBJECT_SIZE);
                objects.addChild(object2);
                object2.x = lastX + 25;
                lastX = object2.x + object2.getTransformedBounds().width;
            }

            if (deep.Bridge.GameAssets.hasAsset("object3")) {
                var object3:createjs.Shape = ObjectFactory.getObject("object3");
                sdk.utils.CreateJSUtils.resizeToFit(object3, Constants.HELP_OBJECT_SIZE, Constants.HELP_OBJECT_SIZE);
                objects.addChild(object3);
                object3.x = lastX + 25;
                lastX = object3.x + object3.getTransformedBounds().width;
            }

            sdk.utils.CreateJSUtils.centerReg(objects);
            objects.x = 200;
            objects.y = 405;
            screen2.addChild(objects);

            var button:createjs.Container = this.createButton("lang/next");
            button.removeAllEventListeners();
            button.addEventListener("click",() => {
                if(!createjs.Ticker.paused) {
                    screen2.dispatchEvent("complete");
                }
            });
            screen2.addChild( button );

            return screen2;
        }


        private createScreen3BadItems ( buttonId:string ) : createjs.Container {
            var screen3:createjs.Container = new createjs.Container();

            var help3:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help3"));
            sdk.utils.CreateJSUtils.centerRegX(help3);
            help3.x = 200;
            help3.y = 235;
            screen3.addChild( help3 );

            var help4:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help4"));
            sdk.utils.CreateJSUtils.centerRegX(help4);
            help4.x = 200;
            help4.y = 275;
            screen3.addChild( help4 );

            var help5:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help5"));
            sdk.utils.CreateJSUtils.centerRegX(help5);
            help5.x = 200;
            help5.y = 345;
            screen3.addChild( help5 );

            var bomb:createjs.Shape = ObjectFactory.getObject("bomb");
            sdk.utils.CreateJSUtils.resizeToFit(bomb, Constants.HELP_OBJECT_SIZE, Constants.HELP_OBJECT_SIZE);
            sdk.utils.CreateJSUtils.centerRegX(bomb);
            screen3.addChild(bomb);
            bomb.x = 200;
            bomb.y = 425;

            var button:createjs.Container = this.createButton(buttonId);
            button.removeAllEventListeners();
            button.addEventListener("click",() => {
                if(!createjs.Ticker.paused) {
                    screen3.dispatchEvent("complete");
                }
            });
            screen3.addChild( button );

            return screen3;
        }

        private createScreen3NoBadItems ( buttonId:string ) : createjs.Container {
            var screen3:createjs.Container = new createjs.Container();

            var help3:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help3"));
            sdk.utils.CreateJSUtils.centerRegX(help3);
            help3.x = 200;
            help3.y = 295;
            screen3.addChild( help3 );

            var help4:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help4"));
            sdk.utils.CreateJSUtils.centerRegX(help4);
            help4.x = 200;
            help4.y = 365;
            screen3.addChild( help4 );

            var button:createjs.Container = this.createButton(buttonId);
            button.removeAllEventListeners();
            button.addEventListener("click",() => {
                if(!createjs.Ticker.paused) {
                    screen3.dispatchEvent("complete");
                }
            });
            screen3.addChild( button );

            return screen3;
        }


        private createScreen4 () : createjs.Container {
            var screen4:createjs.Container = new createjs.Container();

            var help6:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/help6"));
            sdk.utils.CreateJSUtils.centerRegX(help6);
            help6.x = 200;
            help6.y = 235;
            screen4.addChild( help6 );

            var bonus:createjs.Bitmap = new createjs.Bitmap(deep.Bridge.GameAssets.getAsset("lang/bonuspick"));
            sdk.utils.CreateJSUtils.resizeToFit(bonus, Constants.HELP_BONUS_PICK_SIZE, Constants.HELP_BONUS_PICK_SIZE);
            sdk.utils.CreateJSUtils.centerRegX(bonus);
            screen4.addChild(bonus);
            bonus.x = 200;
            bonus.y = 385;

            var button:createjs.Container = this.createButton("lang/play");
            button.removeAllEventListeners();
            button.addEventListener("click",() => {
                if(!createjs.Ticker.paused) {
                    screen4.dispatchEvent("complete");
                }
            });
            screen4.addChild( button );

            return screen4;
        }

    }

}