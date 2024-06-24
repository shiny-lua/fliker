<template>
    <div class="page-activity-privace fp-table">
        <h5 class="text-center mb-4 d-none d-md-block">Your Login Activity</h5>
        <div>
            <div v-for="(item, index) in login_histories" :key="index" class="login-history-item fp-text-color-main fp-border-color-1">
                {{ renderItem(item) }}
            </div>
        </div>
        <div class="d-flex justify-content-end align-items-center">
            <div :class="{'d-none': page_count === 1 && login_histories.length <= filter.per_page}">
                <paginate
                    v-model="filter.page"
                    :page-count="page_count"
                    :page-range="3"
                    :margin-pages="2"
                    :prev-class="'page-item'"
                    :next-class="'page-item'"
                    :prev-link-class="'page-link'"
                    :next-link-class="'page-link'"
                    :click-handler="loadData"
                    :container-class="'pagination'"
                    :page-class="'page-item'"
                    :prev-text="'<'"
                    :next-text="'>'"
                    :page-link-class="'page-link'">
                </paginate>
            </div>
        </div>
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">Your Login Activity</h6>
        </portal>
    </div>
</template>
<script>
export default {
    name: 'LoginActivity',
    data() {
        return {
            login_histories: [],
            page_count: 0,
            total: 0,
            filter: {
                page: 1,
                per_page: 10,
                user_id: null,
            }
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.filter.user_id = this.auth_user.id
        this.loadData();
    },
    methods: {
        async loadData() {
            const response = await this.axios.post(`/get_login_histories`, this.filter)
            if (response.data.status == 'Success') {
                let result = response.data.data
                this.login_histories = result.data;
                this.page_count = result.last_page;
                this.filter.per_page = result.per_page;
                this.total = result.total;
            }
        },
        renderItem(item) {
            return `Logged in from ${item.ip_address} | ${item.os} | ${item.browser} | ${item.timezone} | ${item.location.city} | ${item.location.state} | ${item.location.country} | ${this.$moment(item.local_time).format('MMM DD, YYYY : HH:mm:ss')}`;
        }
    }
}
</script>
<style lang="scss" scoped>
    .login-history-item {
        padding: 8px 14px;
        border-radius: 8px;
        margin-bottom: 12px;
        border-width: 1px;
        border-style: solid;
    }
</style>