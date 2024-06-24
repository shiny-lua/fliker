<template>
    <a href="javascript:;" class="theme-switch" @click.prevent="toggleTheme()">
        <fp-icon :name="theme === 'dark' ? 'theme-light' : 'theme-dark'" class="fp-fs-24 text-white" />
    </a>
</template>
<script>
export default {
    name: 'ToggleTheme',
    computed: {
        theme() {
            return this.$store.getters['theme'];
        }
    },
    methods: {
        toggleTheme() {
            this.$store.dispatch('setTheme');
        }
    }
}
</script>