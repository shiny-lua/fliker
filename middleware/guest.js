export default ({ store, redirect }) => {
    if (store.getters['auth/check']) {
        if (store.getters['auth/redirect_route']) {
            return redirect(store.getters['auth/redirect_route']);
        } else {
            return redirect('/')
        }
    }
}
