<template>
	<div id="app">
		<v-app id="inspire">
			<v-data-table :headers="headers" :items="data" :sort-by="headers.sortBy" class="elevation-1">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title class="col-2">{{$i18n.t(`headshot.team.${title}`)}}</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
						<div class="d-flex flex-row-reverse buttons-painel-datatable" style="width: 100%">
							<v-btn
								@click="insertTeams()"
								class="button-datatable primary"
							>{{$i18n.t('headshot.general.load')}}</v-btn>
						</div>
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
					<v-img :src="this.team.flag" contain max-height="300"/>
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
							delete item.id;

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
					params: {league: 39, season: 2019}
				};

				let teams = await axios(config)
					.then(resp => {
						console.log(resp)
						return resp.data.response;
					})
					.catch(showError);


				// axios
				// 	.post(`${baseApiUrl}/teams`, teams)
				// 	.then(() => {
				// 		this.$toasted.global.defaultSuccess();
				// 	})
				// 	.catch(showError);

				// this.loadteams();
			}
		},
		mounted() {
			this.loadteams();
		},
		created() {
			this.headers = [
				{
					text: this.$i18n.t("headshot.team.name"),
					value: "name"
				},
				{
					text: this.$i18n.t("headshot.team.code"),
					value: "code"
				},
				{
					text: this.$i18n.t("headshot.team.actions"),
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
