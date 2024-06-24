<template>
    <div class="channel-detail pt-2 pt-md-4">
        <div v-if="channel" class="fp-card fp-sm-no-card">
            <div class="d-flex">
                <div class="channel-image">
                    <img v-if="channel.image" :src="channel.image_url" width="100%" height="100%" alt="" />
                    <img v-else src="@/assets/images/fp-default-bg.webp" width="100%" height="100%" alt="" />
                </div>
                <div class="channel-information ml-3 mt-2">
                    <h6>{{ channel.title }}</h6>
                    <div class="fp-text-color-main d-md-flex align-items-center mb-3">
                        <p class="mb-0">@{{ channel.user.username }}</p>
                        <fa icon="circle" class="divider-dot d-none d-md-block" />
                        <p class="mb-0">{{ $nFormatter(channel.joined_count) }} People Joined</p>
                    </div>
                    <div v-if="isMyChannel" class="actions">
                        <router-link :to="{name: 'fliconn.channel.create_post', params: {channel_id: channel.id}}" class="btn fp-btn-outline btn-join px-4">Create new Post</router-link>
                        <router-link :to="{name: 'fliconn.channel.edit', params: {id: channel.id}}" class="fp-fs-24 ml-3 fp-text-color-main"><fp-icon name="setting" /></router-link>
                    </div>
                    <div v-else class="actions">
                        <a v-if="channel.is_joined"
                             href="javascript:;"
                             class="btn fp-btn-gradient btn-join px-4"
                             @click.prevent="leave()"
                        >
                            <span class="leave">Leave</span>
                            <span class="joined">Joined</span>
                        </a>
                        <a v-else href="javascript:;" class="btn fp-btn-gradient btn-join px-4" @click.stop="join()">Join</a>
                        <div class="dropdown dropdown-context-menu ml-2">
                            <a href="javascript:;" class="dropdown-toggle btn-context-menu btn-mobile-sm no-caret" data-toggle="dropdown">
                                <fp-icon name="dots-circle-h" class="fp-fs-22" />
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                                <li v-if="!channel.is_reported" class="dropdown-item" @click="report()">
                                    <fp-icon name="flag" />
                                    <div>
                                        <p>Report</p>
                                        <p>Flag for admin review</p>
                                    </div>
                                </li>
                                <li class="dropdown-item" @click="bookmark()">
                                    <fp-icon name="heart" />
                                    <div>
                                        <p>{{ channel.is_bookmarked ? "Remove from Favourite" : "Favourite" }}</p>
                                        <p>{{ channel.is_bookmarked ?  'Remove' : 'Save'}} this channel in your favourite</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="channel-overview">
                <nav class="navbar fp-navbar navbar-expand fp-border-color-1 mb-3">
                    <ul class="navbar-nav fp-text-color-main">
                        <li class="nav-item" :class="tab === 'Posts' && 'active'">
                            <a class="nav-link" href="javascript:;" @click="tab = 'Posts'">Posts</a>
                        </li>
                        <li class="nav-item" :class="tab === 'Media' && 'active'">
                            <a class="nav-link" href="javascript:;" @click="tab = 'Media'">Media</a>
                        </li>
                        <li class="nav-item" :class="tab === 'Members' && 'active'">
                            <a class="nav-link" href="javascript:;" @click="tab = 'Members'">Members</a>
                        </li>
                        <li class="nav-item" :class="tab === 'Polls' && 'active'">
                            <a class="nav-link" href="javascript:;" @click="tab = 'Polls'">Polls</a>
                        </li>
                        <li class="nav-item" :class="tab === 'About' && 'active'">
                            <a class="nav-link" href="javascript:;" @click="tab = 'About'">About</a>
                        </li>
                    </ul>
                </nav>
                <div class="overview-content">
                    <div v-if="tab === 'Posts'" class="channel-posts">
                        <channel-posts :channel_id="channel.id" />
                    </div>
                    <div v-if="tab === 'Media'" class="channel-media">
                        <channel-media :channel_id="channel.id" />
                    </div>
                    <div v-if="tab === 'Members'" class="channel-members">
                        <fliconn-user-list model="channel"
                                :id="this.channel.id"
                                :user_id="this.channel.user_id"
                                @remove-joins="channel.joined_count--"
                        />
                    </div>
                    <div v-if="tab === 'About'" class="channel-about">
                        <div class="channel-description mb-4">
                            <h6>Description</h6>
                            <p class="fp-text-color-main">{{ channel.description }}</p>
                        </div>
                        <div class="row mx-n2 mb-4">
                            <div class="col-lg-8 px-2">
                                <h6>Details</h6>
                                <p><span class="fp-text-color-main">For business inquiries :</span>&nbsp; {{ channel.email }}</p>
                                <p v-if="channel.location"><span class="fp-text-color-main">Location :</span>&nbsp; {{ channel.location.display_address }}</p>
                            </div>
                            <div class="col-lg-4 px-2">
                                <h6>Stats</h6>
                                    <p><span class="fp-text-color-main">Created :</span>&nbsp; {{ $moment(channel.created_at).format('MMM DD, YYYY') }}</p>
                                    <p><span class="fp-text-color-main">People :</span>&nbsp; {{ $nFormatter(channel.joined_count) }}</p>
                            </div>
                        </div>
                        <div v-if="channel.facebook || channel.twitter || channel.linkedin || channel.weblink" class="channel-social-links">
                            <h6>Social Links</h6>
                            <div v-if="channel.facebook" class="social-link fp-text-color-main">
                                <fp-icon name="facebook" />
                                <a :href="channel.facebook" target="_blank">{{ channel.facebook }}</a>
                            </div>
                            <div v-if="channel.twitter" class="social-link fp-text-color-main">
                                <fp-icon name="twitter" />
                                <a :href="channel.twitter" target="_blank">{{ channel.twitter }}</a>
                            </div>
                            <div v-if="channel.linkedin" class="social-link fp-text-color-main">
                                <fp-icon name="linkedin" />
                                <a :href="channel.linkedin" target="_blank">{{ channel.linkedin }}</a>
                            </div>
                            <div v-if="channel.weblink" class="social-link fp-text-color-main">
                                <fp-icon name="globe" />
                                <a :href="channel.weblink" target="_blank">{{ channel.weblink }}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ChannelPosts from "./ChannelPosts.vue";
import ChannelMedia from "./ChannelMedia.vue";
import FliconnUserList from "~/components/fliconn/user/UserList.vue";
import eventBus from '~/plugins/event-bus';
export default {
    name: 'ChannelDetail',
    components: {
        ChannelPosts,
        ChannelMedia,
        FliconnUserList,
    },
    data() {
        return {
            channel: null,
            tab: 'Posts',
        }
    },
    computed: {
        isMyChannel() {
            return this.channel && this.auth_user && this.channel.user_id === this.auth_user.id;
        },
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        reportUrl() {
            return `${process.env.timelineApiUrl}/fliconn/report`;
        },
    },
    mounted() {
        eventBus.$on('joined_channel', (payload) => {
            if (this.channel && payload.id === this.channel.id) {
                this.joinedChannel();
            }
        });
        eventBus.$on('left_channel', (payload) => {
            if (this.channel && payload.id === this.channel.id) {
                this.leftChannel();
            }
        });
        eventBus.$on('reported', (payload) => {
            this.reported(payload);
        });
        this.getDetail();
    },
    beforeDestroy() {
        eventBus.$off('joined_channel', (payload) => {
            this.joinedChannel();
        });
        eventBus.$off('left_channel', (payload) => {
            this.leftChannel();
        });
        eventBus.$off('reported', (payload) => {
            this.reported(payload);
        });
    },
    methods: {
        async getDetail() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/get_detail`, {slug: this.$route.params.slug});
            if (response.data.status === 'Success') {
                this.channel = response.data.data;
            }
        },
        async join() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/join`, {channel_id: this.channel.id})
                let result = response.data.data;
                this.$fpSuccess(response.data.message)
                this.$emit('joined')
                this.joinedChannel();
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
        async leave() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/leave`, {channel_id: this.channel.id})
                let result = response.data.data;
                this.$fpSuccess(response.data.message)
                this.$emit('left')
                this.leftChannel();
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
        async toggleNotification() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/toggle_notification`, {id: this.channel.id});
            if (response.data.status === 'Success') {
                this.channel.enable_notification = response.data.data;
                this.$fpSuccess(`You have ${this.channel.enable_notification ? "enabled" : "disabled"} notification on this channel.`);
            }
        },
        joinedChannel() {
            this.channel.joined_count++;
            this.channel.is_joined= true;
            if (this.channel.enable_notification) {
                this.$store.dispatch('fetchNotifications');
                let notiFb = this.$fire.database.ref('notifications/' + this.channel.user_id).push();
                notiFb.set({
                    notifier_id: this.auth_user.id,
                    type: 'join_channel',
                });
            }
        },
        leftChannel() {
            this.channel.joined_count--;
            this.channel.is_joined= false;
            if (this.channel.enable_notification) {
                this.$store.dispatch('fetchNotifications');
                let notiFb = this.$fire.database.ref('notifications/' + this.channel.user_id).push();
                notiFb.set({
                    notifier_id: this.auth_user.id,
                    type: 'left_channel',
                });
            }
        },
        bookmark() {
            if (!this.auth_user) {
                return false;
            }
            this.axios.post(`${process.env.timelineApiUrl}/fliconn/bookmark`, {
                    id: this.channel.id,
                    model: 'channel',
                }).then((response) => {
                    if (response.data.status == "Success") {
                        this.channel.is_bookmarked = response.data.data;
                        if (!response.data.data) {
                            this.$emit('bookmark-removed');
                        } else if (this.channel.enable_notification) {
                            let notiFb = this.$fire.database.ref("notifications/" + this.channel.user_id).push();
                            notiFb.set({
                                notifier_id: this.auth_user.id,
                                type: "bookmark_channel",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        report() {
            if (!this.auth_user) {
                this.$login(this.$route.path);
                return false;
            }
            if (this.channel.is_reported) {
                return this.$toast.error("This channel has already been reported");
            }
            const payload = {
                url: this.reportUrl,
                params: {
                    id: this.channel.id,
                    model: 'channel',
                },
            }
            this.$report(payload);
        },
        reported(payload) {
            if (payload.model === 'channel' && payload.id === this.channel.id) {
                this.channel.is_reported = true;
                if (this.channel.enable_notification) {
                    let notiFb = this.$fire.database.ref("notifications/" + this.channel.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "report_channel",
                    });
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .channel-detail {
        @media (min-width: 720px) {
            max-width: 880px;
            margin: 0 auto;
        }
        .channel-image {
            width: 120px;
            height: 120px;
            img {
                border-radius: 100%;
                object-fit: cover;
            }
            @media (max-width: 600px) {
                width: 80px;
                height: 80px;
            }
        }
        .channel-information {
            @media (max-width: 600px) {
                h6 {
                    font-size: 15px;
                }
                p {
                    font-size: 13px;
                    font-weight: 400;
                }
                .btn {
                    font-size: 14.4px;
                    border-radius: 6px;
                }
            }
            .actions {
                display: flex;
                align-items: center;
                .btn-join {
                    .joined {display: inline;}
                    .leave {display: none;}
                    &:hover {
                        .joined {display: none;}
                        .leave {display: inline;}
                    }
                }
            }
        }
        .fp-navbar {
            border-bottom-style: solid;
            border-bottom-width: 1px;
            padding: 0;
            overflow: auto;
            .nav-item {
                margin-right: 70px;
                @media (max-width: 600px) {
                    margin-right: 30px;
                }
                &:last-child {
                    margin-right: 0;
                }
                .nav-link {
                    position: relative;
                    padding-left: 0;
                    padding-right: 0;
                }
                &.active {
                    .nav-link {
                        color: #FF22A1;
                        &::after {
                            content: "";
                            position: absolute;
                            display: block;
                            width: 40px;
                            height: 3px;
                            border-radius: 5px 5px 0 0;
                            bottom: 0px;
                            left: calc(50% - 20px);
                            background-color: #FF22A1;
                        }
                    }
                }
            }
        }
        .similar-channel {
            width: 220px;
        }
        .overview-content {
            .channel-posts {
                &::v-deep {
                    .timeline-item {
                        border-style: solid;
                        border-width: 1px;
                        border-radius: 12px;
                    }
                }
            }
            .channel-members {
                &::v-deep {
                    .fliconn-member {
                        background-color: #F0F3F9;
                    }
                }
            }

            .channel-about {
                p {
                    margin-bottom: 8px;
                }
                .social-link {
                    margin-bottom: 12px;
                    font-weight: 400;
                    svg {
                        font-size: 22px;
                        width: 24px;
                    }
                    a {
                        text-decoration: none;
                        color: inherit;
                    }
                }
            }
        }
    }
    [data-theme=dark] {
        .channel-detail {
            .overview-content {
                .channel-members {
                    &::v-deep {
                        .fliconn-member {
                            background-color: #18243E;
                        }
                    }
                }
            }
        }
    }
</style>