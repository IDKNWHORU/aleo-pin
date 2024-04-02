program base_ball_game.aleo {
    mapping life: address => u8;

    struct Game {
        target: [u8; 3],
    }

    function evaluate_guess(game: Game, guess: [u8; 3]) -> [u8; 2] {
        let strikes:u8 = 0u8;
        let balls:u8 = 0u8;

        if guess[0u8] == game.target[0u8] {
            strikes += 1u8;
        } else if guess[0u8] == game.target[1u8] || guess[0u8] == game.target[2u8]{
            balls += 1u8;
        }

        if guess[1u8] == game.target[1u8] {
            strikes += 1u8;
        } else if guess[1u8] == game.target[0u8] || guess[1u8] == game.target[2u8] {
            balls += 1u8;
        }

        if guess[2u8] == game.target[2u8] {
            strikes += 1u8;
        } else if guess[2u8] == game.target[0u8] || guess[2u8] == game.target[1u8] {
            balls += 1u8;
        }

        return [strikes, balls];
    }

    transition init(t1: u8, t2: u8, t3: u8) -> Game {
        assert_neq(t1, t2);
        assert_neq(t1, t3);
        assert_neq(t2, t3);

        return Game {
            target: [t1, t2, t3],
        } then finalize(self.caller); 
    }

    finalize init (public sender: address) {
        Mapping::set(life, sender, 9u8);
    }

    transition main(game: Game, guess1: u8, guess2: u8, guess3: u8) -> [u8;2] {
        let guess: [u8; 3] = [guess1, guess2, guess3];

        let result:[u8; 2] = evaluate_guess(game, guess);

        return result then finalize(self.caller, result);
    }

    finalize main(public sender: address, result: [u8; 2]) {
        let current_life: u8 = Mapping::get(life, sender);
        if(result[0u8].neq(3u8)) {
            assert_neq(current_life, 0u8);

            Mapping::set(life, sender, current_life - 1u8);
        }
    }
}