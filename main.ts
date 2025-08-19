namespace SpriteKind {
    export const player1 = SpriteKind.create()
    export const player2 = SpriteKind.create()
}

class Player {
    sprite: Sprite
    private _next_flap_at: number
    constructor(player: number) {
        this.sprite = sprites.create(assets.image`duck left`, player == 1 ? SpriteKind.player1 : SpriteKind.player2)
        if (player == 1) {
            info.player1.setLife(3)
            controller.player1.moveSprite(this.sprite, 50, 0)
            this.add_button_handler(1)
            tiles.placeOnTile(this.sprite, tiles.getTileLocation(0, 6))
        } else {
            info.player2.setLife(3)
            controller.player2.moveSprite(this.sprite, 50, 0)
            this.add_button_handler(2)
            tiles.placeOnTile(this.sprite, tiles.getTileLocation(9, 6))
        }
        
        this.sprite.setFlag(SpriteFlag.StayInScreen, true)
        this.sprite.ay = 100
        this._next_flap_at = 0
        this.add_overlap_handler()
    }
    
    public add_button_handler(player: number) {
        function on_button_event_a_pressed() {
            if (game.runtime() > this._next_flap_at) {
                this.sprite.vy = -50
                this._next_flap_at = game.runtime() + 500
            }
            
        }
        
        if (player == 1) {
            controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, on_button_event_a_pressed)
        } else {
            controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, on_button_event_a_pressed)
        }
        
    }
    
    public add_overlap_handler() {
        sprites.onOverlap(SpriteKind.player1, SpriteKind.player2, function on_overlap(p1sprite: Sprite, p2sprite: Sprite) {
            if (p1sprite.y > p2sprite.y) {
                p1sprite.destroy(effects.ashes)
                info.player1.changeLifeBy(-1)
                player2.sprite.vy = -50
            } else if (p1sprite.y < p2sprite.y) {
                p2sprite.destroy(effects.ashes)
                info.player2.changeLifeBy(-1)
                player1.sprite.vy = -50
            } else if (p1sprite.x > p2sprite.x) {
                p1sprite.vx = 50
                p2sprite.vx = -50
            } else {
                p1sprite.vx = -50
                p2sprite.vx = 50
            }
        })
    } 
}

tiles.loadMap(tiles.createSmallMap(tilemap`level2`))

let player1 = new Player(1)
let player2 = new Player(2)
tiles.placeOnTile(player1.sprite, tiles.getTileLocation(1, 13))
tiles.placeOnTile(player2.sprite, tiles.getTileLocation(18, 13))
