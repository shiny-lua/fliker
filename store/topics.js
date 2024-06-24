import axios from "axios";

export const state = () => ({
    topics: [],
})

export const getters = {
    topics: state => state.topics,
}

export const mutations = {
    SET_TOPICS(state, data) {
        state.topics = data
    },
}

export const actions = {
    async getTopics({ commit }) {
        const { data } = await axios.post(`${process.env.topicsApiUrl}/topic/search_topics`, {status: 'active'});
        commit('SET_TOPICS', data.data)
    },
}