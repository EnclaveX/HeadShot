<template>
	<div id="app">
		<v-app id="inspire">
			<v-row>
				<v-btn
					class="primary anothers-buttons"
					@click="loadLeaguesAndSeasons(true, true)"
				>{{$i18n.t('headshot.anothers.loadFixtures')}}</v-btn>
				<v-btn
					class="primary anothers-buttons"
					@click="loadLeaguesAndSeasons(false, true)"
				>{{$i18n.t('headshot.anothers.loadFixturesAntSeasons')}}</v-btn>
				<v-btn
					class="primary anothers-buttons"
					@click="calculateStandings(true)"
				>{{$i18n.t('headshot.anothers.calculateStandings')}}</v-btn>
			</v-row>
		</v-app>
	</div>
</template>

<script>
	import axios from "axios";
	import {
		baseApiUrl,
		showError,
		baseFootballApiUrl,
		footballApiHeaders,
		production
	} from "@/global";

	export default {
		data: function() {
			return {
				leagues: []
			};
		},
		methods: {
			async loadLeaguesAndSeasons(current, loadFixtures) {
				const config = {
					method: "get",
					url: `${baseApiUrl}/leagues/seasons`,
					params: {
						favorite: true
					}
				};

				if (current) {
					config.params.current = true;
				}

				await axios(config)
					.then(leagues => {
						this.leagues = leagues.data.map(item => {
							return item;
						});
					})
					.catch(showError);

				if (loadFixtures) {
					this.leagues.forEach(async league => {
						await this.loadFixtures(
							league.leagueId,
							league.seasonId,
							league.seasonYear
						);
					});
				}
			},
			async loadFixtures(leagueId, seasonId, seasonYear) {
				const config = {
					method: "get",
					url: `${baseFootballApiUrl}/fixtures`,
					headers: footballApiHeaders,
					params: {
						league: leagueId,
						season: seasonYear
					}
				};

				const fixtures = await axios(config)
					.then(resp => {
						return resp.data.response;
					})
					.catch(showError);

				if (!fixtures) {
					return;
				}

				let fixturesFormated = [];

				fixtures.forEach(data => {
					let roundNumber = parseInt(
						data.league.round
							.substring(data.league.round.length - 3)
							.replace("-", "")
							.trim()
					);

					let homeTeamEndStatus, awayTeamEndStatus;

					if (data.fixture.status.long === "Match Finished") {
						if (data.score.fulltime.home > data.score.fulltime.away) {
							homeTeamEndStatus = "W";
							awayTeamEndStatus = "L";
						} else if (data.score.fulltime.home < data.score.fulltime.away) {
							homeTeamEndStatus = "L";
							awayTeamEndStatus = "W";
						} else {
							homeTeamEndStatus = "D";
							awayTeamEndStatus = "D";
						}
					} else {
						homeTeamEndStatus = "P";
						awayTeamEndStatus = "P";
					}

					fixturesFormated.push({
						id: data.fixture.id,
						venue: data.fixture.venue,
						status: data.fixture.status.long,
						round: data.league.round,
						round_number: roundNumber,
						fixture_date: data.fixture.timestamp,
						extratime:
							data.score.extratime.home === null &&
							data.score.extratime.away === null
								? 0
								: 1,
						penalty:
							data.score.penalty.home === null && data.score.penalty.away === null
								? 0
								: 1,
						league_id: leagueId,
						season_id: seasonId,
						team_home_id: data.teams.home.id,
						home_fulltime_goals: data.score.fulltime.home,
						home_halftime_goals: data.score.halftime.home,
						home_extratime_goals: data.score.extratime.home,
						home_penalty_goals: data.score.penalty.home,
						team_away_id: data.teams.away.id,
						away_fulltime_goals: data.score.fulltime.away,
						away_halftime_goals: data.score.halftime.away,
						away_extratime_goals: data.score.extratime.away,
						away_penalty_goals: data.score.penalty.away,
						home_team_end_status: homeTeamEndStatus,
						away_team_end_status: awayTeamEndStatus
					});
				});

				let teamsMaped = fixtures.map(fixture => {
					return {
						id: fixture.teams.home.id,
						name: fixture.teams.home.name,
						logo: fixture.teams.home.logo
					};
				});

				if (
					!!fixturesFormated &&
					fixturesFormated.length > 0 &&
					!!teamsMaped &&
					teamsMaped.length > 0
				) {
					await axios
						.post(`${baseApiUrl}/teams`, teamsMaped)
						.then(() => {
							return axios.post(`${baseApiUrl}/fixtures`, fixturesFormated);
						})
						.then(() => {
							this.$toasted.global.defaultSuccess();
						})
						.catch(showError);
				}
			},
			async calculateLeagueStanding(leagueId, seasonId) {
				let config = {
					method: "get",
					url: `${baseApiUrl}/fixtures`,
					params: {}
				};

				config.params.leagueId = leagueId;
				config.params.seasonId = seasonId;

				let standing = {
					leagueId,
					seasonId,
					teamsStandings: []
				};

				await axios(config)
					.then(fixtures => {
						this.leagues = fixtures.data.map(async fixture => {
							//Ver de trazer a vitória e derrota direto do banco de dados //refatorar
							//Tratar penaltis e tempo extra

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

								standing.teamsStandings.push({
									round: fixture.round,
									roundNumber: fixture.roundNumber,
									teamId: fixture.teamHomeId,
									teamName: fixture.teamHomeName,
									points: fixture.homePoints,
									goalsFor: fixture.homeFulltimeGoals,
									goalsAgainst: fixture.awayFulltimeGoals,
									goalsDiff:
										fixture.homeFulltimeGoals - fixture.awayFulltimeGoals,
									played: 1,
									win: fixture.homeWin,
									draw: fixture.homeDraw,
									lose: fixture.homeLose,
									homeGoalsFor: fixture.homeFulltimeGoals,
									homeGoalsAgainst: fixture.awayFulltimeGoals,
									homePlayed: 1,
									homeWin: fixture.homeWin,
									homeDraw: fixture.homeDraw,
									homeLose: fixture.homeLose,
									awayGoalsFor: 0,
									awayGoalsAgainst: 0,
									awayPlayed: 0,
									awayWin: 0,
									awayDraw: 0,
									awayLose: 0,
									status: fixture.status,
									teamEndStatus: fixture.homeTeamEndStatus,
									leagueId,
									seasonId
								});

								standing.teamsStandings.push({
									round: fixture.round,
									roundNumber: fixture.roundNumber,
									teamId: fixture.teamAwayId,
									teamName: fixture.teamAwayName,
									points: fixture.awayPoints,
									goalsFor: fixture.awayFulltimeGoals,
									goalsAgainst: fixture.homeFulltimeGoals,
									goalsDiff:
										fixture.awayFulltimeGoals - fixture.homeFulltimeGoals,
									played: 1,
									win: fixture.awayWin,
									draw: fixture.awayDraw,
									lose: fixture.awayLose,
									homeGoalsFor: 0,
									homeGoalsAgainst: 0,
									homePlayed: 0,
									homeWin: 0,
									homeDraw: 0,
									homeLose: 0,
									awayGoalsFor: fixture.awayFulltimeGoals,
									awayGoalsAgainst: fixture.homeFulltimeGoals,
									awayPlayed: 1,
									awayWin: fixture.awayWin,
									awayDraw: fixture.awayDraw,
									awayLose: fixture.awayLose,
									status: fixture.status,
									teamEndStatus: fixture.awayTeamEndStatus,
									leagueId,
									seasonId
								});
							} else {
								standing.teamsStandings.push({
									round: fixture.round,
									roundNumber: fixture.roundNumber,
									teamId: fixture.teamHomeId,
									teamName: fixture.teamHomeName,
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
									awayLose: 0,
									status: fixture.status,
									teamEndStatus: fixture.homeTeamEndStatus,
									leagueId,
									seasonId
								});

								standing.teamsStandings.push({
									round: fixture.round,
									roundNumber: fixture.roundNumber,
									teamId: fixture.teamAwayId,
									teamName: fixture.teamAwayName,
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
									awayLose: 0,
									status: fixture.status,
									teamEndStatus: fixture.awayTeamEndStatus,
									leagueId,
									seasonId
								});
							}
						});
					})
					.catch(showError);

				standing.rounds = [];

				let cont = 0;

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

				let standings = [];
				let standingsPerRound = [];

				standing.rounds.forEach(async (round, roundIndex, rounds) => {
					if (roundIndex > 0) {
						let previousRound = rounds[roundIndex - 1];

						await round.standings.forEach(
							async (roundStanding, roundStandingindex, roundStandings) => {
								let previousTeamRound = previousRound.standings.find(e => {
									return e.teamId === roundStanding.teamId;
								});

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
									goalsFor: roundStanding.goalsFor + previousTeamRound.goalsFor,
									goalsAgainst:
										roundStanding.goalsAgainst + previousTeamRound.goalsAgainst,
									goalsDiff:
										roundStanding.goalsDiff + previousTeamRound.goalsDiff,
									played: roundStanding.played + previousTeamRound.played,
									win: roundStanding.win + previousTeamRound.win,
									draw: roundStanding.draw + previousTeamRound.draw,
									lose: roundStanding.lose + previousTeamRound.lose,
									homeGoalsFor:
										roundStanding.homeGoalsFor + previousTeamRound.homeGoalsFor,
									homeGoalsAgainst:
										roundStanding.homeGoalsAgainst +
										previousTeamRound.homeGoalsAgainst,
									homePlayed:
										roundStanding.homePlayed + previousTeamRound.homePlayed,
									homeWin: roundStanding.homeWin + previousTeamRound.homeWin,
									homeDraw: roundStanding.homeDraw + previousTeamRound.homeDraw,
									homeLose: roundStanding.homeLose + previousTeamRound.homeLose,
									awayGoalsFor:
										roundStanding.awayGoalsFor + previousTeamRound.awayGoalsFor,
									awayGoalsAgainst:
										roundStanding.awayGoalsAgainst +
										previousTeamRound.awayGoalsAgainst,
									awayPlayed:
										roundStanding.awayPlayed + previousTeamRound.awayPlayed,
									awayWin: roundStanding.awayWin + previousTeamRound.awayWin,
									awayDraw: roundStanding.awayDraw + previousTeamRound.awayLose,
									awayLose: roundStanding.awayLose + previousTeamRound.awayLose,
									teamEndStatus: roundStanding.teamEndStatus,
									status: roundStanding.status,
									leagueId: roundStanding.leagueId,
									seasonId: roundStanding.seasonId
								};

								roundStandings[roundStandingindex] = newRoundStanding;
							}
						);
					} else {
						delete round.rank;
					}
				});

				standing.rounds.forEach(round => {
					round = this.calculateRankings(round);
				});

				return standing;
			},
			calculateRankings(round) {
				function compareValues(key, order = "asc") {
					return function innerSort(a, b) {
						if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
							return 0;
						}

						const varA =
							typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
						const varB =
							typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

						let comparison = 0;
						if (varA > varB) {
							comparison = 1;
						} else if (varA < varB) {
							comparison = -1;
						}
						return order === "desc" ? comparison * -1 : comparison;
					};
				}

				round.standings
					.sort(compareValues("teamName", "desc"))
					.sort(compareValues("goalsFor", "desc"))
					.sort(compareValues("win", "desc"))
					.sort(compareValues("goalsDiff", "desc"))
					.sort(compareValues("points", "desc"));

				round.standings.forEach((standing, index) => {
					standing.rank = index + 1;
				});

				return round;
			},
			async calculateStandings(current) {
				this.leagues = [];

				await this.loadLeaguesAndSeasons(false, false);

				const getStandingsPerRound = async leagues => {
					let standings = [];

					for (const league of leagues) {
						let standing = await this.calculateLeagueStanding(
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
									goals_for: round.goalsFor,
									goals_against: round.goalsAgainst,
									goals_diff: round.goalsDiff,
									played: round.played,
									win: round.win,
									draw: round.draw,
									lose: round.lose,
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

				let leagueStandingsPerRound = await getStandingsPerRound(this.leagues);

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
					.catch(showError);
			}
		}
	};
</script>

<style>
	.anothers-buttons {
		margin: 20px;
	}
</style>
