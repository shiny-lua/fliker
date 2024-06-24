<template>
    <div class="learning-page">
        <div class="row">
            <div class="col-md-12">
                <div class="learning-content" v-html="settings.payments_refunds"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            settings: {
                payments_refunds: '',
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