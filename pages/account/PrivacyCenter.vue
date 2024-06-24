<template>
    <div>
        <div v-if="activeItem" class="active-item">
            <a href="javascript:;" class="btn-back" @click.prevent="activeItem = null">
                <img src="~assets/images/icons/back.png" width="20" height="20" />
            </a>
            <h5 class="text-center mb-2 d-none d-md-block">{{ activeItem.title }}</h5>
            <p class="text-center text-muted">Updated: {{ $moment(activeItem.updated_at).format('MM/DD/YYYY') }}</p>
            <div v-html="activeItem.content"></div>
            <portal to="mobile-page-title">
                <p class="mb-0 mobile-page-title">{{ activeItem.title }}</p>
            </portal>
        </div>
        <div v-else>
            <h5 class="text-center mb-3 d-none d-md-block">Learn Your Privacy</h5>
            <div class="d-flex flex-wrap">
                <a href="javascript:;" v-for="(item, index) in privacy_contents"
                    :key="index"
                    class="privacy-content-item"
                    @click.prevent="openItem(item)"
                >
                    {{ item.title }}
                </a>
            </div>
            <portal to="mobile-page-title">
                <h6 class="mb-0 mobile-page-title">Learn Your Privacy</h6>
            </portal>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PrivacyCenter',
    data() {
        return {
            privacy_contents: [],
            activeItem: null,
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async loadData() {
            const response = await this.axios.get(`/setting/get_privacy_contents`);
            if (response.data.status == "Success") {
                this.privacy_contents = response.data.data;
            }
        },
        openItem(item) {
            this.activeItem = item
        }
    }
}
</script>
<style lang="scss" scoped>
    .privacy-content-item {
        padding: 6px 14px;
        color: #007BFF;
        font-size: 14.4px;
        font-weight: 600;
        white-space: nowrap;
        border: solid 1px #E3E3E3;
        border-radius: 8px;
        margin-right: 10px;
        text-decoration: none;
    }
    .btn-back {
        position: absolute;
    }
</style>