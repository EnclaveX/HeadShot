<template>
	<v-app id="inspire">
		<Header/>

		<v-content>
			<router-view/>
		</v-content>

		<v-footer app>
			<span>&copy; 2019</span>
		</v-footer>
	</v-app>
</template>

<script>
	import Header from "../template/Header";
	import axios from "axios";

	export default {
		props: {
			source: String
		},
		components: {
			Header
		},
		metaInfo: {
			title: "HeadShot - The Betbot (Home)"
		},
		created() {
			this.$vuetify.theme.dark = true;
		},
		destroyed() {
			this.$vuetify.theme.dark = false;
		}
	};
</script>
