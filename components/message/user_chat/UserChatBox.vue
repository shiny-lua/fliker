<template>
    <div class="chat-box fp-bg-color-1" :class="{minimized}">
        <div class="panel-header">
            <span class="d-inline-flex align-items-center cursor-pointer" @click="goToProfile()">
                <img :src="chat.image_url" width="28" class="avatar" alt="">
                <h6 class="mb-0 user-name">
                    {{chat.name}}
                </h6>
            </span>
            <a href="javascript:;" class="btn-close text-white ml-auto" @click="minimized = !minimized">
                <fa v-if="minimized" :icon="['far', 'window-restore']" />
                <fp-icon v-else name="minus-square" class="fp-fs-20" />
            </a>
            <a href="javascript:;" class="btn-close text-white ml-2" @click="closeUserChat()">
                <fp-icon name="close-1" class="fp-fs-20" />
            </a>
        </div>
        <div class="chatbox-body" v-show="!minimized">
            <user-messages :chat="chat"
                 @read="$emit('read')"
            />
        </div>
    </div>
</template>
<script>
import UserMessages from './UserMessages.vue'
export default {
    name: 'UserChatBox',
    props: {
        chat: { type: Object, required: true },
    },
    components: {
        UserMessages,
    },
    data() {
        return {
            minimized: false,
        }
    },
    methods: {
        closeUserChat() {
            this.$store.dispatch('message/closeUserChat', this.chat);
        },
        async goToProfile() {
            if (this.chat.chat_name) {
                const response = await this.axios.post(`${process.env.adsApiUrl}/automotive/get_seller_profile`, {user_id: this.chat.receiver_id});
                if (response.data.status === 'Success') {
                    const automotive_seller = response.data.data;
                    return this.$router.push({name: 'automotive.seller_profile', params: {slug: automotive_seller.slug}});
                }
            } else {
                const response = await this.axios.post(`/user/get_detail`, {id: this.chat.receiver_id});
                if (response.data.status === 'Success') {
                    const user = response.data.data;
                    return this.$router.push({name: 'fliconn.profile', params: {username: user.username}});
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .panel-header {
        .user-name {
            max-width: 180px;
            font-size: 14px;
            line-height: 1;
        }
    }
    .chatbox-body {
        flex-grow: 1;
        height: calc(100% - 92px);
    }
</style>