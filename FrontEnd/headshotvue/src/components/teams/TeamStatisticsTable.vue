<template>
	<v-app id="inspire">
		<v-card class="charts-cards grey darken-4" :elevation="24">
			<v-row>{{$i18n.t(`headshot.teamStatistics.${statistic.title}StatisticsGeneralAverage`)}}</v-row>
			<v-row class="statistics-tables">
				<TeamStatisticColumnTable v-for="(item, index) in this.statistic.values" :key="index" :statistic="item"/>
			</v-row>
		</v-card>
	</v-app>
</template>

<script>
	import TeamStatisticColumnTable from "./TeamStatisticColumnTable.vue";

	export default {
		components: {
			TeamStatisticColumnTable
		},
		props: {
			statistic: {
				type: Object,
				required: true
			}
		},
		data: () => {
			return {
				statisticLabels: []
			}
		}
	};
</script>
