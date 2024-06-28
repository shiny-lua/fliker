<template>
    <div class="status-card"
         :class="{
            'd-none': mode === 'account' && statuses.length === 0 && !isMyProfile,
            'profile-status-card': mode === 'account',
            'profile-status-card-others': mode === 'account' && (!auth_user || auth_user.id != user_id),
         }"
    >
        <div v-if="visibleAddStatus" class="mt-2 d-none d-md-block">
            <router-link :to="{name: 'fliconn.create.status'}" class="add-status">
                <fp-icon name="camera-dashed-1" class="mr-2" style="font-size: 40px;" />
                Add your Status Story
            </router-link>
        </div>
        <div class="mt-3" style="padding-right: 5px;">
            <fp-slider v-if="statuses.length && showStatuses"
                 :slide-count="statuses.length"
                 :slide-width="176"
                 :item-padding="5"
            >
                <status-item v-for="(item, index) in statuses"
                    :key="index"
                    :status="item"
                    :removable="auth_user && auth_user.id === item.user_id && (mode === 'account' || mode === 'fliconn_index')"
                    @open="openStatusOverview(index)"
                    @deleted="removeStatus"
                    class="status-item"
                ></status-item>
            </fp-slider>
            <div v-else-if="loading"
                class="text-muted no-status"
            >
                <img src="@/assets/images/logo_loading.gif" width="50" height="50" alt="">
            </div>
        </div>
        <status-overview v-if="openOverview"
             ref="overview"
             :mode="mode"
             :statuses="overviewStatuses"
             @close="openOverview = false"
             @select="selectStatuses"
        />
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import StatusOverview from "./status/StatusOverview.vue";
    import StatusItem from "./status/StatusItem.vue";
    import FpSlider from "~/components/ui/FpSlider.vue";
    export default {
        name: "StatusCard",
        props: {
            mode: { type: String, default: "fliconn_index" },
            user_id: { type: Number, required: false },
        },
        components: {
            FpSlider,
            StatusOverview,
            StatusItem,
        },
        data() {
            return {
                statuses: [],
                user: {},
                selected_status: null,
                openOverview: false,
                overviewStatuses: [],
                showStatuses: true,
                loading: false,
            };
        },
        computed: {
            isMyProfile() {
                return this.mode === "account" && this.auth_user && this.auth_user.id == this.user_id;
            },
            visibleAddStatus() {
                return  this.auth_user && this.user && this.auth_user.id === this.user.id || (!this.user_id && this.mode === 'fliconn_index')
            },
            ...mapGetters({
                auth_user: "auth/user",
                profile_visible_users: "fliconn/profile_visible_users",
            }),
        },
        mounted() {
            if (this.auth_user && this.user_id == this.auth_user.id) {
                this.user = this.auth_user;
            } else if (this.user_id) {
                this.getUserDetail();
            }

            this.getStatus();
        },
        methods: {
            async getUserDetail() {
                const response = await this.axios.post("/user/get_detail", {
                    id: this.user_id,
                });
                this.user = response.data.data;
            },
            async getStatus() {
                let params = {
                    mode: this.mode,
                    user_id: this.user_id,
                    profile_visible_users: this.profile_visible_users,
                };
                this.loading = true;
                try {
                    const response = await this.axios.post(`${process.env.timelineApiUrl}/status/search`, params);
                    this.statuses = response.data.data;
                    this.loading = false;
                } catch (error) {
                    this.loading = false;
                }
            },
            async save() {
                this.getStatus();
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
            async removeStatus(id) {
                this.showStatuses = false;
                await this.$nextTick();
                let index = this.statuses.findIndex((i) => i.id === id);
                this.statuses.splice(index, 1);
                this.showStatuses = true;
            },
            sliderChanged(index) {
                this.currentSlideIndex = index
            }
        },
    };
</script>

<style lang="scss" scoped>
    .status-card {
        &::v-deep {
            .slide-container {
                .slick-prev {
                    left: 0px;
                }
            }
        }
    }
    .add-status {
        color: #FF229F;
        font-weight: 500;
        font-size: 16px;
        display: inline-flex;
        align-items: center;
        .circle {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            margin-bottom: 0;
            &::before {
                border-width: 2px;
                // border-color: #D14D6C;
            }
        }
    }
    .image-container {
        max-height: 110px;
    }
    .slider-img {
        height: 305px;
        width: 100%;
        object-fit: cover;
    }
    .no-status {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;

        img {
            border-radius: 20px;
        }
    }
    .profile-status-card {
        .status-item::v-deep {
            .status-user-image,
            .status-user-username {
                display: none;
            }
        }
    }
    .status-item {
        margin: 0 6px;
    }
</style>
