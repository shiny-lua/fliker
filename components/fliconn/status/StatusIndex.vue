<template>
    <div class="page-fliconn-status">
        <div class="px-1 px-lg-2">
            <div class="status-filter mb-2">
                <span class="filter-item" :class="filter.filter === 'most_recent' && 'active'" @click="filter.filter = 'most_recent'">Most Recent</span>
                <span class="filter-item" :class="filter.filter === 'following' && 'active'" @click="filter.filter = 'following'">Following</span>
                <span class="filter-item" :class="filter.filter === 'tagged_me' && 'active'" @click="filter.filter = 'tagged_me'">@Tagged me</span>
            </div>
            <div class="row mx-n1 mx-lg-n2">
                <div v-if="auth_user && user && auth_user.id === user.id" class="col-4 col-lg-3 mb-3 px-1 px-lg-2">
                    <div class="card-add-status">
                        <div class="add-status mb-3" @click="$refs.form.open()">
                            <div class="circle">
                                <fa icon="plus" />
                            </div>
                        </div>
                        Add Status
                    </div>
                </div>
                <div v-for="(item, index) in statuses" :key="index" class="col-4 col-lg-3 mb-3 px-1 px-lg-2">
                    <status-item :status="item"
                             @open="openStatusOverview(index)"
                             :removable="auth_user && auth_user.id === item.user_id"
                             @deleted="statuses.splice(index, 1)"
                    ></status-item>
                </div>
            </div>
            <infinite-loading v-if="profile_visible_users.length"
                     :distance="300"
                     :identifier="infiniteId"
                     @infinite="search"
                     force-use-infinite-wrapper=".page-fliconn-status"
            >
                <div slot="no-more"></div>
                <div class="text-center" slot="no-results"></div>
                <div slot="spinner" class="pt-3 pt-md-4">
                    <img src="~assets/images/logo_loading.gif" width="50" alt="" />
                </div>
            </infinite-loading>
        </div>
        <status-overview v-if="openOverview" ref="overview" :statuses="overviewStatuses" :page="page" @close="openOverview = false" @select="selectStatuses"></status-overview>
        <status-form ref="form" @saved="getStatus"></status-form>
    </div>
</template>
<script>
    import Swal from "sweetalert2";
    import { mapGetters } from "vuex";
    import StatusOverview from "./StatusOverview.vue";
    import StatusForm from "./StatusForm.vue";
    import StatusItem from "./StatusItem.vue";
    export default {
        name: "StatusIndex",
        props: ["page", "user_id"],
        components: {
            StatusOverview,
            StatusForm,
            StatusItem,
        },
        data() {
            return {
                statuses: [],
                filter: {
                    mode: "status_index",
                    profile_visible_users: [],
                    page: 1,
                    filter: "most_recent",
                },
                infiniteId: +new Date(),
                user: {},
                openOverview: false,
                overviewStatuses: [],
            };
        },
        computed: mapGetters({
            auth_user: "auth/user",
            profile_visible_users: "fliconn/profile_visible_users",
        }),
        watch: {
            user_id: function () {
                this.getUserDetail();
                this.getStatus();
            },
            "filter.filter": function (value) {
                this.getStatus();
            },
        },
        mounted() {
            if (this.auth_user && this.user_id == this.auth_user.id) {
                this.user = this.auth_user;
            } else {
                this.getUserDetail();
            }
        },
        methods: {
            async getUserDetail() {
                await this.axios
                    .post("/user/get_detail", {
                        id: this.user_id,
                    })
                    .then((response) => (this.user = response.data.data));
            },
            getStatus() {
                this.statuses = [];
                this.filter.page = 1;
                this.infiniteId++;
            },
            async search($state) {
                this.filter.profile_visible_users = this.profile_visible_users;
                try {
                    const response = await this.axios.post(`${process.env.timelineApiUrl}/status/search`, this.filter);
                    let result = response.data.data;
                    if (result.current_page == 1) this.statuses = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.statuses.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                } catch (error) {

                }
            },
            removeStatus(item, index) {
                Swal.fire({
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios.delete(`${process.env.timelineApiUrl}/status/delete/${item.id}`).then((response) => {
                            this.statuses.splice(index, 1);
                        });
                    }
                });
            },
            async openStatusOverview(index) {
                this.loadOverviewStatuses(index);
                await this.$nextTick();
                this.openOverview = true;
            },
            async selectStatuses(payload) {
                if (!payload.mode) {
                    const index = this.statuses.findIndex((i) => i.id === payload.id);
                    this.loadOverviewStatuses(index);
                } else if (payload.mode === "next") {
                    const currentIndex = this.statuses.findIndex((i) => i.id === payload.id);
                    const index = currentIndex === this.statuses.length - 1 ? currentIndex + 1 : 0;
                    this.loadOverviewStatuses(index);
                } else if (payload.mode === "prev") {
                    const currentIndex = this.statuses.findIndex((i) => i.id === payload.id);
                    const index = currentIndex === 0 ? this.statuses.length - 1 : currentIndex - 1;
                    this.loadOverviewStatuses(index);
                }
            },
            loadOverviewStatuses(index) {
                let overviewStatuses = [];
                let i = 0;
                while (i < 5 && !overviewStatuses.includes(this.statuses[index])) {
                    overviewStatuses.push(this.statuses[index]);
                    index = index == this.statuses.length - 1 ? 0 : index + 1;
                    i++;
                }
                this.overviewStatuses = overviewStatuses;
            },
            async follow(item, index) {
                this.$emit("follow", item.user);
                this.statuses.splice(index, 1);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .page-fliconn-status {
        h6 {
            font-size: 20px;
            line-height: 1.29;
            margin-bottom: 0;
            @media (max-width: 600px) {
                font-size: 16px;
            }
        }
        &::v-deep {
            .status {
                width: 100% !important;
                margin-left: 0;
            }
        }
    }
    .card-add-status {
        height: 210px;
        width: 100%;
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        border: dashed 2px #28a745;
        border-radius: 10px;
        color: #28a745;
        margin-top: 20px;
        .add-status {
            margin-top: 52px;
        }
    }
    .status-filter {
        display: flex;
        align-items: center;
        .filter-item {
            border: solid 2px #212529;
            padding: 2px 6px;
            border-radius: 8px;
            margin-right: 8px;
            font-size: 13px;
            cursor: pointer;
            &.active {
                border-color: #007bff;
                background-color: #007bff;
                color: #fff;
            }
        }
    }
</style>
