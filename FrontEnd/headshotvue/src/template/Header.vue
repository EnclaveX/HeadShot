<template>
	<v-app id="inspire">
		<v-navigation-drawer v-model="drawer" app clipped>
			<Menu/>
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
			<v-col md="2">
				<v-toolbar-title>HeadShot</v-toolbar-title>
			</v-col>
			<v-col md="3" offset-md="7">
				<v-select class="pa-2" :items="langs" v-model="lang"/>
			</v-col>
		</v-app-bar>
	</v-app>
</template>

<script>
	import Menu from "../template/Menu";
	import { mapActions } from "vuex";
	import { userKey } from "@/global";

	export default {
		data: () => ({
			drawer: null,
			lang: "",
			langs: [
				{ text: "Português", value: "pt" },
				{ text: "English", value: "en" }
			]
		}),
		components: {
			Menu
		},
		created() {
			this.$i18n.locale = localStorage.getItem("HeadShotLocale");
			this.lang = this.$i18n.locale;
		},
		watch: {
			lang: function(lang) {
				localStorage.setItem("HeadShotLocale", lang);

				this.$i18n.locale = lang;
			}
		},
		methods: {
			...mapActions("users", ["setUser"]),
			goCountries() {
				this.$router.push({ path: "/countries" });
			},
			logout() {
				localStorage.removeItem(userKey);

				this.setUser(null);
				this.$router.push({ name: "Login" });
			}
		}
	};
</script>


