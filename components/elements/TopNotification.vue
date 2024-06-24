<template>
    <div>
        <router-link :to="{name: 'account.notifications'}" class="nav-link d-md-none">
            <span class="notification-wrapper">
                <fp-icon name="notification" class="fp-fs-24 text-white" />
                <span class="notification-count" v-if="unread_notifications">{{ unread_notifications }}</span>
            </span>
        </router-link>
        <div class="dropdown dropdown-notification d-none d-md-block">
            <a href="javascript:;" class="nav-link dropdown-toggle pl-0" data-toggle="dropdown" @click="load()">
                <span class="notification-wrapper">
                    <fp-icon name="notification" class="fp-fs-24 text-white" />
                    <span class="notification-count" v-if="unread_notifications">{{ unread_notifications }}</span>
                </span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <notifications ref="notifications" mode="top" />
                <div class="text-center">
                    <router-link :to="{ name: 'account.notifications' }"
                        class="btn-show-all"
                    >
                        View more
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import Notifications from "./Notifications.vue";
export default {
    name: 'TopNotification',
    components: {
        Notifications,
    },
    computed: mapGetters({
        auth_user: "auth/user",
        unread_notifications: "unread_notifications",
    }),
    watch: {
        auth_user: function (newUser) {
            if (newUser) {
                this.$store.dispatch("fetchNotifications");
            }
        },
    },
    mounted() {
        if (this.auth_user) {
            this.$store.dispatch("fetchNotifications");
            this.$fire.database.ref("notifications/" + this.auth_user.id).remove();
            const notiCountRef = this.$fire.database.ref("notifications/" + this.auth_user.id).limitToLast(1);
            notiCountRef.on("value", (snapshot) => {
                snapshot.forEach((doc) => {
                    this.$store.dispatch("fetchNotifications");
                });
            });
        }
    },
    methods: {
        load() {
            this.$refs.notifications.searchNotifications();
        }
    }
}
</script>
<style lang="scss" scoped>
    .dropdown-notification {
        .dropdown-toggle {
            &::after {
                display: none;
            }
        }
        .dropdown-menu {
            min-width: 450px;
            border-radius: 15px;
            position: absolute;
            padding: 16px;
            @media (max-width: 600px) {
                min-width: 300px;
            }
        }
        .btn-show-all {
            color: #007bff;
            font-size: 14px;
        }
        .btn-read-all {
            font-size: 13.6px;
        }
    }
</style>