<template>
    <div class="layout">
        <top-nav></top-nav>
        <div class="px-md-2">
            <div class="container-xl page-container">
                <nuxt />
            </div>
        </div>
        <fp-chat v-if="auth_user && auth_user.profile.enable_chat" v-show="enable_chat" />
        <bottom-nav v-if="show_footer" />
        <sidebar />
        <loading v-if="show_loading" />
        <fp-alert />
        <share-modal />
        <report-modal />
    </div>
</template>

<script>
    import TopNav from "~/components/elements/TopNav";
    import BottomNav from "~/components/elements/BottomNav";
    import Sidebar from "~/components/elements/Sidebar";
    import Loading from "~/components/elements/Loading";
    import FpChat from "~/components/message/FpChat.vue";
    import FpAlert from "~/components/ui/FpAlert.vue";
    import { mapGetters } from "vuex";
    import ShareModal from '~/components/ui/ShareModal.vue';
    import ReportModal from "~/components/ui/ReportModal.vue";
    export default {
        namme: 'DefaultLayout',
        head() {
            return {
                htmlAttrs: {
                    "data-theme": this.theme,
                },
            };
        },
        components: {
            TopNav,
            BottomNav,
            FpChat,
            Loading,
            Sidebar,
            FpAlert,
            ShareModal,
            ReportModal,
        },
        computed: mapGetters({
            auth_user: "auth/user",
            enable_chat: "enable_chat",
            show_loading: "show_loading",
            show_footer: "show_footer",
            theme: 'theme',
        }),
        mounted() {
            window.addEventListener("resize", this.appHeight);
            this.appHeight();
        },
        methods: {
            appHeight() {
                const doc = document.documentElement;
                doc.style.setProperty("--app-height", `${window.innerHeight}px`);
            },
        },
    };
</script>
