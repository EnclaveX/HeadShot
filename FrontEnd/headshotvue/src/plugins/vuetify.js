import Vue from 'vue'
import Vuetify from 'vuetify'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import 'vuetify/dist/vuetify.min.css'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(fas)

Vue.use(Vuetify)

const opts = {
    icons: {
        iconfont: 'faSvg'
    }
}

export default new Vuetify(opts)
