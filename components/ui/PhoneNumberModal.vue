<template>
    <fp-modal ref="phoneNumberModal"
         :name="phoneModalName"
         :width="336"
         :show-header="false"
         :show-close-button="false"
    >
        <div class="modal-phone-number" v-if="recaptchaSuccess">
            <h6 class="text-center fp-bg-gradient text-white py-2">
                Contact {{ name }}
            </h6>
            <div class="d-flex align-items-center pr-2 mb-2">
                <span class="icon-phone fp-fs-28"><fp-icon name="mobile" /></span>
                <span class="text-primary ml-2 number">To book a worker call us at {{ phone_number }}</span>
            </div>
            <p class="fp-text-color-danger mb-0">
                * DO NOT contact me with unsolicited messages, offers and services
            </p>
        </div>
        <div v-else>
            <h6 class="recaptcha-header">
                Please verify you are a real person
            </h6>
            <div class="recaptcha-container">
                <recaptcha @success="recaptchaSuccess = true" />
            </div>
        </div>
    </fp-modal>
</template>
<script>
import FpModal from "./Modal.vue";
export default {
    name: 'PhoneNumberModal',
    props: {
        name: { type: String,  required: true },
        phone_number: { type: String,  required: true },
    },
    components: {
        FpModal,
    },
    data() {
        return {
            recaptcha_site_key: process.env.recaptchaSiteKey,
            recaptchaSuccess: false,
        }
    },
    computed: {
        phoneModalName() {
            return `phone_modal_${Math.round(Math.random() * 1000000)}`;
        },
    },
    methods: {
        open() {
            this.$refs.phoneNumberModal.open();
        },
        close() {
            this.$refs.phoneNumberModal.close();
        },
    }
}
</script>
<style lang="scss" scoped>
    .recaptcha-header {
        position: relative;
        color: #FFF;
        text-align: center;
        background-color: #DC3535;
        border-radius: 4px 4px 0 0;
        margin-bottom: -2px;
        z-index: 1;
        padding: 8px 0;
    }
    .recaptcha-container {
        margin-bottom: -2px;
    }
</style>