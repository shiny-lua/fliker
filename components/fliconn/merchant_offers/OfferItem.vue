<template>
    <div class="offer-item cursor-pointer">
        <div class="offer-image" @click="$refs.offerModal.open()">
            <fp-image-slider v-if="offer.images.length" ref="imageSlider" :images="offer.images.map(i => i.src_url)" />
            <img v-else src="@/assets/images/fp-default-bg.webp" width="100%" height="100%" alt="" />
            <span v-if="offer.merchant_name" class="merchant" @click.stop="openMerchantProfile()">
                <img v-if="offer.merchant.image_url" :src="offer.merchant.image_url" width="25" height="25"
                     class="rounded-circle" alt="" />
                {{ offer.merchant_name }}
            </span>
        </div>
        <div class="offer-information fp-card">
            <p class="offer-title" @click="$refs.offerModal.open()">{{ offer.name }}</p>
            <div class="offer-content" @click="$refs.offerModal.open()">
                <div>
                    <del v-if="offer.original_price && offer.discount" class="old-price">${{ offer.original_price }}</del>
                    <span class="price ml-1">${{ offer.price }}</span>
                </div>
                <span v-if="offer.discount" class="off-percentage">{{ offer.discount }}% OFF</span>
            </div>
            <div class="offer-rating">
                <!-- <span>{{ offer.rating }}</span>&nbsp; -->
                <star-rating :rating="offer.rating" :star-size="15" :show-rating="false" class="mt-n1" read-only />
                <span class="ml-1 cursor-pointer" @click="addNewReview">{{ offer.review_count }} Ratings</span>
            </div>
            <a href="javascript:;" class="btn btn-sm btn-get-offer ml-auto mt-2 mt-md-0" @click="$refs.offerModal.open()">
                Get Offer
            </a>
            <div v-if="expire_at" class="expires text-danger"><span>{{ expire_at }}</span></div>
        </div>

        <div class="dropdown dropdown-context-menu">
            <a href="javascript:;" class="dropdown-toggle btn-context-menu no-caret" data-toggle="dropdown">
                <fp-icon name="dots-circle-h" class="fp-text-color-main" style="font-size: 22px;" />
            </a>
            <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                <template v-if="isMyOffer">
                    <li class="dropdown-item" @click="edit()">
                        <fp-icon name="edit" />
                        <div>
                            <p>Update</p>
                            <p>Update your <span class="text-lowercase">{{ offer.type }}</span></p>
                        </div>
                    </li>
                    <li class="dropdown-item" @click="remove()">
                        <fp-icon name="trash" />
                        <div>
                            <p>Delete</p>
                            <p>Permanently remove <span class="text-lowercase">{{ offer.type }}</span></p>
                        </div>
                    </li>
                </template>
                <template v-else>
                    <li v-if="!offer.is_reported" class="dropdown-item" @click="report()">
                        <fp-icon name="flag" style="font-size: 16px;" />
                        <div>
                            <p>Report</p>
                            <p>Flag for admin review</p>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
        <offer-modal ref="offerModal" :offer="offer" :modal-name="`offer_modal_${Math.random().toString(6)}`"
                     @edit-review="editReview" />
        <review-modal ref="writeReviewModal" :url="reviewUrl" :profile-name="offer.merchant.name"
                      :profile-image="offer.merchant.image_url" :params="reviewFormData" @submit="reviewSubmitted"
                      @closed="initReviewParams" />
    </div>
</template>
<script>
import StarRating from 'vue-star-rating';
import OfferModal from "./OfferModal.vue";
import ReviewModal from "~/components/ui/review/ReviewModal.vue";
import FpImageSlider from '~/components/ui/FpImageSlider.vue';
import eventBus from '~/plugins/event-bus';
import Swal from 'sweetalert2';
export default {
    name: 'OfferItem',
    props: {
        offer: { type: Object, required: true },
    },
    components: {
        StarRating,
        OfferModal,
        FpImageSlider,
        ReviewModal,
    },
    data() {
        return {
            reviewFormData: {
                mode: 'add',
                id: '',
                offer_id: this.offer.id,
            },
        }
    },
    computed: {
        isMyOffer() {
            return this.auth_user && this.auth_user.id === this.offer.user_id;
        },
        reportUrl() {
            return `${process.env.merchantApiUrl}/merchant/report`;
        },
        reviewUrl() {
            return `${process.env.merchantApiUrl}/merchant/review/submit`
        },
        expire_at() {
            if (!this.offer.ends_at) {
                return '';
            } else {
                const expire_days = this.$moment(this.offer.ends_at).diff(this.$moment(), 'days');
                if (expire_days === 1) {
                    return 'Expires in 1 day';
                } else if (expire_days < 0) {
                    return 'Expired';
                } else {
                    return `Exp in ${expire_days} days`;
                }
            }
        },
        auth_user() {
            return this.$store.getters['auth/user'];
        },
    },
    mounted() {
        eventBus.$on('reported', (payload) => {
            this.reported(payload);
        });
    },
    beforeDestroy() {
        eventBus.$off('reported', (payload) => {
            this.reported(payload);
        });
    },
    methods: {
        editReview(review) {
            this.reviewFormData.id = review.id;
            this.reviewFormData.mode = 'edit';
            this.reviewFormData.rating = review.rating;
            this.reviewFormData.content = review.content;
            this.$refs.offerModal.close();
            this.$refs.writeReviewModal.open();
        },
        async addNewReview() {
            if (this.offer.has_review) {
                let reviews = await this.getReviews();
                if (reviews.length) {
                    this.editReview(reviews[0]);
                    return false;
                }
            }
            this.reviewFormData.id = '';
            this.reviewFormData.mode = 'add';
            this.$refs.writeReviewModal.open();
        },
        reviewSubmitted(data) {
            this.offer.review_count = data.review_count;
            this.offer.rating = data.rating;
            this.$refs.writeReviewModal.close();
        },
        initReviewParams() {
            this.reviewFormData = {
                mode: 'add',
                id: '',
                offer_id: this.offer.id,
            }
        },
        report() {
            if (!this.auth_user) {
                this.$login(this.$route.path);
                return false;
            }
            if (this.offer.is_reported) {
                return this.$toast.error("This post has already been reported");
            }
            const payload = {
                url: this.reportUrl,
                params: {
                    id: this.offer.id,
                    model: 'offer',
                },
            }
            this.$report(payload);
        },
        reported(payload) {
            if (payload.model === 'offer' && payload.id === this.offer.id) {
                this.offer.is_reported = true;
                if (this.offer.enable_notification) {
                    let notiFb = this.$fire.database.ref("notifications/" + this.offer.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "report_offer",
                    });
                }
            }
        },
        async getReviews() {
            const response = await this.axios.post(`${process.env.merchantApiUrl}/merchant/get_reviews`, { user_id: this.auth_user.id, offer_id: this.offer.id, });
            if (response.data.status === 'Success') {
                return response.data.data;
            } else {
                return [];
            }
        },
        openMerchantProfile() {
            this.$router.push({ name: 'merchant.profile', params: { slug: this.offer.merchant.slug } });
        },
        edit() {
            return this.$router.push({ name: 'merchant.edit_offer', params: { id: this.offer.id } });
        },
        remove() {
            if (this.auth_user.id != this.offer.user_id) return false;
            Swal.fire({
                title: `Do you really want to delete this ${this.offer.type.toLowerCase()}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Delete',
                confirmButtonColor: '#DC3545'
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    this.axios
                        .delete(`${process.env.merchantApiUrl}/merchant/offer/delete/${this.offer.id}`)
                        .then((response) => {
                            if (response.data.status == "Success") {
                                this.$fpSuccess(`Your ${this.offer.type.toLowerCase()} has been deleted successfully!`);
                                this.$emit("deleted");
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
    }
}
</script>
<style lang="scss" scoped>
.offer-item {
    border-radius: 12px;
    position: relative;

    .offer-image {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 180px;
        border-radius: 10px 10px 0 0;
        overflow: hidden;

        &::v-deep {
            .image-slider {
                .image-wrapper {
                    height: 180px;

                    @media (max-width: 600px) {
                        height: 120px;
                    }
                }
            }
        }

        @media (max-width: 600px) {
            height: 120px;
        }

        img {
            border-radius: 10px 10px 0 0;
            object-fit: cover;
        }

        .merchant {
            position: absolute;
            top: 6px;
            left: 6px;
            background: rgba(0, 0, 0, 0.502);
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 400;
            border-radius: 4px;
            padding: 3px 4px;
        }
    }

    .offer-information {
        padding: 10px;
        border-radius: 0 0 10px 10px;

        @media (max-width: 600px) {
            padding: 8px;
        }

        .offer-title {
            font-weight: 500;
            margin-bottom: 4px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .offer-content {
            display: flex;
            justify-content: space-between;
        }

        .old-price {
            font-size: 12px;
            color: #64748B;
            line-height: 1;
        }

        .price {
            color: #FF40AE;
            font-weight: 600;
            font-size: 16px;
        }

        .off-percentage {
            font-size: 12px;
            padding: 3px 7px;
            color: #FF7272;
            border-style: dashed;
            border-width: 1px;
            border-color: #FF7272;
            border-radius: 3px;
            background-color: #FF72721A;
            // background: linear-gradient(0deg, #FF7272, #FF7272), linear-gradient(0deg, rgba(255, 114, 114, 0.1), rgba(255, 114, 114, 0.1));
        }

        .btn-get-offer {
            width: 100%;
            padding: 8px 0;
            font-size: 12px;
            margin-top: 10px !important;
            margin-bottom: 7px;
            border-radius: 5px;
            border: solid 1px #FF22A1;
            color: #FF22A1;

            @media (max-width: 600px) {
                display: block;
                background: linear-gradient(100.05deg, #FF22A1 2.3%, #FFA3D8 100%);
                color: #FFF;
                text-transform: uppercase;
                border: none;
            }
        }

        .offer-rating {
            
            font-size: 12px;
            display: flex;
            justify-content: space-between;
        }
        .expires {
            display: flex;
            justify-content: flex-end;
        }
    }

    .dropdown-context-menu {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 1;
    }
}

[data-theme=dark] {
    .btn-get-offer {
        color: #FFF !important;
    }
}
</style>