<template>
    <div class="d-flex justify-content-center">
        <div class="automotive-subscribe px-3 mt-3 mt-md-5">
            <h4 class="fp-text-color text-center mb-3">Subscribe &amp; Add Items <span v-if="selected_plan">(${{selected_plan.price}})</span></h4>
            <div class="mb-4">
                <step-header
                    :steps="['Create Profile', 'Select Plan', 'Pay & Activate', 'Add Inventory']"
                    :selected="selected_plan ? 2 : 1"
                ></step-header>
            </div>
            <div class="">
                <div v-if="selected_plan" class="subscribe-panel fp-card d-md-flex">
                    <div class="selected-plan mb-3">
                        <div class="plan-card fp-border-color-1 mb-3">
                            <div v-if="selected_plan.name === 'Gold'" class="fav"></div>
                            <h5 class="text-center">{{selected_plan.name}}</h5>
                            <p class="plan-price text-center mb-2"><span class="price">${{selected_plan.price}}</span> / Month</p>
                            <p class="term mb-2"><fa icon="check-circle" /> Add upto {{selected_plan.max_items}} items</p>
                            <p class="term mb-2"><fa icon="check-circle" /> Upgrade anytime</p>
                            <p class="term mb-3"><fa icon="check-circle" /> Cancel anytime</p>
                        </div>
                        <div class="mt-3">
                            <button type="button" class="btn fp-btn-outline" @click="selected_plan = null">Change Plan</button>
                        </div>
                    </div>
                    <div class="stripe-container ml-md-3 flex-grow-1">
                        <stripe-payment-plus
                            v-if="isStripeLoaded"
                            :plan_id="selected_plan.id"
                            :amount="selected_plan.price"
                            @success="paymentSuccess"
                        ></stripe-payment-plus>
                    </div>
                </div>
                <plans v-else
                    @selected="selectedPlan"
                ></plans>
            </div>
        </div>
    </div>
</template>
<script>
import StripePaymentPlus from "~/components/ads/StripePaymentPlus.vue"
import Plans from "../../components/automotive/Plans.vue"
import StepHeader from "~/components/ui/StepHeader.vue"
export default {
    name: 'Subscribe',
    components: {
        StripePaymentPlus, Plans, StepHeader
    },
    head () {
        return {
            script: [
                {
                    hid: 'stripe',
                    src: 'https://js.stripe.com/v3/',
                    defer: true,
                    // Changed after script load
                    callback: () => { this.isStripeLoaded = true; }
                }
            ]
        }
    },
    data() {
        return {
            selected_plan: null,
            isStripeLoaded: false,
        }
    },
    methods: {
        paymentSuccess() {
            console.log("post",this.$route)
            if (this.$route.params.is_posting === true) {
                this.$router.push({name: 'automotive.post'})
            } else {
                this.$router.push({name: 'automotive.seller_profile'})
            }
        },
        selectedPlan(item) {
            this.selected_plan = item
        }
    }
}
</script>
<style lang="scss" scoped>
    .automotive-subscribe {
        width: 100%;
        max-width: 900px;
    }
    .subscribe-panel {
        .selected-plan {
            min-width: 200px;
            .plan-card {
                border-style: solid;
                border-width: 1px;
            }
        }
    }
    .plan-card {
        font-weight: 500;
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        padding: 20px 16px;
        &.favorite {
            border-radius: 10px;
            background-color: #FF22A1;
            color: #FFF;
            .term {
                color: #FFF;
                svg {
                    color: #FFF;
                }
            }
        }
        .fav {
            position: absolute;
            top: -21px;
            right: 13px;
            transform: rotate(-45deg);
            background-color: #FDFF9A;
            color: #FFF;
            width: 22px;
            height: 91px;
        }
        .plan-name {
            font-size: 16px;
            margin-bottom: 5px;
        }
        .plan-price {
            font-size: 13px;
            font-weight: 400;
            .price {
                font-size: 20px;
                font-weight: 500;
            }
        }
        .term {
            font-size: 14.4px;
            color: #64748B;
            font-weight: 400;
        }
    }
</style>