module deep.games.dropper {

    export class Dropper {

        private interval:number;
        private drops:number = 0;
        private primaryDrops:number = 0;
        private dropPool:IObject[] = [];
        private dropDistance:number;
        private dropHandler:Function;
        private lastDropTime:number;
        private lastDropPos:number;
        private levelConfig:ILevelConfig[];
        private extraDropTimeoutId:number;
        private level:number = 0;

        constructor () {
            if (deep.Bridge.GameAssets.hasAsset("bomb")) {
                this.levelConfig = Constants.LEVEL_CONFIG_BOMBS;
            } else {
                this.levelConfig = Constants.LEVEL_CONFIG_NO_BOMBS;
            }

            this.interval = this.levelConfig[this.level].interval;

            this.dropDistance = Constants.DROP_BOUNDS.bottom - Constants.DROP_BOUNDS.top;

            // Create a pool of objects to be dropped.
            // Each object has a weight and appears within the array that many times.
            // The higher the weight, the more likely it is to be dropped due to the
            // increased frequency within the pool.
            for (var a in Constants.OBJECTS) {
                var o:IObject = Constants.OBJECTS[a];
                if (o.enabled) {
                    for (var j:number = 0; j < o.weight; j++) {
                        this.dropPool.push(o);
                    }
                }
            }
        }

        public start ( dropHandler:Function ) : void {
            this.dropHandler = dropHandler;

            // Set up a poll to check if an item needs to be dropped.
            createjs.Ticker.addEventListener("tick",this.onTick);
        }

        private drop = ( extraDrop:boolean ) : void => {
            // Increment the total number of dropped objects
            this.drops++;

            // Increment the number of "primary" drops.
            // This counts the drops excluding extra drops.
            if (!extraDrop) {
                this.primaryDrops++;

                // If the number of primary drops has reached the threshold to change the level, then change it.
                // If we're already at the highest level, then it won't change.
                if (this.primaryDrops >= this.levelConfig[this.level].primaryDrops) {
                    this.primaryDrops = 0;
                    this.level = Math.min(this.level + 1, this.levelConfig.length - 1);
                }
            }

            this.lastDropTime = createjs.Ticker.getTime(true);

            // Figure out which type of object to drop by getting one from the pool
            var randomIndex:number = Math.floor(Math.random() * this.dropPool.length);
            var objData:IObject = this.dropPool[randomIndex];
            objData.scoreMultiplier = this.levelConfig[this.level].scoreMultiplier;

            // Determine how fast to drop this object (time it takes is based on it's speed. T = D / V)
            var speed:number = this.levelConfig[this.level].speed * this.getRandomSpeedMultiplier(this.levelConfig[this.level].speedMultipliers);
            var duration:number = this.dropDistance / speed;

            // Determine where to drop this object
            // Make sure we don't drop the next object too close to where we dropped the last one.
            var xLoc:number;
            while (xLoc === undefined) {
                var loc:number = Math.floor(Math.random() * ((Constants.DROP_BOUNDS.right - Constants.DROP_BOUNDS.left) + 1)) + Constants.DROP_BOUNDS.left;
                if (this.lastDropPos === undefined || Math.abs(this.lastDropPos - loc) > 70) {
                    xLoc = loc;
                    this.lastDropPos = loc;
                }
            }

            var yLoc:number = Constants.DROP_BOUNDS.top;

            // Drop It
            this.dropHandler.apply(null,[objData, new createjs.Point(xLoc,yLoc), duration]);
        };

        public stop () : void {
            // Remove the poll
            createjs.Ticker.removeEventListener("tick",this.onTick);

            // Remove any pending timers for extra drops.
            sdk.utils.TickerTimeout.clearInterval(this.extraDropTimeoutId);
        }

        private onTick = (event:createjs.Event) : void => {
            if(!event.paused) {
                if (this.lastDropTime == undefined || createjs.Ticker.getTime(true) - this.lastDropTime >= this.interval) {
                    this.drop(false);

                    // Determine if we should drop a second object.
                    if (this.determineExtraDrop(this.levelConfig[this.level].firstExtraDropRate)) {
                        this.extraDropTimeoutId = sdk.utils.TickerTimeout.setTimeout(() => {
                            this.drop(true);

                            // If a second object is dropped, determine if we should drop a third.
                            if (this.determineExtraDrop(this.levelConfig[this.level].secondExtraDropRate)) {
                                this.extraDropTimeoutId = sdk.utils.TickerTimeout.setTimeout(() => {
                                    this.drop(true);
                                }, this.getRandomDelay());
                            }
                        }, this.getRandomDelay());
                    }
                }
            }
        };

        private determineExtraDrop ( percentage:number ) : boolean {
            return Math.random() <= percentage;
        }

        private getRandomDelay () : number {
            return Math.floor(Math.random() * (this.levelConfig[this.level].extraDropDelay.max - this.levelConfig[this.level].extraDropDelay.min + 1)) + this.levelConfig[this.level].extraDropDelay.min;
        }

        private getRandomSpeedMultiplier ( speedMultipliers:number[] ) : number {
            return speedMultipliers[Math.floor(Math.random()*speedMultipliers.length)];
        }
    }
}