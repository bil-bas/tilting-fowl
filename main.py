@namespace
class SpriteKind:
    player1 = SpriteKind.create()
    player2 = SpriteKind.create()

class Player:
    def __init__(self, player: number):
        self.sprite = sprites.create(assets.image("""duck left"""),
                                     SpriteKind.player1 if player == 1 else SpriteKind.player2)

        if player == 1:
            info.player1.set_life(3)
            controller.player1.move_sprite(self.sprite, 50, 0)
            self.add_button_handler(1)
            tiles.place_on_tile(self.sprite, tiles.get_tile_location(0, 6))
        else:
            info.player2.set_life(3)
            controller.player2.move_sprite(self.sprite, 50, 0)
            self.add_button_handler(2)
            tiles.place_on_tile(self.sprite, tiles.get_tile_location(9, 6))
    
        self.sprite.set_flag(SpriteFlag.STAY_IN_SCREEN, True)
        self.sprite.ay = 100
    
        self._next_flap_at = 0

        self.add_overlap_handler()

    def add_button_handler(self, player: int):
        def on_button_event_a_pressed():
            if game.runtime() > self._next_flap_at:
                self.sprite.vy = -50
                self._next_flap_at = game.runtime() + 500

        if player == 1:
            controller.player1.on_button_event(ControllerButton.A, ControllerButtonEvent.PRESSED, on_button_event_a_pressed)
        else:
            controller.player2.on_button_event(ControllerButton.A, ControllerButtonEvent.PRESSED, on_button_event_a_pressed)

    def add_overlap_handler(self):
        def on_overlap(p1sprite: Sprite, p2sprite: Sprite):
            if p1sprite.y > p2sprite.y:
                p1sprite.destroy(effects.ashes)
                info.player1.change_life_by(-1)
                player2.sprite.vy = -50
            elif p1sprite.y < p2sprite.y:
                p2sprite.destroy(effects.ashes)
                info.player2.change_life_by(-1)
                player1.sprite.vy = -50
            elif p1sprite.x > p2sprite.x:
                p1sprite.vx = 50
                p2sprite.vx = -50
            else:
                p1sprite.vx = -50
                p2sprite.vx = 50
                
        sprites.on_overlap(SpriteKind.player1, SpriteKind.player2, on_overlap)



player1 = Player(1)
player2 = Player(2)

tiles.load_map(tiles.create_small_map(tilemap("""level1""")))


tiles.place_on_tile(player1.sprite, tiles.get_tile_location(1, 6))
tiles.place_on_tile(player2.sprite, tiles.get_tile_location(8, 6))












