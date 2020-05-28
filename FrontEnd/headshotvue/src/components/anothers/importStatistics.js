import {
    baseApiUrl,
    showError,
    production,
    apiType,
    baseFootballApiUrl,
    footballApiHeaders
} from "@/global";
import axios from "axios"

const loadFixtures = async () => {
    let config;

    if (production) {
        config = {
            method: "get",
            url: `${baseApiUrl}/fixtures`,
            params: {
                loadedStatistics: "N",
                status: "Match Finished",
                limit: 30
            }
        };
    } else {
        config = {
            method: "get",
            url: `${baseApiUrl}/fixtures`,
            params: {
                id: 157165
            }
        };
    }

    let fixtures = await axios(config)
        .then(resp => {
            return resp.data;
        })
        .catch(showError);

    return fixtures
}

var getStatistics = async (fixture) => {
    let config = {};

    if (production) {
        if (apiType === "beta") {
            config = {
                method: "get",
                url: `${baseFootballApiUrl}/fixtures/statistics`,
                headers: footballApiHeaders,
                params: {
                    fixture: fixture.id
                }
            };
        } else {
            config = {
                method: "get",
                url: `${baseFootballOfficialApiUrl}/statistics/fixture/${
                    fixture.id
                    }/`,
                headers: footballOfficialApiHeaders
            };
        }
    } else {
        config = {
            method: "get",
            url: `${baseApiUrl}/apiTests/fixturesStatistics`
        };
    }

    let statistic = await axios(config)
        .then(resp => {
            if (production) {
                return resp.data.response;
            } else {
                return JSON.parse(resp.data.resp);
            }
        })
        .catch(showError => {
            return showError;
        });

    return statistic;
}

const assembleStatisticsOfficial = (fixtures) => {

}

const assembleStatisticsBeta = async (fixtures) => {
    let statisticsInsertProperties = []

    const statisticInsertPromises = fixtures.map(async fixture => {
        const statistic = await getStatistics(fixture)

        let statisticInsertProperties = {
            id: fixture.id,
            venue: fixture.venue,
            status: fixture.status,
            round: fixture.round,
            fixture_date: fixture.fixtureDate,
            extratime: fixture.extratime,
            penalty: fixture.penalty,
            league_id: fixture.leagueId,
            season_id: fixture.seasonId,
            team_home_id: fixture.teamHomeId,
            home_fulltime_goals: fixture.homeFulltimeGoals,
            home_halftime_goals: fixture.homeHalftimeGoals,
            home_extratime_goals: fixture.homeExtratimeGoals,
            home_penalty_goals: fixture.homePenaltyGoals,
            team_away_id: fixture.teamAwayId,
            away_fulltime_goals: fixture.awayFulltimeGoals,
            away_halftime_goals: fixture.awayHalftimeGoals,
            away_extratime_goals: fixture.awayExtratimeGoals,
            away_penalty_goals: fixture.awayPenaltyGoals,
            round_number: fixture.roundNumber,
            home_team_end_status: fixture.homeTeamEndStatus,
            away_team_end_status: fixture.awayTeamEndStatus,
            loaded_statistics: "Y"
        };

        statistic.forEach((fixtureSides, index) => {
            fixtureSides.statistics.forEach(statistic => {
                let side = "";

                if (index === 0) {
                    side = "home";
                } else {
                    side = "away";
                }

                const insertStatisticInsertProperties = (type, property, statistic) => {
                    if (statistic.type === type) {
                        statisticInsertProperties[`${property}`] = statistic.value || 0;
                    }
                }

                insertStatisticInsertProperties("Shots on Goal", `${side}_shots_on_goal`, statistic)
                insertStatisticInsertProperties("Shots off Goal", `${side}_shots_off_goal`, statistic)
                insertStatisticInsertProperties("Total Shots", `${side}_total_shots`, statistic)
                insertStatisticInsertProperties("Blocked Shots", `${side}_blocked_shots`, statistic)
                insertStatisticInsertProperties("Shots insidebox", `${side}_insidebox_shots`, statistic)
                insertStatisticInsertProperties("Shots outsidebox", `${side}_outsidebox_shots`, statistic)
                insertStatisticInsertProperties("Corner Kicks", `${side}_corners`, statistic)
                insertStatisticInsertProperties("Offsides", `${side}_offsides`, statistic)
                insertStatisticInsertProperties("Fouls", `${side}_fouls`, statistic)
                insertStatisticInsertProperties("Ball Possession", `${side}_ball_possession`, statistic)
                insertStatisticInsertProperties("Yellow Cards", `${side}_yellow_cards`, statistic)
                insertStatisticInsertProperties("Red Cards", `${side}_red_cards`, statistic)
                insertStatisticInsertProperties("Goalkeeper Saves", `${side}_goalkeeper_save`, statistic)
                insertStatisticInsertProperties("Total passes", `${side}_total_passes`, statistic)
                insertStatisticInsertProperties("Passes accurate", `${side}_passes_accurate`, statistic)
            });
        });

        statisticsInsertProperties.push(statisticInsertProperties)
    });

    await Promise.all(statisticInsertPromises);

    return statisticsInsertProperties
}

const assembleStatistics = async () => {
    const fixtures = await loadFixtures()

    let statistics;

    if (apiType === 'beta') {
        statistics = await assembleStatisticsBeta(fixtures) //let for later
    } else {
        statistics = await assembleStatisticsOfficial(fixtures)
    }

    return statistics
};

const importStatistics = async () => {
    await assembleStatistics()
        .then((statistics) => {
            axios
                .post(`${baseApiUrl}/fixtures`, statistics)
                .then(() => {
                    return true
                })
                .catch(showError => {
                    return false
                });
        })
}

export default importStatistics