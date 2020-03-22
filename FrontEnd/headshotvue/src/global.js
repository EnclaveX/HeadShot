import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './locales/index.js'


Vue.use(VueI18n)

const i18n = new VueI18n({
    messages
})

export const userKey = '__knowledge_user'
export const baseApiUrl = 'http://localhost:3001'

export function showError(e) {
    const locale = localStorage.getItem('HeadShotLocale')

    i18n.locale = locale

    let msg = ''

    if (e && e.response && e.response.data) {
        msg = i18n.t(e.response.data)
        
        Vue.toasted.global.defaultError({ msg })
    } else if (typeof e === 'string') {
        msg = i18n.t(e)

        Vue.toasted.global.defaultError({ msg })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey }