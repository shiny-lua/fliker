<template>
    <div class="no-results text-center mt-4 mt-md-5 pt-4">
        <img src="~/assets/images/no_results.png" alt="" />
        <h4 class="fp-text-active mt-3 mt-md-4">No Results</h4>
        <h6 class="fp-text-color-main font-weight-400">Be the first to post locally!</h6>
        <div class="text-center mt-3 mt-md-4">
            <router-link v-if="!auth_user" :to="{name: 'login'}" class="btn fp-btn-gradient px-4 mr-3">Log In</router-link>
            <router-link :to="{name: 'index'}" class="btn fp-btn-outline">Explorer FliConn</router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: 'NoResults',
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    }
}
</script>