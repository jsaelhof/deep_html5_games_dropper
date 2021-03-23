module deep.games.dropper {

    export interface ILevelConfig {
        interval:number,
        speed:number,
        speedMultipliers:number[],
        firstExtraDropRate:number,
        secondExtraDropRate:number,
        extraDropDelay: {
            min:number,
            max:number
        },
        scoreMultiplier:number
        primaryDrops:number
    }

}