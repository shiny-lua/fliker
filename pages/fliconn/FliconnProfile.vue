<template>
    <div class="fliconn-card mx-auto">
        <div class="mt-3 mt-md-4">
            <user-card v-if="user" ref="userCard" :user_id="user.id" class="mb-4" />
            <div class="d-lg-flex">
                <div v-if="user" class="fliconn-left-panel mb-3">
                    <account-left-panel
                         v-sticky sticky-offset="{top: 78}"
                         sticky-z-index="9"
                         class="mb-2"
                         :user="user"
                    />
                </div>
                <div class="fliconn-right-panel ml-lg-4 mb-3"><div class="scroll-to" id="fliconnRightPanel"></div>
                    <div ref="fliconnProfileNav"
                         class="fp-card d-flex align-items-center justify-content-between fliconn-profile-nav"
                         v-sticky sticky-offset="{top: 54}"
                         sticky-z-index="9"
                         on-stick="onNavStick"
                    >
                        <a class="nav-link" :class="{ active: tab === 'timeline' }" @click.prevent="tab = 'timeline'">
                            <span class="nav-icon">
                                <fp-icon name="left_menu_timeline" />
                            </span>
                            <span class="nav-tab">Timeline</span>
                        </a>
                        <a class="nav-link" :class="{ active: tab === 'clips' }" @click.prevent="tab = 'clips'">
                            <span class="nav-icon">
                                <fp-icon name="left_menu_flicks" style="font-size: 20px;" />
                            </span>
                            <span class="nav-tab">Flicks</span>
                        </a>
                        <a class="nav-link" :class="{ active: tab === 'connections' }" @click.prevent="tab = 'connections'">
                            <span class="nav-icon">
                                <fp-icon name="left_menu_people" />
                            </span>
                            <span class="nav-tab">People</span>
                        </a>
                        <a class="nav-link" :class="{ active: tab === 'gallery' }" @click.prevent="tab = 'gallery'">
                            <span class="nav-icon">
                                <fp-icon name="left_menu_gallery" />
                            </span>
                            <span class="nav-tab">Gallery</span>
                        </a>
                        <a class="nav-link" :class="{ active: tab === 'groups' }" @click.prevent="tab = 'groups'">
                            <span class="nav-icon">
                                <fp-icon name="left_menu_groups" />
                            </span>
                            <span class="nav-tab">Groups</span>
                        </a>
                        <a class="nav-link" :class="{ active: tab === 'pages' }" @click.prevent="tab = 'pages'">
                            <span class="nav-icon">
                                <fp-icon name="left_menu_pages" />
                            </span>
                            <span class="nav-tab">Pages</span>
                        </a>
                        <a class="nav-link" :class="{ active: tab === 'channels' }" @click.prevent="tab = 'channels'">
                            <span class="nav-icon">
                                <fp-icon name="left_menu_channels" />
                            </span>
                            <span class="nav-tab">Channels</span>
                        </a>
                    </div>
                    <div v-if="user && profile_option && !profile_option.visible_profile" class="text-center fp-text-color-main mt-3 mt-md-4">
                        <p class="mb-1">
                            {{ user.first_name }} has locked their profile!
                        </p>
                    </div>
                    <div v-else-if="user && user.blocked_me" class="text-center fp-text-color-main mt-3 mt-md-4">
                        <p class="mb-1">
                            {{ user.first_name }} has restricted or hidden their profile information!
                        </p>
                    </div>
                    <div v-else-if="user && profile_option" class="py-3">
                        <div v-if="tab === 'timeline'">
                            <div v-if="profile_option.visible_status" style="margin-left: 10px;">
                                <status-card v-if="user && profile_visible_users.length" mode="account" :user_id="user.id" class="mb-3"></status-card>
                            </div>
                            <div v-if="profile_option.visible_timeline" class="fliconn-timeline-list">
                                <add-post-link v-if="user.id === auth_user.id" class="mb-3" />
                                <timeline-index :prop_filter="{user_id: user.id}"
                                     :placeholder-no-result="`${user.first_name} 's timeline is empty`"
                                     @post-deleted="$refs.userCard.getDetail()"
                                />
                            </div>
                            <p v-else class="mt-3 text-center fp-text-color-main">
                                {{ user.first_name }}'s timeline posts are hidden to you!
                            </p>
                        </div>
                        <connections v-if="tab === 'connections'" :user="user" />
                        <clips-profile-index v-if="tab === 'clips' && user && profile_option.visible_clips"
                            :user="user"
                        />
                        <p v-else-if="tab === 'clips' && !profile_option.visible_clips" class="mt-3 text-center fp-text-color-main">
                            {{ user.first_name }}'s short clips are hidden to you!
                        </p>
                        <gallery v-if="tab === 'gallery' && user && profile_option.visible_gallery"
                            :user_id="user.id"
                            :is-account-page="true"
                        />
                        <p v-else-if="tab === 'gallery' && !profile_option.visible_gallery"
                            class="mt-3 text-center fp-text-color-main"
                        >
                            {{ user.first_name }}'s galleries are hidden to you!
                        </p>
                        <group-index v-if="tab === 'groups' && user && profile_option.visible_groups"
                            :user_id="user.id"
                            page="profile"
                            type="group"
                            :user="user"
                        />
                        <p v-else-if="tab === 'groups' && !profile_option.visible_groups"
                            class="mt-3 text-center fp-text-color-main"
                        >
                            {{ user.first_name }}'s groups are hidden to you!
                        </p>
                        <group-index v-if="tab === 'pages' && user && profile_option.visible_pages"
                            :user_id="user.id"
                            page="profile"
                            type="page"
                            :user="user"
                        />
                        <p v-else-if="tab === 'pages' && !profile_option.visible_pages"
                            class="mt-3 text-center fp-text-color-main"
                        >
                            {{ user.first_name }}'s pages are hidden to you!
                        </p>
                        <channel-index v-if="tab === 'channels' && profile_option.visible_channels"
                            :user_id="user.id"
                            page="profile"
                            :user="user"
                        />
                        <p v-else-if="tab === 'channels' && !profile_option.visible_channels"
                            class="mt-3 text-center fp-text-color-main"
                        >
                            {{ user.first_name }}'s channels are hidden to you!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import UserCard from "~/components/fliconn/profile/UserCard.vue";
    import TimelineIndex from "@/components/fliconn/timeline/TimelineIndex.vue";
    import AccountLeftPanel from "~/components/fliconn/AccountLeftPanel.vue";
    import Connections from "~/components/fliconn/user/Connections.vue";
    import ClipsIndex from "~/components/fliconn/clips/ClipsIndex.vue";
    import ClipsProfileIndex from "~/components/fliconn/clips/ClipsProfileIndex.vue";
    import GroupIndex from "~/components/fliconn/group/GroupIndex.vue";
    import ChannelIndex from "~/components/fliconn/channel/ChannelIndex.vue";
    import StatusCard from "~/components/fliconn/StatusCard.vue";
    import AddPostLink from "~/components/fliconn/AddPostLink.vue";
    import Gallery from "../account/Gallery.vue";
    import { mapGetters } from "vuex";
    import Sticky from "vue-sticky-directive";
    export default {
        name: "FliconnProfile",
        directives: { Sticky },
        components: {
            UserCard,
            TimelineIndex,
            Connections,
            Gallery,
            ClipsIndex,
            AccountLeftPanel,
            GroupIndex,
            ChannelIndex,
            StatusCard,
            ClipsProfileIndex,
            AddPostLink,
        },
        data() {
            return {
                tab: "timeline",
                user: null,
                sticked: false,
            };
        },
        watch: {
            tab(value) {
                if (this.sticked) {
                    setTimeout(() => {
                        var access = document.getElementById("fliconnRightPanel");
                        access.scrollIntoView({ behavior: "smooth" }, true);
                    }, 1000);
                }
            },
        },
        computed: mapGetters({
            auth_user: "auth/user",
            profile_option: "fliconn/profile_option",
            profile_visible_users: "fliconn/profile_visible_users",
        }),
        async created() {
            let tab = this.$route.query.tab;
            if (tab) {
                this.tab = tab;
            }
            let username = this.$route.params.username;
            if (!username && this.auth_user) username = this.auth_user.username;
            const response = await this.axios.post(`/user/get_detail`, { username: username });
            if (response.data.status == "Success") {
                this.user = response.data.data;
                this.$store.dispatch("fliconn/getProfileOption", this.user.id);
                if (this.user.profile.visible_profile != "public") {
                    if (!this.auth_user) {
                        this.$router.push({ name: "login" });
                        return false;
                    }
                    this.$store.dispatch("fliconn/getProfileVisibleUsers");
                }
            }
        },
        methods: {
            onNavStick(data) {
                this.sticked = data.sticked;
            },
        },
    };
</script>
<style lang="scss" scoped>
    .fliconn-profile-nav {
        overflow: auto;
        &.top-sticky {
            margin-top: 22px;
            @media (max-width: 600px) {
                padding-top: 20px;
            }
        }
    }
    .nav-link {
        position: relative;
        color: #64748B;
        cursor: pointer;
        margin-right: 6px;
        width: 70px;
        text-align: center;
        padding: 0 0.5rem;
        span {
            display: block;
        }
        .nav-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        &:last-child {
            margin-right: 0;
        }
        &.active {
            &::after {
                content: "";
                position: absolute;
                display: block;
                width: 40px;
                height: 3px;
                border-radius: 5px 5px 0 0;
                bottom: -16px;
                left: 15px;
                background-color: #FF22A1;
            }
        }
        @media (max-width: 600px) {
            width: 80px;
            &.active {
                &::after {
                    bottom: -12px;
                }
            }
        }
    }
    .fliconn-card {
        max-width: 889px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        border: none;
        overflow: hidden;
        @media (max-width: 600px) {
            border: none;
            box-shadow: unset;
        }
        &::v-deep .followings {
            display: block;
        }
    }
    .fliconn-left-panel {
        width: 100%;
        max-width: 308px;
        @media (max-width: 990px) {
            max-width: 100%;
        }
    }
    .fliconn-right-panel {
        z-index: 2;
        width: 100%;
        max-width: 557px;
        position: relative;
        @media (max-width: 990px) {
            max-width: 100%;
        }
        .scroll-to {
            position: absolute;
            height: 0;
            top: -70px;
            left: 0;
        }
    }
</style>
