<template>
    <div>
        <h3 class="text-center mt-3 mb-4">Report Us</h3>
        <div v-html="settings.report_us"></div>
        <div class="d-flex justify-content-center">
            <contact-form
                url="/contact_us"
                mode="report"
            ></contact-form>
        </div>
    </div>
</template>
<script>
import ContactForm from "./ContactForm.vue"
export default {
    name: 'ReportUs',
    components: {
        ContactForm
    },
    data() {
        return {
            settings: {
                report_us: '',
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