<template>
	<div id="app">
		<v-app id="inspire">
			<v-data-table :headers="headers" :items="data" :sort-by="headers.sortBy" class="elevation-1">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title class="col-2">{{$i18n.t(`headshot.teams.${title}`)}}</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
					</v-toolbar>
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
					<div class="overline mb-4">{{this.team.name}}</div>
					<v-img :src="this.team.logo" contain max-height="300"/>
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
		footballApiHeaders
	} from "@/global";

	export default {
		data: function() {
			return {
				headers: [],
				data: [],
				imageDialog: false,
				title: "teams",
				team: {}
			};
		},
		methods: {
			viewImage(team) {
				this.team = team;
				this.imageDialog = true;
			},
			async loadteams() {
				const config = {
					method: "get",
					url: `${baseApiUrl}/teams`
				};

				axios(config)
					.then(teams => {
						this.data = teams.data.map(item => {
							return item;
						});
					})
					.catch(showError);
			},
			async insertTeams() {
				const config = {
					method: "get",
					url: `${baseFootballApiUrl}/teams`,
					headers: footballApiHeaders,
					params: { league: 39, season: 2019 }
				};

				let teams = await axios(config)
					.then(resp => {
						return resp.data.response;
					})
					.catch(showError);
			}
		},
		mounted() {
			this.loadteams();
		},
		created() {
			this.headers = [
				{
					text: this.$i18n.t("headshot.teams.id"),
					value: "id"
				},
				{
					text: this.$i18n.t("headshot.teams.name"),
					value: "name"
				},
				{
					text: this.$i18n.t("headshot.teams.actions"),
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
