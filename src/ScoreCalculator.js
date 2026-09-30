class ScoreCalculator {
    static calculatePoints(circle, roundNumber) {
        if (circle === "F") {
            return 0;
        }

        const basePoints = {
            A: 5,
            B: 4,
            C: 3,
            D: 2,
            E: 1
        };

        return basePoints[circle] + (roundNumber - 1);
    }

    static calculateBonus(firstCircle, secondCircle) {
        return firstCircle === secondCircle ? 2 : 0;
    }
}

module.exports = ScoreCalculator;