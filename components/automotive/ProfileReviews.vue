<template>
    <div class="profile-reviews nice-scrollbar">
        <review-item v-for="(item, index) in reviews"
             :key="index"
             :review="item"
             :profileImg="profile.image ? profile.image.src_url : require('@/assets/images/logo.png')"
             :profileUserId="profile.user_id"
             class="review-item"
             @edit="editReview"
        />
        <div v-if="loading" class="text-center mt-3">
            <div class="spinner-border text-muted" style="width: 25px;height: 25px; border-width: 2px;"></div>
        </div>
        <div v-if="filter.page <= last_page && !loading" class="text-left mt-1">
            <a href="javascript:;" class="fp-text-color-primary" @click="getReviews()">Read more...</a>
        </div>
    </div>
</template>
<script>
    import ReviewItem from "~/components/ui/review/ReviewItem.vue";
    export default {
        name: 'ProfileReviews',
        props: {
            profile: { type: Object, required: true },
        },
        components: {
            ReviewItem,
        },
        data() {
            return {
                reviews: [],
                filter: {
                    profile_id: this.profile.id,
                    per_page: 3,
                    page: 1,
                },
                loading: false,
                last_page: 2,
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.filter.page = 1;
                this.getReviews();
            },
            async getReviews() {
                this.loading = true;
                const response = await this.axios.post(`${process.env.adsApiUrl}/automotive/get_reviews`, this.filter);
                this.loading = false;
                if (response.data.status === 'Success') {
                    const result = response.data.data;
                    if (result.current_page === 1) this.reviews = [];
                    this.reviews.push(...result.data);
                    this.filter.page++;
                    this.last_page = result.last_page;
                }
            },
            editReview(review) {
                this.$emit('edit-review', review);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .profile-reviews {
        max-height: 500px;
        overflow-y: auto;
    }
    .review-item {
        margin-top: 12px;
        &:first-child {
            margin-top: 0;
        }
    }
</style>