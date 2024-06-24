<template>
    <div id="avoid_scams_page">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-8 p-4">
                <ul class="nav nav-pills justify-content-around">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#avoid_scams">Avoid Scams</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#avoid_scams_report">Report</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#avoid_scams_contact_us">Contact Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#avoid_scams_examples">Examples</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row align-items-stretch my-3 my-md-5">
            <div class="col-md-12 mb-3">
                <div class="tab-content">
                    <div class="tab-pane container active" id="avoid_scams">
                        <div class="learning-content" v-html="settings.avoid_scams"></div>
                    </div>
                    <div class="tab-pane container fade" id="avoid_scams_report">
                        <div class="learning-content" v-html="settings.avoid_scams_report"></div>
                    </div>
                    <div class="tab-pane container fade" id="avoid_scams_contact_us">
                        <div class="learning-content" v-html="settings.avoid_scams_contact_us"></div>
                    </div>
                    <div class="tab-pane container fade" id="avoid_scams_examples">
                        <div class="learning-content" v-html="settings.avoid_scams_examples"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            settings: {
                avoid_scams: '',
                avoid_scams_report: '',
                avoid_scams_contact_us: '',
                avoid_scams_examples: '',
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
    .nav-link {
        color: #64748B;
        &.active {
            color: #FFF;
            background: linear-gradient(94.82deg, #FF22A1 2.26%, #FFA3D8 98.55%);
        }
    }
</style>