<template>
	<v-app>
		<v-card>
			<v-row>
				<v-col>
					<v-row class="logo-team">
						<img :src="fixture.teamHomeLogo" alt>
					</v-row>
					<v-row class="name-team">{{fixture.teamHomeName}}</v-row>
				</v-col>
				<v-col>
					<v-row class="label-venue">{{$i18n.t(`headshot.fixtureDetails.venue`)}}</v-row>
					<v-row class="name-venue">{{fixture.venue}}</v-row>
					<v-row>
						<v-col class="fulltime-score">{{fixture.homeFulltimeGoals}}</v-col>
						<v-col class="fulltime-score-divisor">x</v-col>
						<v-col class="fulltime-score">{{fixture.awayFulltimeGoals}}</v-col>
					</v-row>
					<v-row>
						<v-col offset-md="4" md="1">{{fixture.homeHalftimeGoals}}</v-col>
						<v-col md="2">x</v-col>
						<v-col md="1">{{fixture.awayHalftimeGoals}}</v-col>
					</v-row>
				</v-col>
				<v-col>
					<v-row class="logo-team">
						<img :src="fixture.teamAwayLogo" alt>
					</v-row>
					<v-row class="name-team">{{fixture.teamAwayName}}</v-row>
				</v-col>
			</v-row>
		</v-card>
		<v-card>
			<div class="statistics">
				<v-row v-for="statistic in statistics" :key="statistic.label">
					<v-col class="statistic-card">
						<v-row>
							<v-col class="statistic-content">
								<v-row>
									<v-col class="statistic-label">{{statistic.label}}</v-col>
								</v-row>
								<v-row></v-row>
							</v-col>
						</v-row>
						<v-row class="statistics-bars">
							<v-col cols="1" class="statistic-value">{{statistic.homeValue}}</v-col>
							<v-col class="d-flex flex-row-reverse statistic-bar-box">
								<div class="home-statistic-bar" :style="{width: `${statistic.homeValuePercent}%`}"/>
							</v-col>
							<v-col class="d-flex statistic-bar-box">
								<div class="away-statistic-bar" :style="{width: `${statistic.awayValuePercent}%`}"/>
							</v-col>
							<v-col cols="1" class="statistic-value">{{statistic.awayValue}}</v-col>
						</v-row>
					</v-col>
				</v-row>
			</div>
		</v-card>
	</v-app>
</template>

<script>
	export default {
		data: function() {
			return {
				statistics: []
			};
		},
		props: {
			fixture: {
				type: Object,
				required: true
			}
		},
		mounted() {
			console.log(this.fixture);

			const calculatePercent = (homeValue, awayValue, type) => {
				let totalValue = homeValue + awayValue;

				return ((type === "home" ? homeValue : awayValue) / totalValue) * 100;
			};

			

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.ballPossession`),
				homeValue: `${this.fixture.homeBallPossession}%`,
				awayValue: `${this.fixture.awayBallPossession}%`,
				homeValuePercent: this.fixture.homeBallPossession,
				awayValuePercent: this.fixture.awayBallPossession
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.shots`),
				homeValue: this.fixture.homeTotalShots,
				awayValue: this.fixture.awayTotalShots,
				homeValuePercent: calculatePercent(
					this.fixture.homeTotalShots,
					this.fixture.awayTotalShots,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeTotalShots,
					this.fixture.awayTotalShots,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.shotsOnGoal`),
				homeValue: this.fixture.homeShotsOnGoal,
				awayValue: this.fixture.awayShotsOnGoal,
				homeValuePercent: calculatePercent(
					this.fixture.homeShotsOnGoal,
					this.fixture.awayShotsOnGoal,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeShotsOnGoal,
					this.fixture.awayShotsOnGoal,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.shotsOffGoal`),
				homeValue: this.fixture.homeShotsOffGoal,
				awayValue: this.fixture.awayShotsOffGoal,
				homeValuePercent: calculatePercent(
					this.fixture.homeShotsOffGoal,
					this.fixture.awayShotsOffGoal,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeShotsOffGoal,
					this.fixture.awayShotsOffGoal,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.blockedShots`),
				homeValue: this.fixture.homeBlockedShots,
				awayValue: this.fixture.awayBlockedShots,
				homeValuePercent: calculatePercent(
					this.fixture.homeBlockedShots,
					this.fixture.awayBlockedShots,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeBlockedShots,
					this.fixture.awayBlockedShots,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.insideboxShots`),
				homeValue: this.fixture.homeInsideboxShots,
				awayValue: this.fixture.awayInsideboxShots,
				homeValuePercent: calculatePercent(
					this.fixture.homeInsideboxShots,
					this.fixture.awayInsideboxShots,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeInsideboxShots,
					this.fixture.awayInsideboxShots,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.outsideboxShots`),
				homeValue: this.fixture.homeOutsideboxShots,
				awayValue: this.fixture.awayOutsideboxShots,
				homeValuePercent: calculatePercent(
					this.fixture.homeOutsideboxShots,
					this.fixture.awayOutsideboxShots,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeOutsideboxShots,
					this.fixture.awayOutsideboxShots,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.corners`),
				homeValue: this.fixture.homeCorners,
				awayValue: this.fixture.awayCorners,
				homeValuePercent: calculatePercent(
					this.fixture.homeCorners,
					this.fixture.awayCorners,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeCorners,
					this.fixture.awayCorners,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.goalkeeperSaves`),
				homeValue: this.fixture.homeGoalkeeperSave,
				awayValue: this.fixture.awayGoalkeeperSave,
				homeValuePercent: calculatePercent(
					this.fixture.homeGoalkeeperSave,
					this.fixture.awayGoalkeeperSave,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeGoalkeeperSave,
					this.fixture.awayGoalkeeperSave,
					"away"
				)
			});			

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.fouls`),
				homeValue: this.fixture.homeFouls,
				awayValue: this.fixture.awayFouls,
				homeValuePercent: calculatePercent(
					this.fixture.homeFouls,
					this.fixture.awayFouls,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeFouls,
					this.fixture.awayFouls,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.yellowCards`),
				homeValue: this.fixture.homeYellowCards,
				awayValue: this.fixture.awayYellowCards,
				homeValuePercent: calculatePercent(
					this.fixture.homeYellowCards,
					this.fixture.awayYellowCards,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeYellowCards,
					this.fixture.awayYellowCards,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.redCards`),
				homeValue: this.fixture.homeRedCards,
				awayValue: this.fixture.awayRedCards,
				homeValuePercent: calculatePercent(
					this.fixture.homeRedCards,
					this.fixture.awayRedCards,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeRedCards,
					this.fixture.awayRedCards,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.offsides`),
				homeValue: this.fixture.homeOffsides,
				awayValue: this.fixture.awayOffsides,
				homeValuePercent: calculatePercent(
					this.fixture.homeOffsides,
					this.fixture.awayOffsides,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeOffsides,
					this.fixture.awayOffsides,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.fouls`),
				homeValue: this.fixture.homeFouls,
				awayValue: this.fixture.awayFouls,
				homeValuePercent: calculatePercent(
					this.fixture.homeFouls,
					this.fixture.awayFouls,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeFouls,
					this.fixture.awayFouls,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.totalPasses`),
				homeValue: this.fixture.homeTotalPasses,
				awayValue: this.fixture.awayTotalPasses,
				homeValuePercent: calculatePercent(
					this.fixture.homeTotalPasses,
					this.fixture.awayTotalPasses,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homeTotalPasses,
					this.fixture.awayTotalPasses,
					"away"
				)
			});

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.passesAccurate`),
				homeValue: this.fixture.homePassesAccurate,
				awayValue: this.fixture.awayPassesAccurate,
				homeValuePercent: calculatePercent(
					this.fixture.homePassesAccurate,
					this.fixture.awayPassesAccurate,
					"home"
				),
				awayValuePercent: calculatePercent(
					this.fixture.homePassesAccurate,
					this.fixture.awayPassesAccurate,
					"away"
				)
			});
		}
	};
</script>

<style>
	.logo-team {
		display: flex;
		justify-content: center;
	}

	.name-team {
		font-size: 1.4rem;
		justify-content: center;
	}

	.label-venue {
		font-size: 0.7rem;
		justify-content: center;
	}

	.name-venue {
		justify-content: center;
	}

	.fulltime-score {
		justify-content: center;
		font-size: 3rem;
	}

	.fulltime-score-divisor {
		justify-content: center;
		font-size: 2rem;
		margin-top: 10px;
	}

	.statistics {
		border: 1px solid rgba(214, 214, 214, 0.59) !important;
		margin: 5px;
		padding: 10px;
	}

	.statistic-card {
		padding: 0px;
	}

	.statistic-content {
		padding: 0px;
	}

	.statistic-label {
		padding: 0px;
		font-size: 0.7rem;
	}

	.statistic-value {
		padding: 0px;
	}

	.statistic-bar-box {
		margin: 0px;
		padding: 0px;
	}

	.home-statistic-bar {
		padding: 0px;
		background-color: rgba(214, 214, 214, 0.59);
		height: 3px;
		margin: 5px;
	}

	.away-statistic-bar {
		padding: 0px;
		background-color: rgba(214, 214, 214, 0.59);
		height: 3px;
		margin: 5px;
	}

	.statistics-bars {
		margin: 0px;
	}
</style>
