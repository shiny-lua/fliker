<template>
    <div class="w-100 pt-3 pt-md-4">
        <div v-if="merchant == null"></div>
        <div v-else-if="merchant.status === 'deleted'">
            <h6>Merchant profile has been deleted.</h6>
        </div>
        <div v-else class="merchant-profile-image">
            <img v-if="merchant.image_url" :src="merchant.image_url" alt="" />
            <img v-else src="@/assets/images/fp-default-bg.webp" alt="" />
            <div class="merchant-type">
                <span class="profile-type fp-bg-color-1 fp-text-active fp-border-color-1">{{ merchant.category?.name
                }}</span>
            </div>
        </div>
        <div v-if="merchant" class="profile-content mt-4 mb-4 md-lg-0">
            <div class="merchant-profile-card fp-card">
                <h5 class="merchant-profile-title mb-0 mb-md-3">
                    {{ merchant.name }}
                </h5>
                <div class="d-flex flex-wrap align-items-center mb-3">
                    <div class="profile-rating d-flex mt-2 mt-md-0 align-items-center">
                        <star-rating :rating="merchant.rating" :star-size="15" :show-rating="false" class="mt-n1"
                                     read-only />&nbsp;
                        <a href="javascript:;" class="fp-text-color" @click.prevent="openReviewModal()">{{
                            $nFormatter(merchant.review_count) }} {{ merchant.review_count > 1 ? 'Reviews' :
        'Review' }}</a>
                        <a v-if="!isMyProfile && auth_user" href="javascript:;" class="fp-text-color ml-1"
                           @click.prevent="addNewReview()">
                            (Write review)
                        </a>
                    </div>
                    <div v-if="!isMyProfile" class="fp-text-color-info mt-1">
                        <fp-icon name="tag-percent" class="fp-fs-20" /> {{ merchant.posts_count }} Offers
                    </div>
                </div>
                <div class="business-info">
                    <div class="mb-3 info">
                        <label>
                            <fp-icon name="clock" class="fp-fs-20" />
                            Business Hours
                        </label>
                        <p class="mb-0 merchant-profile-detail">{{ merchant.business_hours ? merchant.business_hours :
                            'Not Provided' }}</p>
                    </div>
                    <div class="mb-3 info">
                        <label>
                            <fp-icon name="location" class="fp-fs-20" />
                            Store Location
                        </label>
                        <template v-if="!merchant.is_online_business">
                            <p v-if="merchant.address" class="cursor-pointer mb-0 merchant-profile-detail"
                               @click="openGoogleMap()">{{ merchant.address }}</p>
                            <p v-else class="mb-0 merchant-profile-detail">Not Provided</p>
                        </template>
                        <p v-else class="mb-0 merchant-profile-detail">Online Store</p>
                    </div>
                    <div class=" info"> 
                        <label>
                            <fp-icon name="phone" class="fp-fs-20" />
                            Contact
                        </label>
                        <p class="cursor-pointer mb-0 merchant-profile-detail">{{ merchant.phone_number ?
                            merchant.phone_number : 'Not Provided' }}</p>
                    </div>
                </div>
                <div v-if="isMyProfile" class="merchant-profile-actions mt-3">
                    <div class="row mx-n1">
                        <div class="col-sm-6 px-1">
                            <div class="dropup mb-2">
                                <a href="javascript:;"
                                   class="btn btn-block btn-merchant-profile fp-text-color fp-btn-outline dropdown-toggle no-caret"
                                   data-toggle="dropdown">
                                    <fp-icon name="user" class="fp-fs-18" />
                                    Profile
                                </a>
                                <div class="dropdown-menu">
                                    <router-link :to="{ name: 'merchant.edit', params: { id: merchant.id } }"
                                                 class="dropdown-item"
                                                 :class="merchant.status === 'inactive' && 'disabled'">
                                        <fp-icon name="edit" class="fp-fs-18" />
                                        Edit
                                    </router-link>
                                    <a href="javascript:;" class="dropdown-item"
                                       :class="merchant.status === 'inactive' && 'disabled'"
                                       @click.prevent="changeStatus('deleted')">
                                        <fp-icon name="trash" class="fp-fs-18" />
                                        Delete
                                    </a>
                                    <a href="javascript:;" class="dropdown-item"
                                       @click.prevent="changeStatus(merchant.status === 'active' ? 'inactive' : 'active')">
                                        <fp-icon name="power" class="fp-fs-18" />
                                        {{ merchant.status === "active" ? "Deactivate" : "Activate" }}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 px-1">
                            <router-link :to="{ name: 'merchant.create_offer', query: { merchant: merchant.id } }"
                                         class="btn btn-block btn-merchant-profile fp-text-color fp-btn-outline mb-2"
                                         :class="{ disabled: merchant.status === 'inactive' }">
                                <fp-icon name="plus" class="fp-fs-18" />
                                Add
                            </router-link>
                        </div>
                    </div>
                    <div class="plan-info d-flex justify-content-around mt-1">
                        <p class="mb-0 d-flex align-items-center">
                            <fp-icon name="plan" class="fp-fs-24" />
                            {{ merchant.posts_count }} Total
                        </p>
                        <p class="mb-0 d-flex align-items-center">
                            <fp-icon name="active-items" class="fp-fs-24" />
                            {{ merchant.active_posts_count }} Active
                        </p>
                        <p v-if="merchant.posts_count - merchant.active_posts_count" class="mb-0 d-flex align-items-center">
                            <fp-icon name="items" class="fp-fs-24" />
                            {{ merchant.posts_count - merchant.active_posts_count }} Expired
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="merchant.status === 'active'" class="related-posts">
                <div v-if="categories.length" class="merchant-categories d-flex overflow-auto nice-scrollbar">
                    <div class="category button-view mb-2" :class="{ active: !filter.category }" @click="selectCategory()">
                        All</div>
                    <div class="category button-view mb-2" :class="{ active: filter.category === item }"
                         v-for="(item, index) in categories" :key="index" @click="selectCategory(item)">
                        {{ item }}
                    </div>
                </div>
                <div class="posts mb-5" :class="categories.length === 0 && 'no-category'">
                    <div class="image-contents">
                        <div v-for="(item, index) in posts" class="item" :key="index">
                            <offer-item :offer="item" @deleted="posts.splice(index, 1)" />
                        </div>
                    </div>
                    <infinite-loading :distance="1" :identifier="infiniteId" @infinite="searchPosts">
                        <div slot="no-more"></div>
                        <div slot="no-results mt-4">No offers found!</div>
                    </infinite-loading>
                </div>
            </div>
        </div>
        <div v-if="merchant">
            <review-modal ref="writeReviewModal" :url="reviewUrl" :profile-name="merchant.name" :profile-image="profileImg"
                          :params="reviewFormData" @submit="reviewSubmitted" @closed="initReviewParams" />
            <fp-modal ref="reviewModal" name="reviewModal">
                <template #header>
                    <div class="review-modal-header">
                        <img :src="profileImg" width="42" height="42" :alt="merchant.name" />
                        <div class="ml-2">
                            <p class="mb-n1 profile-name px-0" style="font-size: 15px;">{{ merchant.name }}</p>
                            <div class="d-flex">
                                <star-rating :rating="merchant.rating" :star-size="15" :show-rating="false" read-only />
                                <span class="ml-1" style="margin-top: 2px;">({{ merchant.review_count }}
                                    {{ merchant.review_count > 1 ? 'reviews' : 'review' }})</span>
                                <a v-if="auth_user && !isMyProfile" href="javascript:;" class="ml-3 fp-text-color-primary"
                                   style="margin-top: 2px;" @click.prevent="addNewReview()">Write a review</a>
                            </div>
                        </div>
                    </div>
                </template>
                <template>
                    <profile-reviews ref="profileReviews" :merchant="merchant" @edit-review="editReview" />
                </template>
            </fp-modal>
        </div>
    </div>
</template>
<script>
import OfferItem from "~/components/fliconn/merchant_offers/OfferItem.vue";
import Swal from "sweetalert2";
import FpModal from "~/components/ui/Modal.vue";
import StarRating from 'vue-star-rating';
import ProfileReviews from "~/components/fliconn/merchant_offers/ProfileReviews.vue";
import ReviewModal from "~/components/ui/review/ReviewModal.vue";
export default {
    name: 'MerchantProfile',
    components: {
        OfferItem,
        FpModal,
        StarRating,
        ProfileReviews,
        ReviewModal,
    },
    data() {
        return {
            merchant: null,
            posts: [],
            filter: {
                merchant_id: '',
                is_admin: true,
                status: '',
                page: 1,
                category: '',
            },
            reviewFormData: {
                mode: 'add',
                id: '',
                merchant_id: '',
            },
            infiniteId: +new Date(),
        };
    },
    computed: {
        categories() {
            if (this.merchant && Array.isArray(this.merchant.item_categories)) {
                return this.merchant.item_categories;
            } else {
                return [];
            }
        },
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        isMyProfile() {
            return this.auth_user && this.merchant && this.auth_user.id === this.merchant.user_id;
        },
        profileImg() {
            return this.merchant.image_url ? this.merchant.image_url : require('@/assets/images/logo.png');
        },
        reviewUrl() {
            return `${process.env.merchantApiUrl}/merchant/review/submit`
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            const slug = this.$route.params.slug;
            let url = '';
            if (slug) {
                url = `${process.env.merchantApiUrl}/merchant/get_merchant_profile_data/${slug}`;
            } else {
                url = `${process.env.merchantApiUrl}/merchant/get_merchant_by_user/${this.auth_user.id}`;
            }
            try {
                const response = await this.axios.get(url);
                if (response.data.status == "Success") {
                    this.merchant = response.data.data;
                    this.filter.merchant_id = this.merchant.id;
                    this.reviewFormData.merchant_id = this.merchant.id;
                }
            } catch (error) {
                if (error.response.data.message === 'not_exists') {
                    // this.$fpError('Merchant profile does not exists. Please create your merchant profile.');
                    this.$router.push({ name: 'merchant.promote' });
                }
            }
        },
        searchPosts($state) {
            this.axios.post(`${process.env.merchantApiUrl}/merchant/search_offer`, this.filter).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data
                    if (result.current_page == 1) this.posts = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.posts.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            })
        },
        selectCategory(item) {
            this.filter.category = item
            this.posts = [];
            this.filter.page = 1;
            this.infiniteId++;
        },
        editProfile() {
            if (this.$parent.$options.name == "SellerProfileForm") {
                this.$parent.form_submitted = false;
            } else {
                this.$router.push({ name: "automotive.seller_profile_form" });
            }
        },
        changeStatus(status) {
            let title = "";
            let text = "";
            if (status == "deleted") {
                title = "Are you sure, you want to delete your merchant profile?";
                text = "* Your merchant profile will be removed permanently. \n * All offers in your profile will be removed.";
            }
            if (status == "inactive") {
                title = "Are you sure, you want to deactivate your merchant profile?";
                text = "* Your merchant profile will be inactive. \n * All offers in your profile will go offline. \n * You can not add/remove offers.";
            }
            if (status == "active") {
                title = "Are you sure, you want to activate your merchant profile?";
                text = "* Your merchant profile will be active. \n * All offers in your profile will go online. \n * You can add/remove offers.";
            }
            Swal.fire({
                title: title,
                text: text,
                icon: "warning",
                showCancelButton: true,
                customClass: {
                    title: "merchant-swal-title",
                    content: "merchant-swal-content",
                },
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    let params = {
                        id: this.merchant.id,
                        status: status,
                    };
                    this.axios
                        .post(`${process.env.merchantApiUrl}/merchant/change_status`, params)
                        .then((response) => {
                            if (response.data.status == "Success") {
                                let successMessage = "Successfully done";
                                if (status == "deleted") {
                                    successMessage = "Deleted successfully";
                                } else {
                                    if (status == "active") {
                                        successMessage = "Your merchant profile is live!";
                                    } else if (status == "inactive") {
                                        successMessage = "Your merchant profile is offline!";
                                    }
                                }
                                this.$store.dispatch("fetchNotifications");
                                this.$toast.success(successMessage);
                                this.$emit("update");
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        openGoogleMap() {
            if (this.merchant.address != "") {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${this.merchant.address}`, "_blank");
            }
        },
        openReviewModal() {
            if (this.merchant.review_count === 0) return false;
            this.$refs.reviewModal.open();
        },
        editReview(review) {
            this.reviewFormData.id = review.id;
            this.reviewFormData.mode = 'edit';
            this.reviewFormData.rating = review.rating;
            this.reviewFormData.content = review.content;
            this.$refs.reviewModal.close();
            this.$refs.writeReviewModal.open();
        },
        addNewReview() {
            this.$refs.reviewModal.close();
            this.reviewFormData.id = '';
            this.reviewFormData.mode = 'add';
            this.$refs.writeReviewModal.open();
        },
        reviewSubmitted(data) {
            this.merchant.review_count = data.review_count;
            this.merchant.rating = data.rating;
        },
        initReviewParams() {
            this.reviewFormData = {
                mode: 'add',
                id: '',
                profile_id: this.merchant.id,
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.merchant-profile-image {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    max-height: 320px;

    @media (max-width: 600px) {
        margin-bottom: 16px;
        max-height: 200px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .merchant-type {
        position: absolute;
        right: 0;
        bottom: 10px;
        padding: 0 10px;

        .profile-type {
            border-style: solid;
            border-width: 1px;
            border-radius: 30px;
            margin-right: 8px;
            margin-bottom: 8px;
            padding: 3px 8px;
            font-weight: 400;
            font-size: 13px;
        }
    }
}

.image-contents {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;

    .item {
        width: 23%;
        
        @media (max-width: 991px) {
            width: 31.2%;
        }
        @media (max-width: 500px) {
            width: 48%;
        }
    }
}
.profile-content {
    display: flex;
    flex-direction: row;
    @media (max-width: 767px) {
        flex-direction: column;
        gap: 1em;
    }

}
.merchant-profile-card {
    display: flex;
    flex-direction: column;
    min-width: 270px;
    width: 270px;
    align-self: flex-start;

    @media (max-width: 767px) {
        width: 100%;
        margin-bottom: 16px;
    }

    .merchant-profile-title {
        font-weight: 500;
        font-size: 18px;
    }

    @media (min-width: 600px) {
        .required-input-container::before {
            display: none;
        }
    }

    p.business_hours {
        white-space: pre-line;
        padding-left: 16px;

        svg {
            margin-left: -18px;
        }
    }

    .btn-merchant-profile {
        font-size: 13px;
    }

    .dropdown-menu {
        border-radius: 12px;
        padding: 4px 12px;

        .dropdown-item {
            font-size: 13.6px;
            padding: 8px 0;
            border-bottom: 1px solid #0000001A;

            &:last-child {
                border-bottom: none;
            }

            &:hover {
                background-color: unset;
            }
        }
    }

    .plan-info {
        font-size: 13.6px;
    }

    .merchant-profile-detail {
        padding-left: 24px;
    }

    .merchant-profile-actions {
        @media (max-width: 600px) {
            padding: 12px 8px;
            margin: 0 -8px;
        }
    }
}

.business-info {
    .info {
        display: flex;
        flex-direction: column;
        @media (max-width: 767px) {
            flex-direction: row;
        }
    }
}

.review-modal-header {
    display: flex;
    align-items: center;
    margin: -6px 0 -8px;

    img {
        object-fit: cover;
        border-radius: 100%;
    }

    p {
        flex-grow: 1;
        max-width: calc(100% - 40px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 0;
        text-align: left;
        padding: 0 10px;
    }
}

.contact-info-container {
    .contact-info-item {
        border-style: solid;
        border-width: 1px;
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 16px;

        a {
            font-size: 14.4px;
        }
    }
}

.related-posts {
    @media (min-width: 769px) {
        width: calc(100% - 286px);
        margin-left: 16px;
        flex-grow: 1;
    }

    .posts::v-deep {
        .offer-item {
            .merchant {
                display: none;
            }
        }
    }
}
</style>