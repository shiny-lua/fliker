<template>
    <div class="clips-wrapper">
        <div class="row mx-n1">
            <div v-if="auth_user && user.id === auth_user.id" class="col-12 px-1 mb-2 d-flex align-items-center">
                <add-clips-button redirect-url="/clips/create" class="mr-3" title="Add new short flick" />
                <select v-if="clips.length !== 0" v-model="order_by" class="select-order-by form-control form-control-sm has-bg ml-auto">
                    <option value="most_recent">Most Recent</option>
                    <option value="oldest">Oldest</option>
                    <option value="view_count">Highest Views</option>
                    <option value="likes_count">Highest Likes</option>
                </select>
            </div>
            <div v-for="(item, index) in clips" :key="index" class="col-6 col-lg-4 px-1 mb-2">
                <clips-item :clips="item"
                    :removable="auth_user && auth_user.id === item.user_id"
                    @deleted="clips.splice(index, 1)"
                    @open="openClipsOverview(index)"
                ></clips-item>
                <!-- <top-rated-clips v-if="(auth_user && auth_user.id === user.id && index === 10) || index === 11"></top-rated-clips> -->
            </div>
        </div>
        <infinite-loading :distance="300" :identifier="infiniteId" @infinite="searchClips" force-use-infinite-wrapper=".clips-wrapper">
            <div slot="no-more"></div>
            <div slot="no-results">No flicks found!</div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>
        <clips-overview v-if="openOverview" ref="overview" :clips="overviewClips" @close="openOverview = false" @select="selectClips"></clips-overview>
    </div>
</template>
<script>
    import Form from "vform";
    import ClipsOverview from "./ClipsOverview.vue";
    import ClipsItem from "./ClipsItem.vue";
    import TopRatedClips from "./TopRated.vue";
    import AddClipsButton from "./AddClipsButton.vue";
    export default {
        name: "ClipsProfileIndex",
        props: ["user"],
        components: {
            ClipsOverview,
            ClipsItem,
            TopRatedClips,
            AddClipsButton,
        },
        data() {
            return {
                clips: [],
                comment_form: new Form({
                    clip_id: null,
                    detail: "",
                }),
                is_playing: false,
                openOverview: false,
                overviewClips: [],
                page: 1,
                infiniteId: +new Date(),
                order_by: "most_recent",
            };
        },
        computed: {
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        watch: {
            order_by() {
                this.search();
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.infiniteId += 1;
            });
        },
        methods: {
            search() {
                this.page = 1;
                this.infiniteId++;
            },
            async searchClips($state) {
                let params = {
                    user_id: this.user?.id,
                    // keyword: this.$refs.keyword?.value,
                    order_by: this.order_by,
                    page: this.page,
                };
                const response = await this.axios.post(`${process.env.clipsApiUrl}/clips/search`, params);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.clips = [];
                    if (result.data.length) {
                        this.page++;
                        this.clips.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            },
            async openClipsOverview(index) {
                this.loadOverviewClips(index);
                await this.$nextTick();
                this.openOverview = true;
            },
            async selectClips(payload) {
                if (!payload.mode) {
                    const index = this.clips.findIndex((i) => i.id === payload.id);
                    this.loadOverviewClips(index);
                } else if (payload.mode === "next") {
                    const currentIndex = this.clips.findIndex((i) => i.id === payload.id);
                    const index = currentIndex === this.clips.length - 1 ? currentIndex + 1 : 0;
                    this.loadOverviewClips(index);
                } else if (payload.mode === "prev") {
                    const currentIndex = this.clips.findIndex((i) => i.id === payload.id);
                    const index = currentIndex === 0 ? this.clips.length - 1 : currentIndex - 1;
                    this.loadOverviewClips(index);
                }
            },
            loadOverviewClips(index) {
                let overviewClips = [];
                let i = 0;
                while (i < 5 && !overviewClips.includes(this.clips[index])) {
                    overviewClips.push(this.clips[index]);
                    index = index == this.clips.length - 1 ? 0 : index + 1;
                    i++;
                }
                this.overviewClips = overviewClips;
            },
        },
    };
</script>
<style lang="scss" scoped>
    .clips-index-header {
        display: flex;
        align-items: center;
    }
    .top-rated-clips-container {
        max-width: 100%;
        @media (min-width: 600px) {
            display: none;
        }
    }
    .select-order-by {
        margin-left: auto;
        width: 150px;
        margin-right: 2px;
    }
    .search-form {
        width: 160px;
        input {
            border-radius: 10px;
        }
    }
</style>
