<template>
    <div class="user-messages position-relative">
        <div class="user-message-list" v-chat-scroll="{
            always: false,
            smooth: true,
            scrollonremoved:true,
            smoothonremoved: false,
        }">
            <infinite-loading :distance="50"
                direction="top"
                :identifier="infiniteId"
                @infinite="getMessages"
            >
                <div slot="no-more"></div>
                <div class="text-center" style="color: #C3C3C3;" slot="no-results">{{ messages.length ? '' : 'No messages!'}}</div>
                <div slot="spinner" class="pt-3">
                    <img src="~assets/images/logo_loading.gif" width="40" alt="" />
                </div>
            </infinite-loading>
            <div class="d-flex flex-column-reverse">
                <message-item v-for="(message, index) in messages"
                    :key="index"
                    :message="message"
                    class="mb-3"
                    @click-image="openGallery"
                ></message-item>
            </div>
        </div>
        <message-form :chat="chat"
             @submit="submitted"
        ></message-form>
        <light-box ref="groupMsgLightBox" :media="medias" :show-light-box="false"></light-box>
    </div>
</template>
<script>
import MessageForm from './UserMessageForm.vue'
import MessageItem from './UserMessageItem.vue'
import { mapGetters } from "vuex";
import LightBox from "vue-it-bigger";
import("vue-it-bigger/dist/vue-it-bigger.min.css");
export default {
    name: 'UserMessages',
    props: {
        chat: { type: Object, required: true },
    },
    components: {
        MessageForm,
        MessageItem,
        LightBox,
    },
    data() {
        return {
            messages: [],
            infiniteId: +new Date(),
            page: 1,
            firebaseSubscribed: false,
        }
    },
    computed: {
        ...mapGetters({
            auth_user: 'auth/user',
        }),
        medias() {
            let mediaMessages = this.messages.filter(m => m.images.length > 0);
            let medias = [];
            mediaMessages.map(m => {
                m.images.map(image => {
                    if (['video', 'image'].includes(image.mime)) {
                        let item = {
                            type: image.mime,
                            src: image.src_url,
                            thumb: image.thumbnail_url,
                        }

                        if (image.mime === 'video') {
                            const extension = image.src.substring(image.src.lastIndexOf('.') + 1);
                            item.thumb = image.thumbnail ? image.thumbnail_url : '',
                            item.sources = [
                                {
                                    src: image.src_url,
                                    type: `video/${extension}`
                                }
                            ]
                            item.width = 800;
                            item.height = 600;
                            item.autoplay = true;
                        }
                        medias.push(item);
                    }
                });
            });
            return medias;
        }
    },
    mounted() {
        this.readAll();
    },
    beforeDestroy() {
        let receiveMsgRef = this.$fire.database.ref(`user_chat/${this.chat.id}/messages`).limitToLast(1);
        receiveMsgRef.off();

        let readMsgRef = this.$fire.database.ref(`user_chat/${this.chat.id}/messages`);
        readMsgRef.off();
    },
    methods: {
        initFirebase() {
            this.firebaseSubscribed = true;
            ////// Received Message
            let receiveMsgRef = this.$fire.database.ref(`user_chat/${this.chat.id}/messages`).limitToLast(1);
            receiveMsgRef.on('value', (snapshot) => {
                snapshot.forEach(async (doc) => {
                    const item = doc.val();
                    if (this.auth_user && item.receiver_id === this.auth_user.id) {
                        let audio = new Audio('/sound.mp3');
                        audio.play();
                        doc.ref.remove();
                        this.readAll();
                    }
                    if (this.messages.length === 0 || this.messages[0].id < item.message_id) {
                        const message = await this.getMessage(item.message_id);
                        this.messages.unshift(message);
                    }
                });
            });

            ////// Read all Message
            let readMsgRef = this.$fire.database.ref(`user_chat/${this.chat.id}/messages`);
            readMsgRef.on('value', (snapshot) => {
                snapshot.forEach((doc) => {
                    let item = doc.val();
                    if (this.auth_user && item.receiver_id === this.auth_user.id) {
                        doc.ref.remove();
                    }
                });
                this.$emit('read');
            });
        },
        async getMessages($state) {
            try {
                let payload = {
                    page: this.page,
                    chat_id: this.chat.id
                }
                const response = await this.axios.post(`${process.env.chatApiUrl}/chat/get_messages`, payload);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.messages = [];
                    if (result.data.length) {
                        this.page++;
                        this.messages.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                    if (!this.firebaseSubscribed) {
                        this.initFirebase();
                    }
                }
            } catch (error) { }
        },
        async getMessage(id) {
            const response = await this.axios.get(`${process.env.chatApiUrl}/chat/get_message/${id}`);
            return response.data.data;
        },
        submitted(data) {
            this.messageSent(data.message);
        },
        messageSent(message) {
            let joinData = this.$fire.database.ref(`user_chat/${this.chat.id}/messages`).push();
            joinData.set({
                receiver_id: this.chat.receiver_id,
                message_id: message.id,
                sender_id: this.auth_user.id,
            });
        },
        openGallery(thumbnail_url) {
            const index = this.medias.findIndex(i => i.thumb === thumbnail_url);
            if (index !== -1) {
                this.$refs.groupMsgLightBox.showImage(index);
            }
        },
        readAll() {
            this.axios.get(`${process.env.chatApiUrl}/chat/read_all/${this.chat.id}`);
        }
    }
}
</script>
<style lang="scss" scoped>
    .user-message-list {
        height: 355px;
        overflow-y: auto;
        padding: 8px 12px;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
</style>