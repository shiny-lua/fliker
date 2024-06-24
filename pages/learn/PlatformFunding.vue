<template>
    <div class="learning-page">
        <div class="row">
            <div class="col-md-12">
                <div class="learning-content" v-html="settings.platform_funding"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            settings: {
                platform_funding: '',
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