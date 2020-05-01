<template>
	<div id="chart">
		<apexchart :key="keyApex" height="250" :options="chartOptions" :series="series"/>
	</div>
</template>

<script>
	import VueApexCharts from "vue-apexcharts";
	import axios from "axios";

	import { baseApiUrl, showError } from "@/global";

	export default {
		components: {
			apexchart: VueApexCharts
		},
		props: {
			teamId: {
				type: Number,
				required: true
			},
			seasonId: {
				type: Number,
				required: true
			},
			leagueId: {
				type: Number,
				required: true
			}
		},
		data() {
			return {
				keyApex: 0,
				series: [
					{
						name: this.$i18n.t(`headshot.standings.rank`),
						data: []
					}
				],
				chartOptions: {
					chart: {
						type: "line",
						toolbar: {
							show: false
						}
					},
					dataLabels: {
						enabled: false
					},
					grid: {
						show: true,
						position: "back",
						borderColor: "#454545"
					},
					stroke: {
						curve: "smooth",
						width: 3
					},
					xaxis: {
						type: "string",
						categories: [],
						labels: {
							show: false
						},
						tooltip: {
							enabled: false
						}
					},
					yaxis: {
						min: 1,
						max: 20,
						tickAmount: 4,
						reversed: true,
						labels: {
							style: {
								colors: "#fff"
							}
						}
					},
					tooltip: {
						marker: {
							show: false
						}
					},
					fill: {
						type: "gradient",
						gradient: {
							shadeIntensity: 1,
							opacityFrom: 1,
							opacityTo: 0.5,
							colorStops: [
								{
									offset: 0,
									color: "#949494",
									opacity: 1
								},
								{
									offset: 100,
									color: "#7e7e7e",
									opacity: 1
								}
							]
						}
					},
					markers: {
						size: 4,
						strokeColors: "#fff",
						strokeWidth: 1,
						hover: {
							size: 7
						},
						discrete: []
					}
				}
			};
		},
		methods: {
			defineMarkers(standingsPerRound) {
				let teamEndStatus = standingsPerRound.data.map(standingPerRound => {
					return standingPerRound.teamEndStatus;
				});

				const teamEndStatusColors = {
					W: "#008000",
					L: "#ff0000",
					D: "#ffa500"
				};

				teamEndStatus.forEach((teamEndStatusPerRound, index) => {
					this.chartOptions.markers.discrete.push({
						seriesIndex: 0,
						dataPointIndex: index,
						fillColor: teamEndStatusColors[teamEndStatusPerRound],
						strokeColor: "#fff",
						size: 4
					});
				});
			},
			defineCategories(standingsPerRound) {
				let rounds = standingsPerRound.data.map(standingPerRound => {
					return standingPerRound.round;
				});

				this.chartOptions.xaxis.categories.push(...rounds);
			},
			defineSeries(standingsPerRound) {
				let rankings = standingsPerRound.data.map(standingPerRound => {
					return standingPerRound.rank;
				});

				this.series[0].data.push(...rankings);
			},
			loadStandingsPerRound() {
				let config = {
					method: "get",
					url: `${baseApiUrl}/standingsPerRound`,
					params: {
						leagueId: this.leagueId,
						seasonId: this.seasonId,
						teamId: this.teamId,
						status: "Match Finished"
					}
				};

				return axios(config)
					.then(async standingsPerRound => {
						await this.defineCategories(standingsPerRound);
						await this.defineSeries(standingsPerRound);
						await this.defineMarkers(standingsPerRound);

						this.keyApex++;

						return standingsPerRound;
					})
					.catch(showError => {
						return showError;
					});
			}
		},
		mounted() {
			this.loadStandingsPerRound();
		}
	};
</script>

<style>
	.apexcharts-tooltip {
		background: #f3f3f3;
		color: black;
	}
</style>
