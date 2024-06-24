import Cookies from 'js-cookie'
import { cookieFromRequest } from '~/utils'
import axios from "axios";

// state
export const state = () => ({
    keyword: '',
    unread_notifications: 0,
    followings: [],
    open_category_modal: false,
    enable_chat: false,
    open_left_menu: false,
    has_sidebar: false,
    loading_percent: 0,
    show_loading: false,
    theme: 'light',
    open_alert: '',
    alert_data: {
        type: 'success',
        title: '',
        message: '',
    },
    open_share: false,
    sharing: null,
    show_footer: true,
    open_report: false,
    report_data: null,
})

// getters
export const getters = {
    keyword: state => state.keyword,
    unread_notifications: state => state.unread_notifications,
    followings: state => state.followings,
    enable_chat: state => state.enable_chat,
    loading_percent: state => state.loading_percent,
    open_left_menu: state => state.open_left_menu,
    has_sidebar: state => state.has_sidebar,
    show_loading: state => state.show_loading,
    theme: state => state.theme,
    open_alert: state => state.open_alert,
    alert_data: state => state.alert_data,
    show_footer: state => state.show_footer,
    sharing: state => state.sharing,
    open_share: state => state.open_share,
    report_data: state => state.report_data,
    open_report: state => state.open_report,
}

// mutations
export const mutations = {
    SET_KEYWORD(state, data) {
        state.keyword = data
    },
    GET_CATEGORIES(state, data) {
        state.categories = data
    },
    SET_UNREAD_NOTIFICATIONS(state, data) {
        state.unread_notifications = data
    },
    SELECT_CATEGORY(state, category) {
        // let categories = state.categories;
        state.categories.sort(function (x, y) { return x.id == category.id ? -1 : y == category.id ? 1 : 0; });
    },
    SET_FOLLOWINGS(state, data) {
        state.followings = data
    },
    SET_ENABLE_CHAT(state, data) {
        state.enable_chat = data
    },
    TOGGLE_LEFT_MENU(state, data) {
        if (data === undefined) {
            state.open_left_menu = !state.open_left_menu
        } else {
            state.open_left_menu = !!data;
        }
    },
    TOGGLE_HAS_SIDEBAR(state, data) {
        state.has_sidebar = data
    },
    SET_LOADING_PERCENT(state, percent) {
        state.loading_percent = percent;
    },
    SHOW_LOADING(state, data) {
        state.show_loading = data;
    },
    SET_SHARING(state, data) {
        state.sharing = data;
    },
    SET_THEME(state, data) {
        if (data) {
            state.theme = data;
        } else {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        }
    },
    TOGGLE_ALERT(state, data) {
        if (data === undefined) {
            state.open_alert = !state.open_alert
        } else {
            state.open_alert = !!data;
        }
    },
    SET_ALERT_DATA(state, data) {
        state.alert_data = data;
    },
    TOGGLE_FOOTER(state, data) {
        if (data === undefined) {
            state.show_footer = !state.show_footer
        } else {
            state.show_footer = !!data;
        }
    },
    TOGGLE_SHARE(state, data) {
        if (data === undefined) {
            state.open_share = !state.open_share
        } else {
            state.open_share = !!data;
        }
    },
    TOGGLE_REPORT(state, data) {
        if (data === undefined) {
            state.open_report = !state.open_report
        } else {
            state.open_report = !!data;
        }
    },
    SET_REPORT_DATA(state, data) {
        state.report_data = data;
    },
}

export const actions = {
    nuxtServerInit({ commit }, { req }) {
        const token = cookieFromRequest(req, 'token')
        if (token) {
            commit('auth/SET_TOKEN', token)
        }
    },

    nuxtClientInit({ commit, getters, dispatch }) {
        const token = Cookies.get('token')
        if (token && !getters['auth/token']) {
            commit('auth/SET_TOKEN', token)
        }

        const open_chat = Cookies.get('open_chat')
        commit('message/TOGGLE_CHAT',  open_chat == 'true')

        const location = Cookies.get('location')
        if (location) {
            commit('ads/SET_LOCATION',  JSON.parse(location))
        }

        const theme = Cookies.get('theme')
        if (theme) {
          commit('SET_THEME', theme);
        }

        dispatch('ads/getCountries');
    },

    setKeyword({ commit }, { keyword }) {
        commit('SET_KEYWORD', keyword)
    },

    async fetchNotifications({ commit }) {
        const response = await axios.get(`/notification/get_unreads_count`);
        commit('SET_UNREAD_NOTIFICATIONS', response.data.data);
    },

    selectCategory({ commit }, category) {
        commit('SELECT_CATEGORY', category)
    },

    async getFollowings({ commit }, user_id) {
        const { data } = await axios.post('/user/get_followings', { id: user_id });
        commit('SET_FOLLOWINGS', data.data)
    },

    setEnableChat({ commit }, value) {
        commit('SET_ENABLE_CHAT', value)
    },

    toggleLeftMenu({ commit }, value = undefined) {
        commit('TOGGLE_LEFT_MENU', value)
    },

    setHasSidebar({ commit }, value) {
        commit('TOGGLE_HAS_SIDEBAR', value)
    },

    async requestFollow(context, user_id) {
        const { data } = await axios.post('/user/request_follow', { user_id: user_id });
        return data;
    },
    setLoadingPercent({ commit }, value) {
        commit('SET_LOADING_PERCENT', value);
    },
    showLoading({ commit }, value) {
        commit('SHOW_LOADING', value);
    },
    setTheme({ commit, state }, data = null) {
        commit('SET_THEME', data);
        Cookies.set('theme', state.theme, { expires: 365 })
    },
    setAlertData({ commit }, value) {
        commit('SET_ALERT_DATA', value);
    },
    toggleAlert({ commit }, value = undefined) {
        commit('TOGGLE_ALERT', value);
    },
    setSharing({ commit }, data) {
        commit('SET_SHARING', data);
    },
    toggleShare({ commit }, value = undefined) {
        commit('TOGGLE_SHARE', value);
    },
    setReportData({ commit }, data) {
        commit('SET_REPORT_DATA', data);
    },
    toggleReport({ commit }, value = undefined) {
        commit('TOGGLE_REPORT', value);
    },
    toggleFooter({ commit }, value = undefined) {
        commit('TOGGLE_FOOTER', value)
    },
}