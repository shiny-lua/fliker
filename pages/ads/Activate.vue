<template>
    <div class="row page-activate pt-4 pt-md-5">
        <div class="col-12">
            <div class="submit-process" v-if="post">
                <h4 v-if="hasError && errorMessage" class="success-message fp-text-color-main mb-3">
                    <a href="javascript:;" class="btn-thumbs-up mr-2"><fa icon="exclamation" /></a>
                    &nbsp; {{ errorMessage }}
                </h4>
                <div v-else-if="payment_status || this.post.status === 'pending'">
                    <div class="text-center">
                        <fp-icon name="check-success" style="font-size: 55px;" />
                        <h2 class="text-center mt-4 mb-3">Thank you!</h2>
                        <p v-if="post.automotive_seller_id" class="font-weight-500" style="font-size: 16px;">
                            We appreciate your business. Your item is added to the inventory and activated successfully.
                            <br />
                            <router-link :to="{
                                    name: 'ads',
                                    params: { category_id: 'automotive_home' },
                                }"
                            >
                                Click here
                            </router-link>
                            to check online.
                        </p>
                        <p v-else class="font-weight-500" style="font-size: 16px;">
                            We appreciate your business. Your post has been submitted for admin review successfully.
                            <br />
                            You will receive an email once it is approved.
                        </p>
                        <div v-if="post.automotive_seller" class="text-center mt-4">
                            <router-link :to="{name: 'automotive.seller_profile', params: {slug: post.automotive_seller.slug}}" class="btn btn-primary px-md-4">Go back to Inventory</router-link>
                            <a href="/automotive/create" class="btn btn-primary px-md-4 ml-3">Add more items</a>
                        </div>
                    </div>
                </div>
                <div v-else-if="loaded">
                    <h4 class="success-message fp-text-color-main mb-3">
                        <a href="javascript:;" class="btn-thumbs-up mr-2"><fa icon="thumbs-up" /></a>
                        We have successfully stored your post.
                    </h4>
                    <h6 class="text-center mb-3">Pay and Activate Now ({{ post.price }}$)</h6>
                    <div class="row justify-content-center">
                        <div class="col-md-11 col-xl-10">
                            <div class="fp-card ads-activate">
                                <div class="row">
                                    <div class="col-md-6 other-details fp-border-color-1">
                                        <div class="form-group row mx-n1 mt-3 mb-0">
                                            <label for="" class="col-4 px-1 font-weight-500 text-right">Subject :</label>
                                            <div class="col-8 px-1">{{ post.title }}</div>
                                        </div>
                                        <div class="form-group row mx-n1 mb-0" v-if="post.category">
                                            <label for="" class="col-4 px-1 font-weight-500 text-right">Category :</label>
                                            <div class="col-8 px-1">{{ post.category.name }}</div>
                                        </div>
                                        <div class="form-group row mx-n1 mb-0" v-if="post.automotive_category">
                                            <label for="" class="col-4 px-1 font-weight-500 text-right">Category :</label>
                                            <div class="col-8 px-1">
                                                {{ post.automotive_category.name }}
                                            </div>
                                        </div>
                                        <div class="form-group row mx-n1 mb-0" v-if="post.sub_category">
                                            <label for="" class="col-4 px-1 font-weight-500 text-right">Sub Category :</label>
                                            <div class="col-8 px-1">{{ post.sub_category.name }}</div>
                                        </div>
                                        <div class="form-group row mx-n1">
                                            <label for="" class="col-4 px-1 font-weight-500 text-right">Location :</label>
                                            <div class="col-8 px-1">
                                                {{ post.location.city }}, {{ post.location.state }}, {{ post.location.country }}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-12">
                                                <label class="mb-0">Coupon Code <fp-icon name="question" class="fp-fs-20" v-tooltip="`We will send coupon codes over email or SMS based on your location.`" /></label>
                                                <div class="d-flex">
                                                    <input v-model="coupon_form.code" type="text" class="form-control form-control-sm" style="max-width: 267px;" placeholder="Ex. SIGNUP2022" />
                                                    <button type="button" class="btn btn-sm fp-btn-gradient py-1 px-3 ml-2" :disabled="coupon_form.code == ''" @click="applyCoupon()">
                                                        Apply
                                                    </button>
                                                </div>
                                                <has-error :form="coupon_form" field="code" />
                                                <p class="text-success mt-1 mb-0 font-italic font-weight-500" v-if="coupon_form.successful">
                                                    Code applies successfully!
                                                    <br />
                                                    Discount: {{ discount }}$
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 stripe-form">
                                        <stripe-payment-plus v-if="isStripeLoaded && post_id && amount > 0"
                                             :post_id="post_id"
                                             :amount="amount"
                                             @success="paymentSuccess()"
                                        />
                                        <div v-if="amount == 0">
                                            <h5 class="text-success font-italic">Your toal: 0$</h5>
                                            <button type="button" class="btn btn-success" @click="setPaidStatus()">
                                                Click to Activate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import StripePaymentPlus from "~/components/ads/StripePaymentPlus.vue";
    import Form from "vform";
    export default {
        name: "AdsActivate",
        head() {
            return {
                script: [
                    {
                        hid: "stripe",
                        src: "https://js.stripe.com/v3/",
                        defer: true,
                        // Changed after script load
                        callback: () => {
                            this.isStripeLoaded = true;
                        },
                    },
                ],
            };
        },
        components: {
            StripePaymentPlus,
        },
        data() {
            return {
                email: null,
                post_id: null,
                post: null,

                coupon_form: new Form({
                    code: "",
                    post_id: "",
                }),

                payment_status: null,

                hasError: false,
                errorMessage: "",
                discount: null,
                isStripeLoaded: false,
                loaded: false,
            };
        },
        computed: {
            amount() {
                if (this.post && this.post.price) {
                    if (this.coupon_form.successful) {
                        return this.post.price > this.discount ? this.post.price - this.discount : 0;
                    } else {
                        return this.post.price;
                    }
                } else {
                    return 0;
                }
            },
        },
        created() {
            this.post_id = Number(this.$route.query.id);
            this.coupon_form.post_id = this.$route.query.id;
            this.email = this.$route.query.email;
            this.getDetail();
        },
        methods: {
            async getDetail() {
                this.loaded = false;
                let params = { post_id: this.post_id, email: this.email };
                try {
                    await this.axios.post(`${process.env.adsApiUrl}/post/check_activate`, params);
                } catch (error) {
                    this.hasError = true;
                    this.errorMessage = error.response.data.message;
                }
                const response = await this.axios.post(`${process.env.adsApiUrl}/post/get_detail`, { id: this.post_id });
                this.post = response.data.data;
                this.loaded = true;
            },
            applyCoupon() {
                this.coupon_form.post(`${process.env.adsApiUrl}/post/apply_coupon`).then((response) => {
                    if (response.data.status == "Success") {
                        this.discount = response.data.data.discount;
                    }
                });
            },
            paymentSuccess() {
                this.payment_status = true;
                this.$store.dispatch("fetchNotifications");
            },
            async setPaidStatus() {
                const response = await this.axios.post(`${process.env.adsApiUrl}/post/set_paid_status`, { id: this.post_id });
                if (response.data.status == "Success") {
                    this.payment_status = true;
                    this.$store.dispatch("fetchNotifications");
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .btn-thumbs-up {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 45px;
        color: #ffffff;
        background-color: #28a745;
        border-radius: 100px;
        font-size: 25px;
        cursor: pointer;
    }
    .other-details {
        display: flex;
        flex-direction: column;
        font-size: 15px;
        @media (min-width: 600px) {
            border-right-style: solid;
            border-right-width: 1px;
        }
    }
    .success-message {
        display: flex;
        align-items: center;
        justify-content: center;
        @media (max-width: 600px) {
            font-size: 16px;
        }
    }
    .ads-activate {
        @media (max-width: 600px) {
            padding: 0;
            background-color: unset;
        }
    }
</style>
