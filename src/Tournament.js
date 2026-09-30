const Player = require("./Player");
const Team = require("./Team");
const ScoreCalculator = require("./ScoreCalculator");
const Scoreboard = require("./Scoreboard");

class Tournament {
    constructor(data) {
        this.targetScore = 60;
        this.scoreboard = new Scoreboard();

        this.validateInput(data);

        this.players = this.createPlayers(data);
        this.teams = this.createTeams(data);
        this.playerOrder = data.playerOrder;
        this.rounds = data.rounds;

        this.playerTeamMap = this.createPlayerTeamMap();
    }

    validateInput(data) {
        if (!data || typeof data !== "object") {
            throw new Error("Invalid input: tournament data is required.");
        }

        if (!Array.isArray(data.teams) || data.teams.length === 0) {
            throw new Error("Invalid input: at least one team is required.");
        }

        if (!Array.isArray(data.playerOrder) || data.playerOrder.length === 0) {
            throw new Error("Invalid input: player order is required.");
        }

        if (!Array.isArray(data.rounds) || data.rounds.length === 0) {
            throw new Error("Invalid input: at least one round is required.");
        }

        const playerNames = new Set();

        data.teams.forEach(team => {
            if (!team.name || typeof team.name !== "string") {
                throw new Error("Invalid team: team name is required.");
            }

            if (!Array.isArray(team.players) || team.players.length !== 2) {
                throw new Error(
                    `Invalid team "${team.name}": exactly two players are required.`
                );
            }

            team.players.forEach(player => {
                if (!player || typeof player !== "string") {
                    throw new Error(
                        `Invalid player in team "${team.name}".`
                    );
                }

                if (playerNames.has(player)) {
                    throw new Error(
                        `Duplicate player found: "${player}".`
                    );
                }

                playerNames.add(player);
            });
        });

        if (data.playerOrder.length !== playerNames.size) {
            throw new Error(
                "Invalid player order: every player must appear exactly once."
            );
        }

        const allPlayersInOrder = new Set(data.playerOrder);

        if (allPlayersInOrder.size !== data.playerOrder.length) {
            throw new Error(
                "Invalid player order: duplicate players are not allowed."
            );
        }

        playerNames.forEach(player => {
            if (!allPlayersInOrder.has(player)) {
                throw new Error(
                    `Player "${player}" is missing from playerOrder.`
                );
            }
        });

        data.rounds.forEach((round, index) => {
            if (!Array.isArray(round)) {
                throw new Error(`Round ${index + 1} must be an array.`);
            }

            if (round.length !== data.playerOrder.length) {
                throw new Error(
                    `Round ${index + 1} must contain one score for every player.`
                );
            }

            round.forEach(circle => {
                if (!["A", "B", "C", "D", "E", "F"].includes(circle)) {
                    throw new Error(
                        `Invalid circle "${circle}" in round ${index + 1}.`
                    );
                }
            });
        });
    }

    createPlayers(data) {
        const players = new Map();

        data.teams.forEach(team => {
            team.players.forEach(playerName => {
                players.set(playerName, new Player(playerName));
            });
        });

        return players;
    }

    createTeams(data) {
        return data.teams.map(teamData => {
            const players = teamData.players.map(playerName =>
                this.players.get(playerName)
            );

            return new Team(teamData.name, players);
        });
    }

    createPlayerTeamMap() {
        const playerTeamMap = new Map();

        this.teams.forEach(team => {
            team.players.forEach(player => {
                playerTeamMap.set(player.name, team);
            });
        });

        return playerTeamMap;
    }

    start() {
        for (let roundIndex = 0; roundIndex < this.rounds.length; roundIndex++) {
            const roundNumber = roundIndex + 1;
            const roundResults = this.rounds[roundIndex];

            this.processRound(roundNumber, roundResults);

            this.scoreboard.display(
                roundNumber,
                this.teams,
                Array.from(this.players.values())
            );

            const winner = this.findWinner();

            if (winner) {
                this.scoreboard.displayWinner(winner);
                return winner;
            }
        }

        return null;
    }

    processRound(roundNumber, roundResults) {
        const playerResults = this.calculatePlayerResults(
            roundNumber,
            roundResults
        );

        playerResults.forEach(result => {
            result.player.addScore(result.points);
        });

        this.updateTeamScores(playerResults);
    }

    calculatePlayerResults(roundNumber, roundResults) {
        const results = [];

        this.playerOrder.forEach((playerName, index) => {
            const circle = roundResults[index];
            const player = this.players.get(playerName);

            const points = ScoreCalculator.calculatePoints(
                circle,
                roundNumber
            );

            results.push({
                player,
                circle,
                points
            });
        });

        return results;
    }

    updateTeamScores(playerResults) {
        const resultsByPlayer = new Map();

        playerResults.forEach(result => {
            resultsByPlayer.set(result.player.name, result);
        });

        this.teams.forEach(team => {
            const firstPlayer = resultsByPlayer.get(team.players[0].name);
            const secondPlayer = resultsByPlayer.get(team.players[1].name);

            const roundScore = firstPlayer.points + secondPlayer.points;

            team.addScore(roundScore);

            const bonus = ScoreCalculator.calculateBonus(
                firstPlayer.circle,
                secondPlayer.circle
            );

            if (bonus > 0) {
                team.addBonus(bonus);
            }
        });
    }

    findWinner() {
        const teamsReachedTarget = this.teams.filter(team =>
            team.hasReachedTarget(this.targetScore)
        );

        if (teamsReachedTarget.length === 0) {
            return null;
        }

        return teamsReachedTarget.reduce((winner, team) =>
            team.score > winner.score ? team : winner
        );
    }
}

module.exports = Tournament;