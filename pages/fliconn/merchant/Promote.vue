<template>
    <div class="merchant-promote-page pt-3 pt-md-4">
        <div class="row mb-md-3">
            <div class="col-md-6 mb-3">
                <h4 class="mt-lg-5">Register and <span class="fp-text-active">Promote</span></h4>
                <h4 class="ml-md-5 pl-5"><span class="fp-text-active">Your Business</span> Today!</h4>
                <p class="fp-text-color-main promote-description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised.
                </p>
                <div class="mt-4">
                    <button type="button" class="btn btn-lg fp-btn-gradient" @click="createMerchant()">Get Started</button>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="fp-card d-flex align-items-center justify-content-center h-100">
                    <img src="@/assets/images/merchants/promote_banner_1.png" width="100%" alt="">
                </div>
            </div>
        </div>
        <div class="row mb-md-3 create-offers">
            <div class="col-md-6 mb-3">
                <div class="fp-card d-flex align-items-center justify-content-center h-100">
                    <img src="@/assets/images/merchants/promote_banner_2.png" width="65%" alt="">
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <h4 class="mt-lg-5">Create Offers, <span class="fp-text-active">Coupons &amp; Discounts</span></h4>
                <p class="fp-text-color-main promote-description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised.
                </p>
                <div class="mt-4">
                    <a href="javascript:;" @click="createOffer()" class="btn btn-lg fp-btn-gradient">Create</a>
                </div>
            </div>
        </div>
        <div class="row mb-md-3">
            <div class="col-md-6 mb-3">
                <h4 class="mt-lg-5">Gain <span class="fp-text-active">Visitors</span></h4>
                <p class="fp-text-color-main promote-description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised.
                </p>
            </div>
            <div class="col-md-6 mb-3">
                <div class="fp-card d-flex align-items-center justify-content-center h-100">
                    <img src="@/assets/images/merchants/promote_banner_3.png" height="84%" alt="">
                </div>
            </div>
        </div>
        <div class="row mb-md-3 create-offers">
            <div class="col-md-6 mb-3">
                <div class="fp-card">
                    <img src="@/assets/images/merchants/promote_banner_4.png" width="100%" alt="">
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <h4 class="mt-lg-5">Monitor <span class="fp-text-active">Stastics</span></h4>
                <p class="fp-text-color-main promote-description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, nostrum odio numquam voluptatibus esse laboriosam, asperiores dignissimos autem nemo, deserunt placeat cupiditate. Repudiandae, culpa nam asperiores nulla excepturi reiciendis voluptatem.

                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised.
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MerchantPromote',
    data() {
        return {
            merchant: null,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    mounted() {
        this.getMerchant();
    },
    methods: {
        async getMerchant() {
            try {
                const response = await this.axios.get(`${process.env.merchantApiUrl}/merchant/get_merchant_by_user/${this.auth_user.id}`);
                if (response.data.status === 'Success') {
                    this.merchant = response.data.data;
                }
            } catch (error) {

            }
        },
        createOffer() {
            if (this.merchant) {
                this.$router.push({name: 'merchant.create_offer', query: {merchant: this.merchant.id}});
            } else {
                this.$router.push({name: 'merchant.create'});
            }
        },
        async createMerchant() {
            if (this.merchant) {
                this.$router.push({name: 'merchant.profile', params: {slug: this.merchant.slug}});
            } else {
                this.$router.push({name: 'merchant.create'});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .create-offers {
        @media (max-width: 600px) {
            flex-direction: column-reverse;
        }
    }
    .btn {
        padding-left: 20px;
        padding-right: 20px;
        font-size: 14.4px;
    }
    .promote-description {
        white-space: pre-line;
        line-height: 22.4px;
    }
</style>