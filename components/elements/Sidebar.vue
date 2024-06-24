<template>
    <div class="fp-sidebar" :class="{'opened': open_left_menu}">
        <div class="fp-sidebar-content" :class="{'active': open_menu}">
            <portal-target name="fp-sidebar"></portal-target>
        </div>
        <div class="fp-sidebar-overlay" :class="{'active': open_overlay}" @click="closeSidebar()"></div>
    </div>
</template>
<script>
export default {
    name: 'Sidebar',
    data() {
        return {
            open_menu: false,
            open_overlay: false,
        };
    },
    computed: {
        open_left_menu() {
            return this.$store.getters['open_left_menu'];
        }
    },
    watch: {
        async open_left_menu(value) {
            this.open_overlay = value;
            setTimeout(() => {
                this.open_menu = value;
            }, 100);
        }
    },
    methods: {
        closeSidebar() {
            this.$store.dispatch('toggleLeftMenu', false);
        }
    }
}
</script>
<style lang="scss" scoped>
    .fp-sidebar {
        position: fixed;
        z-index: 9999;
        top: 65px;
        left: 0;
        width: 100vw;
        height: calc(100vh - 65px);
        display: none;
        @media (min-width: 601px) {
            display: none;
        }
        &.opened {
            display: block;
        }
        .fp-sidebar-content {
            position: absolute;
            top: 0;
            left: -253px;
            z-index: 10000;
            height: 100%;
            overflow: auto;
            background: #FFF;
            transition: left 0.2s linear;
                width: 253px;
            &.active {
                left: 0;
            }
        }
        .fp-sidebar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9999;
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 0;
            transition: opacity 0.2s linear;
            &.active {
                opacity: 0.35;
            }
        }
    }
    [data-theme=dark] {
        .fp-sidebar {
            .fp-sidebar-content {
                background-color: #00162D;
            }
        }
    }
</style>