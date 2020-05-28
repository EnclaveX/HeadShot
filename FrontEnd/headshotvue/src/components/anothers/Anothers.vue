<template>
	<div id="app">
		<v-app id="inspire">
			<v-row>
				<v-btn
					class="primary anothers-buttons"
					@click="loadLeaguesAndSeasonsFixtures(true, true)"
				>{{$i18n.t('headshot.anothers.loadFixtures')}}</v-btn>
				<v-btn
					class="primary anothers-buttons"
					@click="loadLeaguesAndSeasonsFixtures(false, true)"
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
	import importStatistics from "./importStatistics.js";
	import loadFixtures from "./loadFixtures.js";
	import calculateStandingsPerRound from "./calculateStandingsPerRound.js";

	import {
		baseApiUrl,
		showError,
		baseFootballApiUrl,
		footballApiHeaders,
		production,
		baseFootballOfficialApiUrl,
		footballOfficialApiHeaders
	} from "@/global";

	export default {
		data: function() {
			return {
				leagues: []
			};
		},
		methods: {
			async loadFixtureStatistics() {
				await importStatistics();
			},
			async loadLeaguesAndSeasonsFixtures(current, mustLoadFixtures) {
				this.leagues = loadFixtures(current, mustLoadFixtures);
			},
			async calculateStandings(current) {
				calculateStandingsPerRound(current);
			}
		}
	};
</script>

<style>
	.anothers-buttons {
		margin: 20px;
	}
</style>
