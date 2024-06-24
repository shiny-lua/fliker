export default ({ app, store }, inject) => {

    inject('showLoading', () => {
        store.dispatch('showLoading', true);
    });

    inject('hideLoading', () => {
        store.dispatch('showLoading', false);
    });

};