<template>
	<div id="app">
		<link
			href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
			rel="stylesheet"
		>
		<link
			href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css"
			rel="stylesheet"
		>

		<router-view/>
	</div>
</template>

<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-apexcharts"></script>

<script>
	import axios from "axios";
	import { mapActions } from "vuex";
	import { baseApiUrl, userKey } from "@/global";

	export default {
		name: "App",
		methods: {
			...mapActions("users", ["setUser"]),
			async validateToken() {
				this.validatingToken = true;

				const json = localStorage.getItem(userKey);
				const userData = JSON.parse(json);

				this.setUser(null);

				const res = await axios.post(`${baseApiUrl}/validateToken`, userData);

				if (res.data) {
					this.setUser(userData);
				} else {
					localStorage.removeItem(userKey);

					if (this.$router.history.current.name !== "Login") {
						this.$router.push({ name: "Login" });
					}
				}

				this.validatingToken = false;
			}
		},
		created() {
			this.validateToken();
		}
	};
</script>


<style>
	#app {
		font-family: Roboto, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		text-align: center;
	}

	.toasted-layout {
		font-family: Roboto, Helvetica, Arial, sans-serif;
	}
</style>
