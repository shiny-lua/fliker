<template>
    <div class="chat-list-container fp-bg-color-1" :class="{'page-type': type == 'page', 'mobile-hide': chat_users.length}">
        <div class="page-header border-0 my-2" v-if="type == 'page'">
            <a v-if="tab === 'active'" href="javascript:;" class="fp-text-active" @click="tab = 'archive'">
                <fa icon="archive" />
                Archived Messages
            </a>
            <a v-else href="javascript:;" class="fp-text-active" @click="tab = 'active'">
                <fa icon="chevron-left" />
                Active Messages
            </a>
        </div>
        <div class="panel-header" v-if="type == 'panel'">
            <h6 class="mb-0">Messages</h6>
            <a href="javascript:;" class="ml-auto header-icon" @click.prevent="addGroup()">
                <fp-icon name="group" class="fp-fs-20" />
            </a>
            <a href="javascript:;" class="ml-1 header-icon">
                <fp-icon name="setting" class="fp-fs-20" />
            </a>
            <a href="javascript:;" class="text-white ml-2 btn-close" @click="toggleChat()">
                <fp-icon name="times-square" class="fp-fs-20" />
            </a>
        </div>
        <div :class="type === 'panel' && 'p-2'">
            <ul class="nav nav-pills nav-justified nav-chat-type fp-bg-color-2 p-md-1">
                <li class="nav-item">
                    <a href="javascript:;"
                        class="nav-link"
                        :class="chatType === 'user' && 'active'"
                        @click="chatType = 'user'"
                    >
                        Message
                        <span v-if="user_unreads" class="badge badge-danger badge-pill mt-n1">{{ user_unreads }}</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:;"
                        class="nav-link"
                        :class="chatType === 'group' && 'active'"
                        @click="chatType = 'group'"
                    >
                        Group Chat
                        <span v-if="group_unreads" class="badge badge-danger badge-pill">{{ group_unreads }}</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="chat-list nice-scrollbar fp-card fp-sm-no-card p-0">
            <user-list v-if="chatType === 'user'" ref="userList" :type="type" :tab="tab"></user-list>
            <group-list v-if="chatType === 'group'" ref="groupList" :type="type" :tab="tab"></group-list>
        </div>
        <fp-modal ref="groupFormModal"
            name="groupFormModal"
            :width="500"
            title="Create new Group"
        >
            <group-form ref="groupForm"
                @submitted="groupCreated"
            ></group-form>
        </fp-modal>
    </div>
</template>
<script>
import UserList from "./user_chat/UserList.vue";
import GroupList from "./group_chat/GroupList.vue";
import GroupForm from "./group_chat/GroupForm.vue";
import FpModal from "../ui/Modal.vue";
import { mapGetters } from "vuex"
export default {
    props: ['type'],
    components: {
        UserList,
        GroupList,
        GroupForm,
        FpModal,
    },
    data() {
        return {
            tab: 'active',
            chatType: 'user',
            auth_groups: [],
        };
    },
    computed: {
        ...mapGetters({
            auth_user: 'auth/user',
            chat_users: 'message/chat_users',
            user_unreads: 'message/user_unreads',
            group_unreads: 'message/group_unreads',
        }),
    },
    watch: {
        tab() {
            this.$store.dispatch('message/closeUserChat');
            this.$store.dispatch('message/closeGroupChat');
        },
        chatType() {
            this.$store.dispatch('message/closeUserChat');
            this.$store.dispatch('message/closeGroupChat');
        }
    },
    methods: {
        toggleChat() {
            this.$store.dispatch('message/toggleChat');
        },
        addGroup() {
            this.$refs.groupFormModal.open();
        },
        groupCreated(data) {
            this.$refs.groupFormModal.close();
            if (this.chatType === 'group') {
                this.$refs.groupList.groups.unshift(data);
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .chat-list {
        height: calc(100% - 72px);
        overflow-y: auto;
    }
    .nav-chat-type {
        background-color: #F6F9FC;
        border-radius: 6px !important;
        .nav-link {
            color: inherit;
            padding: 4px 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px !important;
            font-weight: 400;
            font-size: 14px;
            &.active {
                color: #FFF;
                background-color: #FF22A1;
            }
            .badge {
                margin-left: 4px;
                font-size: 12px;
                padding-bottom: 2px;
            }
        }
    }
    .header-icon {
        padding: 3px;
    }
</style>