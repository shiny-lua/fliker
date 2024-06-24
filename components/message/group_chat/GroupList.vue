<template>
    <div class="user-list group-list">
        <ul class="chat-user-list">
            <li v-for="(item, index) in groups"
                :key="index"
                :class="{
                    'list': true,
                    'active': active_index === index,
                    'd-none': type === 'page' && (tab == 'active' == item.is_archived)
                }"
                @click="openGroupChat(item)"
            >
                <div class="chat-user-item fp-border-color-1">
                    <div class="profile">
                        <img :src="item.image_url" alt="">
                    </div>
                    <div class="info flex-grow-1 mr-0">
                        <p class="name">
                            {{item.name}}
                        </p>
                        <p :class="{
                                'last-message': true,
                            }"
                        >{{ item.last_message }}</p>
                        <!-- <p class="last_time">{{ item.last_time }}</p> -->
                    </div>
                    <span class="ml-auto">
                        <span class="badge badge-danger badge-pill" v-if="item.unread_count > 0">{{item.unread_count}}</span>
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
                <div class="text-center" style="color: #C3C3C3;" slot="no-results">No group found!</div>
                <div slot="spinner" class="pt-3">
                    <img src="~assets/images/logo_loading.gif" width="40" alt="" />
                </div>
            </infinite-loading>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    name: 'GroupList',
    props: {
        type: { type: String, default: 'panel' },
        tab: { type: String, default: 'active' },
    },
    data() {
        return {
            groups: [],
            page: 1,
            infiniteId: +new Date(),
            auth_groups: [],
        }
    },
    computed: {
        active_index() {
            if (!this.chat_group) return null;
            return this.groups.findIndex(i => i.id === this.chat_group.id);
        },
        ...mapGetters({
            auth_user: 'auth/user',
            keyword: 'message/keyword',
            chat_group: 'message/chat_group',
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
                const response = await this.axios.post(`${process.env.chatApiUrl}/group/search`, payload);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.groups = [];
                    if (result.data.length) {
                        this.page++;
                        this.groups.push(...result.data);
                        this.getUnreadCount();
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            } catch (error) { }
        },
        submitted(data) {
            this.$modal.hide('group_detail_modal');
            this.groups.unshift(data);
        },
        async openGroupChat(item) {
            item.unread_count = 0;
            if (this.chat_group) {
                this.$store.dispatch('message/closeGroupChat');
            }
            await this.$nextTick();
            this.$store.dispatch('message/openGroupChat', item);
            if (this.$parent.$parent.$options.name === 'FpChat') {
                this.$parent.$parent.getGroupUnreads();
            }
        },
        getUnreadCount() {
            this.groups.map(group => {
                let unreadMsgRef = this.$fire.database.ref(`group_chat/${group.id}/messages`);
                unreadMsgRef.orderByChild("user_id").equalTo(this.auth_user.id).once('value')
                .then((snapshot) => {
                    const unreadCount = snapshot.numChildren();
                    group.unread_count = unreadCount
                });
            });
        },
        async toggleArchive(item) {
            const response = await this.axios.post(`${process.env.chatApiUrl}/group/archive`, {group_id: item.id});
            if (response.data.status === 'Success') {
                item.is_archived = response.data.data;
            }
        },
        removeGroup(group_id) {
            const index = this.groups.findIndex(g => g.id === group_id);
            if (index !== -1) {
                this.groups.splice(index, 1);
            }
        }
    }
}
</script>