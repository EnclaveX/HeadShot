import {
    baseApiUrl,
    showError,
    baseFootballApiUrl,
    footballApiHeaders
} from "@/global";

import axios from "axios"

const loadFootballApiFixtures = async (leagueId, seasonId, seasonYear) => {
    const configGetFixtures = {
        method: "get",
        url: `${baseFootballApiUrl}/fixtures`,
        headers: footballApiHeaders,
        params: {
            league: leagueId,
            season: seasonYear
        }
    };

    const fixtures = await axios(configGetFixtures)
        .then(fixtures => {
            return fixtures.data.response;
        })
        .catch(showError);

    if (!fixtures) return;

    let fixturesFormated = [];

    const getRoundNumber = round => {
        return parseInt(
            round
                .substring(round.length - 3)
                .replace("-", "")
                .trim()
        );
    };

    fixtures.forEach(fixture => {
        const roundNumber = getRoundNumber(fixture.league.round);

        let homeTeamEndStatus, awayTeamEndStatus;

        if (fixture.fixture.status.long === "Match Finished") {
            if (fixture.score.fulltime.home > fixture.score.fulltime.away) {
                homeTeamEndStatus = "W";
                awayTeamEndStatus = "L";
            } else if (fixture.score.fulltime.home < fixture.score.fulltime.away) {
                homeTeamEndStatus = "L";
                awayTeamEndStatus = "W";
            } else {
                homeTeamEndStatus = "D";
                awayTeamEndStatus = "D";
            }
        } else {
            homeTeamEndStatus = "P";
            awayTeamEndStatus = "P";
        }

        fixturesFormated.push({
            id: fixture.fixture.id,
            venue: fixture.fixture.venue,
            status: fixture.fixture.status.long,
            round: fixture.league.round,
            round_number: roundNumber,
            fixture_date: fixture.fixture.timestamp,
            extratime:
                fixture.score.extratime.home === null &&
                    fixture.score.extratime.away === null
                    ? 0
                    : 1,
            penalty:
                fixture.score.penalty.home === null && fixture.score.penalty.away === null
                    ? 0
                    : 1,
            league_id: leagueId,
            season_id: seasonId,
            team_home_id: fixture.teams.home.id,
            home_fulltime_goals: fixture.score.fulltime.home,
            home_halftime_goals: fixture.score.halftime.home,
            home_extratime_goals: fixture.score.extratime.home,
            home_penalty_goals: fixture.score.penalty.home,
            team_away_id: fixture.teams.away.id,
            away_fulltime_goals: fixture.score.fulltime.away,
            away_halftime_goals: fixture.score.halftime.away,
            away_extratime_goals: fixture.score.extratime.away,
            away_penalty_goals: fixture.score.penalty.away,
            home_team_end_status: homeTeamEndStatus,
            away_team_end_status: awayTeamEndStatus
        });
    });

    let teamsMaped = fixtures.map(fixture => {
        return {
            id: fixture.teams.home.id,
            name: fixture.teams.home.name,
            logo: fixture.teams.home.logo
        };
    });

    if (
        !!fixturesFormated &&
        fixturesFormated.length > 0 &&
        !!teamsMaped &&
        teamsMaped.length > 0
    ) {
        await axios
            .post(`${baseApiUrl}/teams`, teamsMaped)
            .then(() => {
                return axios.post(`${baseApiUrl}/fixtures`, fixturesFormated);
            })
            .then(() => {
                this.$toasted.global.defaultSuccess();
            })
            .catch(showError);
    }
}

const loadFixtures = async (current, mustLoadFixtures) => {
    const configGetSeasons = {
        method: "get",
        url: `${baseApiUrl}/leagues/seasons`,
        params: {
            favorite: true
        }
    };

    if (current) configGetSeasons.params.current = true;

    let leagues = []

    await axios(configGetSeasons)
        .then(leaguesItem => {
            leagues = leaguesItem.data.map(item => {
                return item;
            });
        })
        .catch(showError);

    if (mustLoadFixtures) {
        const promiseLeagues = leagues.map(league => {
            loadFootballApiFixtures(
                league.leagueId,
                league.seasonId,
                league.seasonYear
            );
        });

        await Promise.all(promiseLeagues)
    }
    
    return leagues
}

export default loadFixtures