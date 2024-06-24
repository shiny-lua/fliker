import axios from 'axios'
import Cookies from 'js-cookie'

// state
export const state = () => ({
    user: null,
    token: null,
    modal_content: '',
    unverified_user: '',
    redirect_route: '',
    circle_users: [], // users in same country
})

// getters
export const getters = {
    user: state => state.user,
    token: state => state.token,
    check: state => state.user !== null,
    modal_content: state => state.modal_content,
    unverified_user: state => state.unverified_user,
    redirect_route: state => state.redirect_route,
    circle_users: state => state.circle_users,
}

// mutations
export const mutations = {
    SET_TOKEN (state, token) {
        state.token = token
    },

    FETCH_USER_SUCCESS (state, user) {
        state.user = user
    },

    FETCH_USER_FAILURE (state) {
        state.token = null
    },

    LOGOUT (state) {
        state.user = null
        state.token = null
    },
    UPDATE_USER (state, { user }) {
        state.user = user
    },
    SET_MODAL_CONTENT(state, { modal_content }) {
        state.modal_content = modal_content;
    },
    SET_UNVERIFIED_USER(state, {user}) {
        state.unverified_user = user;
    },
    SET_REDIRECT_ROUTE(state, data) {
        state.redirect_route = data;
    },
    UPDATE_USER_DETAIL (state, user) {
        if (user.automotive_seller !== undefined) state.user.automotive_seller = user.automotive_seller
        if (user.has_seller_profile !== undefined) state.user.has_seller_profile = user.has_seller_profile
        if (user.available_add_inventory !== undefined) state.user.available_add_inventory = user.available_add_inventory
        if (user.seller_profile_status !== undefined) state.user.seller_profile_status = user.seller_profile_status
    },
    SET_CIRCLE_USERS(state, users) {
        state.circle_users = users;
    },
}

// actions
export const actions = {
    saveToken ({ commit, dispatch }, { token, remember }) {
        commit('SET_TOKEN', token)

        Cookies.set('token', token, { expires: remember ? 365 : null })
    },

    async fetchUser ({ commit }) {
        try {
            const { data } = await axios.get(`/user`)
            commit('FETCH_USER_SUCCESS', data)
            const response = await axios.post(`${process.env.adsApiUrl}/get_user_detail`, {id: data.id});
            commit('UPDATE_USER_DETAIL', response.data.data)
        } catch (e) {
            Cookies.remove('token')
            commit('FETCH_USER_FAILURE')
        }
    },

    updateUser ({ commit }, payload) {
        commit('UPDATE_USER', payload)
    },

    updateUserDetail ({ commit }, payload) {
        commit('UPDATE_USER_DETAIL', payload)
    },

    async logout ({ commit }) {
        try {
            await axios.post(`/logout`)
        } catch (e) { }

        Cookies.remove('token')

        commit('LOGOUT')
    },

    async fetchOauthUrl (ctx, { provider }) {
        const { data } = await axios.post(`/oauth/${provider}`)

        return data.url
    },

    setModalContent({ commit }, payload) {
        commit('SET_MODAL_CONTENT', payload)
    },

    setUnverifiedUser({ commit }, payload) {
        commit('SET_UNVERIFIED_USER', payload)
    },

    setRedirectRoute({ commit }, payload) {
        commit('SET_REDIRECT_ROUTE', payload)
    },

    async getCircleUsers({ commit }) {
        try {
            const response = await axios.post(`/user/get_same_country_users`, { is_not_following: true });
            commit('SET_CIRCLE_USERS', response.data.data.data)
        } catch (e) { }
    },
}
