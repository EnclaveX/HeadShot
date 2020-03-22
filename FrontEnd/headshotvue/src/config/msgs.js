import Vue from 'vue'
import Toasted from 'vue-toasted'
import VueI18n from 'vue-i18n'
import messages from '../locales/index.js'

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3000
})

Vue.use(VueI18n)

const i18n = new VueI18n({
    messages
})

Vue.toasted.register(
    'defaultSuccess',
    payload => {
        const locale = localStorage.getItem('HeadShotLocale')

        i18n.locale = locale

        return !payload.msg ? i18n.t('headshot.general.successMsg') : payload.msg
    },
    { 
        type: 'success', 
        icon: 'check', 
        className: 'toasted-layout' 
    }
)

Vue.toasted.register(
    'defaultError',
    payload => {
        const locale = localStorage.getItem('HeadShotLocale')

        i18n.locale = locale
        
        return !payload.msg ? i18n.t('headshot.general.unexpectedError') : payload.msg
    },
    { 
        type: 'error', 
        icon: 'times', 
        className: 'toasted-layout' 
    }
) 
