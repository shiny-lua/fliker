<template>
    <div class="group-message-form">
        <div v-if="form.progress && form.files" class="progress">
            <div class="progress-bar" :style="{ width: `${form.progress.percentage}%` }"></div>
        </div>
        <form class="chat-form px-0 px-md-2 py-2" @submit.prevent="formSubmit">
            <textarea ref="msgInput"
                 v-model="form.detail"
                 rows="1"
                 class="form-control chat-input fp-bg-color-2 bg-revert-sm flex-grow-1"
                 placeholder="Send message..."
                 required
                 maxlength="300"
                 @keydown="sendMessage"
            ></textarea>
            <div class="message-actions">
                <label class="mb-0">
                    <input type="file" multiple hidden accept="image/*,video/*,.pdf,.doc,.docx" @change="handleFiles" />
                    <fp-icon name="attachment" class="fp-fs-18 fp-text-active" />
                </label>
                <label class="mb-0 ml-1">
                    <fp-icon name="emoji" class="fp-fs-18 fp-text-active" />
                </label>
                <label class="mx-1 mb-0">
                    <fp-icon name="gif" class="fp-fs-16" />
                </label>
            </div>
            <button type="submit" @click.prevent="sendMessage" class="btn fp-btn-gradient ml-2">
                <fp-icon name="share" class="fp-fs-20" />
            </button>
        </form>
    </div>
</template>
<script>
import Form from "vform";
export default {
    name: 'GroupMessageForm',
    props: {
        id: { type: Number, reuired: true },
        editable: { type: Object, reuired: false },
    },
    data() {
        return {
            form: new Form({
                id: '',
                group_id: this.id,
                detail: '',
                files: null
            }),
            acceptable: 'image/*',
            showIconPopUp: false,
        }
    },
    watch: {
        editable(value) {
            if (value) {
                this.form.id = value.id;
                this.form.detail = value.detail;
            } else {
                this.form.reset();
            }
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
            const response = await this.form.post(`${process.env.chatApiUrl}/group/save_message`);
            if (response.data.status === 'Success') {
                this.$emit('submit', {mode: this.editable ? 'edit' : 'add', message: response.data.data });
                this.form.reset();
                this.$refs.msgInput.focus();
            }
        },
        handleFiles(event) {
            const files = event.target.files
            this.form.files = files;
            if (files.length) {
                this.submit();
            }
            this.showIconPopUp = false;
        },
        formSubmit() {
            if (this.form.detail.trim()) {
                this.submit();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .group-message-form {
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
                background-color: #F8F8F8;
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