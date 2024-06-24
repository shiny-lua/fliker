<template>
    <div>
        <h3 class="text-center mt-3 mb-4">Join Us Today</h3>
        <div v-html="settings.careers"></div>
        <div class="contact-form-wrapper mx-auto mb-3">
            <contact-form
                url="/join_us"
                mode="careers"
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
                careers: '',
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
<style lang="scss" scoped>
    .contact-form-wrapper {
        width: 100%;
        padding: 0 0.75rem;
        max-width: 500px;
    }
</style>