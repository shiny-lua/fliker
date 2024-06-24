<template>
    <div class="channel-post-item fp-border-color-1">
        <div class="channel-post-image">
            <img v-if="post.image" :src="post.image" alt="" />
            <img v-else src="@/assets/images/fp-default-bg.webp" alt="" />
        </div>
        <div class="channel-post-detail flex-grow-1">
            <div class="channel-post-user d-flex align-items-center mb-2">
                <img :src="post.user.photo_url" width="38" height="38" class="rounded-circle" />
                <span class="user-name ml-2">{{ post.user.name }}</span>
                <span class="fp-text-color-main ml-3 ml-md-4">{{ $moment(post.created_at).format('DD MMM, YYYY') }}</span>
                <div class="dropdown ml-auto dropdown-context-menu">
                    <a href="javascript:;" class="dropdown-toggle btn-context-menu no-caret" data-toggle="dropdown">
                        <fp-icon name="dots-circle-h" />
                    </a>
                    <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                        <template v-if="isMyPost">
                            <li class="dropdown-item" @click="hide()">
                                <fp-icon name="eye" />
                                <div>
                                    <p>{{ post.status ? 'Hide' : 'Show'}}</p>
                                    <p>{{ post.status ? 'Hide' : 'Show'}} this post from your channel</p>
                                </div>
                            </li>
                            <li class="dropdown-item" @click="edit()">
                                <fp-icon name="edit" />
                                <div>
                                    <p>Edit Post</p>
                                    <p>Update post content</p>
                                </div>
                            </li>
                            <li class="dropdown-item" @click="remove()">
                                <fp-icon name="trash" />
                                <div>
                                    <p>Delete Post</p>
                                    <p>Permanently remove post</p>
                                </div>
                            </li>
                            <li class="dropdown-item" @click="toggleNotification()">
                                <fp-icon :name="post.enable_notification ? 'bell-slash' : 'bell'" />
                                <div>
                                    <p>{{ post.enable_notification ? "Turn off notifications" : "Turn on notifications" }}</p>
                                    <p>{{ post.enable_notification ?  'Disable' : 'Enable'}} notifications for this post</p>
                                </div>
                            </li>
                        </template>
                        <template v-else>
                            <li v-if="!post.channel_joined" class="dropdown-item" @click="join()">
                                <fp-icon name="user-plus" />
                                <div>
                                    <p>Follow this channel</p>
                                    <p>Join Channel</p>
                                </div>
                            </li>
                            <li v-if="!post.is_reported" class="dropdown-item" @click="report()">
                                <fp-icon name="flag" />
                                <div>
                                    <p>Report</p>
                                    <p>Flag for admin review</p>
                                </div>
                            </li>
                            <li v-if="auth_user" class="dropdown-item" @click="bookmark()">
                                <fp-icon name="heart" />
                                <div>
                                    <p>{{ post.is_bookmarked ? "Remove from Favourite" : "Favourite" }}</p>
                                    <p>{{ post.is_bookmarked ?  'Remove' : 'Save'}} this post in your favourite</p>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
            <h6 class="channel-post-title" @click="goToDetail()">{{ post.title }}</h6>
            <p class="fp-text-color-main channel-post-description mb-0">{{ post.detail }}</p>
        </div>
    </div>
</template>
<script>
import Swal from "sweetalert2";
import eventBus from '~/plugins/event-bus';
export default {
    name: 'ChannelPostItem',
    props: {
        post: { type: Object, required: true },
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        isMyPost() {
            return this.auth_user && this.auth_user.id === this.post.user_id;
        },
        reportUrl() {
            return `${process.env.timelineApiUrl}/fliconn/report`;
        },
    },
    created() {
        eventBus.$on('reported', (payload) => {
            this.reported(payload);
        });
    },
    beforeDestroy() {
        eventBus.$off('reported', (payload) => {
            this.reported(payload);
        });
    },
    methods: {
        report() {
            if (!this.auth_user) {
                this.$login(this.$route.path);
                return false;
            }
            const payload = {
                url: this.reportUrl,
                params: {
                    id: this.post.id,
                    model: 'channel_post',
                },
            }
            this.$report(payload);
        },
        reported(payload) {
            if (payload.model === 'channel_post' && payload.id === this.post.id) {
                this.post.is_reported = true;
                if (this.post.enable_notification) {
                    let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "channel_post",
                    });
                }
            }
        },
        async toggleNotification() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/toggle_notification`, {id: this.post.id, model: 'channel_post'});
            if (response.data.status === 'Success') {
                this.post.enable_notification = response.data.data;
                this.$fpSuccess(`You have ${this.post.enable_notification ? "enabled" : "disabled"} notification on this post.`);
            }
        },
        edit() {
            if (!this.isMyPost) return false;
            this.$router.push({
                name: "fliconn.channel.edit_post",
                params: { id: this.post.id },
            });
        },
        remove() {
            if (!this.isMyPost) return false;
            Swal.fire({
                title: "Do you really want to delete this post?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Delete',
                confirmButtonColor: '#DC3545'
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    this.axios
                        .delete(`${process.env.timelineApiUrl}/channel/delete_post/${this.post.id}`)
                        .then((response) => {
                            if (response.data.status == "Success") {
                                this.$fpSuccess("Your post has been deleted successfully!");
                                this.$emit("deleted");
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        async hide() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/change_status`, { id: this.post.id, model: 'channel_post' });
            this.post.status = response.data.data;
            this.$fpSuccess(this.post.status ? "Your post is now visible on your channel." : "Your post is hidden from your channel.");
        },
        bookmark() {
            if (!this.auth_user) {
                this.$login(this.$route.path);
                return false;
            }
            this.axios
                .post(`${process.env.timelineApiUrl}/fliconn/bookmark`, {
                    id: this.post.id,
                    model: 'channel_post',
                })
                .then((response) => {
                    if (response.data.status == "Success") {
                        this.post.is_bookmarked = response.data.data;
                        if (!response.data.data) {
                            this.$emit('bookmark-removed');
                        } else if (this.post.enable_notification) {
                            let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                            notiFb.set({
                                notifier_id: this.auth_user.id,
                                type: "bookmark_post",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        async join() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/join`, {channel_id: this.post.channel_id})
                this.$fpSuccess(response.data.message)
                eventBus.$emit('joined_channel', {id: this.post.channel_id});
                this.post.channel_joined = true;
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
        goToDetail() {
            this.$router.push({name: 'fliconn.channel.post_detail', params: {slug: this.post.slug}});
        }
    }
}
</script>
<style lang="scss" scoped>
    .channel-post-item {
        position: relative;
        display: flex;
        border-style: solid;
        border-width: 1px;
        padding: 16px;
        border-radius: 8px;
        cursor: pointer;
        .channel-post-image {
            width: 140px;
            height: 125px;
            min-width: 140px;
            @media (max-width: 600px) {
                width: 90px;
                height: 90px;
                min-width: 90px;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 6px;
            }
        }
        .channel-post-title {
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
        }
        .channel-post-detail {
            margin-left: 12px;
            .channel-post-description {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        @media (max-width: 600px) {
            padding: 8px;
            .channel-post-image {
                width: 90px;
                height: 90px;
                min-width: 90px;
            }
            .channel-post-user {
                font-size: 13.6px;
                img {
                    width: 30px;
                    height: 30px;
                }
            }
            h6 {
                font-size: 14.4px;
                margin-bottom: 4px;
            }
            .channel-post-description {
                font-size: 13px;
                font-weight: 400;
                line-height: 1.2;
            }
        }
    }
</style>