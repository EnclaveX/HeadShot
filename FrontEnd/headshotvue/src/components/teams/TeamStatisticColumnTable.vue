<template>
	<v-col class="table-col-statistic">
		<v-row class="table-label-statistic">{{$i18n.t(`headshot.teamStatistics.${statistic.label}`)}}</v-row>
		<v-row class="table-value-statistic">{{statistic.value}}</v-row>
	</v-col>
</template>

<script>
	export default {
		props: {
			statistic: {
				type: Object,
				required: true
			}
		}
	};
</script>

<style scopped>
	.table-label-statistic {
		font-size: 0.7rem;
		word-wrap: break-word;
	}

	.table-value-statistic {
		font-size: 1.3rem;
	}

	.table-col-statistic {
		padding: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
