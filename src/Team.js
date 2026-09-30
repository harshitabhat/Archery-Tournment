class Team {
    constructor(name, players) {
        this.name = name;
        this.players = players;
        this.score = 0;
        this.bonus = 0;
    }

    addScore(points) {
        this.score += points;
    }

    addBonus(points) {
        this.bonus += points;
        this.score += points;
    }

    hasReachedTarget(targetScore) {
        return this.score >= targetScore;
    }
}

module.exports = Team;