<template>
    <div class="group-item fp-card" :class="mini && 'mini'">
        <div class="wallpaper" @click="openGroupDetail()">
            <img v-if="group.image" class="cover-image" :src="group.wallpaper" alt="" />
            <img v-else class="cover-image" src="@/assets/images/fp-default-bg.webp" alt="" />
        </div>
        <div class="mini-detail" @click="openGroupDetail()">
            <p>{{ group.title }}</p>
        </div>
        <div class="group-item-detail">
            <div class="detail" @click="openGroupDetail()">
                <h6 class="group-title">{{group.title}}</h6>
                <p class="created-by text-muted">Created by <a href="javascript:;" @click.stop="openProfile()" class="text-muted">{{ group.user.name }}</a></p>
                <div class="group-info d-md-flex">
                    <p class="group-type">
                        <span v-if="group.type === 'page'">
                            <fp-icon name="page" class="fp-fs-20" />
                            &nbsp;{{group.posts_count}} Posts
                        </span>
                        <span v-else-if="group.is_private">
                            <fa icon="lock" />
                            &nbsp;&nbsp;Private Group
                        </span>
                        <span v-else>
                            <fp-icon name="ads-community" class="fp-fs-20" />
                            &nbsp;&nbsp;Public Group
                        </span>
                    </p>
                    <p class="group-members pl-md-3 mb-0 mr-auto fp-border-color-1">
                        <fp-icon name="user-plus" class="fp-fs-20" />
                        &nbsp;{{$nFormatter(group.joined_count)}} {{group.type === 'group' ? 'Joined' : 'Following'}}
                    </p>
                </div>
            </div>
            <template v-if="auth_user && group.user_id != auth_user.id">
                <a v-if="group.type === 'page' && group.is_joined" href="javascript:;" class="btn btn-join fp-btn-gradient">Following</a>
                <a v-else-if="group.type === 'page' && !group.is_joined" href="javascript:;" class="btn btn-join-outline fp-btn-gradient" @click.stop="join()">Follow</a>
                <a v-else-if="group.type === 'group' && group.is_join_requested" href="javascript:;" class="btn btn-join fp-btn-gradient">Request sent</a>
                <a v-else-if="group.type === 'group' && group.is_joined" href="javascript:;" class="btn btn-join fp-btn-gradient">Joined</a>
                <a v-else-if="group.type === 'group' && !group.is_joined" href="javascript:;" class="btn btn-join fp-btn-outline" @click.stop="join()">Join</a>
            </template>
            <div class="dropdown dropdown-context-menu">
                <a href="javascript:;" class="dropdown-toggle btn-context-menu btn-mobile-sm no-caret" data-toggle="dropdown">
                    <fp-icon name="dots-circle-h" class="fp-fs-20" />
                </a>
                <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                    <template v-if="isMyGroup">
                        <li class="dropdown-item" @click="toggleNotification()">
                            <fp-icon :name="group.enable_notification ? 'bell-slash' : 'bell'" />
                            <div>
                                <p>{{ group.notification_enabled ? "Turn off notifications" : "Turn on notifications" }}</p>
                                <p>{{ group.notification_enabled ?  'Disable' : 'Enable'}} notifications for this post</p>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <li v-if="!group.is_reported" class="dropdown-item" @click="report()">
                            <fp-icon name="flag" />
                            <div>
                                <p>Report</p>
                                <p>Flag for admin review</p>
                            </div>
                        </li>
                        <li class="dropdown-item" @click="bookmark()">
                            <fp-icon name="heart" />
                            <div>
                                <p>{{ group.is_bookmarked ? "Remove from Favourite" : "Favourite" }}</p>
                                <p>{{ group.is_bookmarked ?  'Remove' : 'Save'}} this post in your favourite</p>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import eventBus from '~/plugins/event-bus';
export default {
    name: 'GroupItem',
    props: ['group', 'mini'],
    computed: {
        isMyGroup() {
            return this.auth_user && this.auth_user.id === this.group.user_id;
        },
        reportUrl() {
            return `${process.env.timelineApiUrl}/fliconn/report`;
        },
        ...mapGetters({
            auth_user: 'auth/user',
        })
    },
    mounted() {
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
        async join() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/join`, {group_id: this.group.id})
                let result = response.data.data;
                this.group.joined= result.joined
                this.group.is_joined= result.is_joined
                this.group.is_join_requested= result.is_join_requested
                this.$fpSuccess(response.data.message)
                this.$emit('joined')
                if (this.group.enable_notification) {
                    this.$store.dispatch('fetchNotifications');
                    let notiFb = this.$fire.database.ref('notifications/' + this.group.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: 'join_group',
                    });
                }
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
        openGroupDetail() {
            this.$router.push({name: 'group.detail', params: {slug: this.group.slug}})
        },
        openProfile() {
            return this.$router.push({name: 'fliconn.profile', params: {username: this.group.user.username}}).catch(err => {});
        },
        bookmark() {
            if (!this.auth_user) {
                return false;
            }
            this.axios.post(`${process.env.timelineApiUrl}/fliconn/bookmark`, {
                    id: this.group.id,
                    model: 'group',
                }).then((response) => {
                    if (response.data.status == "Success") {
                        this.group.is_bookmarked = response.data.data;
                        if (!response.data.data) {
                            this.$emit('bookmark-removed');
                        } else if (this.group.enable_notification) {
                            let notiFb = this.$fire.database.ref("notifications/" + this.group.user_id).push();
                            notiFb.set({
                                notifier_id: this.auth_user.id,
                                type: "bookmark_group",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        async toggleNotification() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/toggle_notification`, {id: this.group.id, model: 'group'});
            if (response.data.status === 'Success') {
                this.group.enable_notification = response.data.data;
                this.$fpSuccess(`You have ${this.group.enable_notification ? "enabled" : "disabled"} notification on this group.`);
            }
        },
        report() {
            if (!this.auth_user) {
                this.$login(this.$route.path);
                return false;
            }
            if (this.group.is_reported) {
                return this.$toast.error("This group has already been reported");
            }
            const payload = {
                url: this.reportUrl,
                params: {
                    id: this.group.id,
                    model: 'group',
                },
            }
            this.$report(payload);
        },
        reported(payload) {
            if (payload.model === 'group' && payload.id === this.group.id) {
                this.group.is_reported = true;
                if (this.group.enable_notification) {
                    let notiFb = this.$fire.database.ref("notifications/" + this.group.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "report_group",
                    });
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .group-item {
        display: flex;
        cursor: pointer;
        border-radius: 8px;
        padding: 10px;
        @media (max-width: 600px) {
            padding: 8px;
        }
        .wallpaper {
            width: 90px;
            height: 90px;
            min-width: 90px;
            position: relative;
            border-radius: 6px;
            background-size: cover !important;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
            }
            @media (max-width: 600px) {
                width: 80px;
                min-width: 80px;
                height: 80px;
            }
        }
        .mini-detail {
            display: none;
        }
        &.mini {
            flex-direction: column;
            .wallpaper {
                width: 100%;
                height: 85px;
                min-width: 70px;
            }
            .detail {
                display: none;
            }
            .mini-detail {
                color: #64748B;
                display: block;
                margin-top: 5px;
                p {
                    margin-bottom: 0;
                    line-height: 16px;
                }
            }
            .btn-join,
            .created-by {
                display: none;
            }
        }
        .group-item-detail {
            display: flex;
            align-items: flex-end;
            flex-grow: 1;
            padding-left: 10px;
            max-width: calc(100% - 90px);
            position: relative;
            @media (max-width: 600px) {
                max-width: calc(100% - 80px);
            }
            .dropdown-context-menu {
                position: absolute;
                top: 0;
                right: 0;
            }
            .detail {
                display: flex;
                flex-direction: column;
                width: calc(100% - 80px);
                height: 100%;
                margin-right: auto;
                .group-title {
                    margin-bottom: 2px;
                    font-size: 15px;
                    line-height: 1.29;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 6px;
                    @media (max-width: 600px) {
                        -webkit-line-clamp: 1;
                        font-size: 14.4px;
                        line-height: 1;
                    }
                }
                .created-by {
                    font-size: 13px;
                    margin-bottom: 2px;
                    @media (max-width: 600px) {
                        font-size: 10.5px;
                        line-height: 1;
                        margin-bottom: 0;
                    }
                }
                .group-info {
                    margin-top: auto;
                    @media (min-width: 600px) {
                        & > p {
                            width: 45%;
                            &:nth-child(2) {
                                border-left: solid 1px #D9D9D9;
                            }
                        }
                    }
                    .group-type {
                        color: #64748B;
                        font-size: 13.6px;
                        margin-bottom: 0;
                        height: 20px;
                        span {
                            display: inline-flex;
                            align-items: center;
                        }
                        svg {
                            color: #64748B;
                        }
                    }
                    .group-members {
                        display: inline-flex;
                        align-items: center;
                        color: #64748B;
                        font-size: 13.6px;
                        margin-bottom: 0;
                        height: 20px;
                        svg {
                            color: #64748B;
                        }
                    }
                    @media (max-width: 600px) {
                        .group-type, .group-members {
                            font-size: 12.6px;
                            height: 20px;
                            line-height: 20px;
                        }
                    }
                }
            }
            .btn-join {
                text-decoration: none;
                margin-left: auto;
                border-radius: 5px;
                font-size: 12px;
                line-height: 21px;
                padding: 6px 16px;
                @media (max-width: 600px) {
                    padding: 2px 12px;
                    border-radius: 5px;
                }
            }
        }
        &.similar-group {
            .group-item-detail {
                .detail {
                    width: calc(100% - 15px);
                    .group-type {
                        width: unset;
                        margin-top: 0.5px;
                        font-size: 12px;
                        svg {
                            font-size: 16px;
                        }
                    }
                    .group-members {
                        width: unset;
                        font-size: 12px;
                        padding-left: 4px !important;
                        margin-left: 8px !important;
                        padding-right: 0;
                        svg {
                            font-size: 16px;
                        }
                    }
                }
                .btn {
                    display: none;
                }
            }
        }
    }
</style>