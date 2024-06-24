<template>
    <div class="pt-3 pt-md-4">
        <div class="d-flex justify-content-center">
            <div class="fliconn-users">
                <div class="input-container">
                    <input type="text"
                         class="form-control has-bg"
                         v-model="filter.keyword"
                         placeholder="Search name or search with @username"
                         @input="debounceSearchUsers"
                    />
                    <fp-icon name="search" class="fp-fs-18" style="color: #90949C;" />
                </div>

                <div class="search-users-list">
                    <div class="users-wrapper">
                        <fliconn-user-item v-for="(item, index) in users"
                                :key="index"
                                :user="item"
                        />
                    </div>
                    <infinite-loading
                        :distance="300"
                        :identifier="infiniteId"
                        @infinite="search"
                    >
                        <div slot="no-more"></div>
                        <div slot="no-results">No results found...</div>
                    </infinite-loading>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FliconnUserItem from "~/components/fliconn/user/FliconnUserItem.vue"
export default {
    name: 'FliconnUsers',
    middleware: 'auth',
    components: {
        FliconnUserItem,
    },
    data() {
        return {
            users: [],
            filter: {
                page: 1,
                keyword: '',
            },
            infiniteId: +new Date(),
            tm: null,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        debounceSearchUsers() {
            clearTimeout(this.tm);
            this.tm = setTimeout(() => {
                this.searchUsers();
            }, 500);
        },
        searchUsers() {
            this.users = [];
            this.filter.page = 1;
            this.infiniteId += 1;
        },
        async search($state) {
            const response  = await this.axios.get('/user/search', {params: this.filter});
            if (response.data.status == 'Success') {
                let result = response.data.data
                if (result.current_page == 1) this.users = [];
                if(result.data.length) {
                    this.filter.page++;
                    this.users.push(...result.data);
                    $state.loaded();
                } else {
                    $state.complete();
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    [data-theme=dark] {
        .input-container {
            input {
                background-color: #00162D;
            }
        }
    }
    .input-container {
        position: relative;
        margin-bottom: 12px;
        input {
            padding-right: 30px;
            font-size: 14.4px;
            border: none;
        }
        svg {
            position: absolute;
            top: 9px;
            right: 9px;
            z-index: 1;
        }
    }
    .users-wrapper {
        &::v-deep {
            .fliconn-user-item:last-child {
                margin-bottom: 0;
            }
        }
    }
    .fliconn-users {
        width: 100%;
        max-width: 520px;
    }
</style>