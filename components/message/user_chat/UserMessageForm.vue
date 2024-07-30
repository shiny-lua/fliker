<template>
    <div class="user-message-form">
        <div v-if="form.progress && form.files" class="progress">
            <div class="progress-bar" :style="{ width: `${form.progress.percentage}%` }"></div>
        </div>
        <form class="chat-form px-0 px-md-2 py-2" @submit.prevent="formSubmit">
            <textarea ref="msgInput" v-model="form.content" rows="1"
                      class="form-control chat-input fp-bg-color-2 bg-revert-sm flex-grow-1"
                      :placeholder="!chat.is_blocked ? 'Send message...' : `Chat has been disabled`" required
                      maxlength="300" @keydown="sendMessage" :disabled="chat.is_blocked"></textarea>
            <div v-if="!chat.is_blocked" class="message-actions">
                <label class="mb-0">
                    <input type="file" multiple hidden accept="image/*,video/*,.pdf,.doc,.docx" @change="handleFiles" />
                    <fp-icon name="attachment" class="fp-fs-18 fp-text-active" />
                </label>
                <label class="mb-0 ml-1">
                    <reaction-emoji @selected="selectEmoji" />
                </label>
                <label class="mx-1 mb-0">
                    <fp-icon name="gif" class="fp-fs-16" />
                </label>
            </div>
            <button type="submit" class="btn fp-btn-gradient ml-2" :disabled="chat.is_blocked || form.content.length <= 0">
                <fp-icon name="share" class="fp-fs-20" />
            </button>
        </form>
    </div>
</template>
<script>
import Form from "vform";
import ReactionEmoji from "~/components/message/user_chat/Reaction.vue";
export default {
    name: 'UserMessageForm',
    props: {
        chat: { type: Object, reuired: true },
    },
    components: {
        ReactionEmoji,
    },
    data() {
        return {
            form: new Form({
                id: '',
                chat_id: this.chat.id,
                content: '',
                files: null
            }),
            acceptable: 'image/*',
        }
    },
    computed: {
        firstName() {
            return this.chat.name.split(' ')[0];
        }
    },
    methods: {
        sendMessage(event) {
            let message = event.target.value
            if (event.keyCode == 13 && !event.shiftKey) {
                if (message.trim()) {
                    this.submit();
                    event.preventDefault();
                }
            }
        },
        async submit() {
            const response = await this.form.post(`${process.env.chatApiUrl}/chat/save_message`);
            if (response.data.status === 'Success') {
                const message = response.data.data;
                this.$emit('submit', { message: message });
                this.form.reset();
                this.$refs.msgInput.focus();
                if (message.notification_sent) {
                    let notiFb = this.$fire.database.ref("notifications/" + message.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "user_message",
                    });
                }
            }
        },
        handleFiles(event) {
            const files = event.target.files
            this.form.files = files;
            if (files.length) {
                this.submit();
            }
        },
        formSubmit() {
            if (this.form.content.trim()) {
                this.submit();
            }
        },
        async selectEmoji(emoji) {
            console.log(emoji)
            this.form.content += emoji;
        },
    }
}
</script>
<style lang="scss" scoped>
.user-message-form {
    .chat-form {
        display: flex;
        align-items: center;

        .chat-input {
            resize: none;
            border: none;
            font-size: 14.4px;
            font-weight: 400;
            flex-grow: 1;
            scrollbar-width: none;
            border-radius: 8px;
            padding: 8.3px 84px 8.3px 12px;

            &::-webkit-scrollbar {
                display: none;
            }

            &:focus {
                border: none;
                outline: none;
                box-shadow: none;
            }

            &::placeholder {
                font-weight: 400;
            }
        }
    }

    .progress {
        height: 2px;

        &-bar {
            height: 2px;
        }
    }

    .message-actions {
        display: flex;
        align-items: center;
        margin-left: -80px;
    }
}
</style>