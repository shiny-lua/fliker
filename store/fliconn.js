import axios from "axios";

export const state = () => ({
    profile_option: null,
    profile_visible_users: [],
    files: null,
    previews: null,
})

export const getters = {
    profile_option: state => state.profile_option,
    profile_visible_users: state => state.profile_visible_users,
    files: state => state.files,
    previews: state => state.previews,
}

export const mutations = {
    SET_PROFILE_OPTION(state, data) {
        state.profile_option = data
    },
    SET_PROFILE_VISIBLE_USERS(state, data) {
        state.profile_visible_users = data
    },
    SET_FFILES(state, data) {
        state.files = data.files,
        state.previews = data.previews;
    }
}

export const actions = {
    async getProfileOption({ commit }, user_id) {
        const { data } = await axios.get(`/get_profile_options/${user_id}`);
        commit('SET_PROFILE_OPTION', data.data)
    },
    async getProfileVisibleUsers({ commit }) {
        const { data } = await axios.get(`/user/get_profile_visible_user_ids`);
        commit('SET_PROFILE_VISIBLE_USERS', data.data)
    },
    setFiles({ commit }, data) {
        commit('SET_FFILES', data)
    }
}