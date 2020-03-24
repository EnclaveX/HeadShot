<template>
	<v-app id="inspire">
		<v-navigation-drawer v-model="drawer" app clipped>
			<v-list dense>
				<v-list-item link>
					<v-list-item-action>
						<v-icon>mdi-view-dashboard</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Dashboard</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link>
					<v-list-item-action>
						<v-icon>mdi-settings</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Settings</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
			<v-toolbar-title>Application</v-toolbar-title>
		</v-app-bar>

		<v-content>
			<v-container class="fill-height" fluid>
				<v-btn @click="insertCountries">InsertCountries</v-btn>
				<v-row align="center" justify="center">
					<v-col class="shrink">
						<v-tooltip right>
							<template v-slot:activator="{ on }">
								<v-btn :href="source" icon large target="_blank" v-on="on">
									<v-icon large>mdi-code-tags</v-icon>
								</v-btn>
							</template>
							<span>Source</span>
						</v-tooltip>
						<v-tooltip right>
							<template v-slot:activator="{ on }">
								<v-btn
									icon
									large
									href="https://codepen.io/johnjleider/pen/bXNzZL"
									target="_blank"
									v-on="on"
								>
									<v-icon large>mdi-codepen</v-icon>
								</v-btn>
							</template>
							<span>Codepen</span>
						</v-tooltip>
					</v-col>
				</v-row>
			</v-container>
		</v-content>

		<v-footer app>
			<span>&copy; 2019</span>
		</v-footer>
	</v-app>
</template>

<script>
	import axios from "axios";
	import { baseApiUrl, showError, userKey, baseFootballApiUrl, footballApiHeaders } from "@/global";

	export default {
		props: {
			source: String
		},
		data: () => ({
			drawer: null
		}),
		metaInfo: {
			title: "HeadShot - The Betbot (Home)"
		},
		created() {
			this.$vuetify.theme.dark = true;
		},
		destroyed() {
			this.$vuetify.theme.dark = false;
		},
		methods: {
			async insertCountries() {
				const config = {
					method: "get",
					url: `${baseFootballApiUrl}/countries`,
					headers: footballApiHeaders
				};

				let contries = await axios(config)
					.then((resp) => {
						return resp.data.response
					})
					.catch(showError);

				axios
					.post(`${baseApiUrl}/countries/insertCountries`, contries)
					.then(() => {
						this.$toasted.global.defaultSuccess();
					})
					.catch(showError);
			}
		}
	};
</script>