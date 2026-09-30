class Scoreboard {
    display(roundNumber, teams, players) {
        console.log(`\nRound ${roundNumber}`);

        this.displayTeamScores(teams);
        this.displayIndividualScores(players);
        this.displayBonusPoints(teams);
    }

    displayTeamScores(teams) {
        console.log("\nTeam Scores");
        console.log("-----------------");

        teams.forEach(team => {
            console.log(`${team.name}: ${team.score}`);
        });
    }

    displayIndividualScores(players) {
        console.log("\nIndividual Scores");
        console.log("-----------------");

        players.forEach(player => {
            console.log(`${player.name}: ${player.score}`);
        });
    }

    displayBonusPoints(teams) {
        console.log("\nBonus Points");
        console.log("-----------------");

        teams.forEach(team => {
            console.log(`${team.name}: ${team.bonus}`);
        });
    }

    displayWinner(team) {
        console.log(`\nGame over. ${team.name} won!!!`);
    }
}

module.exports = Scoreboard;