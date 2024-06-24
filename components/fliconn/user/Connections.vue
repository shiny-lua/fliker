<template>
    <div class="connections">
        <div class="nav-container fp-card round-8 mb-3">
            <ul class="nav nav-filter">
                <li class="nav-item">
                    <a class="nav-link fp-text-color-main" :class="{ active: tab === 'followers' }" @click.prevent="tab = 'followers'">
                        <fp-icon name="users-check" />
                        Followers
                        <span>({{user.followers_count}})</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link fp-text-color-main" :class="{ active: tab === 'following' }" @click.prevent="tab = 'following'">
                        <fp-icon name="user-check" />
                        Following
                        <span>({{user.following_count}})</span>
                    </a>
                </li>
                <li v-if="isMyProfile" class="nav-item">
                    <a class="nav-link fp-text-color-main" :class="{ active: tab === 'request_sent' || tab === 'request_received' }" @click.prevent="tab = 'request_received'">
                        <fp-icon name="request" />
                        Requests
                        <sup v-if="auth_user && auth_user.received_follow_requests_count" class="badge badge-pill badge-danger">
                            {{ auth_user.received_follow_requests_count }}
                        </sup>
                    </a>
                </li>
                <li v-if="isMyProfile" class="nav-item ml-auto">
                    <router-link :to="{name: 'fliconn.users'}" class="nav-link fp-text-color-main" v-tooltip="'Find new people'">
                        <fp-icon name="search" style="font-size: 20px;" />
                    </router-link>
                </li>
            </ul>
        </div>
        <p v-if="tab === 'request_sent' || tab === 'request_received'" class="pl-2">
            Find your <a href="javascript:;"
                class="text-underline"
                @click.prevent="tab = tab === 'request_sent' ? 'request_received' : 'request_sent'"
            >{{ tab === "request_sent" ? "Received Requests" : "Sent Requests" }}</a>
        </p>
        <p v-if="peopleHidden && (tab === 'followers' || tab === 'following')" class="fp-text-color-main text-center">
            {{ user.first_name }}'s {{tab === 'following' ? 'followings' : 'followers'}} are hidden to you!
        </p>
        <div v-else class="connection-users">
            <fliconn-user-item v-for="(item, index) in users"
                 :key="index"
                 :user="item"
                 :type="tab"
                 @request-accepted="users.splice(index, 1)"
                 @request-deleted="users.splice(index, 1)"
            />
            <infinite-loading
                :distance="300"
                :identifier="infiniteId"
                @infinite="getUsers"
            >
                <div slot="no-more"></div>
                <div slot="no-results">
                    <p v-if="tab === 'followers'" class="fp-text-color-main">
                        {{ isMyProfile ? "You do not have any followers!" : `${user.first_name} has no followers yet!` }}
                    </p>
                    <p v-else-if="tab === 'following'" class="fp-text-color-main">
                        {{ isMyProfile ? "You are not following anyone yet!" : `${user.first_name} is not following anyone yet!` }}
                    </p>
                    <p v-else-if="tab === 'request_sent'" class="fp-text-color-main">No sent requests</p>
                    <p v-else-if="tab === 'request_received'" class="fp-text-color-main">No new requests</p>
                </div>
            </infinite-loading>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import FliconnUserItem from "./FliconnUserItem.vue";
    export default {
        name: "FliconnConnections",
        props: ["user"],
        components: {
            FliconnUserItem,
        },
        data() {
            return {
                tab: "followers",
                users: [],
                page: 1,
                total_users: 0,
                infiniteId: +new Date(),
            };
        },
        computed: {
            isMyProfile() {
                return this.auth_user && this.auth_user.id === this.user.id;
            },
            peopleHidden() {
                return !this.isMyProfile && this.profile_option && !this.profile_option.visible_people;
            },
            ...mapGetters({
                auth_user: "auth/user",
                profile_option: "fliconn/profile_option",
            }),
        },
        watch: {
            tab() {
                this.reset();
                this.infiniteId++;
            }
        },
        mounted() {
            let tab = this.$route.query.tab;
            if (tab === "connections") {
                let sub_tab = this.$route.query.sub_tab;
                if (sub_tab) this.tab = sub_tab;
            }
            this.$store.dispatch("fliconn/getProfileOption", this.user.id);
        },
        methods: {
            reset() {
                this.page = 1;
                this.total_users = 0;
                this.users = [];
            },
            async getUsers($state) {
                const payload = {
                    user_id: this.user.id,
                    type: this.tab,
                    page: this.page,
                };
                const response = await this.axios.post('/user/get_connections', payload);
                if (response.data.status === 'Success') {
                    let result = response.data.data
                    if (result.current_page === 1) this.users = [];
                    if(result.data.length) {
                        this.page++;
                        this.users.push(...result.data);
                        this.total_users = result.total;
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
    .nav-container {
        @media (max-width: 768px) {
            overflow: auto;
        }
    }
    .nav.nav-filter {
        flex-wrap: nowrap;
        .nav-item {
            display: flex;
            align-items: center;
            margin-right: 20px;
            &:last-child {
                margin-right: 0;
            }
            @media (max-width: 600px) {
                svg {
                    width: 22px;
                }
                .nav-link {
                    font-size: 13.6px;
                    margin-right: 4px;
                }
            }
        }
        .nav-link {
            background-color: unset;
            font-size: 15px;
            line-height: 25.78px;
            padding: 0px;
            margin-left: 4px;
            white-space: nowrap;
            cursor: pointer;
            svg {
                font-size: 24px;
            }
            &.active {
                color: #FF22A1 !important;
            }
        }
    }
</style>
