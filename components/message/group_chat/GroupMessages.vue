<template>
    <div class="group-messages position-relative">
        <div class="group-message-list" v-chat-scroll="{
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
                <div class="text-center" style="color: #C3C3C3;" slot="no-results">{{ messages.length ? '' : 'No group messages!'}}</div>
                <div slot="spinner" class="pt-3">
                    <img src="~assets/images/logo_loading.gif" width="40" alt="" />
                </div>
            </infinite-loading>
            <div class="d-flex flex-column-reverse">
                <message-item v-for="(message, index) in messages"
                    :key="index"
                    :message="message"
                    :isPrimaryAdmin="group.isPrimaryAdmin"
                    class="mb-3"
                    @deleted="messages.splice(index, 1)"
                    @edit="edit"
                    @click-image="openGallery"
                ></message-item>
                <div v-if="group.available_hours" class="group-available-hours fp-bg-color-2 bg-revert-sm">
                    <p class="mb-0">
                        Admin enabled disappearing messages. Messages disappear from this chat {{ Math.round(group.available_hours / 24) }} {{group.available_hours > 24 ? 'days' : 'day'}} after they are sent.
                    </p>
                </div>
            </div>
        </div>
        <message-form v-if="messageable"
             :id="group.id"
             :editable="editable"
             @submit="submitted"
        ></message-form>
        <div v-else class="message-disabled fp-bg-color-2 fp-text-color-main">
            <p>1-way communication enabled.
            Only Group <a href="javascript:;" @click.prevent="$emit('change-tab', 'Members')">admins</a> can send messages.</p>
        </div>
        <light-box ref="groupMsgLightBox" :media="medias" :show-light-box="false"></light-box>
    </div>
</template>
<script>
import MessageForm from './GroupMessageForm.vue'
import MessageItem from './GroupMessageItem.vue'
import { mapGetters } from "vuex";
import Cookies from 'js-cookie'
import LightBox from "vue-it-bigger";
import("vue-it-bigger/dist/vue-it-bigger.min.css");
export default {
    name: 'GroupMessages',
    props: {
        group: { type: Object, required: true },
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
            editable: null,
            firebaseSubscribed: false,
        }
    },
    computed: {
        ...mapGetters({
            auth_user: 'auth/user',
        }),
        messageable() {
            return this.group.is_primary_admin || this.group.is_admin || (this.group.is_user && this.group.repliable);
        },
        isMuted() {
            let mutedGroups = Cookies.get('muted_groups');
            return mutedGroups && JSON.parse(mutedGroups).includes(this.group.id);
        },
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
    beforeDestroy() {
        let receiveMsgRef = this.$fire.database.ref(`group_chat/${this.group.id}/messages`).limitToLast(1);
        receiveMsgRef.off();

        let readMsgRef = this.$fire.database.ref(`group_chat/${this.group.id}/messages`);
        readMsgRef.off();
    },
    methods: {
        initFirebase() {
            ////// Received Message
            let receiveMsgRef = this.$fire.database.ref(`group_chat/${this.group.id}/messages`).limitToLast(1);
            receiveMsgRef.on('value', (snapshot) => {
                snapshot.forEach(async (doc) => {
                    let item = doc.val();
                    if (this.auth_user && item.user_id == this.auth_user.id) {
                        if (this.messages.length === 0 || item.message_id > this.messages[0].id) {
                            if (this.auth_user && this.auth_user.id !== item.sender_id && this.auth_user.id === item.user_id && !this.isMuted) {
                                let audio = new Audio('/sound.mp3');
                                audio.play();
                            }
                            const message = await this.getMessage(item.message_id);
                            this.messages.unshift(message);
                        }
                        doc.ref.remove();
                    }
                });
                this.$emit('read');
            });

            ////// Read all Message
            let readMsgRef = this.$fire.database.ref(`group_chat/${this.group.id}/messages`);
            readMsgRef.on('value', (snapshot) => {
                snapshot.forEach((doc) => {
                    let item = doc.val();
                    if (this.auth_user && item.user_id == this.auth_user.id) {
                        doc.ref.remove();
                    }
                });
            });
        },
        async getMessages($state) {
            try {
                let payload = {
                    page: this.page,
                    id: this.group.id
                }
                const response = await this.axios.post(`${process.env.chatApiUrl}/group/get_messages`, payload);
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
            try {
                const response = await this.axios.get(`${process.env.chatApiUrl}/group/get_message/${id}`);
                return response.data.data;
            } catch (error) { }
        },
        submitted(data) {
            if (data.mode === 'add') {
                this.messageSent(data.message);
            } else if (data.mode === 'edit') {
                const index = this.messages.findIndex(i => i.id === data.message.id);
                this.messages[index].detail = data.message.detail;
                this.editable = null;
            }
        },
        edit(item) {
            this.editable = item;
        },
        messageSent(message) {
            this.group.group_users.map(user_id => {
                let joinData = this.$fire.database.ref(`group_chat/${this.group.id}/messages`).push();
                joinData.set({
                    user_id: user_id,
                    message_id: message.id,
                    sender_id: this.auth_user.id,
                });
            })
        },
        openGallery(thumbnail_url) {
            const index = this.medias.findIndex(i => i.thumb === thumbnail_url);
            if (index !== -1) {
                this.$refs.groupMsgLightBox.showImage(index);
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .group-available-hours {
        padding: 8px 16px;
        border-radius: 8px;
        max-width: 360px;
        margin: auto;
        p {
            font-size: 13px;
            font-weight: 400;
            line-height: 1.2;
            margin-bottom: 0;
        }
    }
    .group-message-list {
        height: 355px;
        overflow-y: auto;
        padding: 8px 12px;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    .message-disabled {
        margin: 4px 12px;
        border-radius: 6px;
        p {
            font-size: 13.6px;
            font-weight: 400;
            line-height: 1.2;
            margin-bottom: 0;
            padding: 4px 12px;
            white-space: pre-line;
            border-radius: 8px;
        }
    }
</style>