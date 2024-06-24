<template>
    <div class="fliconn-index">
        <div v-if="auth_user" class="container-posts" :class="hideRight && 'hide-right-section'">
            <div class="post-left-section d-none d-lg-block pt-lg-4">
                <div v-sticky
                     sticky-offset="{top: 99}"
                     sticky-z-index="9"
                     class="left-section-wrapper"
                >
                    <div class="fp-card mb-4">
                        <fliconn-left-menu :tab="tab" @change="changeTab" class="ml-n3" />
                    </div>
                    <recent-poll class="mb-4 fp-card" />
                </div>
            </div>
            <div class="post-container">
                <div v-if="tab === 'timeline'" class="sticky-nav">
                    <div class="sticky-placeholder"></div>
                    <add-post-link />
                </div>
                <div class="post-list">
                    <transition v-if="tab === 'timeline'">
                        <div>
                            <status-card v-if="profile_visible_users.length"
                                    @view="tab = 'status'"
                                    class="mb-3 mt-3"
                            />
                            <quick-links class="mb-4" />
                            <timeline-index ref="timelineIndex">
                                <template #circle-people="{ index }">
                                    <circle-people :key="'_' + index"
                                        v-if="auth_user && index !== 0 && (index === 2 || index % 15 === 0) && circle_users.length"
                                        :users="circle_users"
                                        @follow="follow" @open-profile="goFliconnProfile"
                                        class="mt-4 mb-4"
                                    />
                                    <top-rated-clips v-if=" index !== 0 && index % 6 ===0 && index % 15 !== 0"
                                            class="mt-4 mb-4"
                                            @show-all="tab = 'clips'"
                                            @clips-selected="tab = 'clips'"
                                    />
                                </template>
                            </timeline-index>
                        </div>
                    </transition>
                    <transition v-if="tab === 'clips'">
                        <!-- <clips-index @follow="follow"></clips-index> -->
                        <clips-home @follow="follow" />
                    </transition>
                    <!-- <transition v-if="tab === 'status'">
                        <status-index :user_id="auth_user.id" @follow="follow" class="mt-2"></status-index>
                    </transition> -->
                    <transition v-if="tab === 'merchant'">
                        <merchant-index />
                    </transition>
                    <transition v-if="tab === 'connections'">
                        <fliconn-connections @follow="follow" :user="auth_user"></fliconn-connections>
                    </transition>
                    <transition v-if="tab === 'channel'">
                        <channel-index :user_id="auth_user.id"></channel-index>
                    </transition>
                    <transition v-if="tab === 'group'">
                        <group-index type="group"></group-index>
                    </transition>
                    <transition v-if="tab === 'page'">
                        <group-index type="page"></group-index>
                    </transition>
                    <transition v-if="tab === 'discover'">
                        <discover-index />
                    </transition>
                    <transition v-if="tab === 'bookmark'">
                        <favourite-index></favourite-index>
                    </transition>
                </div>
            </div>
            <div class="post-right-section d-none d-lg-block pt-lg-4">
                <div v-sticky
                     sticky-offset="{top: 99}"
                     sticky-z-index="9"
                     class="right-section-wrapper"
                >
                    <recommend-groups v-if="tab === 'group' || tab === 'page'" :type="tab" class="mb-4" />
                    <promote-banner v-else-if="tab === 'merchant'" class="mb-4" />
                    <popular-users v-else-if="tab !== 'clips'" class="mb-4" @follow="follow" />
                    <!-- <recent-chat-users @loaded="loadedRecentChatUser" /> -->
                    <!-- <recent-chat-groups v-if="tab !== 'clips'"
                        :class="{
                            'd-none': !recent_chat_users_count && !recent_chat_groups_count,
                        }"
                        @loaded="loadedRecentChatGroup"
                    /> -->
                    <recent-channels />
                </div>
            </div>
        </div>
        <portal to="top-search">
            <search-box v-model="keyword" mode="top" placeholder="Search here..." />
        </portal>
        <portal to="fp-sidebar">
            <div class="sidebar-menu pt-1">
                <fliconn-left-menu :tab="tab" @change="changeMobileTab" mode="mobile" />
            </div>
        </portal>
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">{{ pageTitle }}</h6>
        </portal>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import FliconnLeftMenu from "~/components/fliconn/LeftMenu.vue";
    import FliconnHashTags from "~/components/fliconn/HashTags.vue";
    import RecentChannels from "~/components/fliconn/RecentChannels.vue";
    import FliconnForm from "~/components/fliconn/timeline/TimelineForm.vue";
    import TimelineIndex from "~/components/fliconn/timeline/TimelineIndex.vue";
    import StatusCard from "~/components/fliconn/StatusCard.vue";
    import CirclePeople from "~/components/fliconn/CirclePeople.vue";
    import FliconnConnections from "~/components/fliconn/user/Connections.vue";
    import PopularUsers from "~/components/fliconn/PopularUsers.vue";
    import StatusIndex from "~/components/fliconn/status/StatusIndex.vue";
    import MerchantIndex from "~/components/fliconn/merchant_offers/MerchantIndex.vue";
    import ClipsHome from "~/components/fliconn/clips/ClipsHome.vue";
    import ChannelIndex from "~/components/fliconn/channel/ChannelIndex.vue";
    import GroupIndex from "~/components/fliconn/group/GroupIndex.vue";
    import FavouriteIndex from "~/components/fliconn/FavouriteIndex.vue";
    import DiscoverIndex from "~/components/discover/DiscoverIndex.vue";
    import TopRatedClips from "~/components/fliconn/clips/TopRated.vue";
    import RecommendGroups from "~/components/fliconn/group/RecommendGroups.vue";
    import AboutMe from "~/components/fliconn/profile/AboutMe.vue";
    import Gallery from "../account/Gallery.vue";
    import AddPostLink from "~/components/fliconn/AddPostLink.vue";
    import RecentChatUsers from "~/components/message/user_chat/RecentChatUsers.vue";
    import RecentChatGroups from "~/components/message/group_chat/RecentChatGroups.vue";
    import QuickLinks from "~/components/ui/QuickLinks.vue";
    import PromoteBanner from "~/components/fliconn/merchant_offers/PromoteBanner.vue";
    import RecentPoll from "~/components/fliconn/poll/RecentPoll.vue";
    import SearchBox from '~/components/elements/SearchBox.vue'
    import Cookies from "js-cookie";
    import Sticky from "vue-sticky-directive";
    export default {
        middleware: "auth",
        name: "FliconnIndex",
        directives: { Sticky },
        components: {
            FliconnLeftMenu,
            FliconnForm,
            TimelineIndex,
            AddPostLink,
            StatusCard,
            CirclePeople,
            FliconnConnections,
            GroupIndex,
            StatusIndex,
            MerchantIndex,
            ClipsHome,
            TopRatedClips,
            RecommendGroups,
            AboutMe,
            Gallery,
            PopularUsers,
            RecentChatUsers,
            RecentChatGroups,
            QuickLinks,
            PromoteBanner,
            FavouriteIndex,
            DiscoverIndex,
            FliconnHashTags,
            RecentChannels,
            SearchBox,
            RecentPoll,
            ChannelIndex,
        },
        data() {
            return {
                tab: "timeline",
                keyword: '',
                recent_chat_users_count: 0,
                recent_chat_groups_count: 0,
            };
        },
        computed: {
            hideRight() {
                return this.tab === 'clips' || this.tab === 'discover';
            },
            pageTitle() {
                switch (this.tab) {
                    case 'timeline':
                        return 'Timeline';
                        break;
                    case 'clips':
                        return 'Flicks';
                        break;
                    case 'channel':
                        return 'Channels';
                        break;
                    case 'page':
                        return 'Pages';
                        break;
                    case 'connections':
                        return 'Find People';
                        break;
                    case 'merchant':
                        return 'Coupons/Offers';
                        break;
                    case 'discover':
                        return 'Around Me';
                        break;
                    case 'bookmark':
                        return 'Favourite';
                        break;

                    default:
                        break;
                }
            },
            ...mapGetters({
                auth_user: "auth/user",
                profile_visible_users: "fliconn/profile_visible_users",
                circle_users: 'auth/circle_users',
            })
        },
        watch: {
            keyword(value) {
                this.tab = 'timeline';
                setTimeout(() => {
                    this.$refs.timelineIndex.searchForm(value);
                }, 500);
            }
        },
        mounted() {
            Cookies.set("last_visited_route", this.$route.name);
            this.$store.dispatch("fliconn/getProfileVisibleUsers");
            this.getCircleUsers();
            let tab = this.$route.query.tab;
            let fliconn_tab = Cookies.get("fliconn_tab");
            if (fliconn_tab) {
                this.tab = fliconn_tab;
            } else if (tab) {
                this.tab = tab;
            }
            this.$store.dispatch("setEnableChat", true);
            this.$store.dispatch("setHasSidebar", true);
        },
        beforeDestroy() {
            Cookies.remove("last_visited_route");
            this.$store.dispatch("setHasSidebar", false);
        },
        methods: {
            async getCircleUsers() {
                this.$store.dispatch('auth/getCircleUsers');
            },
            async follow(item) {
                const data = await this.$store.dispatch("requestFollow", item.id);
                if (data.status === "Success") {
                    this.$toast.success(data.message);
                    this.getCircleUsers();
                }
            },
            goFliconnProfile(item) {
                this.$router.push({
                    name: "fliconn.profile",
                    params: { username: item.username },
                });
            },
            changeTab(tab) {
                this.tab = tab;
                Cookies.set("fliconn_tab", tab);
            },
            changeMobileTab(tab) {
                this.$store.dispatch('toggleLeftMenu', false);
                this.changeTab(tab);
            },
            loadedRecentChatUser(data) {
                this.recent_chat_users_count = data;
            },
            loadedRecentChatGroup(data) {
                this.recent_chat_groups_count = data;
            },
        },
    };
</script>
<style lang="scss" scoped>
    @import '~assets/scss/variables.scss';
    .container-posts {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        &.hide-right-section {
            .post-right-section {
                display: none !important;
            }
            .post-container {
                flex-grow: 1;
                @media (min-width: 601px) {
                    padding-right: 0;
                }
            }
        }
    }

    .post-left-section {
        @media (min-width: 601px) {
            max-width: 255px;
            .left-section-wrapper {
                max-height: calc(100vh - 100px);
                overflow-y: auto;
                overflow-x: hidden;
                &::-webkit-scrollbar {
                    display: none;
                }
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
            }
        }
    }

    .post-right-section {
        @media (min-width: 601px) {
            max-width: 252px;
            .right-section-wrapper {
                max-height: calc(100vh - 100px);
                overflow-y: auto;
                overflow-x: hidden;
                &::-webkit-scrollbar {
                    display: none;
                }
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
            }
        }
    }

    .post-container {
        margin-top: 24px;
        padding-left: 24px;
        padding-right: 24px;
        @media (max-width: 600px) {
            padding-left: 0;
            padding-right: 0;
            margin-top: 8px;
        }
        @media (min-width: 992px) {
            width: calc(100% - 510px);
        }
    }

    @media (min-width: 601px) {
        .post-list {
            overflow: visible;
            max-width: 100%;
        }
    }

    .sticky-nav {
        position: sticky;
        top: 75px;
        z-index: 3;
        margin-top: -24px;
        @media (max-width: 600px) {
            display: none;
        }
        .sticky-placeholder {
            height: 24px;
            width: 100%;
            @media (max-width: 600px) {
                height: 12px;
            }
        }
    }

    .badge-received-follow-requests {
        position: absolute;
        top: 3px;
        right: 7px;
        font-size: 10.8px;
    }
    .sidebar-menu {
        padding-left: 16px;
        padding-right: 16px;
        &::v-deep {
            .left-fliconn-menu {
                .menu-item {
                    padding: 12px 0;
                    border-bottom: solid 1px #D3DDEB;
                    border-radius: 0;
                    .menu-image {
                        margin-right: 8px;
                    }
                    &:last-child {
                        border-bottom: none !important;
                    }
                    &.active {
                        background-color: unset;
                        color: #22FFA1;
                        &::before {
                            display: none;
                        }
                    }
                }
            }
        }
    }
    [data-theme=dark] {
        .sidebar-menu {
            &::v-deep {
                .left-fliconn-menu {
                    .menu-item {
                        border-bottom: solid 1px rgba(51, 69, 87, 0.502);
                    }
                }
            }
        }
    }
</style>
