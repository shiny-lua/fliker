import Cookies from "js-cookie";
import axios from "axios";

export const state = () => ({
  location: null,
  categories: "",
  countries: [],
  previewImages: [],
  automotiveSellerImages: [],
});

export const getters = {
  location: (state) => state.location,
  categories: (state) => state.categories,
  countries: (state) => state.countries,
  previewImages: (state) => state.previewImages,
  automotiveSellerImages: (state) => state.automotiveSellerImages,
};

export const mutations = {
  SET_LOCATION(state, data) {
    state.location = data;
  },
  GET_CATEGORIES(state, data) {
    state.categories = data;
  },
  GET_COUNTRIES(state, data) {
    state.countries = data;
  },
  SET_PREVIEW_IMAGES(state, data) {
    state.previewImages = data;
  },
  CLEAR_PREVIEW_IMAGES(state) {
    state.previewImages = [];
    console.log("clearing preview images");
  },
  SET_AUTOMOTIVE_PREVIEW_IMAGES(state, data) {
    state.automotiveSellerImages = data;
  },
  CLEAR_AUTOMOTIVE_SELLER_PREVIEW_IMAGES(state) {
    state.automotiveSellerImages = [];
    console.log("clearing preview images");
  },
};

export const actions = {
  setLocation({ commit }, data) {
    Cookies.set("location", JSON.stringify(data));
    commit("SET_LOCATION", data);
  },

  async getCategories({ commit, state }) {
    let url = `${process.env.adsApiUrl}/category/get_all`;
    let country_code = state.location ? state.location.country : "";
    const { data } = await axios.post(url, { country_code });
    commit("GET_CATEGORIES", data.data);
  },

  async getCountries({ commit }) {
    let url = `${process.env.adsApiUrl}/country/get_all`;
    const { data } = await axios.get(url);
    commit("GET_COUNTRIES", data.data);
  },

  // preview images we store when user uploaded without saving
  setPreviewImages({ commit }, data) {
    commit("SET_PREVIEW_IMAGES", data);
  },
  clearPreviewImages({ commit }) {
    commit("CLEAR_PREVIEW_IMAGES");
  },
  setAutomotiveSellerImages({ commit }, data) {
    commit("SET_AUTOMOTIVE_PREVIEW_IMAGES", data);
  },
  clearAutomotiveSellerImages({ commit }) {
    commit("CLEAR_AUTOMOTIVE_SELLER_PREVIEW_IMAGES");
  },
};
