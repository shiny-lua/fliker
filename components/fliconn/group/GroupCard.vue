<template>
    <div class="fp-card group-card">
        <div class="card-img-top wallpaper">
            <img v-if="group.image" :src="group.wallpaper" :alt="group.title" class="img-wallpaper" />
            <img v-else class="img-wallpaper" src="@/assets/images/fp-default-bg.webp" alt="" />
            <img :src="group.user.photo_url" alt="" class="img-user fp-border-color" />
        </div>
        <div class="card-body detail">
            <h6 class="title">{{group.title}}</h6>
            <div class="d-md-flex align-items-center">
                <div class="joined mr-auto">
                    <div class="joined-users">
                        <img v-for="(item, index) in group.joins.slice(0, 5)"
                             :src="item.photo_url"
                             alt=""
                             :key="index"
                             class="img-join fp-border-color-1"
                        />
                        <span class="ml-2 fp-text-color-main" style="font-size: 13.6px;">{{$nFormatter(group.joined_count)}} {{group.type === 'group' ? 'Joined' : 'Following'}}</span>
                    </div>
                </div>
                <div v-if="auth_user && group.user_id === auth_user.id">
                    <a href="javascript:;" class="btn-edit fp-text-color-main" @click="edit()"><fp-icon name="setting" class="fp-fs-26" /></a>
                </div>
                <div v-else-if="auth_user" class="actions">
                    <a v-if="group.is_joined" href="javascript:;" class="btn fp-btn-outline" @click="exit()"><fp-icon name="user-minus" /> {{group.type === 'group' ? 'Exit Group' : 'Unfollow'}}</a>
                    <a v-else-if="group.is_join_requested" href="javascript:;" class="btn fp-btn-outline" @click="cancelRequest()"><fp-icon name="user-minus" /> Cancel Request</a>
                    <a v-else href="javascript:;" class="btn fp-btn-outline" @click="join()"><fp-icon name="user-plus" /> {{group.type === 'group' ? 'Join' : 'Follow'}}</a>
                    <a href="javascript:;" class="btn fp-btn-gradient ml-2" @click="openChat()"><fp-icon name="comment-dots" /> Message</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    name: 'GroupCard',
    props: {
        group: { type: Object, required: true },
    },
    computed: mapGetters({
        auth_user: 'auth/user',
        enable_chat: 'enable_chat',
    }),
    methods: {
        async join() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/join`, {group_id: this.group.id})
                if (response.data.success === 'Success') {
                    if (this.group.enable_notification) {
                        this.$store.dispatch('fetchNotifications');
                        let notiFb = this.$fire.database.ref('notifications/' + this.group.user_id).push();
                        notiFb.set({
                            notifier_id: this.auth_user.id,
                            type: 'join_group',
                        });
                    }
                    this.$emit('fetch');
                }
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
        async exit() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/exit`, {group_id: this.group.id})
                this.$emit('fetch');
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
        async cancelRequest() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/cancel_request`, {group_id: this.group.id})
                this.$emit('fetch');
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
        openChat() {
            if (!this.enable_chat) {
                this.$store.dispatch('setEnableChat', true);
            }
            let payload = {
                user_id: this.group.user_id,
                is_online: this.group.user.is_online,
            }
            this.$store.dispatch("message/openUserChatBox", payload);
        },
        edit() {
            this.$router.push({name: 'fliconn.group.edit', params: {id: this.group.id}})
        }
    }
}
</script>
<style lang="scss" scoped>
    .group-card {
        padding: 0;
        overflow: hidden;
        .detail {
            padding: 80px 40px 20px 40px;
            @media (max-width: 600px) {
                padding: 60px 16px 16px 16px;
            }
            .title {
                font-size: 18px;
                margin-bottom: 20px;
            }
        }
        .wallpaper {
            height: 250px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #c3c3c3;
            border-radius: 12px;
            .img-wallpaper {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 12px 12px 0 0;
            }
            .img-user {
                width: 120px;
                height: 120px;
                position: absolute;
                bottom: -60px;
                left: 16px;
                border-style: solid;
                border-width: 4px;
                border-radius: 100%;
                object-fit: cover;
                @media (max-width: 600px) {
                    width: 100px;
                    height: 100px;
                    bottom: -50px;
                    left: 30px;
                }
            }
        }
        .btn-message {
            color: #28A745;
            padding: 7px 20px 5px;
            background: transparent;
            border: solid 1px #28A745;
            font-weight: 500;
            text-decoration: none;
            border-radius: 10px;
            cursor: pointer;
            &:hover {
                text-decoration: none;
            }
        }
        .joined-users {
            padding-left: 10px;
            margin-bottom: 6px;
            img {
                border-radius: 100%;
                width: 38px;
                height: 38px;
                object-fit: cover;
                margin-left: -15px;
                border: solid 2px #FFF;
            }
        }

        .btn-edit {
            font-size: 22px;
        }
        .actions {
            .btn {
                font-size: 14.4px;
                svg {
                    font-size: 18px;
                }
            }
        }
    }
</style>