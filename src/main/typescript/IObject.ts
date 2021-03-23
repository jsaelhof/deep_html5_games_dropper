module deep.games.dropper {

    export interface IObject {
        id:string
        points:number
        weight:number
        bomb:boolean
        enabled:boolean
        scoreMultiplier:number
    }

}