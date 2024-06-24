<template>
    <div class="fliconn-timeline-index">
        <div v-for="(item, index) in posts"
             :key="index"
             class="timeline-item fp-border-color-1 mb-3 mb-md-4"
             :class="!isVisible(item) && 'd-none'"
        >
            <timeline-item :post="item"
                 page="page"
                 @user-selected="goFliconnProfile(item.user)"
                 @follow="follow"
                 @unfollow="unfollow"
                 @hide="posts.splice(index, 1)"
                 @deleted="postDeleted(index)"
            />
            <slot name="circle-people" :index="index" />
        </div>
        <infinite-loading :distance="300"
            :identifier="infiniteId"
            @infinite="search"
        >
            <div slot="no-more"></div>
            <div class="text-center" slot="no-results">{{ placeholderNoResult }}</div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>
    </div>
</template>
<script>
    import TimelineItem from "./TimelineItem.vue";
    export default {
        name: "TimelineIndex",
        props: {
            prop_filter: { type: Object, default: () => new Object()},
            placeholderNoResult: { type: String, default: ''},
        },
        components: {
            TimelineItem,
        },
        data() {
            return {
                posts: [],
                filter: {
                    ...this.prop_filter,
                    keyword: "",
                    page: 1,
                },
                infiniteId: +new Date(),
                page_count: 0,
                total: 0,
                per_page: 15,
                loaded: false,
            };
        },
        computed: {
            auth_user() {
                return this.$store.getters['auth/user'];
            }
        },
        methods: {
            searchForm(keyword = '') {
                this.posts = [];
                this.filter.keyword = keyword;
                this.filter.page = 1;
                this.infiniteId += 1;
            },
            async search($state) {
                try {
                    const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/search`, this.filter);
                    if (response.data.status == "Success") {
                        let result = response.data.data;
                        if (result.current_page == 1) this.posts = [];
                        if (result.data.length) {
                            this.filter.page++;
                            this.posts.push(...result.data);
                            $state.loaded();
                        } else {
                            $state.complete();
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            goFliconnProfile(item) {
                this.$router.push({
                    name: "fliconn.profile",
                    params: { username: item.username },
                });
            },
            async follow(item) {
                const data = await this.$store.dispatch("requestFollow", item.id);
                if (data.status === "Success") {
                    this.$fpSuccess(data.message);
                    this.$store.dispatch('auth/getCircleUsers');
                    let notiFb = this.$fire.database.ref("notifications/" + item.id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "follow_request",
                    });
                }
            },
            async unfollow(item) {
                const response = await this.axios.post('/user/unfollow', {user_id: item.id, follower_id: this.auth_user.id});
                if (response.data.status === "Success") {
                    this.$store.dispatch('auth/getCircleUsers');
                }
            },
            isVisible(item) {
                if (!item.visible) return false;
                if (item.poll && item.poll.is_expired) return false;
                return true;
            },
            postDeleted(index) {
                this.posts.splice(index, 1);
                this.$emit('post-deleted');
            }
        },
    };
</script>
