<template>
	<v-app id="inspire" class="standings-table">
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
			</v-data-table>
		</v-card>
	</v-app>
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
				headers: [],
				standings: []
			};
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
			season: function(newSeason){
				this.loadStandings()
			}
		},
		methods: {
			async loadStandings() {
				if (this.league === null || this.season === null) {
					return;
				}

				const config = {
					method: "get",
					url: `${baseApiUrl}/standings`,
					params: {
						leagueId: this.league,
						seasonId: this.season
					}
				};

				axios(config)
					.then(standings => {
						this.standings = standings.data.map(item => {
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
				{
					text: this.$i18n.t("headshot.standings.actions"),
					value: "actions",
					sortable: false
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
		background-color: green;
	}

	.lastfiveD {
		background-color: orange;
	}

	.lastfiveL {
		background-color: red;
	}

	.button-datatable {
		align-self: center;
	}
</style>
