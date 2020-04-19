<template>
	<div id="app">
		<v-app id="inspire">
			<v-data-table :headers="headers" :items="data" :sort-by="headers.sortBy" class="elevation-1">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title class="col-2">{{$i18n.t(`headshot.loadApis.${title}`)}}</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
					</v-toolbar>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-tooltip left color="rgba(50,50,50,0.8)">
						<template v-slot:activator="{ on }">
							<v-icon dark v-on="on" @click="viewResp(item)">mdi-cloud-braces</v-icon>
						</template>
						<span>{{$i18n.t('headshot.general.viewResp')}}</span>
					</v-tooltip>
					<v-tooltip left color="rgba(50,50,50,0.8)">
						<template v-slot:activator="{ on }">
							<v-icon class="ml-2" dark v-on="on" @click="loadApis(item)">mdi-download</v-icon>
						</template>
						<span>{{$i18n.t('headshot.loadApis.loadApis')}}</span>
					</v-tooltip>
				</template>
			</v-data-table>
			<v-dialog v-model="respDialog" max-width="1500px" scrollable>
				<v-card>
					<div class="overline mb-4">{{this.apiTest.name}}</div>
					<v-container fluid>
						<v-textarea
							readonly="true"
							name="apiTestResp"
							filled
							label="JSON"
							:value="this.apiTest.resp"
							height="500px"
							no-resize
						></v-textarea>
					</v-container>
					<v-card-actions>
						<v-btn color="primary" text @click="respDialog = false">{{$i18n.t('headshot.general.close')}}</v-btn>
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
		data() {
			return {
				data: [],
				headers: [],
				title: "loadApis",
				apiTest: {},
				respDialog: false
			};
		},
		methods: {
			async viewResp(item) {
				this.apiTest = item;

				const config = {
					method: "get",
					url: `${baseApiUrl}/apiTests/${item.name}`
				};

				await axios(config)
					.then(resp => {
						this.apiTest.resp = resp.data.resp;
					})
					.catch(showError);

				this.respDialog = true;
			},
			async loadApis(item) {
				const config = {
					method: "get",
					url: `${baseFootballApiUrl}/${item.name}`,
					headers: footballApiHeaders,
					params: item.params
				};

				let resp = await axios(config)
					.then(resp => resp.data.response)
					.catch(showError);

				let apiTest = {
					name: item.name,
					resp: JSON.stringify(resp)
				};

				await axios
					.post(`${baseApiUrl}/apiTests`, apiTest)
					.then(() => {
						this.$toasted.global.defaultSuccess();
					})
					.catch(showError);
			}
		},
		created() {
			this.headers = [
				{
					text: this.$i18n.t("headshot.loadApis.name"),
					value: "name"
				},
				{
					text: this.$i18n.t("headshot.loadApis.actions"),
					value: "actions",
					sortable: false
				}
			];

			this.data = [
				{ name: "countries" },
				{ name: "teams" },
				{ name: "leagues" },
				{
					name: "standings",
					params: {
						league: "39",
						season: "2019"
					}
				},
				{
					name: "fixtures",
					params: {
						league: "39",
						season: "2019"
					}
				}
			];
		}
	};
</script>

<style>
	.datatable-button {
		margin-top: 5px;
	}
</style>
