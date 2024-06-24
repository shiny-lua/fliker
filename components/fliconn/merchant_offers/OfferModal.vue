<template>
    <fp-modal :name="modalName"
        :width="550"
        :show-header="false"
        @before-open="initReviews"
    >
        <div class="d-md-flex pt-3 pt-md-0">
            <div class="offer-image">
                <fp-image-slider v-if="offer.images.length"
                    ref="imageSlider"
                    :images="offer.images.map(i => i.thumbnail_url)"
                />
                <img v-else src="@/assets/images/fp-default-bg.webp" width="100%" height="100%" alt="" />
            </div>
            <div class="offer-information mt-3 mt-md-0 ml-md-3">
                <h6 class="offer-title">{{ offer.name }}</h6>
                <div class="d-flex align-items-start mb-3">
                    <div class="coupon">
                        <div class="coupon-code d-flex align-items-center">
                            {{ offer.coupon_code }}
                            <a href="javascript:;" class="btn-copy ml-auto" @click="copyCode">
                                <fp-icon name="copy" class="fp-fs-18" />
                            </a>
                        </div>
                        <p v-if="offer.ends_at" class="coupon-expire-at mb-0 mt-1">Expires on: {{ $moment(offer.ends_at).format('MM/DD/YYYY') }}</p>
                    </div>
                    <a :href="offer.merchant.website_url" target="_blank" class="btn fp-btn-gradient ml-3 btn-shop-now">Shop Now</a>
                </div>
                <div class="d-flex offer-valid">
                    <p class="mb-0">Is this code still valid?</p>
                    <span class="ml-2" style="color: #28A745;">
                        <fp-icon name="thumbs-up" @click="like('like')" />
                        &nbsp;Yes
                        <span>({{ $nFormatter(offer.likes_count) }})</span>
                    </span>
                    <span class="ml-2" style="color: #FF4141;">
                        <fp-icon name="thumbs-down" @click="like('unlike')" />
                        &nbsp;No
                        <span>({{ $nFormatter(offer.unlikes_count) }})</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="offer-reviews mt-3 nice-scrollbar">
            <review-item v-for="(item, index) in reviews"
                 :key="index"
                 model="merchant"
                 :review="item"
                 :profileImg="offer.merchant.image ? offer.merchant.image.thumbnail_url : require('@/assets/images/logo.png')"
                 :profileUserId="offer.user_id"
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
    </fp-modal>
</template>
<script>
import FpModal from "~/components/ui/Modal.vue";
import FpImageSlider from '~/components/ui/FpImageSlider.vue';
import ReviewItem from '~/components/ui/review/ReviewItem.vue';
export default {
    name: 'OfferModal',
    props: {
        modalName: { type: String, required: true },
        offer: { type: Object, required: true },
    },
    components: {
        FpModal,
        FpImageSlider,
        ReviewItem,
    },
    data() {
        return {
            reviews: [],
            filter: {
                offer_id: this.offer.id,
                per_page: 3,
                page: 1,
            },
            loading: false,
            last_page: 2,
        }
    },
    methods: {
        open() {
            this.$modal.show(this.modalName);
        },
        close() {
            this.$modal.hide(this.modalName);
        },
        async like(mode) {
            const response = await this.axios.post(`${process.env.merchantApiUrl}/merchant/offer/like`, {id: this.offer.id, mode: mode});
            if (response.data.status == "Success") {
                this.offer.likes_count = response.data.data.likes_count;
                this.offer.unlikes_count = response.data.data.unlikes_count
            }
        },
        async copyCode() {
            await this.$copyText(this.offer.coupon_code);
            this.$toast.success('Code copied!');
        },
        initReviews() {
            this.filter.page = 1;
            this.getReviews();
        },
        async getReviews() {
            this.loading = true;
            const response = await this.axios.post(`${process.env.merchantApiUrl}/merchant/get_reviews`, this.filter);
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
    .btn-close {
        position: absolute;
        top: 10px;
        right: 15px;
    }
    .offer-image {
        width: 100%;
        border: 1px solid rgba(0, 0, 0, 0.102);
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 180px;
        @media (min-width: 601px) {
            max-width: 150px;
            height: 150px;
        }
        &::v-deep {
            .image-slider {
                .image-wrapper {
                    height: 180px;
                    @media (min-width: 601px) {
                        max-width: 150px;
                        height: 150px;
                    }
                }
            }
        }
        img {
            object-fit: cover;
        }
    }
    .coupon {
        .coupon-code {
            border: dashed 1px #FF22A1;
            border-radius: 8px;
            padding: 7px 5px;
            background-color: #FF22A11A;
        }
        .coupon-expire-at {
            color: #FF4141;
            font-size: 12px;
        }
    }
    .btn-shop-now {
        font-size: 13.6px;
        padding: 8px 12px;
    }
    .offer-valid {
        svg {
            font-size: 22px;
            cursor: pointer;
        }
    }
    .offer-reviews {
        max-height: 300px;
        overflow-y: auto;
    }
    .review-item {
        margin-top: 12px;
        &:first-child {
            margin-top: 0;
        }
    }
</style>