<template>
    <div class="groups-wrapper" :class="page === 'profile' && 'profile-groups'">
        <div class="fp-card round-8 mb-3">
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
                         :class="{ active: (type === 'group' && tab === 'my_groups') || (type === 'page' && tab === 'my_pages') }"
                         @click.prevent="tab = type === 'group' ? 'my_groups' : 'my_pages'"
                    >
                        <fp-icon name="user-check-circle" />
                        {{ type === 'group' ? 'My Groups' : 'My Pages'}}
                    </a>
                </li>
                <li class="nav-item" :class="page === 'profile' && 'ml-md-4'">
                    <a class="nav-link fp-text-color-main px-0" :class="{ active: filter.following }" @click.prevent="tab = 'following'">
                        <fp-icon :name="type" />
                        {{ type === "group" ? "Joined" : "Following" }}
                    </a>
                </li>
                <li v-if="page === 'profile' && type === 'group' && auth_user && user_id === auth_user.id"
                     class="nav-item"
                     :class="page === 'profile' && 'ml-md-4'"
                >
                    <a class="nav-link fp-text-color-main px-0" :class="{ active: tab === 'requests' }" @click.prevent="tab = 'requests'">
                        <fp-icon name="request" />
                        Requests
                        <span v-if="join_requests.length" class="badge badge-danger badge-pill">{{ join_requests.length }}</span>
                    </a>
                </li>
                <li class="nav-item" :class="page === 'profile' && 'ml-auto'">
                    <router-link :to="{name: 'group.search', params: {type: type}}">
                        <fp-icon name="search" class="icon-search fp-text-color-main" />
                    </router-link>
                </li>
            </ul>
        </div>

        <div v-if="page === 'profile' && user_id && (auth_user && user_id === auth_user.id)" class="mb-3">
            <add-group :type="type"></add-group>
        </div>

        <div v-show="tab !== 'requests'" class="groups-list">
            <group-item v-for="(item, index) in groups"
                 :key="index"
                 :group="item"
                 @joined="joined"
                 class="mb-2 mb-md-3"
                 :class="!type && filter.following && 'hide-btn-labels'"
            ></group-item>
            <infinite-loading :distance="300" :identifier="infiniteId" @infinite="searchGroups" force-use-infinite-wrapper=".groups-list">
                <div slot="no-more"></div>
                <div slot="no-results">
                    <p class="text-muted text-center">
                        <span v-if="type === 'group' && tab === 'my_groups'">{{ username && !isMyProfile ? username : "You" }} did not create any groups yet!</span>
                        <span v-if="type === 'page' && tab === 'my_pages'">{{ username && !isMyProfile ? username : "You" }} did not create any pages yet!</span>
                        <span v-if="type === 'group' && tab === 'following'">{{ username && !isMyProfile ? username : "You" }} did not join any groups yet!</span>
                        <span v-if="type === 'page' && tab === 'following'">{{ username && !isMyProfile ? `${username} is` : "You are" }} not following any pages yet!</span>
                    </p>
                </div>
                <div slot="spinner" class="pt-3 pt-md-4">
                    <img src="~assets/images/logo_loading.gif" width="50" alt="" />
                </div>
            </infinite-loading>
        </div>
        <div v-show="tab === 'requests'" class="join-requests-list">
            <div v-for="item in join_requests" :key="item.id" class="join-request-item">
                <img :src="item.user.photo_url" alt="" />
                <div class="detail">
                    <p>{{ item.user.name }} is waiting to join your group "<span class="text-primary">{{ item.group.title }}</span>"</p>
                    <div class="actions">
                        <a href="javascript:;" class="btn btn-success" @click.prevent="acceptRequest(item, index)">Accept</a>
                        <a href="javascript:;" class="btn btn-reject ml-2" @click.prevent="rejectRequest(item, index)">Reject</a>
                    </div>
                </div>
            </div>
            <p v-if="!join_requests.length" class="text-center text-muted">
                No pending requests!
            </p>
        </div>
    </div>
</template>
<script>
    import GroupItem from "./GroupItem.vue";
    import AddGroup from "./AddGroup.vue";
    export default {
        name: "GroupIndex",
        props: {
            user_id: { type: [Number, String], required: false },
            user: { type: Object, required: false },
            type: { type: String, default: 'group' },
            page: { type: String, default: 'index' },
        },
        components: {
            GroupItem,
            AddGroup,
        },
        data() {
            return {
                groups: [],
                filter: {
                    type: this.type ? this.type : "",
                    user_id: this.user_id,
                    keyword: "",
                    following: false,
                    page: 1,
                },
                join_requests: [],
                infiniteId: +new Date(),
                tab: "",
            };
        },
        watch: {
            tab(tab) {
                if (tab === "my_groups") {
                    this.filter.user_id = this.user ? this.user.id : this.auth_user.id;
                    this.search("type", "group");
                } else if (tab === "my_pages") {
                    this.filter.user_id = this.user ? this.user.id : this.auth_user.id;
                    this.search("type", "page");
                } else if (this.type && tab === "following") {
                    this.filter.type = this.type;
                    this.filter.following = true;
                    this.filter.page = 1;
                    this.infiniteId += 1;
                } else if (tab === "requests") {
                    this.filter.following = false;
                    this.getJoinRequests();
                } else if (tab === 'all') {
                    this.filter.user_id = '';
                    this.search("type", this.type);
                }
            },
            type(value) {
                this.tab = value === "page" ? "my_pages" : "my_groups";
                this.filter.following = false;
                this.filter.type = value;
                this.filter.page = 1;
                this.infiniteId += 1;
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
            let query_type = this.$route.query.type;
            if (sub_tab) {
                this.tab = sub_tab;
            } else if (keyword && query_type) {
                this.filter.type = query_type;
                this.filter.keyword = keyword;
            } else if (this.page === 'profile') {
                this.tab = this.type === "page" ? "my_pages" : "my_groups";
            } else {
                this.tab = 'all'
            }
            if (this.user_id) this.getJoinRequests();
        },
        methods: {
            async search(field, value) {
                if (field === "type") this.filter.following = false;
                if (field === "following") this.filter.type = "";
                this.filter[field] = value;
                if (this.type) this.filter.type = this.type;
                this.filter.page = 1;
                this.groups = [];
                await this.$nextTick();
                this.infiniteId += 1;
            },
            async searchGroups($state) {
                try {
                    const response = await this.axios.post(`${process.env.timelineApiUrl}/group/search`, this.filter);
                    let result = response.data.data;
                    if (result.current_page == 1) this.groups = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.groups.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                } catch (e) {}
            },
            addGroup(type) {
                this.search("type", this.filter.type === "" ? "" : type);
            },
            joined() {
                this.$store.dispatch("fetchNotifications");
            },
            async getJoinRequests() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_join_requests`, { user_id: this.user_id });
                if (response.data.status === "Success") {
                    this.join_requests = response.data.data;
                }
            },

            async acceptRequest(item, index) {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/accept_request`, { id: item.id });
                if (response.data.status === "Success") {
                    this.join_requests.splice(index, 1);
                    let notiFb = this.$fire.database.ref("notifications/" + item.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "accept_join_request",
                    });
                }
            },
            async rejectRequest(item, index) {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/reject_request`, { id: item.id });
                this.join_requests.splice(index, 1);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .groups-wrapper {
        border-radius: 12px;
        &.profile-groups {
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
    .icon-search {
        font-size: 22px;
    }
</style>
