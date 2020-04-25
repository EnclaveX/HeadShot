<template>
	<v-app id="inspire">
		<div class="standings">
			<v-row>
				<v-col cols="12">
					<FilterStandings/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="8">
					<Table/>
				</v-col>
				<v-col cols="4">
					<Fixtures/>
				</v-col>
			</v-row>
		</div>
	</v-app>
</template>

<script>
	import FilterStandings from "./StandingsFilter.vue";
	import Table from "./StandingsTable.vue";
	import Fixtures from "./StandingsFixtures.vue";

	import axios from "axios";
	import {
		baseApiUrl,
		showError,
		baseFootballApiUrl,
		footballApiHeaders,
		production
	} from "@/global";

	export default {
		components: {
			FilterStandings,
			Table,
			Fixtures
		},
		computed: {
			league: {
				get() {
					return this.$store.state.standings.league;
				}
			},
			season: {
				get() {
					return this.$store.state.standings.season;
				}
			}
		},
		methods: {
			async insertStandingsAndFixtures() {
				if (!this.league && !this.season) {
					return;
				}

				let config = {};

				if (production) {
					config = {
						method: "get",
						url: `${baseFootballApiUrl}/standings`,
						headers: footballApiHeaders,
						params: {
							league: this.league,
							season: this.season
						}
					};
				} else {
					config = {
						method: "get",
						url: `${baseApiUrl}/apiTests/standings`
					};
				}

				let standings = await axios(config)
					.then(resp => {
						return JSON.parse(resp.data.resp);
					})
					.catch(showError);

				const league = standings[0].league;
				const seasonYear = standings[0].league.season;

				let params = {
					year: seasonYear,
					leagueId: league.id
				};

				let season = await axios
					.get(`${baseApiUrl}/seasons`, { params })
					.then(resp => {
						return resp.data;
					})
					.catch(showError);

				let standingsFormated = [];

				league.standings[0].forEach(standing => {
					standingsFormated.push({
						rank: standing.rank,
						teamId: standing.team.id,
						teamName: standing.team.name,
						teamLogo: standing.team.logo,
						leagueId: this.league,
						seasonId: this.season,
						points: standing.points,
						goalsFor: standing.all.goals.for,
						goalsAgainst: standing.all.goals.against,
						goalsDiff: standing.goalsDiff,
						played: standing.all.played,
						win: standing.all.win,
						draw: standing.all.draw,
						lose: standing.all.lose,
						homeGoalsFor: standing.home.goals.for,
						homeGoalsAgainst: standing.home.goals.against,
						homePlayed: standing.home.played,
						homeWin: standing.home.win,
						homeDraw: standing.home.draw,
						homeLose: standing.home.lose,
						awayGoalsFor: standing.away.goals.for,
						awayGoalsAgainst: standing.away.goals.against,
						awayPlayed: standing.away.played,
						awayWin: standing.away.win,
						awayDraw: standing.away.draw,
						awayLose: standing.away.lose,
						lastFive: standing.form
					});
				});

				let teamsMaped = standingsFormated.map(team => {
					return {
						id: team.teamId,
						name: team.teamName,
						logo: team.teamLogo
					};
				});

				let standingsMaped = standingsFormated.map(standing => {
					return {
						rank: standing.rank,
						team_id: standing.teamId,
						league_id: standing.leagueId,
						season_id: standing.seasonId,
						points: standing.points,
						goals_for: standing.goalsFor,
						goals_against: standing.goalsAgainst,
						goals_diff: standing.goalsDiff,
						played: standing.played,
						win: standing.win,
						draw: standing.draw,
						lose: standing.lose,
						home_goals_for: standing.homeGoalsFor,
						home_goals_against: standing.homeGoalsAgainst,
						home_played: standing.homePlayed,
						home_win: standing.homeWin,
						home_draw: standing.homeDraw,
						home_lose: standing.homeLose,
						away_goals_for: standing.awayGoalsFor,
						away_goals_against: standing.awayGoalsAgainst,
						away_played: standing.awayPlayed,
						away_win: standing.awayWin,
						away_draw: standing.awayDraw,
						away_lose: standing.awayLose,
						form: standing.lastFive
					};
				});

				if (production) {
					config = {
						method: "get",
						url: `${baseFootballApiUrl}/fixtures`,
						headers: footballApiHeaders,
						params: {
							league: this.league,
							season: this.season
						}
					};
				} else {
					config = {
						method: "get",
						url: `${baseApiUrl}/apiTests/fixtures`
					};
				}

				let fixtures = await axios(config)
					.then(resp => {
						return JSON.parse(resp.data.resp);
					})
					.catch(showError);

				let fixturesFormated = [];

				fixtures.forEach(data => {
					fixturesFormated.push({
						id: data.fixture.id,
						venue: data.fixture.venue,
						status: data.fixture.status.long,
						round: data.league.round,
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
						league_id: this.league,
						season_id: this.season,
						team_home_id: data.teams.home.id,
						home_fulltime_goals: data.score.fulltime.home,
						home_halftime_goals: data.score.halftime.home,
						home_extratime_goals: data.score.extratime.home,
						home_penalty_goals: data.score.penalty.home,
						team_away_id: data.teams.away.id,
						away_fulltime_goals: data.score.fulltime.away,
						away_halftime_goals: data.score.halftime.away,
						away_extratime_goals: data.score.extratime.away,
						away_penalty_goals: data.score.penalty.away
					});
				});

				if (
					!!standingsMaped &&
					standingsMaped.length > 0 &&
					!!teamsMaped &&
					teamsMaped.length > 0 &&
					!!fixturesFormated &&
					fixturesFormated.length > 0
				) {
					await axios
						.post(`${baseApiUrl}/teams`, teamsMaped)
						.then(() => {
							return axios
								.post(`${baseApiUrl}/standings`, standingsMaped)
								.catch(showError);
						})
						.then(() => {
							return axios
								.post(`${baseApiUrl}/fixtures`, fixturesFormated)
								.catch(showError);
						})
						.then(() => {
							this.$toasted.global.defaultSuccess();
						})
						.catch(showError);
				}
			}
		},
		created() {
			this.$store.commit("standings/setLeague", null);
			this.$store.commit("standings/setSeason", null);
		}
	};
</script>

<style>
	.standings {
		margin: 20px;
	}

	.button-filter {
		margin-top: 10px;
		width: 100%;
	}
</style>
