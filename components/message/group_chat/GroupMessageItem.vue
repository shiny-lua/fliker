<template>
    <div class="group-message-item" :class="auth_user && auth_user.id === message.user_id && 'is-mine'">
        <div v-if="message.is_new_date" class="timestamp"><span class="fp-bg-color-1">{{ $moment(message.created_at).format('MMMM Do, YYYY') }}</span></div>
        <div class="message-content">
            <img :src="message.user.photo_url" class="user-photo" alt="">
            <div class="message-info">
                <div class="message-user">
                    <span class="user-name ml-2">{{ message.user.first_name }}</span>
                    <div v-if="auth_user && message.user_id === auth_user.id" class="actions">
                        <div class="dropdown dropdown-group">
                            <a href="javascript:;" class="dropdown-toggle no-caret fp-text-color-main" data-toggle="dropdown"><fa icon="ellipsis-h" /></a>
                            <div class="dropdown-menu dropdown-menu-sm">
                                <a href="javascript:;" class="dropdown-item" @click.prevent="edit()">Edit</a>
                                <a href="javascript:;" class="dropdown-item" @click.prevent="remove()">Delete</a>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="isPrimaryAdmin" class="actions mr-3">
                        <div class="dropdown dropdown-group">
                            <a href="javascript:;" class="dropdown-toggle no-caret fp-text-color-main" data-toggle="dropdown">
                                <fa icon="ellipsis-h" />
                            </a>
                            <div class="dropdown-menu dropdown-menu-sm">
                                <a href="javascript:;" class="dropdown-item" @click.prevent="block()">Block</a>
                                <a href="javascript:;" class="dropdown-item" @click.prevent="report()">Report</a>
                                <a href="javascript:;" class="dropdown-item" @click.prevent="contact()">Contact {{message.user.first_name}}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="message-detail fp-bg-color-2 bg-revert-sm"
                     :class="{
                        'has-media': message.images.length,
                        'no-detail': !message.detail,
                     }"
                >
                    <p v-if="message.detail">{{ message.detail }}</p>
                    <div v-if="message.images.length" class="mt-1">
                        <div class="row mx-n1 mb-n1">
                            <div v-for="(item, index) in message.images"
                                 :key="index"
                                 class="px-1 mb-2"
                                 :class="{
                                    'col-12': message.images.length === 1,
                                    'col-6': message.images.length === 2,
                                    'col-4': message.images.length > 2,
                                 }"
                            >
                                <div class="media-container">
                                    <img v-if="item.thumbnail_url" :src="item.thumbnail_url" alt="" @click="$emit('click-image', item.thumbnail_url)" />
                                    <img v-else-if="item.mime === 'pdf'" src="~/assets/images/icons/pdf.png" alt="" @click="downloadFile(item)" />
                                    <img v-else-if="item.mime === 'word'" src="~/assets/images/icons/word.png" alt="" @click="downloadFile(item)" />
                                </div>
                                <p v-if="item.file_name && (item.mime === 'pdf' || item.mime === 'word')"
                                     class="file-name"
                                >{{ item.file_name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="created_at mb-0">{{ $moment(message.created_at).format('h:mm A') }}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'GroupMessageItem',
    props: {
        message: { type: Object, required: true },
        isPrimaryAdmin: { type: Boolean, default: false },
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        edit() {
            this.$emit('edit', this.message);
        },
        async remove() {
            if (this.auth_user.id != this.message.user_id) return false;
            const response = await this.axios.delete(`${process.env.chatApiUrl}/group/delete_message/${this.message.id}`)
            if (response.data.status == "Success") {
                this.$emit("deleted");
            }
        },
        block() {

        },
        report() {

        },
        contact() {

        },
        downloadFile(item) {
            const url = item.src_url;
            const filename = url.split("/").pop();
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank'
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
            }, 100);
        }
    }
}
</script>