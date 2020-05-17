<template>
	<div id="app">
		<v-app id="inspire">
			<v-data-table :headers="headers" :items="data" :sort-by="headers.sortBy" class="elevation-1">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title class="col-2">{{$i18n.t(`headshot.country.${title}`)}}</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
						<div class="d-flex flex-row-reverse buttons-painel-datatable" style="width: 100%">
							<v-btn 
								@click="insertCountries()"
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
					<div class="overline mb-4">{{this.country.name}}</div>
					<v-img :src="this.country.flag" contain max-height="300"/>
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
				title: "countries",
				country: {}
			};
		},
		methods: {
			viewImage(country) {
				this.country = country;
				this.imageDialog = true;
			},
			async loadCountries() {
				const configGetCountries = {
					method: "get",
					url: `${baseApiUrl}/countries`
				};

				axios(configGetCountries)
					.then(countries => {
						this.data = countries.data.map(item => {
							delete item.id;

							return item;
						});
					})
					.catch(showError);
			},
			async insertCountries() {
				if (production) {
					let configGetCountriesFootballApi = {
						method: "get",
						url: `${baseFootballApiUrl}/countries`,
						headers: footballApiHeaders
					};
				} else {
					let configGetCountriesFootballApi = {
						method: "get",
						url: `${baseApiUrl}/apiTests/countries`
					};
				}

				let countries = await axios(configGetCountriesFootballApi)
					.then(countries => {
						return JSON.parse(countries.data.resp);
					})
					.catch(showError);

				if (!!countries && countries.length > 0) {
					axios
						.post(`${baseApiUrl}/countries`, countries)
						.then(() => {
							this.$toasted.global.defaultSuccess();
							this.loadCountries();
						})
						.catch(showError);
				}
			}
		},
		mounted() {
			this.loadCountries();
		},
		created() {
			this.headers = [
				{
					text: this.$i18n.t("headshot.country.name"),
					value: "name"
				},
				{
					text: this.$i18n.t("headshot.country.code"),
					value: "code"
				},
				{
					text: this.$i18n.t("headshot.country.actions"),
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
</style>
