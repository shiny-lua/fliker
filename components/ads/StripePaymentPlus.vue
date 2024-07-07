<template>
    <div>
        <div class="fp-card fp-border-color-1 overflow-hidden mb-2" style="border-style: solid;border-width: 1px;">
            <div class="fp-card-header d-flex">
                <p class="fp-card-title">
                    Payment Details
                </p>
                <img src="~assets/images/payment_cards.png" height="32" class="ml-auto" alt="">
            </div>
            <div class="fp-card-body pt-3">
                <stripe-elements
                    :stripe-key="stripeKey"
                    :instance-options="instanceOptions"
                    :elements-options="elementsOptions"
                    #default="{ elements }"
                    ref="elements"
                >
                    <div class="row mx-n1">
                        <div class="col-md-6 px-1 form-group">
                            <label for="" class="control-label">Name on Card</label>
                            <input v-model="cardName"
                                 type="text"
                                 class="stripe-field form-control"
                                 placeholder="Name on card"
                                 :class="showError && !cardName && 'is-invalid'"
                            />
                            <div v-if="showError && !cardName" class="invalid-feedback d-block">Name is required!</div>
                        </div>
                        <div class="col-md-6 px-1 form-group">
                            <label for="" class="control-label">Card Number</label>
                            <stripe-element ref="cardNumber"
                                 type="cardNumber"
                                 :elements="elements"
                                 :options="cardNumberOptions"
                                 class="form-control stripe-field"
                                 :class="showError && errors.cardNumber && 'is-invalid'"
                            />
                            <div v-if="showError && errors.cardNumber" class="invalid-feedback d-block">
                                <span v-if="error_code === 'incomplete_number'">Card number is incomplete!</span>
                                <span v-else-if="error_code === 'invalid_number'">Card number is invalid!</span>
                                <span v-else>{{ errors.cardNumber }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row mx-n1">
                        <div class="col-md-6 px-1 form-group">
                            <label for="" class="control-label">CVC</label>
                            <stripe-element ref="cardCvc"
                                 type="cardCvc"
                                 :elements="elements"
                                 :options="cardCvcOptions"
                                 class="form-control stripe-field"
                                 :class="showError && errors.cvc && 'is-invalid'"
                            />
                            <div v-if="showError && errors.cvc" class="invalid-feedback d-block">
                                <span v-if="error_code === 'incomplete_cvc'">CVC is incomplete!</span>
                                <span v-else-if="error_code === 'invalid_cvc'">CVC is invalid!</span>
                                <span v-else>{{ errors.cvc }}</span>
                            </div>
                        </div>
                        <div class="col-md-6 px-1 form-group">
                            <label for="" class="control-label">Expiration Date</label>
                            <stripe-element ref="cardExpiry"
                                 type="cardExpiry"
                                 :elements="elements"
                                 :options="cardExpiryOptions"
                                 class="form-control stripe-field"
                                 :class="showError && errors.expiry && 'is-invalid'"
                            />
                            <div v-if="showError && errors.expiry" class="invalid-feedback d-block">
                                <span v-if="error_code === 'incomplete_expiry'">Expiration Date is incomplete!</span>
                                <span v-else-if="error_code === 'invalid_expiry'">Expiration Date is invalid!</span>
                                <span v-else>{{ errors.expiry }}</span>
                            </div>
                        </div>
                    </div>
                </stripe-elements>

                <div id="card-error" class="text-danger mb-2"></div>
                <div>
                    <button type="button" class="btn fp-btn-gradient" :class="{'btn-loading': loading}" :disabled="loading" @click="createToken()">Pay Now (${{amount}})</button>
                </div>
            </div>
        </div>
        <p class="mb-0 fp-text-color-main">
            <b>All transactions are SSL(Secure Socket Layer) protected.</b>
            Your information is securely transmitted during the processing of all payments with AES-256.
            Please check <a href="https://stripe.com/docs/security/stripe" class="fp-text-active" target="_blank">https://stripe.com/docs/security/stripe</a>
            for more details.
        </p>
    </div>
</template>
<script>
import { StripeElements, StripeElement } from 'vue-stripe-elements-plus'
export default {
    name: 'StripePaymentPlus',
    props: ['post_id', 'plan_id', 'amount'],
    components: {
        StripeElements,
        StripeElement
    },
    data() {
        return {
            token: null,
            cardName: null,
            loading: false,
            stripeKey: process.env.stripeKey,

            instanceOptions: {},
            elementsOptions: {
                // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
            },
            elements: [],
            showError: false,
            errors: {},
            error_code: '',
        };
    },
    computed:{
        theme() {
            return this.$store.getters['theme'];
        },
        inputStyle() {
            return {
                base: {
                    color: this.theme === 'dark' ? '#FFF' : '#091E42',
                    fontFamily: 'Roboto, Arial, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    border: this.theme === 'dark' ? 'solid 1px #ffffff33' : 'solid 1px #D3DDEB',
                    borderRadius: '0.125rem',
                    '::placeholder': {
                        color: '#64748B',
                    },
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a',
                },
            }
        },
        cardNumberOptions() {
            return {
                style: this.inputStyle,
                placeholder: '4242 4242 4242 4242',
            }
        },
        cardCvcOptions() {
            return {
                style: this.inputStyle,
            }
        },
        cardExpiryOptions() {
            return {
                style: this.inputStyle,
            }
        },
    },
    mounted() {

    },
    methods: {
        async createToken () {
            if (!this._validate()) {
                this.showError = true;
                return false;
            }
            this.showError = false;
            this.loading = true;
            const groupComponent = this.$refs.elements
            const cardNumberComponent = this.$refs.cardNumber
            // Get stripe element
            const cardNumberElement = cardNumberComponent.stripeElement

            // Access instance methods, e.g. createToken()
            const { token, error } = await groupComponent.instance.createToken(cardNumberElement)
            if (error) {
                this.loading = false;
                this.showError = true;
                this.errors = {};
                this.error_code = '';
                console.log("error", error)
                if (error.code.includes('number')) this.errors.cardNumber = error.message;
                if (error.code.includes('cvc')) this.errors.cvc = error.message;
                if (error.code.includes('expiry')) this.errors.expiry = error.message;
                this.error_code = error.code;
                return;
            }
            if (this.post_id) {
                await this.processPostPayment(token)
            } else if (this.plan_id) {
                await this.subscribeAutomotive(token)
            }
            this.loading = false;
        },
        _validate() {
            if (!this.cardName) return false;
            return true;
        },

        async processPostPayment(token) {
            let params = {
                post_id: this.post_id,
                stripe_token: token.id,
                amount: this.amount,
                card_name: this.cardName,
            }

            try {
                const response = await this.axios.post(`${process.env.adsApiUrl}/stripe/process_post_payment`, params)
                if (response.data.status == 'Success') {
                    this.$emit('success')
                }
            } catch (error) {
                this.$toast.error(error.data.error);
            }
        },
        async subscribeAutomotive(token) {
            let params = {
                plan_id: this.plan_id,
                stripe_token: token.id,
                amount: this.amount,
                card_name: this.cardName,
            }

            try {
                const response = await this.axios.post(`${process.env.adsApiUrl}/stripe/subscribe_automotive`, params)
                if (response.data.status == 'Success') {
                    this.$emit('success')
                }
            } catch (error) {
                this.$toast.error(error.response.data.error);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .stripe-field {
        padding-top: 8px;
    }
    .control-label {
        margin-bottom: 4px;
    }
    .form-group {
        margin-bottom: 10px;
    }
</style>