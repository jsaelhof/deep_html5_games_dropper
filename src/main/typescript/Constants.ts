module deep.games.dropper {

    export class Constants {

        // NOTE: Trying to do the level configs by equation instead of hardcoded array.
        // Never got it done but this is what I had when i left off.
        // Interval: Need a base interval and a max, decrease linearly by some delta
        // Speed: Need a base speed and a max, increase linearly by some delta
        // First Extra Drop Chance Rate: Need a base and a max. Increase in an exponential fashion.
        //          True exponential (mult previous value by constant multiplier) ramps up too quick or not quick enough depending on the value.
        //          Was going to use: <Previous Value> * ( 1 + (<multiplier> * 2^<level-2>) ).
        //          Basically,

        //public static LEVEL_CONFIG_NORMAL_NO_BOMB = {
        //    baseInterval: 700,
        //    primaryDrops: 15,
        //    intervalDeltaPerLevel: -50,
        //    minInterval: 400,
        //    scoreMultiplier: 1,
        //    scoreMultiplierDelta: 0.5,
        //    maxScoreMultiplier,
        //
        //    baseSpeed: 0.4,
        //    speedDeltaPerLevel: 0.05,
        //    maxSpeed: 0.8,
        //
        //    firstExtraDropRate: 0.25,
        //    firstExtraDropRateDeltaPerLevel: 0.03,
        //    maxFirstExtraDropRate: 0.125,
        //
        //    secondExtraDropRate: 0.17,
        //    secondExtraDropRateDeltaPerLevel: 0.03,
        //    maxSecondExtraDropRate: 0.45,
        //
        //    minExtraDropDelay: 150,
        //    maxExtraDropDelay: 500
        //};


        public static LEVEL_CONFIG_BOMBS:ILevelConfig[] = [
            {
                interval: 700,
                speed: 0.5,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0,
                secondExtraDropRate: 0,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 1,
                primaryDrops: 15
            },
            {
                interval: 700,
                speed: 0.6,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 1,
                primaryDrops: 20
            },
            {
                interval: 675,
                speed: 0.62,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 1.5,
                primaryDrops: 20
            },
            {
                interval: 650,
                speed: 0.65,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 2,
                primaryDrops: 20
            },
            {
                interval: 625,
                speed: 0.68,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 2.5,
                primaryDrops: 20
            },
            {
                interval: 600,
                speed: 0.7,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 3,
                primaryDrops: 15
            },
            {
                interval: 550,
                speed: 0.8,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.4,
                secondExtraDropRate: 0.25,
                extraDropDelay: { min: 150, max:400 },
                scoreMultiplier: 3,
                primaryDrops: 10
            },
            {
                interval: 500,
                speed: 0.9,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.7,
                secondExtraDropRate: 0.45,
                extraDropDelay: { min: 150, max:350 },
                scoreMultiplier: 3,
                primaryDrops: 10
            }
        ];

        public static LEVEL_CONFIG_NO_BOMBS:ILevelConfig[] = [
            {
                interval: 700,
                speed: 0.5,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0,
                secondExtraDropRate: 0,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 1,
                primaryDrops: 15
            },
            {
                interval: 700,
                speed: 0.6,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 1,
                primaryDrops: 20
            },
            {
                interval: 650,
                speed: 0.62,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 1.5,
                primaryDrops: 20
            },
            {
                interval: 600,
                speed: 0.65,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 2,
                primaryDrops: 20
            },
            {
                interval: 550,
                speed: 0.7,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 2.5,
                primaryDrops: 20
            },
            {
                interval: 500,
                speed: 0.75,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.25,
                secondExtraDropRate: 0.17,
                extraDropDelay: { min: 150, max:500 },
                scoreMultiplier: 3,
                primaryDrops: 15
            },
            {
                interval: 450,
                speed: 0.8,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.4,
                secondExtraDropRate: 0.25,
                extraDropDelay: { min: 150, max:400 },
                scoreMultiplier: 3,
                primaryDrops: 10
            },
            {
                interval: 400,
                speed: 0.9,
                speedMultipliers: [ 1, 1, 1.15, 1.3 ],
                firstExtraDropRate: 0.7,
                secondExtraDropRate: 0.45,
                extraDropDelay: { min: 150, max:350 },
                scoreMultiplier: 3,
                primaryDrops: 10
            }
        ];

        //////

        public static OBJECTS:any = {
            "object1": {"id":"object1", "points": 10, "weight": 3, "bomb":false, "enabled":false},
            "object2": {"id":"object2", "points": 10, "weight": 3, "bomb":false, "enabled":false},
            "object3": {"id":"object3", "points": 10, "weight": 2, "bomb":false, "enabled":false},
            "bomb": {"id":"bomb", "points":0, "weight": 1, "bomb":true, "enabled":false}
        };
        public static DROP_BOUNDS:any = {
            "top": -20,
            "bottom": 660,
            "left": 45,
            "right": 355
        };
        public static FONT1:string = "font1";
        public static GAME_OBJECT_SIZE:number = 85;
        public static HELP_OBJECT_SIZE:number = 80;
        public static HELP_BONUS_PICK_SIZE:number = 120;
        public static CATCHES_FOR_BONUS_PICK:number[] = [10,30,60,100]; // WARNING: Array length must not be longer than the number of bonus picks that can be earned (Total picks minus 1 free pick)
        public static MAX_BONUS_PICKS:number = 5;
	    public static BONUS_BOX_SIZE:number = 120;
        public static BONUS_OBJECT_SIZE:number = 120;
        public static LIVES:number = 5;
    }

}