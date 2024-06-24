<template>
    <div class="col-lg-12 col-xl-10">
        <div class="row">
            <div class="col-5 mb-3" :class="(chat_user || chat_group) && 'chat-opened'">
                <div class="message-left-panel fp-card fp-sm-no-card">
                    <div class="icon-prefix-input">
                        <fp-icon name="search" style="font-size: 16px;" />
                        <input type="text"
                             class="form-control"
                             placeholder="Search names..."
                             @input="searchChatUsers"
                        />
                    </div>
                    <fp-chat-list ref="chatList" type="page" />
                </div>
            </div>
            <div v-if="chat_user || chat_group" class="col-7 mb-3">
                <div class="page-chat-container">
                    <user-chat-box v-if="chat_user" :chat="chat_user"></user-chat-box>
                    <group-chat-box v-else-if="chat_group" :group="chat_group"></group-chat-box>
                </div>
            </div>
        </div>
        <portal to="mobile-page-title">
            <div v-if="chat_user" class="d-flex align-items-center">
                <img :src="chat_user.image_url" width="38" height="38" class="rounded-circle" alt="">
                <h6 class="text-white mb-0 ml-2">{{ chat_user.name }}</h6>
            </div>
            <div v-else-if="chat_group" class="d-flex align-items-center">
                <img :src="chat_group.image_url" width="38" height="38" class="rounded-circle" alt="">
                <h6 class="text-white mb-0 ml-2">{{ chat_group.name }}</h6>
            </div>
            <h6 v-else class="mb-0 mobile-page-title">Chat</h6>
        </portal>
        <portal v-if="chat_user || chat_group" to="logo-m">
            <a href="javascript:;" class="btn-back" @click="reset()">
                <fp-icon name="chevron-left" class="fp-fs-22 text-white" />
            </a>
        </portal>
    </div>
</template>
<script>
import {mapGetters} from "vuex"
import FpChatList from "~/components/message/FpChatList.vue"
import UserChatBox from "~/components/message/user_chat/UserChatBox.vue"
import GroupChatBox from "~/components/message/group_chat/GroupChatBox.vue"
export default {
    middleware: 'auth',
    components: {
        FpChatList, UserChatBox, GroupChatBox
    },
    data() {
        return {
            tm: null,
        }
    },
    computed: mapGetters({
        chat_user: 'message/chat_user',
        chat_group: 'message/chat_group',
    }),
    watch: {
        chat_group(value) {
            this.$store.dispatch('toggleFooter', !value && !this.chat_user);
        },
        chat_user(value) {
            this.$store.dispatch('toggleFooter', !value && !this.chat_group);
        }
    },
    mounted() {
        this.$store.dispatch("setEnableChat", false);
        const user_id = this.$route.query.user_id;
        if (user_id) {
            this.$store.dispatch("message/openUserChatBox", { user_id: user_id });
        }
    },
    beforeDestroy() {
        this.$store.dispatch("setEnableChat", true);
        this.$store.dispatch('message/closeUserChat');
        this.$store.dispatch('message/closeGroupChat');
    },
    methods: {
        searchChatUsers(event) {
            const keyword = event.target.value
            clearTimeout(this.tm);
            this.tm = setTimeout(() => {
                this.$store.dispatch('message/setKeyword', keyword);
            }, 500);
        },
        reset() {
            this.$store.dispatch('message/closeUserChat');
            this.$store.dispatch('message/closeGroupChat')
        }
    }
}
</script>
<style lang="scss" scoped>
    .message-left-panel {
        &::v-deep {
            .chat-list-container {
                border: none;
                height: 373px;
                @media (max-width: 600px) {
                    height: calc(100vh - 222px);
                    background-color: transparent !important;
                }
            }
            .nav {
                background-color: #F6F9Fc;
                border-radius: 8px;
                border: none !important;
                margin-bottom: 8px;
                .nav-link {
                    &.active {
                        color: #FFF;
                        border-radius: 8px;
                    }
                }
            }
        }
    }
    .chat-opened {
        @media (max-width: 600px) {
            display: none;
        }
    }
    @media (max-width: 600px) {
        .col-5, .col-7 {
            min-width: 100%;
        }
    }
    .page-chat-container {
        height: 100%;
        &::v-deep {
            .chat-box {
                width: 100%;
                margin: 0;
                border-radius: 8px;
                overflow: hidden;
                @media (max-width: 600px) {
                    height: calc(100vh - 90px);
                    max-height: unset;
                    margin-bottom: -85px;
                    background-color: unset !important;
                    border-radius: 0;
                }
            }
            .panel-header {
                .btn-close {
                    @media (min-width: 600px) {
                        display: none;
                    }
                }
                @media (max-width: 600px) {
                    display: none;
                }
                .group-name {
                    max-width: 400px;
                }
            }
            @media (max-width: 600px) {
                .user-messages, .group-messages {
                    height: 100%;
                }
                .user-message-list, .group-message-list {
                    height: calc(100% - 50px);
                    padding: 0;
                }
            }
        }
    }
</style>