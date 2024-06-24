<template>
    <login />
</template>

<script>
import Login from '~/components/auth/Login.vue';
export default {
    middleware: 'guest',
    components: {
        Login,
    },

    head () {
        return { title: 'Log In' }
    },
}
</script>
