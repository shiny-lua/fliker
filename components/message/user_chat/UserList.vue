<template>
    <div class="user-list group-list">
        <ul class="chat-user-list">
            <li v-for="(item, index) in chats"
                :key="index"
                :class="{
                    'list': true,
                    'active': active_index === index,
                    'd-none': type === 'page' && (tab == 'active' == item.is_archived),
                    'online': item.is_online,
                    'in_24_hours': item.in_24_hours,
                }"
                @click="openUserChat(item)"
            >
                <div class="chat-user-item fp-border-color-1">
                    <div class="profile">
                        <img :src="item.image_url" alt="">
                        <span class="online-offline" :class="{online: item.is_online}"></span>
                    </div>
                    <div class="info flex-grow-1">
                        <p class="name">{{item.name}} <span class="last-time">{{ item.is_online ? 'Online' : (item.diff_time).split(",")[0] }}</span> </p>
                        <p :class="{
                                'last-message': true,
                                'text-danger': !item.last_message_read
                            }"
                        >{{ item.last_message }}</p>
                    </div>
                    <span>
                        <span class="badge badge-danger badge-pill badge-unreads" v-if="item.unread_count > 0">{{item.unread_count}}</span>
                        <a v-if="type == 'page'"
                            href="javascript:;"
                            class="btn-archive-active ml-2"
                            :class="{'archive': !item.is_archived, 'active': item.is_archived}"
                            @click.stop="toggleArchive(item)"
                        >
                            <fa :icon="item.is_archived ? 'check-square' : 'archive'" />
                        </a>
                    </span>
                </div>
            </li>
            <infinite-loading :distance="100" :identifier="infiniteId" @infinite="search">
                <div slot="no-more"></div>
                <div class="text-center mt-2" style="color: #C3C3C3;" slot="no-results">No messages found!</div>
                <div slot="spinner" class="pt-3 pt-md-4">
                    <img src="~assets/images/logo_loading.gif" width="40" alt="" />
                </div>
            </infinite-loading>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    name: 'UserList',
    props: {
        type: { type: String, default: 'panel' },
        tab: { type: String, default: 'active' },
    },
    data() {
        return {
            chats: [],
            page: 1,
            infiniteId: +new Date(),
        }
    },
    computed: {
        active_index() {
            if (!this.chat_user) return null;
            return this.chats.findIndex(i => i.id === this.chat_user.id);
        },
        ...mapGetters({
            auth_user: 'auth/user',
            keyword: 'message/keyword',
            chat_user: 'message/chat_user',
        })
    },
    watch: {
        keyword(value) {
            this.page = 1;
            this.infiniteId++;
        },
        tab(value) {
            this.page = 1;
            this.infiniteId++;
        }
    },
    methods: {
        async search($state) {
            try {
                let payload = {
                    page: this.page,
                    keyword: this.keyword,
                    is_archived: this.tab === 'archive',
                    page_size: 5,
                }
                const response = await this.axios.post(`${process.env.chatApiUrl}/chat/search`, payload);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.chats = [];
                    if (result.data.length) {
                        this.page++;
                        this.chats.push(...result.data);
                        $state.loaded();
                        this.checkOnline();
                    } else {
                        $state.complete();
                    }
                }
            } catch (error) { }
        },
        async openUserChat(item) {
            item.unread_count = 0;
            if (this.chat_user) {
                this.$store.dispatch('message/closeUserChat');
            }
            await this.$nextTick();
            this.$store.dispatch("message/openUserChat", item);
            if (this.$parent.$parent.$options.name === 'FpChat') {
                this.$parent.$parent.getUserUnreads();
            }
        },
        async getUnreadCount(chat_id) {
            let chat = this.chats.find(i => i.id === chat_id);
            if (chat) {
                const response = await this.axios.get(`${process.env.chatApiUrl}/chat/get_unread_count/${chat_id}`);
                chat.unread_count = response.data.data;
            }
        },
        async toggleArchive(item) {
            const response = await this.axios.post(`${process.env.chatApiUrl}/chat/archive`, {chat_id: item.id});
            if (response.data.status === 'Success') {
                item.is_archived = response.data.data;
            }
        },
        async checkOnline() {
            let user_ids = this.chats.map(i => i.receiver_id);
            const response = await this.axios.post('/user/check_online_users', {users: user_ids});
            let online_users = response.data.data
            this.chats.map(i => {
                i.is_online = online_users.includes(i.receiver_id);
            });
        }
    }
}
</script>