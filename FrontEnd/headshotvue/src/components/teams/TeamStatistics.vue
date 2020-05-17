<template>
	<v-app id="inspire">
		<v-card>
			<v-row>
				<v-col cols="2" class="mt-1">
					<img :src="statistics.teamLogo" class="team-logo-medium">
				</v-col>
				<v-col cols="10" class="mt-2 team-name-medium">{{statistics.teamName}}</v-col>
			</v-row>
			<!-- <v-row>
				<v-col>competição</v-col>
				<v-col>season</v-col>
			</v-row>-->
			<v-container>
				<v-card class="charts-cards grey darken-4" :elevation="24">
					<v-row>{{$i18n.t(`headshot.teamStatistics.standingsRankPerRoundChart`)}}</v-row>
					<v-row>
						<v-col cols="12">
							<StandingsRankRiseChart
								:key="statistics.teamId"
								:teamId="statistics.teamId"
								:seasonId="statistics.seasonId"
								:leagueId="statistics.leagueId"
							/>
						</v-col>
					</v-row>
				</v-card>
				<TeamStatisticsTable :key="statisticControlers.mainId" :statistic="statistics.main"/>
				<v-card class="charts-cards grey darken-4" :elevation="24">
					<v-row>{{$i18n.t(`headshot.teamStatistics.resultsStatistics`)}}</v-row>
					<v-row>
						<v-col cols="4">
							<TeamResultsStatisticsCharts
								:key="statistics.teamId"
								:statistics="statistics.chartResultsHome"
								:title="'homeResults'"
							/>
						</v-col>
						<v-col cols="4">
							<TeamResultsStatisticsCharts
								:key="statistics.teamId"
								:statistics="statistics.chartResults"
								:title="'results'"
							/>
						</v-col>
						<v-col cols="4">
							<TeamResultsStatisticsCharts
								:key="statistics.teamId"
								:statistics="statistics.chartResultsAway"
								:title="'awayResults'"
							/>
						</v-col>
					</v-row>
				</v-card>
				<TeamStatisticsTable :key="statisticControlers.mainId" :statistic="statistics.goals"/>
				<v-card class="charts-cards grey darken-4" :elevation="24">
					<v-row>{{$i18n.t(`headshot.teamStatistics.goalsStatistics`)}}</v-row>
					<v-row>
						<v-col cols="4">
							<TeamGoalsStatisticsCharts
								:key="statistics.teamId"
								:statistics="statistics.chartGoalsHome"
								:title="'homeGoals'"
							/>
						</v-col>
						<v-col cols="4">
							<TeamGoalsStatisticsCharts
								:key="statistics.teamId"
								:statistics="statistics.chartGoals"
								:title="'goals'"
							/>
						</v-col>
						<v-col cols="4">
							<TeamGoalsStatisticsCharts
								:key="statistics.teamId"
								:statistics="statistics.chartGoalsAway"
								:title="'awayGoals'"
							/>
						</v-col>
					</v-row>
				</v-card>
				<TeamStatisticsTable :key="statisticControlers.mainId" :statistic="statistics.attack"/>
				<TeamStatisticsTable :key="statisticControlers.mainId" :statistic="statistics.defense"/>
				<TeamStatisticsTable :key="statisticControlers.mainId" :statistic="statistics.discipline"/>
				<TeamStatisticsTable :key="statisticControlers.mainId" :statistic="statistics.teamRole"/>
			</v-container>
		</v-card>
	</v-app>
</template>

<script>
	import axios from "axios";
	import numeral from "numeral";

	import StandingsRankRiseChart from "../standings/StandingsRankRiseChart.vue";
	import TeamStatisticsTable from "./TeamStatisticsTable.vue";
	import TeamResultsStatisticsCharts from "./TeamResultsStatisticsCharts.vue";
	import TeamGoalsStatisticsCharts from "./TeamGoalsStatisticsCharts.vue";

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
				statistics: {
					main: {
						values: []
					},
					goals: {
						values: []
					},
					attack: {
						values: []
					},
					defense: {
						values: []
					},
					discipline: {
						values: []
					},
					teamRole: {
						values: []
					}
				},
				statisticControlers: {
					mainId: 0
				}
			};
		},
		components: {
			StandingsRankRiseChart,
			TeamStatisticsTable,
			TeamResultsStatisticsCharts,
			TeamGoalsStatisticsCharts
		},
		props: {
			teamId: {
				type: Number,
				required: true
			},
			seasonId: {
				type: Number,
				required: true
			},
			leagueId: {
				type: Number,
				required: true
			}
		},
		methods: {
			loadStatistics() {
				if (!this.teamId) {
					return;
				}

				const params = {
					teamId: this.teamId,
					status: "Match Finished"
				};

				if (this.seasonId) params.seasonId = this.seasonId;
				if (this.leagueId) params.leagueId = this.leagueId;

				const config = {
					method: "get",
					url: `${baseApiUrl}/teamsStatistics`,
					params
				};

				axios(config).then(teamStatistics => {
					this.statistics.teamName = teamStatistics.data[0].teamName;
					this.statistics.teamLogo = teamStatistics.data[0].teamLogo;
					this.statistics.teamId = teamStatistics.data[0].teamId;

					const statistics = {
						playedGames: 0,
						wins: 0,
						homeWins: 0,
						awayWins: 0,
						loses: 0,
						homeLoses: 0,
						awayLoses: 0,
						draws: 0,
						homeDraws: 0,
						awayDraws: 0,
						goalsFor: 0,
						homeGoalsFor: 0,
						awayGoalsFor: 0,
						goalsAgainst: 0,
						homeGoalsAgainst: 0,
						awayGoalsAgainst: 0,
						cleanSheets: 0,
						awayBallPossession: 0,
						awayBlockedShotsAgainst: 0,
						awayBlockedShotsFor: 0,
						awayCornersAgainst: 0,
						awayCornersFor: 0,
						awayFoulsAgainst: 0,
						awayFoulsFor: 0,
						awayGoalkeeperSaveAgainst: 0,
						awayGoalkeeperSaveFor: 0,
						awayInsideboxShotsAgainst: 0,
						awayInsideboxShotsFor: 0,
						awayOffsidesAgainst: 0,
						awayOffsidesFor: 0,
						awayOutsideboxShotsAgainst: 0,
						awayOutsideboxShotsFor: 0,
						awayPassesAccurateAgainst: 0,
						awayPassesAccurateFor: 0,
						awayRedCardsAgainst: 0,
						awayRedCardsFor: 0,
						awayShotsOffGoalAgainst: 0,
						awayShotsOffGoalFor: 0,
						awayShotsOnGoalAgainst: 0,
						awayShotsOnGoalFor: 0,
						awayTotalPassesAgainst: 0,
						awayTotalPassesFor: 0,
						awayTotalShotsAgainst: 0,
						awayTotalShotsFor: 0,
						awayYellowCardsAgainst: 0,
						awayYellowCardsFor: 0,
						cornersAgainst: 0,
						cornersFor: 0,
						foulsAgainst: 0,
						foulsFor: 0,
						goalkeeperSaveAgainst: 0,
						goalkeeperSaveFor: 0,
						homeBallPossession: 0,
						homeBlockedShotsAgainst: 0,
						homeBlockedShotsFor: 0,
						homeCornersAgainst: 0,
						homeCornersFor: 0,
						homeFoulsAgainst: 0,
						homeFoulsFor: 0,
						homeGoalkeeperSaveAgainst: 0,
						homeGoalkeeperSaveFor: 0,
						homeInsideboxShotsAgainst: 0,
						homeInsideboxShotsFor: 0,
						homeOffsidesAgainst: 0,
						homeOffsidesFor: 0,
						homeOutsideboxShotsAgainst: 0,
						homeOutsideboxShotsFor: 0,
						homePassesAccurateAgainst: 0,
						homePassesAccurateFor: 0,
						homeRedCardsAgainst: 0,
						homeRedCardsFor: 0,
						homeShotsOffGoalAgainst: 0,
						homeShotsOffGoalFor: 0,
						homeShotsOnGoalAgainst: 0,
						homeShotsOnGoalFor: 0,
						homeTotalPassesAgainst: 0,
						homeTotalPassesFor: 0,
						homeTotalShotsAgainst: 0,
						homeTotalShotsFor: 0,
						homeYellowCardsAgainst: 0,
						homeYellowCardsFor: 0,
						insideboxShotsAgainst: 0,
						insideboxShotsFor: 0,
						offsidesAgainst: 0,
						offsidesFor: 0,
						outsideboxShotsAgainst: 0,
						outsideboxShotsFor: 0,
						passesAccurateAgainst: 0,
						passesAccurateFor: 0,
						redCardsAgainst: 0,
						redCardsFor: 0,
						shotsOffGoalAgainst: 0,
						shotsOffGoalFor: 0,
						shotsOnGoalAgainst: 0,
						shotsOnGoalFor: 0,
						totalPassesAgainst: 0,
						totalPassesFor: 0,
						totalShotsAgainst: 0,
						totalShotsFor: 0,
						yellowCardsAgainst: 0,
						yellowCardsFor: 0,
						ballPossession: 0,
						blockedShotsAgainst: 0,
						blockedShotsFor: 0
					};

					teamStatistics.data.forEach(teamStatistic => {
						statistics.playedGames++;

						if (teamStatistic.teamEndStatus === "W") {
							statistics.wins++;

							teamStatistic.side === "home"
								? statistics.homeWins++
								: statistics.awayWins++;
						} else if (teamStatistic.teamEndStatus === "L") {
							statistics.loses++;

							teamStatistic.side === "home"
								? statistics.homeLoses++
								: statistics.awayLoses++;
						} else {
							statistics.draws++;

							teamStatistic.side === "home"
								? statistics.homeDraws++
								: statistics.awayDraws++;
						}

						statistics.goalsFor += teamStatistic.teamGoalsFor || 0;
						statistics[`${teamStatistic.side}GoalsFor`] +=
							teamStatistic.teamGoalsFor;

						statistics.goalsAgainst += teamStatistic.teamGoalsAgainst || 0;
						statistics[`${teamStatistic.side}GoalsAgainst`] +=
							teamStatistic.teamGoalsAgainst;

						statistics.ballPossession += teamStatistic.teamBallPossession || 0;
						statistics[`${teamStatistic.side}BallPossession`] +=
							teamStatistic.teamBallPossession;

						statistics.blockedShotsAgainst +=
							teamStatistic.teamBlockedShotsAgainst || 0;
						statistics[`${teamStatistic.side}BlockedShotsAgainst`] +=
							teamStatistic.teamBlockedShotsAgainst;

						statistics.blockedShotsFor += teamStatistic.teamBlockedShotsFor || 0;
						statistics[`${teamStatistic.side}BlockedShotsFor`] +=
							teamStatistic.teamBlockedShotsFor;

						statistics.cornersAgainst += teamStatistic.teamCornersAgainst || 0;
						statistics[`${teamStatistic.side}CornersAgainst`] +=
							teamStatistic.teamCornersAgainst;

						statistics.cornersFor += teamStatistic.teamCornersFor || 0;
						statistics[`${teamStatistic.side}CornersFor`] +=
							teamStatistic.teamCornersFor;

						statistics.foulsAgainst += teamStatistic.teamFoulsAgainst || 0;
						statistics[`${teamStatistic.side}FoulsAgainst`] +=
							teamStatistic.teamFoulsAgainst;

						statistics.foulsFor += teamStatistic.teamFoulsFor || 0;
						statistics[`${teamStatistic.side}FoulsFor`] +=
							teamStatistic.teamFoulsFor;

						statistics.goalkeeperSaveAgainst +=
							teamStatistic.teamGoalkeeperSaveAgainst || 0;
						statistics[`${teamStatistic.side}GoalkeeperSaveAgainst`] +=
							teamStatistic.teamGoalkeeperSaveAgainst;

						statistics.goalkeeperSaveFor +=
							teamStatistic.teamGoalkeeperSaveFor || 0;
						statistics[`${teamStatistic.side}GoalkeeperSaveFor`] +=
							teamStatistic.teamGoalkeeperSaveFor;

						statistics.insideboxShotsAgainst +=
							teamStatistic.teamInsideboxShotsAgainst || 0;
						statistics[`${teamStatistic.side}InsideboxShotsAgainst`] +=
							teamStatistic.teamInsideboxShotsAgainst;

						statistics.insideboxShotsFor +=
							teamStatistic.teamInsideboxShotsFor || 0;
						statistics[`${teamStatistic.side}InsideboxShotsFor`] +=
							teamStatistic.teamInsideboxShotsFor;

						statistics.offsidesAgainst += teamStatistic.teamOffsidesAgainst || 0;
						statistics[`${teamStatistic.side}OffsidesAgainst`] +=
							teamStatistic.teamOffsidesAgainst;

						statistics.offsidesFor += teamStatistic.teamOffsidesFor || 0;
						statistics[`${teamStatistic.side}OffsidesFor`] +=
							teamStatistic.teamOffsidesFor;

						statistics.outsideboxShotsAgainst +=
							teamStatistic.teamOutsideboxShotsAgainst || 0;
						statistics[`${teamStatistic.side}OutsideboxShotsAgainst`] +=
							teamStatistic.teamOutsideboxShotsAgainst;

						statistics.outsideboxShotsFor +=
							teamStatistic.teamOutsideboxShotsFor || 0;
						statistics[`${teamStatistic.side}OutsideboxShotsFor`] +=
							teamStatistic.teamOutsideboxShotsFor;

						statistics.passesAccurateAgainst +=
							teamStatistic.teamPassesAccurateAgainst || 0;
						statistics[`${teamStatistic.side}PassesAccurateAgainst`] +=
							teamStatistic.teamPassesAccurateAgainst;

						statistics.passesAccurateFor +=
							teamStatistic.teamPassesAccurateFor || 0;
						statistics[`${teamStatistic.side}PassesAccurateFor`] +=
							teamStatistic.teamPassesAccurateFor;

						statistics.redCardsAgainst += teamStatistic.teamRedCardsAgainst || 0;
						statistics[`${teamStatistic.side}RedCardsAgainst`] +=
							teamStatistic.teamRedCardsAgainst;

						statistics.redCardsFor += teamStatistic.teamRedCardsFor || 0;
						statistics[`${teamStatistic.side}RedCardsFor`] +=
							teamStatistic.teamRedCardsFor;

						statistics.yellowCardsAgainst +=
							teamStatistic.teamYellowCardsAgainst || 0;
						statistics[`${teamStatistic.side}YellowCardsAgainst`] +=
							teamStatistic.teamYellowCardsAgainst;

						statistics.yellowCardsFor += teamStatistic.teamYellowCardsFor || 0;
						statistics[`${teamStatistic.side}YellowCardsFor`] +=
							teamStatistic.teamYellowCardsFor;

						statistics.shotsOffGoalAgainst +=
							teamStatistic.teamShotsOffGoalAgainst || 0;
						statistics[`${teamStatistic.side}ShotsOffGoalAgainst`] +=
							teamStatistic.teamShotsOffGoalAgainst;

						statistics.shotsOffGoalFor += teamStatistic.teamShotsOffGoalFor || 0;
						statistics[`${teamStatistic.side}ShotsOffGoalFor`] +=
							teamStatistic.teamShotsOffGoalFor;

						statistics.shotsOnGoalAgainst +=
							teamStatistic.teamShotsOnGoalAgainst || 0;
						statistics[`${teamStatistic.side}ShotsOnGoalAgainst`] +=
							teamStatistic.teamShotsOnGoalAgainst;

						statistics.shotsOnGoalFor += teamStatistic.teamShotsOnGoalFor || 0;
						statistics[`${teamStatistic.side}ShotsOnGoalFor`] +=
							teamStatistic.teamShotsOnGoalFor;

						statistics.totalPassesAgainst +=
							teamStatistic.teamTotalPassesAgainst || 0;
						statistics[`${teamStatistic.side}TotalPassesAgainst`] +=
							teamStatistic.teamTotalPassesAgainst;

						statistics.totalPassesFor += teamStatistic.teamTotalPassesFor || 0;
						statistics[`${teamStatistic.side}TotalPassesFor`] +=
							teamStatistic.teamTotalPassesFor;

						statistics.totalShotsAgainst +=
							teamStatistic.teamTotalShotsAgainst || 0;
						statistics[`${teamStatistic.side}TotalShotsAgainst`] +=
							teamStatistic.teamTotalShotsAgainst;

						statistics.totalShotsFor += teamStatistic.teamTotalShotsFor || 0;
						statistics[`${teamStatistic.side}TotalShotsFor`] +=
							teamStatistic.teamTotalShotsFor;

						if (teamStatistic.teamGoalsAgainst === 0) {
							statistics.cleanSheets++;
						}
					});

					this.statistics.chartResults = {
						W: statistics.wins,
						D: statistics.draws,
						L: statistics.loses
					};

					this.statistics.chartResultsHome = {
						W: statistics.homeWins,
						D: statistics.homeDraws,
						L: statistics.homeLoses
					};

					this.statistics.chartResultsAway = {
						W: statistics.awayWins,
						D: statistics.awayDraws,
						L: statistics.awayLoses
					};

					this.statistics.chartGoals = {
						for: statistics.goalsFor,
						against: statistics.goalsAgainst
					};

					this.statistics.chartGoalsHome = {
						for: statistics.homeGoalsFor,
						against: statistics.homeGoalsAgainst
					};

					this.statistics.chartGoalsAway = {
						for: statistics.awayGoalsFor,
						against: statistics.awayGoalsAgainst
					};

					this.statistics.main.values.push({
						label: "playedGames",
						value: statistics.playedGames
					});

					this.statistics.main.values.push({
						label: "wins",
						value: `${statistics.wins} (${numeral(
							statistics.wins / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.main.values.push({
						label: "loses",
						value: `${statistics.loses} (${numeral(
							statistics.loses / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.main.values.push({
						label: "draws",
						value: `${statistics.draws} (${numeral(
							statistics.draws / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.goals.values.push({
						label: "goalsFor",
						value: `${statistics.goalsFor} (${numeral(
							statistics.goalsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.goals.values.push({
						label: "goalsAgainst",
						value: `${statistics.goalsAgainst} (${numeral(
							statistics.goalsAgainst / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.defense.values.push({
						label: "cleanSheets",
						value: `${statistics.cleanSheets} (${numeral(
							statistics.cleanSheets / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.attack.values.push({
						label: "shotsOnGoal",
						value: `${statistics.shotsOnGoalFor} (${numeral(
							statistics.shotsOnGoalFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.attack.values.push({
						label: "shotsOffGoal",
						value: `${statistics.shotsOffGoalFor} (${numeral(
							statistics.shotsOffGoalFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.attack.values.push({
						label: "shots",
						value: `${statistics.totalShotsFor} (${numeral(
							statistics.totalShotsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.attack.values.push({
						label: "blockedShots",
						value: `${statistics.blockedShotsFor} (${numeral(
							statistics.blockedShotsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.attack.values.push({
						label: "insideBoxShots",
						value: `${statistics.insideboxShotsFor} (${numeral(
							statistics.insideboxShotsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.attack.values.push({
						label: "outsideBoxShots",
						value: `${statistics.outsideboxShotsFor} (${numeral(
							statistics.outsideboxShotsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.attack.values.push({
						label: "corners",
						value: `${statistics.cornersFor} (${numeral(
							statistics.cornersFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.discipline.values.push({
						label: "fouls",
						value: `${statistics.foulsFor} (${numeral(
							statistics.foulsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.discipline.values.push({
						label: "offsides",
						value: `${statistics.offsidesFor} (${numeral(
							statistics.offsidesFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.discipline.values.push({
						label: "yellowCards",
						value: `${statistics.yellowCardsFor} (${numeral(
							statistics.yellowCardsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.discipline.values.push({
						label: "redCards",
						value: `${statistics.redCardsFor} (${numeral(
							statistics.redCardsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.defense.values.push({
						label: "goalkeeperDefenses",
						value: `${statistics.goalkeeperSaveFor} (${numeral(
							statistics.goalkeeperSaveFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.defense.values.push({
						label: "blockedShots",
						value: `${statistics.blockedShotsFor} (${numeral(
							statistics.blockedShotsFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.defense.values.push({
						label: "corners",
						value: `${statistics.cornersAgainst} (${numeral(
							statistics.cornersAgainst / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.teamRole.values.push({
						label: "ballPossession",
						value: `${numeral(
							statistics.ballPossession / statistics.playedGames
						).format("0.00")}%`
					});

					this.statistics.teamRole.values.push({
						label: "totalPasses",
						value: `${statistics.totalPassesFor} (${numeral(
							statistics.totalPassesFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.teamRole.values.push({
						label: "accuratePasses",
						value: `${statistics.passesAccurateFor} (${numeral(
							statistics.passesAccurateFor / statistics.playedGames
						).format("0.00")})`
					});

					this.statistics.main.title = "main";
					this.statistics.goals.title = "goals";
					this.statistics.attack.title = "attack";
					this.statistics.defense.title = "defense";
					this.statistics.discipline.title = "discipline";
					this.statistics.teamRole.title = "teamRole";
					this.statisticControlers.mainId++;
				});
			}
		},
		mounted() {
			this.loadStatistics();
		}
	};
</script>

<style>
	.team-logo-medium {
		width: 50px;
	}

	.team-name-medium {
		font-size: 1.8rem;
		text-align: left;
	}

	.statistics-tables {
		border: 1px solid rgba(214, 214, 214, 0.59);
		border-radius: 6px;
		align-self: center;
	}

	.charts-cards {
		padding: 20px;
		margin-bottom: 10px;
	}
</style>
