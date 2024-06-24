import Vue from 'vue'

import VModal from 'vue-js-modal/dist/ssr.nocss'
import 'vue-js-modal/dist/styles.css'
Vue.use(VModal)

import InfiniteLoading from 'vue-infinite-loading'
Vue.component('infinite-loading', InfiniteLoading);

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyBIKQxYhCEXZNRyt7gCTyuHkyDxFXjP2BM',
        libraries: 'places',
    },
});

import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)

import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast, {
    position: 'top',
    duration: 5000,
});

import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents)

import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';

Vue.use(Tooltip, {class: 'fp-tooltip'});

import FpIcon from "@/components/ui/FpIcon.vue";
Vue.component('fp-icon', FpIcon);