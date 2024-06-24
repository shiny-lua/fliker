<template>
    <div class="recent-chat fp-card" :class="groups.length === 0 && 'd-none'">
        <div class="fp-card-header">
            <h6 class="fp-card-title">Channels</h6>
        </div>
        <div class="fp-card-body pt-3">
            <div v-for="(group, index) in groups"
                :key="index"
                class="recent-chat-item fp-border-color-1"
                @click="openChat(group)"
            >
                <div class="chat-image">
                    <img :src="group.image_url" width="35" height="35" alt="">
                </div>
                <div class="chat-info">
                    <p class="chat-name">{{ group.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'RecentChatGroups',
    data() {
        return {
            groups: [],
            loading: false,
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            this.loading = true;
            const response = await this.axios.get(`${process.env.chatApiUrl}/group/recent_chats`);
            if (response.data.status === 'Success') {
                this.groups = response.data.data;
                this.$emit('loaded', this.groups.length);
            }
            this.loading = false;
        },
        openChat(item) {
            this.$store.dispatch('message/openGroupChat', item);
        }
    }
}
</script>
<style lang="scss" scoped>
    .recent-chat-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        cursor: pointer;
        border-style: solid;
        border-width: 1px;
        border-radius: 8px;
        padding: 10px;
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
                font-weight: 400;
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