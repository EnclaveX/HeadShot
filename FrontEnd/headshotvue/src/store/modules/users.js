import axios from 'axios'

export default ({
    namespaced: true,
    state: {
        user: null,
        auth: true
    },
    mutations: {
        setUser(state, user) {
            state.user  = user
            state.auth  = !user
            
            if(user) {
                axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
            } else {
                delete axios.defaults.headers.common['Authorization']
            }
        }
    },
    actions: {
        setUser(state, payload) {
            state.commit('setUser', payload)
        }
    }
})