<template>
	<v-app id="inspire">
		<v-card>
			<v-card-title>{{$i18n.t(`headshot.general.filters`)}}</v-card-title>
			<v-card class="standings-filters grey darken-4" :elevation="24">
				<v-row>
					<v-col cols="3">
						<v-select
							:items="leagues"
							item-text="leagueName"
							item-value="leagueId"
							:label="$i18n.t(`headshot.standings.league`)"
							:no-data-text="$i18n.t(`headshot.general.noDataAvailable`)"
							@change="selectLeague"
						></v-select>
					</v-col>
					<v-col cols="2">
						<v-select
							:items="seasons"
							item-text="seasonYear"
							item-value="seasonId"
							:label="$i18n.t(`headshot.standings.season`)"
							:no-data-text="$i18n.t(`headshot.general.noDataAvailable`)"
							@change="selectSeason"
						></v-select>
					</v-col>
				</v-row>
			</v-card>
		</v-card>
	</v-app>
</template>

<script>
	import axios from "axios";
	import {
		baseApiUrl,
		showError,
		baseFootballApiUrl,
		footballApiHeaders
	} from "@/global";

	export default {
		data() {
			return {
				leagues: [],
				seasons: [],
				leagueId: null,
				seasonId: null
			};
		},
		methods: {
			selectLeague(leagueId) {
				this.leagueId = leagueId;

				this.loadSeasons(leagueId);
			},
			selectSeason(seasonId) {
				this.seasonId = seasonId;
			},
			async loadLeagues() {
				const config = {
					method: "get",
					url: `${baseApiUrl}/leagues`,
					params: {
						favorite: true
					}
				};

				axios(config)
					.then(leagues => {
						this.leagues = leagues.data.map(item => {
							return {
								leagueId: item.id,
								leagueName: `${item.name} (${item.countryName})`
							};
						});
					})
					.catch(showError);
			},
			loadSeasons(leagueId) {
				const config = {
					method: "get",
					url: `${baseApiUrl}/seasons`,
					params: {
						leagueId: leagueId
					}
				};

				axios(config)
					.then(seasons => {
						const sortedSeasons = seasons.data.sort(function(a, b) {
							if (a.year > b.year) {
								return 1;
							}
							if (a.year < b.year) {
								return -1;
							}
							if (a.year === b.year) {
								return 0;
							}
						});

						this.seasons = sortedSeasons.map(item => {
							return {
								seasonId: item.id,
								seasonYear: item.year
							};
						});
					})
					.catch(showError);
			}
		},
		watch: {
			leagueId: function(newLeague) {
				this.$store.commit("standings/setLeague", newLeague);
			},
			seasonId: function(newSeason) {
				this.$store.commit("standings/setSeason", newSeason);
			}
		},
		created() {
			this.loadLeagues();
		}
	};
</script>

<style>
	.standings-filters {
		margin: 10px;
		padding: 10px;
	}
</style>
