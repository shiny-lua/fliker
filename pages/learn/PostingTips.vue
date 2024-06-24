<template>
    <div id="posting_tips_page">
        <div class="row justify-content-center">
            <div class="col-md-6 p-4">
                <ul class="nav nav-pills nav-justified">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#posting_tips_ads">Tips to post Ads</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#postint_tips_topics">Topics</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#posting_tips_fliconn">FliConn</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row align-items-stretch my-3 my-md-5">
            <div class="col-md-12 mb-3">
                <div class="tab-content">
                    <div class="tab-pane container active" id="posting_tips_ads">
                        <div class="learning-content" v-html="settings.posting_tips_ads"></div>
                    </div>
                    <div class="tab-pane container fade" id="postint_tips_topics">
                        <div class="learning-content" v-html="settings.postint_tips_topics"></div>
                    </div>
                    <div class="tab-pane container fade" id="posting_tips_fliconn">
                        <div class="learning-content" v-html="settings.posting_tips_fliconn"></div>
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
                posting_tips_ads: '',
                postint_tips_topics: '',
                posting_tips_fliconn: '',
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
        white-space: nowrap;
        &.active {
            color: #FFF;
            background: linear-gradient(94.82deg, #FF22A1 2.26%, #FFA3D8 98.55%);
        }
    }
</style>