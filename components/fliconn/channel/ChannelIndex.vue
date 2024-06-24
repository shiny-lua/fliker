<template>
    <div class="channel-index" :class="page === 'profile' && 'profile-channels'">
        <div class="fp-card fp-sm-no-card round-8 mb-4">
            <ul class="nav nav-filter" :class="page === 'index' && 'justify-content-between'">
                <li v-if="page === 'index'" class="nav-item">
                    <a class="nav-link fp-text-color-main px-0" :class="{ active: tab === 'all' }" @click.prevent="tab = 'all'">
                        <fp-icon name="all" />
                        All
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:;"
                         class="nav-link fp-text-color-main px-0"
                         :class="{ active: tab === 'my_channels' }"
                         @click.prevent="tab = 'my_channels'"
                    >
                        <fp-icon name="channel" />
                        <span>{{ isMyProfile ? 'My Channels' : 'Channels'}}</span>
                    </a>
                </li>
                <li class="nav-item" :class="page === 'profile' && 'ml-md-5'">
                    <a class="nav-link fp-text-color-main px-0" :class="{ active: filter.joined }" @click.prevent="tab = 'joined'">
                        <fp-icon name="group" />
                        Joined
                    </a>
                </li>
                <li class="nav-item" :class="page === 'profile' && 'ml-auto'">
                    <router-link :to="{name: 'channel.search'}" class="fp-text-color-main">
                        <fp-icon name="search" class="icon-search fp-fs-20" />
                    </router-link>
                </li>
            </ul>
        </div>

        <div class="channels-list px-2">
            <div class="row mx-n2">
                <div v-for="(item, index) in channels" :key="index" class="col-6 col-md-4 px-2 mb-4">
                    <channel-item :channel="item"
                        @joined="joined"
                    ></channel-item>
                </div>
            </div>
            <infinite-loading :distance="300" :identifier="infiniteId" @infinite="searchChannels" force-use-infinite-wrapper=".channels-list">
                <div slot="no-more"></div>
                <div slot="no-results">
                    <p class="fp-text-color-main text-center">
                        <span v-if="tab === 'my_channels'">{{ username && !isMyProfile ? username : "You" }} did not create any channels yet!</span>
                        <span v-if="tab === 'joined'">{{ username && !isMyProfile ? username : "You" }} did not join any channels yet!</span>
                    </p>
                </div>
                <div slot="spinner" class="pt-3 pt-md-4">
                    <img src="~assets/images/logo_loading.gif" width="50" alt="" />
                </div>
            </infinite-loading>
        </div>
    </div>
</template>
<script>
    import ChannelItem from "./ChannelItem.vue";
    export default {
        name: "ChannelIndex",
        props: {
            user_id: { type: [Number, String], required: false },
            user: { type: Object, required: false },
            page: { type: String, default: 'index' },
        },
        components: {
            ChannelItem,
        },
        data() {
            return {
                channels: [],
                filter: {
                    user_id: "",
                    keyword: "",
                    joined: false,
                    page: 1,
                },
                infiniteId: +new Date(),
                tab: "all",
            };
        },
        watch: {
            tab(tab) {
                if (tab === "my_channels") {
                    this.filter.user_id = this.user ? this.user.id : this.auth_user.id;
                    this.filter.joined = false;
                    this.search();
                } else if (tab === "joined") {
                    this.filter.user_id = '';
                    this.filter.joined = true;
                    this.search();
                } else if (tab === 'all') {
                    this.filter.user_id = '';
                    this.filter.joined = false;
                    this.search();
                }
            },
        },
        computed: {
            username() {
                return this.user ? this.user.first_name : "";
            },
            isMyProfile() {
                return this.auth_user && this.auth_user.id === this.user_id;
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        mounted() {
            let sub_tab = this.$route.query.sub_tab;
            let keyword = this.$route.query.keyword;
            if (sub_tab) {
                this.tab = sub_tab;
            } else if (keyword) {
                this.filter.keyword = keyword;
            } else if (this.page === 'profile') {
                this.tab = "my_channels";
            } else {
                this.tab = 'all';
            }
        },
        methods: {
            async search() {
                this.filter.page = 1;
                this.channels = [];
                await this.$nextTick();
                this.infiniteId += 1;
            },
            async searchChannels($state) {
                try {
                    const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/search`, this.filter);
                    let result = response.data.data;
                    if (result.current_page == 1) this.channels = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.channels.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                } catch (e) {}
            },
            joined() {
                this.$store.dispatch("fetchNotifications");
            },
        },
    };
</script>
<style lang="scss" scoped>
    .channel-index {
        border-radius: 12px;
        &.profile-channels {
            .nav-filter {
                .nav-item {
                    margin-right: 26px;
                    &:last-child {
                        margin-right: 0;
                    }
                }
                @media (max-width: 600px) {
                    justify-content: space-between;
                    .nav-item {
                        margin-right: 0;
                    }
                }
            }
        }
    }
    .nav.nav-filter {
        .nav-item {
            display: flex;
            align-items: center;
        }
        .nav-link {
            background-color: unset;
            font-size: 14.4px;
            margin-left: 4px;
            padding: 0;
            cursor: pointer;
            border-bottom: solid 2px transparent;
            position: relative;
            .badge {
                position: absolute;
                top: 5px;
                right: -22px;
            }
            svg {
                font-size: 24px;
            }
            &.active {
                color: #FF22A1 !important;
            }
        }
    }
    .search-form {
        flex-grow: 1;
        // max-width: calc(100% - 195px);
        position: relative;
        input {
            padding-right: 38px;
        }
        img {
            position: absolute;
            top: 8px;
            right: 10px;
        }
    }
    .join-requests-list {
        .join-request-item {
            display: flex;
            padding-bottom: 18px;
            border-bottom: solid 1px #0000001a;
            margin-bottom: 18px;
            &:last-child {
                border-bottom: none;
            }
            img {
                width: 50px;
                height: 50px;
                min-width: 50px;
                object-fit: cover;
                border-radius: 100%;
            }
            .detail {
                margin-left: 10px;
                .actions {
                    .btn {
                        border-radius: 10px;
                        font-size: 14.4px;
                        padding: 6px 14px;
                    }
                    .btn-reject {
                        background: #f0f0f0;
                        &:hover {
                            background: #28a745;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
    .hide-btn-labels::v-deep {
        .btn {
            display: none;
        }
    }
</style>
