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
			const calculatePercent = (homeValue, awayValue, type) => {
				let totalValue = homeValue + awayValue;

				return ((type === "home" ? homeValue : awayValue) / totalValue) * 100;
			};

			const insertStatistic = (homeValue, awayValue, label) => {
				this.statistics.push({
					label: this.$i18n.t(`headshot.fixtureDetails.${label}`),
					homeValue: homeValue,
					awayValue: awayValue,
					homeValuePercent: calculatePercent(homeValue, awayValue, "home"),
					awayValuePercent: calculatePercent(homeValue, awayValue, "away")
				});
			};

			this.statistics.push({
				label: this.$i18n.t(`headshot.fixtureDetails.ballPossession`),
				homeValue: `${this.fixture.homeBallPossession || 0}%`,
				awayValue: `${this.fixture.awayBallPossession || 0}%`,
				homeValuePercent: this.fixture.homeBallPossession || 0,
				awayValuePercent: this.fixture.awayBallPossession || 0
			});

			insertStatistic(
				this.fixture.homeTotalShots,
				this.fixture.awayTotalShots,
				"shots"
			);

			insertStatistic(
				this.fixture.homeShotsOnGoal,
				this.fixture.awayShotsOnGoal,
				"shotsOnGoal"
			);

			insertStatistic(
				this.fixture.homeShotsOffGoal,
				this.fixture.awayShotsOffGoal,
				"shotsOffGoal"
			);

			insertStatistic(
				this.fixture.homeBlockedShots,
				this.fixture.awayBlockedShots,
				"blockedShots"
			);

			insertStatistic(
				this.fixture.homeInsideboxShots,
				this.fixture.awayInsideboxShots,
				"insideboxShots"
			);

			insertStatistic(
				this.fixture.homeOutsideboxShots,
				this.fixture.awayOutsideboxShots,
				"outsideboxShots"
			);

			insertStatistic(
				this.fixture.homeCorners,
				this.fixture.awayCorners,
				"corners"
			);

			insertStatistic(
				this.fixture.homeGoalkeeperSave,
				this.fixture.awayGoalkeeperSave,
				"goalkeeperSaves"
			);

			insertStatistic(this.fixture.homeFouls, this.fixture.awayFouls, "fouls");

			insertStatistic(
				this.fixture.homeYellowCards,
				this.fixture.awayYellowCards,
				"yellowCards"
			);

			insertStatistic(
				this.fixture.homeRedCards,
				this.fixture.awayRedCards,
				"redCards"
			);

			insertStatistic(
				this.fixture.homeOffsides,
				this.fixture.awayOffsides,
				"offsides"
			);

			insertStatistic(this.fixture.homeFouls, this.fixture.awayFouls, "fouls");

			insertStatistic(
				this.fixture.homeTotalPasses,
				this.fixture.awayTotalPasses,
				"totalPasses"
			);

			insertStatistic(
				this.fixture.homePassesAccurate,
				this.fixture.awayPassesAccurate,
				"passesAccurate"
			);
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
