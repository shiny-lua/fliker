<template>
    <div class="recent-chat" :class="chats.length === 0 && 'd-none'">
        <h6 class="mb-0 mt-1">Recent Chat</h6>
        <hr class="my-2">
        <div v-for="(chat, index) in chats" :key="index" class="recent-chat-item" @click="openChat(chat)">
            <div class="chat-image">
                <img :src="chat.image_url" width="35" height="35" alt="">
            </div>
            <div class="chat-info">
                <p class="chat-name">{{ chat.name }}</p>
                <p class="last-message">{{ chat.last_message }}</p>
            </div>
            <span class="ml-auto last-time">
                {{ $moment(chat.last_time).format('h:mm A') }}
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'RecentChatGroups',
    data() {
        return {
            chats: [],
            loading: false,
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.loading = true;
            const response = await this.axios.get(`${process.env.chatApiUrl}/chat/recent_chats`);
            if (response.data.status === 'Success') {
                this.chats = response.data.data;
                this.$emit('loaded', this.chats.length);
            }
            this.loading = false;
        },
        openChat(chat) {
            this.$store.dispatch("message/openUserChat", chat);
        },
    }
}
</script>
<style lang="scss" scoped>
    .recent-chat-item {
        display: flex;
        margin-bottom: 10px;
        cursor: pointer;
        &:last-child {
            margin-bottom: 0;
        }
        .chat-image {
            position: relative;
            min-width: 35px;
            img {
                border-radius: 100%;
                object-fit: cover;
            }
        }
        .chat-info {
            margin-left: 6px;
            flex-grow: 1;
            max-width: calc(100% - 95px);
            .chat-name {
                margin-bottom: 0;
                font-size: 13.6px;
                font-weight: 500;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .last-message {
                margin-bottom: 0;
                font-size: 12px;
                font-weight: 400;
                color: #999999;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .last-time {
            font-size: 12px;
            color: #999999;
            margin-top: 2px;
        }
    }
    .no-chats {
        margin-bottom: 0;
        color: #999999;
        text-align: center;
        font-size: 13.6px;
    }
</style>