<template>
    <div class="mobile-more-page mt-n2">
        <template v-if="auth_user">
            <div class="more-nav-item fp-border-color-1">
                <router-link :to="{name: 'fliconn.profile', params: {username: auth_user.username}}" class="more-nav-link">
                    <fp-icon name="user" class="fp-fs-22" />
                    Profile
                </router-link>
            </div>
            <div class="more-nav-item fp-border-color-1">
                <router-link :to="{ name: 'more.manage' }" class="more-nav-link">
                    <fp-icon name="page" class="fp-fs-22" />
                    Manage
                </router-link>
            </div>
            <div class="more-nav-item fp-border-color-1">
                <router-link :to="{ name: 'settings.basic_information' }" class="more-nav-link">
                    <fp-icon name="setting" class="fp-fs-22" />
                    Settings
                </router-link>
            </div>
        </template>
        <div class="more-nav-item fp-border-color-1">
            <router-link :to="{ name: 'learn_mobile' }" class="more-nav-link">
                <fp-icon name="learn" class="fp-fs-22" />
                Learn
            </router-link>
        </div>
        <div v-if="auth_user" class="more-nav-item fp-border-color-1">
            <a @click.prevent="logout" class="more-nav-link">
                <fp-icon name="sign-out" class="fp-fs-22 fp-text-color-danger" />
                Logout
            </a>
        </div>
        <div v-else class="more-nav-item fp-border-color-1">
            <a @click.prevent="login('/')" class="more-nav-link">
                <fp-icon name="sign-in" class="fp-fs-22" />
                Login
            </a>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    export default {
        name: "More",
        computed: mapGetters({
            auth_user: "auth/user",
        }),
        methods: {
            login(redirect = "") {
                if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
                if (this.$route.name !== "login") this.$router.push({ name: "login" });
            },
            async logout() {
                await this.$store.dispatch("auth/logout");
                this.$router.push({ name: "login" });
            },
            goToPage(routerName) {
                if (!this.auth_user && (routerName.includes("topic") || routerName.includes("fliconn"))) {
                    this.login(routerName);
                } else {
                    if (this.$route.name !== routerName) this.$router.push({ name: routerName });
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
    .more-nav-item {
        padding: 16px 0;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        &:last-child {
            border-bottom: none;
        }
        .more-nav-link {
            font-size: 15px;
            text-align: center;
            font-weight: 500;
            text-decoration: none;
            svg {
                margin-right: 4px;
            }
        }
    }
</style>
