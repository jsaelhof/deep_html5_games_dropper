module deep.games.dropper {

    export interface ILayout {
        logoArea: {
            width: number,
            height: number
        }

        score: createjs.Point
        lives: createjs.Point

        bonusRound: {
            box: createjs.DisplayObject
            boxLoc: createjs.Point[]
            picks: createjs.DisplayObject
            continue: createjs.DisplayObject
            continueMaxArea: {
                width: number,
                height: number
            }
        }

        summary: {
            container: createjs.DisplayObject
            scoreBonus: createjs.DisplayObject
            scoreNoBonus: createjs.DisplayObject
            bonusPicks: createjs.DisplayObject
            continue: createjs.DisplayObject
            continueMaxArea: {
                width: number,
                height: number
            }
        }
    }

}