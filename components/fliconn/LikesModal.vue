<template>
    <fp-modal :name="modalName"
        ref="likesModal"
        title="All Likes"
        :width="400"
        @before-open="load()"
    >
        <div class="liked-users">
            <div v-if="loading" class="text-center">
                <img src="~/assets/images/logo_loading.gif" width="36" height="34" alt="">
            </div>
            <div v-for="(item, index) in likes"
                 :key="index"
                 class="user-item"
            >
                <img :src="item.photo_url" width="35" height="35" alt="" />
                <span class="mr-auto">{{item.name}} <span v-if="auth_user.id === item.id" class="text-muted">(You)</span></span>
                <a v-if="!item.is_following && !item.is_requested_follow && item.id !== auth_user.id"
                     href="javascript:;"
                     class="btn btn-sm bt-outline-success"
                     @click.prevent="follow(item)"
                >Follow</a>
                <a v-else-if="item.is_requested_follow" href="javascript:;" class="btn btn-sm btn-outline-success">Follow Requested</a>
            </div>
        </div>
    </fp-modal>
</template>
<script>
import FpModal from "../ui/Modal.vue";
export default {
    name: 'LikesModal',
    props: {
        modalName: { type: String, required: true },
        url: { type: String, required: true },
        params: { type: Object, default: () => new Object()},
    },
    components: {
        FpModal,
    },
    data() {
        return {
            likes: [],
            loading: false,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    methods: {
        async load() {
            this.likes = [];
            this.loading = true;
            try {
                const response = await this.axios.post(this.url, this.params);
                if (response.data.status === 'Success') {
                    this.likes = response.data.data;
                }
            } catch (error) { }
            this.loading = false;
        },
        open() {
            this.$refs.likesModal.open();
        },
        async follow(user) {
            const data = await this.$store.dispatch("requestFollow", user.id);
            if (data.status === "Success") {
                this.$toast.success(data.message);
                user.is_requested_follow = true;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .user-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        &:last-child {
            margin-bottom: 0;
        }
        img {
            border-radius: 100%;
            object-fit: cover;
            margin-right: 6px;
            border: solid 2px #004080;
        }
        .btn {
            font-size: 13.6px;
            padding: 2px 8px 3px;
        }
    }
</style>