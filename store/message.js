import Cookies from 'js-cookie'
import axios from "axios";
import { fpError } from "../plugins/fp-alert";

// state
export const state = () => ({
    user_unreads: 0,
    group_unreads: 0,
    open_chat: false,
    chat_users: [],
    chat_groups: [],
    chat_user: null,
    chat_group: null,
    keyword: '',
})

// getters
export const getters = {
    user_unreads: state => state.user_unreads,
    group_unreads: state => state.group_unreads,
    open_chat: state => state.open_chat,
    chat_users: state => state.chat_users,
    chat_groups: state => state.chat_groups,
    chat_user: state => state.chat_user,
    chat_group: state => state.chat_group,
    keyword: state => state.keyword,
}

// mutations
export const mutations = {
    TOGGLE_CHAT (state, data) {
        state.open_chat = data
    },
    SET_USER_UNREADS (state, data) {
        state.user_unreads = data
    },
    SET_GROUP_UNREADS (state, data) {
        state.group_unreads = data
    },
    SET_CHAT_USER (state, data) {
        state.chat_user = data;
    },
    REMOVE_CHAT_USER (state) {
        state.chat_user = null;
    },
    SET_CHAT_GROUP (state, data) {
        state.chat_group = data;
    },
    REMOVE_CHAT_GROUP (state) {
        state.chat_group = null;
    },
    SET_KEYWORD (state, data) {
        state.keyword = data;
    },
    SET_GROUP_REPLY(state, data) {
        if (state.chat_group.id !== data.group_id) return;
        state.chat_group.repliable = data.repliable;
    },
    SET_GROUP_AVAILABLE_HOURS(state, data) {
        if (state.chat_group.id !== data.group_id) return;
        state.chat_group.avaiable_hours = data.avaiable_hours;
    },
    SET_GROUP_BLOCKED(state, data) {
        state.chat_group.is_blocked = data;
    }
}

export const actions = {
    toggleChat({ commit, state }) {
        let open_chat = !state.open_chat;
        Cookies.set('open_chat', open_chat);
        commit('TOGGLE_CHAT', open_chat);
    },

    openUserChat ({ commit }, user) {
        commit('TOGGLE_CHAT', true);
        commit('REMOVE_CHAT_GROUP');
        commit('SET_CHAT_USER', user);
    },

    async openUserChatBox({ commit }, data) { //data: {user_id: '', name: '', image_url: ''}
        try {
            const response = await axios.post(`${process.env.chatApiUrl}/chat/save_chat`, data);
            if (response.data.status === 'Success') {
                commit('REMOVE_CHAT_GROUP');
                commit('REMOVE_CHAT_USER');
                let chat_user = {
                    is_online: !!data.is_online,
                    ...response.data.data
                };
                commit('SET_CHAT_USER', chat_user);
                commit('TOGGLE_CHAT', true);
            }
        } catch (error) {
            this.$fpError(error.response.data.message);
        }
    },

    closeUserChat({ commit }) {
        commit('REMOVE_CHAT_USER');
    },

    openGroupChat ({ commit }, group) {
        commit('REMOVE_CHAT_USER');
        commit('SET_CHAT_GROUP', group);
        commit('TOGGLE_CHAT', true);
    },

    closeGroupChat({ commit }) {
        commit('REMOVE_CHAT_GROUP');
    },
    setUserUnreads({ commit }, data) {
        commit('SET_USER_UNREADS', data);
    },
    setGroupUnreads({ commit }, data) {
        commit('SET_GROUP_UNREADS', data);
    },
    openPageChat({ commit }, user) {
        commit('SET_CHAT_USER', user);
    },
    setKeyword({ commit }, keyword) {
        commit('SET_KEYWORD', keyword);
    },
    enableGroupReply({ commit }, data) {
        commit('SET_GROUP_REPLY', data);
    },
    changeGroupMsgAvailableHours({ commit }, data) {
        commit('SET_GROUP_AVAILABLE_HOURS', data);
    },
    setGroupBlocked({ commit }, data) {
        commit('SET_GROUP_BLOCKED', data);
    }
}
