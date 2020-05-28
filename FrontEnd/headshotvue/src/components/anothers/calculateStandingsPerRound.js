import {
    baseApiUrl,
    showError
} from "@/global";

import axios from "axios"

import loadFixtures from "./loadFixtures.js";

const calculateRankings = (round) => {
    function compareValues(key, order = "asc") {
        return function innerSort(paramA, paramB) {
            if (!paramA.hasOwnProperty(key) || !paramB.hasOwnProperty(key)) {
                return 0;
            }

            const valueA =
                typeof paramA[key] === "string"
                    ? paramA[key].toUpperCase()
                    : paramA[key];
            const valueB =
                typeof paramB[key] === "string"
                    ? paramB[key].toUpperCase()
                    : paramB[key];

            let comparison = 0;

            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }
            return order === "desc" ? comparison * -1 : comparison;
        };
    }

    round.standings
        .sort(compareValues("teamName", "asc"))
        .sort(compareValues("goalsFor", "desc"))
        .sort(compareValues("win", "desc"))
        .sort(compareValues("goalsDiff", "desc"))
        .sort(compareValues("points", "desc"));

    round.standings.forEach((standing, index) => {
        standing.rank = index + 1;
    });

    return round;
}

const calculateLeagueStanding = async (leagueId, seasonId) => {
    let configGetFixtures = {
        method: "get",
        url: `${baseApiUrl}/fixtures`,
        params: {}
    };

    configGetFixtures.params.leagueId = leagueId;
    configGetFixtures.params.seasonId = seasonId;

    let standing = {
        leagueId,
        seasonId,
        teamsStandings: []
    };

    await axios(configGetFixtures)
        .then(fixtures => {
            fixtures.data.map(async fixture => {
                function TeamStandings(
                    round,
                    roundNumber,
                    teamId,
                    teamName,
                    status,
                    teamEndStatus,
                    leagueId,
                    seasonId,
                    typeTeam,
                    points = 0,
                    goalsFor = 0,
                    goalsAgainst = 0,
                    played = 0,
                    win = 0,
                    draw = 0,
                    lose = 0
                ) {
                    this.round = round;
                    this.roundNumber = roundNumber;
                    this.teamId = teamId;
                    this.teamName = teamName;
                    this.points = points;
                    this.status = status;
                    this.teamEndStatus = teamEndStatus;
                    this.leagueId = leagueId;
                    this.seasonId = seasonId;
                    this.goalsDiff = goalsFor - goalsAgainst;

                    this[`${typeTeam}GoalsFor`] = goalsFor;
                    this[`${typeTeam}GoalsAgainst`] = goalsAgainst;
                    this[`${typeTeam}Played`] = played;
                    this[`${typeTeam}Win`] = win;
                    this[`${typeTeam}Draw`] = draw;
                    this[`${typeTeam}Lose`] = lose;

                    typeTeam = typeTeam === "home" ? "away" : "home";

                    this[`${typeTeam}GoalsFor`] = 0;
                    this[`${typeTeam}GoalsAgainst`] = 0;
                    this[`${typeTeam}Played`] = 0;
                    this[`${typeTeam}Win`] = 0;
                    this[`${typeTeam}Draw`] = 0;
                    this[`${typeTeam}Lose`] = 0;
                }

                fixture.homeWin = 0;
                fixture.homeDraw = 0;
                fixture.homeLose = 0;
                fixture.awayWin = 0;
                fixture.awayDraw = 0;
                fixture.awayLose = 0;
                fixture.homePoints = 0;
                fixture.awayPoints = 0;

                if (fixture.status === `Match Finished`) {
                    if (fixture.homeFulltimeGoals > fixture.awayFulltimeGoals) {
                        fixture.homeWin = 1;
                        fixture.awayLose = 1;

                        fixture.homePoints = 3;
                    } else if (
                        fixture.homeFulltimeGoals < fixture.awayFulltimeGoals
                    ) {
                        fixture.homeLose = 1;
                        fixture.awayWin = 1;

                        fixture.awayPoints = 3;
                    } else {
                        fixture.homeDraw = 1;
                        fixture.awayDraw = 1;

                        fixture.awayPoints = 1;
                        fixture.homePoints = 1;
                    }

                    standing.teamsStandings.push(
                        new TeamStandings(
                            fixture.round,
                            fixture.roundNumber,
                            fixture.teamHomeId,
                            fixture.teamHomeName,
                            fixture.status,
                            fixture.homeTeamEndStatus,
                            leagueId,
                            seasonId,
                            "home",
                            fixture.homePoints,
                            fixture.homeFulltimeGoals,
                            fixture.awayFulltimeGoals,
                            fixture.homeFulltimeGoals - fixture.awayFulltimeGoals,
                            1,
                            fixture.homeWin,
                            fixture.homeDraw,
                            fixture.homeLose
                        )
                    );

                    standing.teamsStandings.push(
                        new TeamStandings(
                            fixture.round,
                            fixture.roundNumber,
                            fixture.teamAwayId,
                            fixture.teamAwayName,
                            fixture.status,
                            fixture.awayTeamEndStatus,
                            leagueId,
                            seasonId,
                            "away",
                            fixture.awayPoints,
                            fixture.awayFulltimeGoals,
                            fixture.homeFulltimeGoals,
                            fixture.awayFulltimeGoals - fixture.homeFulltimeGoals,
                            1,
                            fixture.awayWin,
                            fixture.awayDraw,
                            fixture.awayLose
                        )
                    );
                } else {
                    standing.teamsStandings.push(
                        new TeamStandings(
                            fixture.round,
                            fixture.roundNumber,
                            fixture.teamHomeId,
                            fixture.teamHomeName,
                            fixture.status,
                            fixture.homeTeamEndStatus,
                            leagueId,
                            seasonId,
                            "home"
                        )
                    );

                    standing.teamsStandings.push(
                        new TeamStandings(
                            fixture.round,
                            fixture.roundNumber,
                            fixture.teamAwayId,
                            fixture.teamAwayName,
                            fixture.status,
                            fixture.awayTeamEndStatus,
                            leagueId,
                            seasonId,
                            "away"
                        )
                    );
                }
            });
        })
        .catch(showError);

    standing.rounds = [];

    standing.teamsStandings.forEach(teamsStanding => {
        let round = standing.rounds.find(round => {
            return teamsStanding.round == round.round;
        });

        if (round !== undefined) {
            round.standings.push(teamsStanding);
        } else {
            standing.rounds.push({
                round: teamsStanding.round,
                standings: [teamsStanding]
            });
        }
    });

    standing.rounds.forEach(async (round, roundIndex, rounds) => {
        if (roundIndex > 0) {
            let previousRound = rounds[roundIndex - 1];

            await round.standings.forEach(
                async (roundStanding, roundStandingindex) => {
                    let previousTeamRound = previousRound.standings.find(
                        actualRound => {
                            return actualRound.teamId === roundStanding.teamId;
                        }
                    );

                    if (previousTeamRound === undefined) {
                        previousTeamRound = {
                            points: 0,
                            goalsFor: 0,
                            goalsAgainst: 0,
                            goalsDiff: 0,
                            played: 0,
                            win: 0,
                            draw: 0,
                            lose: 0,
                            homeGoalsFor: 0,
                            homeGoalsAgainst: 0,
                            homePlayed: 0,
                            homeWin: 0,
                            homeDraw: 0,
                            homeLose: 0,
                            awayGoalsFor: 0,
                            awayGoalsAgainst: 0,
                            awayPlayed: 0,
                            awayWin: 0,
                            awayDraw: 0,
                            awayLose: 0
                        };
                    }

                    let newRoundStanding = {
                        round: roundStanding.round,
                        roundNumber: roundStanding.roundNumber,
                        teamId: roundStanding.teamId,
                        teamName: roundStanding.teamName,
                        points: roundStanding.points + previousTeamRound.points,
                        homeGoalsFor: roundStanding.homeGoalsFor + previousTeamRound.homeGoalsFor,
                        homeGoalsAgainst: roundStanding.homeGoalsAgainst + previousTeamRound.homeGoalsAgainst,
                        homePlayed: roundStanding.homePlayed + previousTeamRound.homePlayed,
                        homeWin: roundStanding.homeWin + previousTeamRound.homeWin,
                        homeDraw: roundStanding.homeDraw + previousTeamRound.homeDraw,
                        homeLose: roundStanding.homeLose + previousTeamRound.homeLose,
                        awayGoalsFor: roundStanding.awayGoalsFor + previousTeamRound.awayGoalsFor,
                        awayGoalsAgainst: roundStanding.awayGoalsAgainst + previousTeamRound.awayGoalsAgainst,
                        awayPlayed: roundStanding.awayPlayed + previousTeamRound.awayPlayed,
                        awayWin: roundStanding.awayWin + previousTeamRound.awayWin,
                        awayDraw: roundStanding.awayDraw + previousTeamRound.awayLose,
                        awayLose: roundStanding.awayLose + previousTeamRound.awayLose,
                        teamEndStatus: roundStanding.teamEndStatus,
                        status: roundStanding.status,
                        leagueId: roundStanding.leagueId,
                        seasonId: roundStanding.seasonId
                    };

                    round.standings[roundStandingindex] = newRoundStanding;
                }
            );
        } else {
            delete round.rank;
        }
    });

    standing.rounds.forEach(round => {
        round = calculateRankings(round);
    });

    return standing;
}

const getStandingsPerRound = async leagues => {
    let standings = [];

    for (const league of leagues) {
        let standing = await calculateLeagueStanding(
            league.leagueId,
            league.seasonId
        )
            .then(league => {
                return league.rounds;
            })
            .then(rounds => {
                let standingsPerRound = rounds.map(round => {
                    return [...round.standings];
                });

                return standingsPerRound;
            })
            .catch((err) => {
                console.log(err)
            });

        standing.length > 0 ? standings.push(standing) : false;
    }

    return standings.map(rounds => {
        return rounds.map(standings => {
            return standings.map(round => {
                return {
                    round: round.round,
                    round_number: round.roundNumber,
                    rank: round.rank,
                    team_id: round.teamId,
                    league_id: round.leagueId,
                    season_id: round.seasonId,
                    points: round.points,
                    goals_for: round.homeGoalsFor + round.awayGoalsFor,
                    goals_against: round.homeGoalsAgainst + round.awayGoalsAgainst,
                    goals_diff: round.goalsDiff,
                    played: round.homePlayed || round.awayPlayed,
                    win: round.homeWin || round.awayWin,
                    draw: round.homeDraw || round.awayDraw,
                    lose: round.homeLose || round.awayLose,
                    home_goals_for: round.homeGoalsFor,
                    home_goals_against: round.homeGoalsAgainst,
                    home_played: round.homePlayed,
                    home_win: round.homeWin,
                    home_draw: round.homeDraw,
                    home_lose: round.homeLose,
                    away_goals_for: round.awayGoalsFor,
                    away_goals_against: round.awayGoalsAgainst,
                    away_played: round.awayPlayed,
                    away_win: round.awayWin,
                    away_draw: round.awayDraw,
                    away_lose: round.awayLose,
                    team_end_status: round.teamEndStatus,
                    status: round.status
                };
            });
        });
    });
};

const calculateStandingsPerRound = async (current) => {
    const leagues = await loadFixtures(current, false);

    let leagueStandingsPerRound = await getStandingsPerRound(leagues);

    let insertStandings = [];
    
    for (let standingsPerRound of leagueStandingsPerRound) {
        for (let standingPerRound of standingsPerRound) {
            for (let standing of standingPerRound) {
                insertStandings.push(standing);
            }
        }
    }

    await axios
        .post(`${baseApiUrl}/standingsPerRound`, insertStandings)
        .then(() => {
            this.$toasted.global.defaultSuccess();
        })
        .catch((showError) => {
            console.log(showError)
        });
}

export default calculateStandingsPerRound