export default ({
    namespaced: true,
    state: {
        league: null,
        season: null
    },
    mutations: {
        setLeague(state, payload){
            state.league = payload
        },
        setSeason(state, payload){
            state.season = payload
        }
    },
    actions: {
    }
})