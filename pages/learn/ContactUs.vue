<template>
    <div>
        <h3 class="text-center mt-3 mb-4">Contact Us</h3>
        <div v-html="settings.contact_us"></div>
        <div class="d-flex justify-content-center">
            <contact-form
                url="/contact_us"
            ></contact-form>
        </div>
    </div>
</template>
<script>
import ContactForm from "./ContactForm.vue"
export default {
    name: 'ContactUs',
    components: {
        ContactForm
    },
    data() {
        return {
            settings: {
                contact_us: '',
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            for (const key in this.settings) {
                this.axios.post(`/setting/get`, { key }).then(response => {
                    if (response.data.status == 'Success') {
                        this.settings[key] = response.data.data;
                    }
                });
            }
        },
    }
}
</script>