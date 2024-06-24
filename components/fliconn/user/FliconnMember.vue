<template>
    <div class="fliconn-member fp-card p-0" @click="openProfile()">
        <div class="fliconn-member-cover-image">
            <img v-if="user.cover_image" class="cover-image" :src="user.cover_image_url" alt="" />
            <img v-else class="cover-image" src="@/assets/images/fp-default-bg.webp" alt="" />
        </div>
        <div class="fliconn-member-info">
            <img class="fliconn-member-photo-image fp-border-color fp-bg-color-1" :src="user.photo_url" />
            <h6 class="name mb-0">
                {{ user.name }}
            </h6>
        </div>
        <div v-if="auth_user && user.id != auth_user.id" class="actions d-flex">
            <a href="javascript:;" class="btn fp-btn-outline flex-grow-1 mr-2" @click.stop="openChat()">
                <fp-icon name="message" class="fp-fs-18 fp-text-active mt-n-2px" />
                Message
            </a>
            <a v-if="removable" href="javascript:;" class="btn fp-btn-gradient px-2" @click.stop="remove()">
                <fp-icon name="trash" class="fp-fs-18" />
            </a>
            <a v-else-if="!user.is_following" href="javascript:;" class="btn fp-btn-gradient px-2" @click.stop="follow()">
                <fp-icon name="user-plus" class="fp-fs-18" />
            </a>
            <a v-else-if="user.is_following" href="javascript:;" class="btn fp-btn-gradient px-2" @click.stop="unfollow()">
                <fp-icon name="user-minus" class="fp-fs-18" />
            </a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'FliconnMember',
    props: {
        removable: { type: Boolean, default: false },
        user: { type: Object, required: true },
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
        enable_chat() {
            return this.$store.getters["enable_chat"];
        }
    },
    methods: {
        openProfile() {
            return this.$router.push({name: 'fliconn.profile', params: {username: this.user.username}});
        },
        remove(item) {
            this.$emit('remove', item);
        },
        openChat() {
            if (!this.auth_user) return this.$login(this.$route.path);
            if (this.user.is_requested_follow) return false;
            if (!this.user.is_following) {
                this.user.is_requested_follow = this.follow(this.user);
                return false;
            }
            if (!this.enable_chat) {
                this.$store.dispatch("setEnableChat", true);
            }
            let payload = {
                user_id: this.user.id,
                is_online: this.user.is_online,
            }
            this.$store.dispatch("message/openUserChatBox", payload);
        },
        async follow() {
            if (!this.auth_user) return this.$router.push({ name: "login" });
            const data = await this.$store.dispatch("requestFollow", this.user.id);
            if (data.status === "Success") {
                this.$fpSuccess(data.message);
                this.user.is_requested_follow = true;
                let notiFb = this.$fire.database.ref("notifications/" + this.user.id).push();
                notiFb.set({ notifier_id: this.auth_user.id, type: "follow_request" });
                return true;
            } else {
                return false;
            }
        },
        async unfollow() {
            const response = await this.axios.post(`/user/unfollow`, {
                user_id: this.user.id,
                follower_id: this.auth_user.id,
            });
            if (response.data.status === "Success") {
                this.$toast.success("Unfollowed successfully!");
                this.user.is_following = false;
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .fliconn-member {
        padding-bottom: 12px !important;
        height: 100%;
        cursor: pointer;
        .fliconn-member-cover-image {
            border-radius: 12px 12px 0 0;
            width: 100%;
            height: 130px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            @media (max-width: 600px) {
                height: 110px;
            }
        }
        .fliconn-member-photo-image {
            position: relative;
            width: 76px;
            height: 76px;
            border-radius: 8px;
            object-fit: cover;
            border-style: solid;
            border-width: 2px;
            margin-top: -33px;
            @media (max-width: 600px) {
                width: 66px;
                height: 66px;
                border-radius: 6px;
            }
        }
        .fliconn-member-info {
            display: flex;
            align-items: flex-end;
            padding: 0 10px;
            .name {
                font-size: 12px;
                margin-left: 8px;
            }
        }
        .actions {
            margin-top: 12px;
            padding: 0 10px;
            .btn {
                font-weight: 400;
                font-size: 13.6px;
                padding: 6px 3px;
                border-radius: 6px;
            }
            .btn-outline-success {
                &:hover {
                    svg {
                        color: #FFF;
                    }
                }
            }
        }
    }
</style>