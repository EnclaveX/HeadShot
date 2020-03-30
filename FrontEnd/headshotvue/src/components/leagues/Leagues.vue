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
					<v-img :src="this.league.flag" contain max-height="300"/>
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
				title: "leagues",
				league: {}
			};
		},
		methods: {
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
							delete item.id;

							return item;
						});
					})
					.catch(showError);
			},
			async insertLeagues() {
				const config = {
					method: "get",
					url: `${baseFootballApiUrl}/leagues`,
					headers: footballApiHeaders
				};

				let leagues = await axios(config)
					.then(resp => {
						return resp.data.response;
					})
					.then(leagues => {
						return axios.post(`${baseApiUrl}/leagues`, leagues);
					})
					.then(() => {
						this.$toasted.global.defaultSuccess();
					})
					.catch(showError);
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
					value: "country"
				},
				{
					text: this.$i18n.t("headshot.league.type"),
					value: "type"
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
