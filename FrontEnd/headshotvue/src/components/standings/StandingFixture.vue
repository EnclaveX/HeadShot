<template>
	<v-app id="inspire" class="fixture-app">
		<div v-if="dialogFixtureDetails">
			<v-dialog scrollable max-width="1000px" v-model="dialogFixtureDetails">
				<v-card style="padding-top:20px;">
					<v-card-text style="height: 600px;">
						<FixturesDetails
							:key="fixture.id"
							:fixture="fixture"
						/>
					</v-card-text>
				</v-card>
			</v-dialog>
		</div>
		<v-card class="mx-auto" min-width="100%" tile>
			<v-row class="fixture">
				<v-col class="fixture-teams">
					<v-row class="home-team">
						<div
							:class="[{ 
                                result: true},
                                fixture.homeResult
                            ]"
						/>
						<img class="team-logo" :src="fixture.teamHomeLogo">
						<div class="team-name">{{fixture.teamHomeName}}</div>
						<div class="goals">{{fixture.homeFulltimeGoals}}</div>
					</v-row>
				</v-col>
				<v-col class="fixture-divisor">X</v-col>
				<v-col class="fixture-teams">
					<v-row class="away-team">
						<div class="goals">{{fixture.awayFulltimeGoals}}</div>
						<div class="team-name">{{fixture.teamAwayName}}</div>
						<img class="team-logo" :src="fixture.teamAwayLogo">
						<div
							:class="[{ 
                                result: true},
                                fixture.awayResult
                            ]"
						/>
					</v-row>
				</v-col>
			</v-row>
			<v-row>
				<a class="details-label" @click="dialogFixtureDetails = !dialogFixtureDetails">{{$i18n.t('headshot.standings.details')}}</a>
			</v-row>
		</v-card>
	</v-app>
</template>

<script>
	import FixturesDetails from "../fixtures/FixturesDetails.vue";
	export default {
		props: {
			fixture: {
				type: Object,
				required: true
			}
		},
		data: () => {
			return {
				dialogFixtureDetails: false
			};
		},
		components: {
			FixturesDetails
		}
	};
</script>

<style>
	.team-logo {
		width: 20px;
		height: 20px;
		margin: 0px 5px;
	}

	.team-name {
		white-space: nowrap;
	}

	.result {
		width: 10px;
		height: 10px;
		border-radius: 5px;
		margin-top: 7px;
		margin-right: 5px;
	}

	.win {
		background: green;
	}
	.draw {
		background: orange;
	}
	.lose {
		background: red;
	}

	.goals {
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		width: 20px;
		margin: 0px 10px;
		background-color: #505050;
	}

	.fixture-divisor {
		margin: 10px 0px;
		padding: 10px 0px;
		padding-bottom: 0px;
		max-width: 30px;
	}

	.home-team {
		padding: 10px 0px;
		flex-wrap: nowrap;
		justify-content: flex-end;
		padding-bottom: 0px;
	}

	.away-team {
		padding: 10px 0px;
		flex-wrap: nowrap;
		justify-content: flex-start;
		padding-bottom: 0px;
	}

	.fixture {
		flex-wrap: nowrap;
	}

	.fixture-app {
		border-top: thin solid hsla(0, 0%, 100%, 0.2);
	}

	.details-label {
		font-size: 0.7rem;
		width: 100%;
		text-decoration: none;
		text-align: center;
	}

	.fixture-teams {
		padding-bottom: 0px;
	}
</style>
