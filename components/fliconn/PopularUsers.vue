<template>
    <div class="popular-users fp-card" :class="!popular_users.length && 'd-none'">
        <div class="fp-card-header">
            <p class="fp-card-title">Popular people you may like</p>
        </div>
        <div class="fp-card-body pt-3">
            <ul class="mb-0">
                <li class="list"
                    v-for="(item, index) in popular_users.slice(0, 5)"
                    :key="index"
                >
                    <div class="profile" @click="goFliconnProfile(item)">
                        <img :src="item.photo_url" alt="" />
                    </div>
                    <div class="info" @click="goFliconnProfile(item)">
                        <p class="name">{{item.name}}</p>
                        <p class="username">@{{ item.username }}</p>
                    </div>
                    <a class="btn btn-sm ml-auto"
                        :class="{disabled: item.is_requested_follow}"
                        @click.prevent="follow(item)"
                    >
                        <fp-icon name="user-plus" class="fp-fs-18 fp-text-active" />
                    </a>
                </li>
                <li v-if="count_popular_users > 5" class="list justify-content-center">
                    <router-link
                        :to="{name: 'fliconn.users'}"
                        class="more-people fp-text-color-info"
                    >Find more...</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PopularUsers',
    data() {
        return {
            popular_users: [],
            count_popular_users: 0,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            let params = {
                user_id: this.auth_user.id,
                page: 1,
            }
            const response = await this.axios.post('/user/get_popular_users', params)
            this.popular_users = response.data.data.data
            this.count_popular_users = response.data.data.total
        },
        async follow(item) {
            await this.$emit('follow', item)
            this.init()
        },
        goFliconnProfile(item) {
            this.$router.push({name: 'fliconn.profile', params: {username: item.username}})
        },
    }
}
</script>

<style lang="scss" scoped>
    ul {
        padding-left: 0;
        li.list {
            padding: 0;
            display: -webkit-flex;
            display: flex;
            -webkit-justify-content: space-between;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            margin-bottom: 20.5px;
            &.active {
                background: #E7E7E7;
            }
            &:last-child {
                margin-bottom: 0;
            }
            .profile {
                position: relative;
                margin-right: 0.5rem;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                    object-fit: cover;
                }
                span {
                    position: absolute;
                    bottom: 3px;
                    right: -3px;
                    height: 0.6rem;
                    width: 0.6rem;
                    border: 0.1rem solid #ffffff;
                    min-width: 0.6rem;
                }
            }
            .info {
                width: 135px;
                p {
                    margin-bottom: 0;
                    max-width: calc(100% - 10px);
                    white-space: nowrap;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    &.username {
                        font-weight: 400;
                        color: #FF22A1;
                        font-size: 13px;
                        margin-bottom: 0;
                        line-height: 18px;
                        img {
                            margin-top: -1px;
                        }
                    }
                }
            }
            .btn {
                background: rgba(255, 34, 161, 0.102);
                padding: 7.4px 9px;
            }
        }
    }
    .more-people {
        font-size: 14.4px;
        white-space: nowrap;
    }
</style>