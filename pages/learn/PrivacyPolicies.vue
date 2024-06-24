<template>
    <div id="privacy_policies_page">
        <div class="row">
            <div class="col-md-12">
                <div class="text-center p-4">
                    <h3>Privacy policy</h3>
                    <h6 class="text-muted">Updated on: {{updated_date}}</h6>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="learning-content" v-html="settings.privacy_policies"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            settings: {
                privacy_policies: '',
            },
            updated_date: '',
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
            this.axios.post(`/setting/get_updated_date`, { key: 'privacy_policies' }).then(response => {
                if (response.data.status == 'Success') {
                    let updated_on = response.data.data
                    this.updated_date = updated_on ? this.$moment(updated_on).format('DD MMM, YYYY') : this.$moment().format('DD MMM, YYYY');
                }
            });
        },
    }
}
</script>