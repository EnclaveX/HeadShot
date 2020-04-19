<template>
	<v-app id="inspire" class="standings-fixtures">
		<v-card>
			<v-row>
				<v-col cols="4">
					<v-card-title>{{$i18n.t(`headshot.standings.fixtures`)}}</v-card-title>
				</v-col>
				<v-col offset-md="1" cols="6">
					<v-select
						md="4"
						@change="selectRound"
						v-model="round"
						:items="rounds"
						:label="$i18n.t(`headshot.standings.round`)"
					></v-select>
				</v-col>
			</v-row>
		</v-card>
		<div v-for="fixture in roundFixtures" :key="fixture.id">
			<StandingFixture :fixture="fixture"/>
		</div>
	</v-app>
</template>

<script>
	import StandingFixture from "./StandingFixture.vue";
	import axios from "axios";
	import {
		baseApiUrl,
		showError,
		baseFootballApiUrl,
		footballApiHeaders,
		production
	} from "@/global";

	export default {
		data() {
			return {
				fixtures: [],
				rounds: [],
				roundFixtures: [],
				round: ""
			};
		},
		components: {
			StandingFixture
		},
		computed: {
			league: {
				get() {
					return this.$store.state.standings.league;
				}
			},
			season: {
				get() {
					return this.$store.state.standings.season;
				}
			}
		},
		watch: {
			season: async function(newSeason) {
				await this.loadFixtures();

				this.rounds = await this.getRounds();
				this.round = this.rounds[
					this.rounds.indexOf(this.getLastFinishedRound())
				];

				await this.filterFixturesByRound(this.round);

				this.$forceUpdate();
			}
		},
		methods: {
			async selectRound(round) {
				this.round = round;

				await this.filterFixturesByRound(this.round);

				this.$forceUpdate();
			},
			filterFixturesByRound(round) {
				this.roundFixtures = this.fixtures.filter(fixture => {
					return round === fixture.round;
				});
			},
			getRounds() {
				const distinctRounds = [
					...new Set(this.fixtures.map(fixture => fixture.round))
				];

				return distinctRounds;
			},
			getLastFinishedRound() {
				let lastFinishedRound = "";

				this.fixtures.forEach(fixture => {
					if (fixture.status === "Match Finished") {
						lastFinishedRound = fixture.round;
					}
				});

				console.log(!!lastFinishedRound);

				if (lastFinishedRound === null || lastFinishedRound === "") {
					lastFinishedRound = this.fixtures[1];
				}

				return lastFinishedRound;
			},
			getResult(fixture) {
				let penalty = false;
				let extratime = false;
				let homeResult = "";
				let awayResult = "";

				if (fixture.status !== "Match Finished") {
					homeResult = "pending";
					awayResult = "pending";
				} else {
					if (
						fixture.homePenaltyGoals !== null &&
						fixture.awayPenaltyGoals !== null
					) {
						penalty = true;

						if (
							fixture.homeExtratimeGoals !== null &&
							fixture.awayExtratimeGoals !== null
						) {
							extratime = true;
						}

						if (fixture.homePenaltyGoals > fixture.awayPenaltyGoals) {
							homeResult = "win";
							awayResult = "lose";
						} else if (fixture.homePenaltyGoals < fixture.awayPenaltyGoals) {
							homeResult = "lose";
							awayResult = "win";
						} else {
							homeResult = "draw";
							awayResult = "draw";
						}
					} else if (
						fixture.homeExtratimeGoals !== null &&
						fixture.awayExtratimeGoals !== null
					) {
						penalty = false;
						extratime = true;

						if (fixture.homeExtratimeGoals > fixture.awayExtratimeGoals) {
							homeResult = "win";
							awayResult = "lose";
						} else if (fixture.homeExtratimeGoals < fixture.awayExtratimeGoals) {
							homeResult = "lose";
							awayResult = "win";
						} else {
							homeResult = "draw";
							awayResult = "draw";
						}
					} else if (
						fixture.homeFulltimeGoals !== null &&
						fixture.awayFulltimeGoals !== null
					) {
						penalty = false;
						extratime = false;

						if (fixture.homeFulltimeGoals > fixture.awayFulltimeGoals) {
							homeResult = "win";
							awayResult = "lose";
						} else if (fixture.homeFulltimeGoals < fixture.awayFulltimeGoals) {
							homeResult = "lose";
							awayResult = "win";
						} else {
							homeResult = "draw";
							awayResult = "draw";
						}
					} else {
						penalty = false;
						extratime = false;
						homeResult = "peding";
						awayResult = "peding";
					}
				}

				return {
					penalty,
					extratime,
					homeResult,
					awayResult
				};
			},
			async loadFixtures() {
				if (this.league === null || this.season === null) {
					return;
				}

				const config = {
					method: "get",
					url: `${baseApiUrl}/fixtures`,
					params: {
						leagueId: this.league,
						seasonId: this.season
					}
				};

				await axios(config)
					.then(fixtures => {
						this.fixtures = fixtures.data.map(item => {
							if (item.teamAwayName.length > 19) {
								item.teamAwayName = `${item.teamAwayName.substring(0, 16)}...`;
							}

							if (item.teamHomeName.length > 19) {
								item.teamHomeName = `${item.teamHomeName.substring(0, 16)}...`;
							}

							return item;
						});
					})
					.catch(showError);

				this.fixtures = this.fixtures.map(fixture => {
					let result = this.getResult(fixture);

					fixture.homeResult = result.homeResult;
					fixture.awayResult = result.awayResult;
					fixture.penalty = result.penalty;
					fixture.extratime = result.extratime;

					return fixture;
				});
			}
		},
		data() {
			return {
				rounds: [],
				finxtures: []
			};
		}
	};
</script>

<style>
	.standings-fixtures {
		min-width: 500px;
	}
</style>
