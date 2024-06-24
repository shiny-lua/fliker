<template>
    <div class="group-message-item" :class="auth_user && auth_user.id === message.user_id && 'is-mine'">
        <div v-if="message.is_new_date" class="timestamp"><span class="fp-bg-color-1">{{ $moment(message.created_at).format('MMMM Do, YYYY') }}</span></div>
        <div class="message-content">
            <img :src="message.image_url" class="user-photo" alt="">
            <div class="message-info">
                <div class="message-user">
                    <span class="user-name ml-2">{{ message.user_first_name }}</span>
                </div>
                <div class="message-detail fp-bg-color-2 bg-revert-sm"
                     :class="{
                        'has-media': message.images.length,
                        'no-detail': !message.content,
                     }"
                >
                    <p v-if="message.content">{{ message.content }}</p>
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
    name: 'UserMessageItem',
    props: {
        message: { type: Object, required: true },
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
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