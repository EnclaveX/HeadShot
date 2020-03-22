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

<style lang="scss">
	#app {
		font-family: Roboto, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		text-align: center;
	}

	#nav {
		padding: 30px;

		a {
			font-weight: bold;
		}
	}

	.toasted-layout {
		font-family: Roboto, Helvetica, Arial, sans-serif;
	}
</style>
