import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './locales/index.js'


Vue.use(VueI18n)

const i18n = new VueI18n({
    messages,
    silentTranslationWarn: true
})

export const userKey = '__knowledge_user'
export const baseApiUrl = 'http://localhost:3001'
export const baseFootballApiUrl = 'https://api-football-v1.p.rapidapi.com'
export const footballApiHeaders = {
    "x-rapidapi-host": "api-football-beta.p.rapidapi.com",
    "x-rapidapi-key": "1320ffeacfmsh4ad3a0a2b97c3c8p1ad9f1jsn75c1e160eac6",
    "Content-Type": "application/json"
}

export const production = false

export function showError(e) {
    const locale = localStorage.getItem('HeadShotLocale')

    i18n.locale = locale

    let msg = ''

    if (e && e.response && e.response.data && e.response.data.message) {
        msg = i18n.t(e.response.data.message)

        Vue.toasted.global.defaultError({ msg })
    } else if (e && e.response && e.response.data) {
        msg = i18n.t(e.response.data)

        Vue.toasted.global.defaultError({ msg })
    } else if (typeof e === 'string') {
        msg = i18n.t(e)

        Vue.toasted.global.defaultError({ msg })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey, baseFootballApiUrl, footballApiHeaders, production }