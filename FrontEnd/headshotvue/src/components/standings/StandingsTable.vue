<template>
	<v-app id="inspire" class="standings-table">
		<v-dialog
			v-model="dialogMoreStatistics"
			width="1000">
			<TeamsStatistics/>
		</v-dialog>
		<v-card>
			<v-row>
				<v-card-title class="ml-4">{{$i18n.t(`headshot.standings.standings`)}}</v-card-title>
				<v-divider class="mx-4" inset vertical></v-divider>
			</v-row>
			<v-data-table
				:hide-default-footer="true"
				:no-data-text="$i18n.t(`headshot.general.noDataAvailable`)"
				:headers="headers"
				:items="standings"
				:sort-by="headers.sortBy"
				item-key="rank"
				:single-expand="false"
				show-expand
				class="elevation-1"
				:items-per-page="30"
				:calculate-widths="true"
			>
				<template v-slot:item.lastFive="{ item }">
					<v-tooltip bottom color="rgba(50,50,50,0.8)">
						<template v-slot:activator="{ on }">
							<v-row>
								<div
									v-for="(item, index) in item.lastFive"
									:key="index"
									dark
									v-on="on"
									:class="`lastfive lastfive${item}`"
									@click="viewImage(item)"
								>{{item}}</div>
							</v-row>
						</template>
						<span>{{'Vai mostrar o jogo em questão'}}</span>
					</v-tooltip>
				</template>
				<template v-slot:expanded-item="{ headers, item }">
					<td :colspan="headers.length">
						<v-row>
							<v-col cols="2" class="mt-1">
								<img :src="item.teamLogo" class="team-logo-medium">
							</v-col>
							<v-col cols="6" class="mt-2 team-name-medium">{{item.teamName}}</v-col>
							<v-col cols="4" class="mt-3">
								<v-btn class="grey darken-3" @click="showMoreStatistics(item)">{{$i18n.t(`headshot.standings.moreStatistics`)}}</v-btn>
							</v-col>
						</v-row>
						<StandingsRankRiseChart
							:key="item.teamId"
							:teamId="item.teamId"
							:seasonId="item.seasonId"
							:leagueId="item.leagueId"
						/>
					</td>
				</template>
			</v-data-table>
		</v-card>
	</v-app>
</template>

<script>
	import axios from "axios";
	import StandingsRankRiseChart from "./StandingsRankRiseChart.vue";
	import TeamsStatistics from "../teams/TeamStatistics.vue";

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
				headers: [],
				standings: [],
				expanded: [],
				dialogMoreStatistics: false
			};
		},
		components: {
			StandingsRankRiseChart,
			TeamsStatistics
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
		watch: {
			season: function(newSeason) {
				this.loadStandings();
			},
			league: function(newLeague) {
				this.standings = [];
			}
		},
		methods: {
			async showMoreStatistics(team){
				this.dialogMoreStatistics = true
			},
			async loadStandings() {
				if (this.league === null || this.season === null) {
					return;
				}

				let config = {
					method: "get",
					url: `${baseApiUrl}/lastStandingPerRound`,
					params: {
						leagueId: this.league,
						seasonId: this.season
					}
				};

				axios(config)
					.then(item => {
						const roundNumber = item.data[0].roundNumber;

						let config = {
							method: "get",
							url: `${baseApiUrl}/standingsPerRound`,
							params: {
								leagueId: this.league,
								seasonId: this.season,
								roundNumber
							}
						};

						return axios(config);
					})
					.then(standingsPerRound => {
						this.standings = standingsPerRound.data.map(item => {
							return item;
						});
					})
					.catch(showError);
			}
		},
		created() {
			this.headers = [
				{
					text: this.$i18n.t("headshot.standings.rank"),
					value: "rank",
					width: "10px",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.team"),
					value: "teamName",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.points"),
					value: "points",
					width: "10px",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.numberGames"),
					value: "played",
					width: "10px",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.numberLoses"),
					value: "win",
					width: "10px",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.numberDraws"),
					value: "draw",
					width: "10px",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.numberLoses"),
					value: "lose",
					width: "10px",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.goalsDiff"),
					value: "goalsDiff",
					width: "10px",
					sortable: false
				},
				{
					text: this.$i18n.t("headshot.standings.lastFive"),
					value: "lastFive",
					width: "130px",
					sortable: false
				},
				,
				{
					text: "",
					value: "data-table-expand"
				}
			];
		},
		mounted() {
			this.loadStandings();
		}
	};
</script>

<style>
	.standings-table {
		min-width: 800px;
	}

	.lastfive {
		width: 20px;
		height: 20px;
		margin: 2px;
		border-radius: 10px;
		text-align: center;
		cursor: default;
	}

	.lastfiveW {
		background-color: #008000;
	}

	.lastfiveD {
		background-color: #ffa500;
	}

	.lastfiveL {
		background-color: #ff0000;
	}

	.button-datatable {
		align-self: center;
	}

	.team-logo-medium {
		width: 50px;
	}

	.team-name-medium {
		font-size: 1.8rem;
		text-align: left;
	}
</style>
