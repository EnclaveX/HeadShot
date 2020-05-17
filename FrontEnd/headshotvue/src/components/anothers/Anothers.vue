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
				<v-btn
					class="primary anothers-buttons"
					@click="loadFixtureStatistics()"
				>{{$i18n.t('headshot.anothers.loadFixtureStatistics')}}</v-btn>
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
			async loadFixtureStatistics() {
				let config;

				if (production) {
					config = {
						method: "get",
						url: `${baseApiUrl}/fixtures`,
						params: {
							loadedStatistics: "N",
							status: "Match Finished",
							limit: 100
						}
					};
				} else {
					config = {
						method: "get",
						url: `${baseApiUrl}/fixtures`,
						params: {
							loadedStatistics: "N",
							status: "Match Finished",
							id: 157165
						}
					};
				}

				let fixtures = await axios(config)
					.then(resp => {
						return resp.data;
					})
					.catch(showError);

				fixtures.forEach(async fixture => {
					if (production) {
						config = {
							method: "get",
							url: `${baseFootballApiUrl}/fixtures/statistics`,
							headers: footballApiHeaders,
							params: {
								fixture: fixture.id
							}
						};
					} else {
						config = {
							method: "get",
							url: `${baseApiUrl}/apiTests/fixturesStatistics`
						};
					}

					let statistic = await axios(config)
						.then(resp => {
							if (production) {
								return resp.data.response;
							} else {
								return JSON.parse(resp.data.resp);
							}
						})
						.catch(showError => {
							return showError;
						});

					let statisticsInsert = [];

					let statisticInsertProperties = {
						id: fixture.id,
						venue: fixture.venue,
						status: fixture.status,
						round: fixture.round,
						fixture_date: fixture.fixture_date,
						extratime: fixture.extratime,
						penalty: fixture.penalty,
						league_id: fixture.league_id,
						season_id: fixture.season_id,
						team_home_id: fixture.team_home_id,
						home_fulltime_goals: fixture.home_fulltime_goals,
						home_halftime_goals: fixture.home_halftime_goals,
						home_extratime_goals: fixture.home_extratime_goals,
						home_penalty_goals: fixture.home_penalty_goals,
						team_away_id: fixture.team_away_id,
						away_fulltime_goals: fixture.away_fulltime_goals,
						away_halftime_goals: fixture.away_halftime_goals,
						away_extratime_goals: fixture.away_extratime_goals,
						away_penalty_goals: fixture.away_penalty_goals,
						round_number: fixture.round_number,
						home_team_end_status: fixture.home_team_end_status,
						away_team_end_status: fixture.away_team_end_status,
						loaded_statistics: "Y"
					};

					statistic.forEach((fixtureSides, index) => {
						fixtureSides.statistics.forEach(statistic => {
							let side = "";

							if (index === 0) {
								side = "home";
							} else {
								side = "away";
							}

							if (statistic.type === "Shots on Goal") {
								statisticInsertProperties[`${side}_shots_on_goal`] =
									statistic.value || 0;
							}

							if (statistic.type === "Shots off Goal") {
								statisticInsertProperties[`${side}_shots_off_goal`] =
									statistic.value || 0;
							}

							if (statistic.type === "Total Shots") {
								statisticInsertProperties[`${side}_total_shots`] =
									statistic.value || 0;
							}

							if (statistic.type === "Blocked Shots") {
								statisticInsertProperties[`${side}_blocked_shots`] =
									statistic.value || 0;
							}

							if (statistic.type === "Shots insidebox") {
								statisticInsertProperties[`${side}_insidebox_shots`] =
									statistic.value || 0;
							}

							if (statistic.type === "Shots outsidebox") {
								statisticInsertProperties[`${side}_outsidebox_shots`] =
									statistic.value || 0;
							}

							if (statistic.type === "Corner Kicks") {
								statisticInsertProperties[`${side}_corners`] =
									statistic.value || 0;
							}

							if (statistic.type === "Offsides") {
								statisticInsertProperties[`${side}_offsides`] =
									statistic.value || 0;
							}

							if (statistic.type === "Fouls") {
								statisticInsertProperties[`${side}_fouls`] = statistic.value || 0;
							}

							if (statistic.type === "Ball Possession") {
								statisticInsertProperties[`${side}_ball_possession`] =
									statistic.value || "0%";
							}

							if (statistic.type === "Yellow Cards") {
								statisticInsertProperties[`${side}_yellow_cards`] =
									statistic.value || 0;
							}

							if (statistic.type === "Red Cards") {
								statisticInsertProperties[`${side}_red_cards`] =
									statistic.value || 0;
							}

							if (statistic.type === "Goalkeeper Saves") {
								statisticInsertProperties[`${side}_goalkeeper_save`] =
									statistic.value || 0;
							}

							if (statistic.type === "Total passes") {
								statisticInsertProperties[`${side}_total_passes`] =
									statistic.value || 0;
							}

							if (statistic.type === "Passes accurate") {
								statisticInsertProperties[`${side}_passes_accurate`] =
									statistic.value || 0;
							}
						});
					});

					await axios
						.post(`${baseApiUrl}/fixtures`, [statisticInsertProperties]) 
						.catch(showError => {
							console.log(showError)
						});
				});
			},
			async loadLeaguesAndSeasons(current, loadFixtures) {
				const configGetSeasons = {
					method: "get",
					url: `${baseApiUrl}/leagues/seasons`,
					params: {
						favorite: true
					}
				};

				if (current) config.params.current = true;

				await axios(configGetSeasons)
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
				const configGetFixtures = {
					method: "get",
					url: `${baseFootballApiUrl}/fixtures`,
					headers: footballApiHeaders,
					params: {
						league: leagueId,
						season: seasonYear
					}
				};

				const fixtures = await axios(configGetFixtures)
					.then(fixtures => {
						return fixtures.data.response;
					})
					.catch(showError);

				if (!fixtures) return;

				let fixturesFormated = [];

				const getRoundNumber = round => {
					return parseInt(
						round
							.substring(round.length - 3)
							.replace("-", "")
							.trim()
					);
				};

				fixtures.forEach(fixture => {
					const roundNumber = getRoundNumber(fixture.league.round);

					let homeTeamEndStatus, awayTeamEndStatus;

					if (fixture.fixture.status.long === "Match Finished") {
						if (fixture.score.fulltime.home > fixture.score.fulltime.away) {
							homeTeamEndStatus = "W";
							awayTeamEndStatus = "L";
						} else if (fixture.score.fulltime.home < fixture.score.fulltime.away) {
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
								goalsDiff = 0,
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
								let previousTeamRound = previousRound.standings.find(actualRound => {
									return actualRound.teamId === roundStanding.teamId;
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

								round.standings[roundStandingindex] = newRoundStanding;
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
