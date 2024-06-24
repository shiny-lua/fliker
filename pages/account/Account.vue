<template>
    <div class="row pt-2 pt-md-4 justify-content-center">
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
export default {
    middleware: 'auth',
    head () {
        return { title: 'Account' }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
}
</script>
