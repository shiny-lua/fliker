<template>
    <div class="group-users p-2">
        <div v-if="group.is_user" class="form-group mb-1">
            <div class="icon-prefix-input">
                <fp-icon name="add-group" />
                <input type="text" name="keyword" class="form-control" v-model="keyword" placeholder="Add people" />
            </div>
        </div>
        <div v-if="group.is_user && searched_users.length" class="searched-users nice-scrollbar fp-border-color-1">
            <div v-for="(item, index) in searched_users" :key="index" class="user-item fp-border-color-1">
                <img :src="item.photo_url" width="40" height="40" alt="" class="user-photo rounded-lg" />
                <div class="user-details flex-grow-1 d-flex align-items-center ml-2">
                    <div>
                        <p class="mb-0 font-weight-bold">{{ item.name }}</p>
                        <p class="mb-0 username">@{{ item.username }}</p>
                    </div>
                    <div class="actions ml-auto">
                        <a href="javascript:;" class="btn btn-sm fp-btn-gradient py-1 px-3" @click.prevent="addUser(item, index)">Add</a>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="searched_users.length === 0" class="group-users-list nice-scrollbar">
            <div class="mb-3 mt-2">
                <h6 class="sub-title">Group Admins</h6>
                <div v-for="(item, index) in groupAdmins" :key="index" class="user-item fp-border-color-1" @click="openProfile(item)">
                    <img :src="item.photo_url" width="40" height="40" alt="" class="user-photo rounded-lg" />
                    <div class="user-details flex-grow-1 d-flex align-items-center ml-2">
                        <div>
                            <p class="mb-0 font-weight-bold">{{ item.name }}</p>
                            <p class="mb-0 username">@{{ item.username }}</p>
                        </div>
                        <div v-if="group.is_admin" class="actions ml-auto fp-text-color-main">
                            <a href="javascript:;" @click.prevent="removeUser(item, index)">
                                <img src="~/assets/images/icons/remove.png" width="18" />
                            </a>
                            <template v-if="group.is_primary_admin">
                                <a v-if="item.pivot && item.pivot.is_admin" href="javascript:;" class="ml-2" @click.stop="setAsAdmin(item, false)">
                                    <fp-icon name="user-check" class="fp-fs-20" />
                                </a>
                                <a v-else href="javascript:;" class="ml-2" @click.stop="setAsAdmin(item, true)">
                                    <fp-icon name="user-admin" class="fp-fs-20" />
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h6 class="sub-title">Other Members</h6>
                <div v-for="(item, index) in otherMembers" :key="index" class="user-item fp-border-color-1" @click="openProfile(item)">
                    <img :src="item.photo_url" width="40" height="40" alt="" class="user-photo rounded-lg" />
                    <div class="user-details flex-grow-1 d-flex align-items-center ml-2">
                        <div>
                            <p class="mb-0 font-weight-bold">{{ item.name }}</p>
                            <p class="mb-0 username">@{{ item.username }}</p>
                        </div>
                        <div v-if="group.is_admin" class="actions ml-auto fp-text-color-main">
                            <a href="javascript:;" @click.prevent="removeUser(item, index)">
                                <img src="~/assets/images/icons/remove.png" width="18" />
                            </a>
                            <template v-if="group.is_primary_admin">
                                <a v-if="item.pivot && item.pivot.is_admin" href="javascript:;" class="ml-2" @click.stop="setAsAdmin(item, false)">
                                    <fp-icon name="user-check" class="fp-fs-20" />
                                </a>
                                <a v-else href="javascript:;" class="ml-2" @click.stop="setAsAdmin(item, true)">
                                    <fp-icon name="user-admin" class="fp-fs-20" />
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    name: 'GroupUsers',
    props: {
        group: { type: Object, required: true },
    },
    data() {
        return {
            users: [],
            searched_users: [],
            loading: false,
            keyword: '',
        }
    },
    computed: {
        groupAdmins() {
            return this.users.filter(item => item.pivot.is_admin);
        },
        otherMembers() {
            return this.users.filter(item => !item.pivot.is_admin);
        },
        ...mapGetters({
            auth_user: 'auth/user',
        }),
    },
    watch: {
        keyword() {
            this.handleSearch(this.keyword);
        }
    },
    mounted() {
        this.getUsers();
    },
    methods: {
        async getUsers() {
            try {
                let payload = {
                    page: this.page,
                    id: this.group.id
                }
                const response = await this.axios.post(`${process.env.chatApiUrl}/group/get_users`, payload);
                if (response.data.status == "Success") {
                    this.users = response.data.data;
                }
                this.loading = false;
            } catch (error) { }
        },
        handleSearch(keyword) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (keyword == '') {
                    this.searched_users = [];
                } else {
                    this.searchUsers(keyword);
                }
            }, 500);
        },
        async searchUsers(keyword) {
            this.loading = true;
            try {
                const response = await this.axios.post('/user/get_same_country_users', {keyword: keyword});
                this.searched_users = response.data.data.data;
            } catch (error) { }
            this.loading = false;
        },
        async addUser(item, index) {
            let payload = {
                id: this.group.id,
                user_id: item.id
            }
            try {
                const response = await this.axios.post(`${process.env.chatApiUrl}/group/add_user`, payload);
                if (response.data.status === 'Success') {
                    this.searched_users.splice(index, 1);
                    item.pivot = {is_admin: false};
                    this.users.push(item);
                }
            } catch (error) {
                this.$toast.error(error.response.data.message);
            }

        },
        async removeUser(item, index) {
            let payload = {
                id: this.group.id,
                user_id: item.id
            }
            const response = await this.axios.post(`${process.env.chatApiUrl}/group/remove_user`, payload);
            if (response.data.status === 'Success') {
                this.users.splice(index, 1);
            }
        },
        async setAsAdmin(item, value) {
            let payload = {
                id: this.group.id,
                user_id: item.id,
                is_admin: value,
            }
            const response = await this.axios.post(`${process.env.chatApiUrl}/group/set_as_admin`, payload);
            if (response.data.status === 'Success') {
                item.pivot.is_admin = response.data.data;
            }
        },
        openProfile(item) {
            this.$router.push({name: 'fliconn.profile', params: { username: item.username }});
        }
    }
}
</script>
<style lang="scss" scoped>
    .group-users {
        .searched-users {
            max-height: 250px;
            overflow-y: auto;
            border-style: solid;
            border-width: 1px;
            border-radius: 6px;
            padding: 4px 8px;
            .user-item {
                display: flex;
                border-bottom: solid 1px #E1E1E1;
                padding: 8px 0;
                &:last-child {
                    border-bottom: none;
                }
                .user-photo {
                    min-width: 40px;
                    object-fit: cover;
                }
                .username {
                    font-size: 13px;
                    color: #3F48CC;
                }
            }
        }
        .group-users-list {
            max-height: 350px;
            overflow-y: auto;
            .sub-title {
                margin-bottom: 0;
                font-size: 14.4px;
                font-weight: 600;
            }
            .user-item {
                display: flex;
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding: 8px 0;
                cursor: pointer;
                &:last-child {
                    border-bottom: none;
                }
                .user-photo {
                    min-width: 40px;
                    object-fit: cover;
                }
                .username {
                    font-size: 13px;
                    color: #3F48CC;
                }
            }
        }
    }
</style>