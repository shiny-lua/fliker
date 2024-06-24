<template>
    <router-link :to="{name: 'account.messages'}" class="top-chat nav-link px-1 d-md-none">
        <span class="notification-wrapper">
            <fp-icon name="comment" class="fp-fs-24 text-white" />
            <span v-if="total_unread_count" class="notification-count">{{ total_unread_count }}</span>
        </span>
    </router-link>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    name: 'TopChat',
    computed: {
        total_unread_count() {
            return this.user_unreads + this.group_unreads;
        },
        ...mapGetters({
            user_unreads: 'message/user_unreads',
            group_unreads: 'message/group_unreads',
        })
    },
}
</script>