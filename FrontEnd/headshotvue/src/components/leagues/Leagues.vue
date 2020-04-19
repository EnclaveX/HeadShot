<template>
	<div id="app">
		<v-app id="inspire">
			<v-data-table :headers="headers" :items="data" :sort-by="headers.sortBy" class="elevation-1">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title class="col-2">{{$i18n.t(`headshot.league.${title}`)}}</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
						<div class="d-flex flex-row-reverse buttons-painel-datatable" style="width: 100%">
							<v-btn 
								@click="insertLeagues()"
								class="button-datatable primary"
							>{{$i18n.t('headshot.general.load')}}</v-btn>
						</div>
					</v-toolbar>
				</template>
				<template v-slot:item.favorite="{ item }">
					<v-icon
						:color="item.favorite ? 'red' : 'gray'"
						v-model="item.favorite"
						dark
						v-on="on"
						@click="favoriteLeague(item)"
					>mdi-heart</v-icon>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-tooltip left color="rgba(50,50,50,0.8)">
						<template v-slot:activator="{ on }">
							<v-icon dark v-on="on" @click="viewImage(item)">mdi-image</v-icon>
						</template>
						<span>{{$i18n.t('headshot.general.viewImage')}}</span>
					</v-tooltip>
				</template>
			</v-data-table>
			<v-dialog v-model="imageDialog" max-width="500px">
				<v-card>
					<div class="overline mb-4">{{this.league.name}}</div>
					<v-img :src="this.league.logo" contain max-height="300"/>
					<v-card-actions>
						<v-btn color="primary" text @click="imageDialog = false">{{$i18n.t('headshot.general.close')}}</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
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
				headers: [],
				data: [],
				imageDialog: false,
				title: "leagues",
				league: {}
			};
		},
		methods: {
			async favoriteLeague(league) {
				if (league.favorite === 1) {
					league.favorite = 0;
				} else {
					league.favorite = 1;
				}

				const leagueMaped = { ...league };

				delete leagueMaped.countryName;

				axios
					.post(`${baseApiUrl}/leagues`, [leagueMaped])
					.then(() => {
						this.$toasted.global.defaultSuccess();
					})
					.catch(showError);
			},
			viewImage(league) {
				this.league = league;
				this.imageDialog = true;
			},
			async loadLeagues() {
				const config = {
					method: "get",
					url: `${baseApiUrl}/leagues`
				};

				axios(config)
					.then(leagues => {
						this.data = leagues.data.map(item => {
							return item;
						});
					})
					.catch(showError);
			},
			async mapLeagues(leagues) {
				let mapedLeagues = [];

				const resolveLeagues = new Promise((resolve, reject) => {
					mapedLeagues = leagues.map(async league => {
						const params = {
							countryName: league.country.name
						};

						let seasons = await league.seasons.map((season) => {
							return {
								year: season.year,
								start: season.start,
								end: season.end,
								current: season.current ? 1 : 0,
								league_id: league.league.id,
								fixture_events: season.coverage.fixtures.events ? 1 : 0,
								fixture_lineups: season.coverage.fixtures.lineups ? 1 : 0,
								fixture_statistics: season.coverage.fixtures.statistics_fixtures ? 1 : 0,
								fixture_statistics_players: season.coverage.fixtures.statistics_players ? 1 : 0,
								standings: season.coverage.standings ? 1 : 0,
								players: season.coverage.players ? 1 : 0,
								top_scorers: season.coverage.top_scorers ? 1 : 0,
								predictions: season.coverage.predictions ? 1 : 0,
								odds: season.coverage.odds ? 1 : 0								
							}
						})

						var country = {};

						await axios
							.get(`${baseApiUrl}/countries`, { params })
							.then(resp => {
								country = resp.data[0];
							})
							.catch(showError);

						if (country === undefined) {
							params.countryName = "World";

							await axios
								.get(`${baseApiUrl}/countries`, { params })
								.then(resp => {
									country = resp.data[0];
								})
								.catch(showError);
						}

						if (country !== undefined) {
							return {
								id: league.league.id,
								name: league.league.name,
								type: league.league.type,
								logo: league.league.logo,
								country_id: country.id,
								seasons: seasons
							};
						} else {
							return {};
						}
					});

					resolve(mapedLeagues);
				});

				return resolveLeagues;
			},
			async insertLeagues() {
				let config = {};

				if (production) {
					config = {
						method: "get",
						url: `${baseFootballApiUrl}/leagues`,
						headers: footballApiHeaders
					};
				} else {
					config = {
						method: "get",
						url: `${baseApiUrl}/apiTests/leagues`
					};
				}

				
				let leagues = await axios(config)
					.then(resp => {
						return JSON.parse(resp.data.resp);
					})
					.catch(showError);

				const leaguesMaped = await this.mapLeagues(leagues).then(leagues => {
					return Promise.all(leagues).then(league => {
						return league;
					});
				});

				if (!!leaguesMaped && leaguesMaped.length > 0) {
					axios
						.post(`${baseApiUrl}/leagues`, leaguesMaped)
						.then(() => {
							this.$toasted.global.defaultSuccess();

							this.loadLeagues();
						})
						.catch(showError);
				}
			}
		},
		mounted() {
			this.loadLeagues();
		},
		created() {
			this.headers = [
				{
					text: this.$i18n.t("headshot.league.name"),
					value: "name"
				},
				{
					text: this.$i18n.t("headshot.league.country"),
					value: "countryName"
				},
				{
					text: this.$i18n.t("headshot.league.type"),
					value: "type"
				},
				{
					text: this.$i18n.t("headshot.league.favorite"),
					value: "favorite"
				},
				{
					text: this.$i18n.t("headshot.league.actions"),
					value: "actions",
					sortable: false
				}
			];
		}
	};
</script>

<style>
	.button-datatable {
		padding: 10px;
		margin: 5px;
	}

	.buttons-painel-datatable {
		color: black;
	}

	.v-application--wrap {
		min-height: 0;
	}
</style>
