class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    addScore(points) {
        this.score += points;
    }
}

module.exports = Player;