<template>
	<div id="chart">
		<apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
	</div>
</template>

<script>
	import VueApexCharts from "vue-apexcharts";

	export default {
		mounted() {
			try {
				this.series.push(this.statistics.for);
				this.series.push(this.statistics.against);
			} catch (err) {
				return;
			}
		},
		components: {
			apexchart: VueApexCharts
		},
		props: {
			statistics: {
				type: Object,
				required: true
			},
			title: {
				type: String,
				required: false
			}
		},
		data: function() {
			return {
				series: [],
				chartOptions: {
					title: {
						text: this.$i18n.t(`headshot.teamStatistics.${this.title}`),
						align: "center",
						margin: 10,
						offsetX: 0,
						offsetY: 0,
						floating: false,
						style: {
							fontSize: "16px",
							fontWeight: "100",
							fontFamily: "Helvetica, Arial",
							color: "#fff"
						}
					},
					chart: {
						type: "pie"
					},
					labels: [
						this.$i18n.t(`headshot.teamStatistics.goalsFor`),
						this.$i18n.t(`headshot.teamStatistics.goalsAgainst`)
					],
					colors: ["#008000", "#ff0000", "#ffa500"],
					stroke: {
						width: 1
					},
					dataLabels: {
						enabled: false
					},
					legend: {
						position: "bottom",
						horizontalAlign: "center",
						onItemHover: {
							highlightDataSeries: true
						},
						fontSize: "12px",
						fontFamily: "Helvetica, Arial",
						fontWeight: 400,
						labels: {
							colors: "#fff"
						}
					}
				}
			};
		}
	};
</script>

<style>
</style>
