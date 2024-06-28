<template>
    <div id="message_panel">
        <div class="chat-windows" v-if="open_chat">
            <div class="chat-boxes">
                <user-chat-box v-if="chat_user"
                     :chat="chat_user"
                     @read="getUserUnreads"
                />
                <group-chat-box v-if="chat_group"
                     :group="chat_group"
                     @group-deleted="groupDeleted"
                     @read="getGroupUnreads"
                />
            </div>
            <chat-list type="panel" ref="chatList" />
        </div>
        <div id="btn-message-indicator" @click="toggleChat()" v-else>
            <div class="position-relative h-100 d-flex align-items-center justify-content-center">
                <svg width="40" height="34" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_3277_11975)">
                        <path d="M31.715 10.1402C31.715 10.6673 31.715 11.1881 31.715 11.7152C31.6957 11.7914 31.6636 11.8676 31.6571 11.9502C31.5478 13.0679 31.2199 14.1221 30.712 15.1191C29.9082 16.7005 28.7445 17.9833 27.3106 19.0375C27.2078 19.1137 27.0663 19.2344 27.0599 19.3424C27.0406 19.7806 26.9956 20.2442 27.0984 20.6633C27.272 21.3746 27.5357 22.0668 27.7929 22.7463C27.9665 23.2036 27.9407 23.6164 27.6385 23.9974C27.3235 24.3975 26.8927 24.5182 26.404 24.4166C26.0054 24.334 25.6132 24.226 25.2274 24.0927C23.6907 23.5465 22.2954 22.7209 20.9195 21.8699C20.6108 21.6794 20.3151 21.635 19.9679 21.6604C17.6017 21.8572 15.2999 21.5461 13.0945 20.6633C10.439 19.6027 8.28502 17.9389 6.87048 15.4367C5.69383 13.36 5.35949 11.1436 5.9253 8.83196C6.69687 5.69472 8.72224 3.49738 11.5063 1.95416C14.5219 0.290283 17.7817 -0.179669 21.1702 0.35379C24.0315 0.804689 26.5712 1.97322 28.6544 4.00544C29.9404 5.26287 30.892 6.72988 31.3678 8.46997C31.5157 9.01613 31.5993 9.58134 31.715 10.1402ZM17.0745 10.6483C17.0616 9.60675 16.2065 8.76211 15.1584 8.76211C14.1039 8.76211 13.2359 9.63215 13.2424 10.68C13.2488 11.7152 14.1232 12.5662 15.1648 12.5662C16.2193 12.5662 17.0809 11.6961 17.0745 10.6483ZM24.1536 10.6737C24.1729 9.65755 23.3242 8.80021 22.2568 8.76211C21.2281 8.724 20.3151 9.60675 20.3022 10.6483C20.2893 11.6644 21.1445 12.5344 22.199 12.5662C23.2342 12.5979 24.1408 11.7215 24.1536 10.6737Z" fill="url(#paint0_linear_3277_11975)"/>
                        <path d="M5.54584 6.36719C5.36581 6.75458 5.19863 7.08482 5.06361 7.42775C3.62335 11.0413 4.12487 14.4262 6.45243 17.5127C8.28491 19.945 10.7989 21.4374 13.7309 22.263C15.3255 22.7139 16.9522 22.9044 18.6046 22.8345C18.8297 22.8282 19.0547 22.8345 19.3634 22.8345C19.0676 22.9869 18.8425 23.1203 18.6046 23.2283C16.1356 24.3587 13.5509 24.7715 10.8439 24.4667C10.6511 24.4476 10.4132 24.5048 10.246 24.6064C8.90216 25.4129 7.57121 26.2385 6.10523 26.8228C5.65514 27.0006 5.17291 27.1085 4.70997 27.2546C4.50422 27.3181 4.28561 27.3054 4.19559 27.1213C4.1313 26.9752 4.1313 26.7466 4.20202 26.5941C4.68425 25.578 4.99931 24.5238 4.98002 23.387C4.98002 23.1775 4.96073 22.9615 4.94144 22.752C4.92215 22.4852 4.78713 22.3074 4.55566 22.1487C2.63317 20.8087 1.21219 19.0876 0.594939 16.8204C-0.221638 13.8229 0.530641 11.162 2.51743 8.80585C3.30186 7.8723 4.24703 7.12292 5.29508 6.50055C5.37224 6.46245 5.4301 6.43069 5.54584 6.36719Z" fill="url(#paint1_linear_3277_11975)"/>
                    </g>
                    <defs>
                        <linearGradient id="paint0_linear_3277_11975" x1="18.6859" y1="0.144531" x2="18.6859" y2="24.4507" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FF22A1"/>
                            <stop offset="1" stop-color="#FFA3D8"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_3277_11975" x1="9.81669" y1="6.36719" x2="9.81669" y2="27.2892" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FF22A1"/>
                            <stop offset="1" stop-color="#FFA3D8"/>
                        </linearGradient>
                        <clipPath id="clip0_3277_11975">
                            <rect width="31.4286" height="27.1429" fill="white" transform="translate(0.286133 0.144531)"/>
                        </clipPath>
                    </defs>
                </svg>
                <span class="message-count" v-if="total_unread_count">{{total_unread_count}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from "vuex"
import ChatList from "./FpChatList.vue"
import UserChatBox from "./user_chat/UserChatBox.vue"
import GroupChatBox from "./group_chat/GroupChatBox.vue"
import Cookies from 'js-cookie'
export default {
    name: 'FpChat',
    components: {
        ChatList,
        UserChatBox,
        GroupChatBox,
    },
    data() {
        return {
            auth_groups: [],
            auth_chats: [],
            unread_message_count: 0,
        };
    },
    computed: {
        total_unread_count() {
            return this.user_unreads + this.group_unreads + this.unread_message_count;
        },
        ...mapGetters({
            auth_user: 'auth/user',
            chat_user: 'message/chat_user',
            chat_group: 'message/chat_group',
            open_chat: 'message/open_chat',
            user_unreads: 'message/user_unreads',
            group_unreads: 'message/group_unreads',
        })
    },
    mounted() {
        this.subscribeUsers();
        this.subscribeGroups();
        this.unread_message_count = 0;
    },
    beforeDestroy() {
        this.unsubscribeUsers();
        this.unsubscribeGroups();
    },
    methods: {
        toggleChat() {
            this.unread_message_count = 0;
            this.$store.dispatch('message/toggleChat');
        },
        async subscribeGroups() {
            const response = await this.axios.get(`${process.env.chatApiUrl}/group/get_auth_group_ids`);
            if (response.data.status === 'Success') {
                this.auth_groups = response.data.data;
                this.auth_groups.map(group_id => {
                    let msgRef = this.$fire.database.ref(`group_chat/${group_id}/messages`).limitToLast(1);
                    msgRef.on('value', (snapshot) => {
                        snapshot.forEach((doc) => {
                            const item = doc.val();
                            if (this.auth_user && item.user_id === this.auth_user.id && item.sender_id !== this.auth_user.id ) {
                                if (!this.isMuted(group_id)) {
                                    let audio = new Audio('/sound.mp3');
                                    audio.play();
                                }
                                if (!this.open_chat) this.unread_message_count++;
                                this.getGroupUnreads();
                            }
                        });
                    });
                });
            }
        },
        unsubscribeGroups() {
            this.auth_groups.map(group_id => {
                let msgRef = this.$fire.database.ref(`group_chat/${group_id}/messages`).limitToLast(1);
                msgRef.off('value');
            });
        },
        getGroupUnreads() {
            let group_unreads = 0;
            this.auth_groups.map(group_id => {
                let unreadMsgRef = this.$fire.database.ref(`group_chat/${group_id}/messages`);
                unreadMsgRef.orderByChild("user_id").equalTo(this.auth_user.id).once('value')
                    .then((snapshot) => {
                        const unreadCount = snapshot.numChildren();
                        if (unreadCount) {
                            group_unreads++;
                        }
                        this.$store.dispatch('message/setGroupUnreads', group_unreads);
                    });
            });
        },
        isMuted(group_id) {
            let mutedGroups = Cookies.get('muted_groups');
            return mutedGroups && JSON.parse(mutedGroups).includes(group_id);
        },
        groupDeleted(group_id) {
            const groupListComponent = this.$refs.chatList.$refs.groupList;
            if (groupListComponent) {
                groupListComponent.removeGroup(group_id);
            }
        },

        async subscribeUsers() {
            const response = await this.axios.get(`${process.env.chatApiUrl}/chat/get_auth_chat_ids`);
            if (response.data.status === 'Success') {
                this.auth_chats = response.data.data;
                this.getUserUnreads();
                this.auth_chats.map(chat_id => {
                    let msgRef = this.$fire.database.ref(`user_chat/${chat_id}/messages`).limitToLast(1);
                    msgRef.on('value', (snapshot) => {
                        snapshot.forEach((doc) => {
                            const item = doc.val();
                            if (this.auth_user && item.receiver_id === this.auth_user.id ) {
                                let audio = new Audio('/sound.mp3');
                                audio.play();
                                if (!this.open_chat) this.unread_message_count++;
                                if (this.$refs.chatList) {
                                    const userListComponent = this.$refs.chatList.$refs.userList;
                                    if (userListComponent) {
                                        userListComponent.getUnreadCount(chat_id);
                                    }
                                    this.getUserUnreads();
                                }
                            }
                        });
                    });
                });
            }
        },
        unsubscribeUsers() {
            this.auth_chats.map(chat_id => {
                let msgRef = this.$fire.database.ref(`user_chat/${chat_id}/messages`).limitToLast(1);
                msgRef.off('value');
            });
        },
        getUserUnreads() {
            let user_unreads = 0;
            this.auth_chats.map(chat_id => {
                let unreadMsgRef = this.$fire.database.ref(`user_chat/${chat_id}/messages`);
                unreadMsgRef.orderByChild("receiver_id").equalTo(this.auth_user.id).once('value')
                    .then((snapshot) => {
                        const unreadCount = snapshot.numChildren();
                        if (unreadCount) {
                            user_unreads++;
                        }
                        this.$store.dispatch('message/setUserUnreads', user_unreads);
                    });
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    #btn-message-indicator {
        position: fixed;
        bottom: 70px;
        right: 30px;
        width: 64px;
        height: 64px;
        border-radius: 100px;
        cursor: pointer;
        background-color: #F1F1F1;
        border: 2px solid #FF22A1;
        z-index: 99;
        @media (max-width: 600px) {
            width: 50px;
            height: 50px;
            svg {
                width: 30px;
            }
        }
        .message-count {
            position: absolute;
            display: inline-block;
            background-color: #FF22A1;
            color: #FFF;
            border-radius: 20px;
            font-size: 14.4px;
            line-height: 14.4px;
            font-weight: 400;
            padding: 1px 4px;
            border: 1px solid #FFF;
            top: 0px;
            right: -5px;
        }
        @media (max-width: 600px) {
            bottom: 70px;
            right: 12px;
        }
    }
    #message_panel {
        @media (max-width: 600px) {
            display: none;
        }
    }

[data-theme=dark] {
    #btn-message-indicator {
        background-color: #18243E;
    }
}
</style>