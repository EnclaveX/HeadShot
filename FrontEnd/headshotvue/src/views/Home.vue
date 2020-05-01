<template>
	<v-app id="inspire">
		<Header/>

		<v-content>
			<router-view/>
		</v-content>

		<Footer/>
	</v-app>
</template>

<script>
	import Header from "../template/Header";
	import Footer from "../template/Footer";
	import axios from "axios";

	export default {
		props: {
			source: String
		},
		components: {
			Header,
			Footer
		},
		metaInfo: {
			title: "HeadShot - The Betbot"
		},
		created() {
			this.$vuetify.theme.dark = true;
		},
		destroyed() {
			this.$vuetify.theme.dark = false;
		}
	};
</script>
