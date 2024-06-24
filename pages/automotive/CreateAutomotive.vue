<template>
    <div class="pt-3 pt-md-5">
        <div class="row justify-content-center">
            <div class="col-12">
                <div class="row">
                    <div class="col-lg-5 mb-4 mb-md-0">
                        <div class="image-container text-center mb-0">
                            <img src="~/assets/images/automotive_banner.png" width="80%" class="visible-light" alt="">
                            <img src="~/assets/images/automotive_banner_dark.png" width="80%" class="visible-dark" alt="">
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="row align-items-center automotive-card-wrapper">
                            <div class="col-md-6 mb-4 mb-md-0 automotive-card">
                                <h6 class="text-md-center fp-text-color mb-3">Automotive Businesses</h6>
                                <div class="fp-card">
                                    <div class="fp-card-header">
                                        <p class="fp-card-title">Create an Automotive Seller Profile</p>
                                    </div>
                                    <div class="fp-card-body pt-3">
                                        <p v-for="(item, index) in terms_with_profile" :key="index">
                                            <fp-icon name="checkbox" class="fp-fs-18 fp-text-active" />
                                            &nbsp;
                                            {{ item }}
                                        </p>
                                        <div class="mt-auto">
                                            <router-link :to="{name: 'automotive.seller_profile_form', params: {is_posting: true}}" class="btn fp-btn-gradient px-4">Create &amp; Subscribe</router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3 mb-md-0 automotive-card">
                                <h6 class="text-md-center fp-text-color mb-3">Individual/Private Sellers</h6>
                                <div class="fp-card">
                                    <div class="fp-card-header">
                                        <p class="fp-card-title">Post Without Creating a Seller Profile</p>
                                    </div>
                                    <div class="fp-card-body pt-3">
                                        <p v-for="(item, index) in terms_without_profile" :key="index">
                                            <fp-icon name="checkbox" class="fp-fs-18 fp-text-active" />
                                            &nbsp;
                                            {{ item }}
                                        </p>
                                        <div class="mt-auto">
                                            <router-link :to="{name: 'automotive.post'}" class="btn fp-btn-gradient px-4">Post</router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CreateAutomotive',
    middleware: 'auth',
    data() {
        return {
            terms_with_profile: [
                'Suitable for automobile businesses.',
                'Can manage inventory easily',
                'Avoid reposting headache.',
                'Save in bundle',
                'Cancel subscription anytime.',
            ],
            terms_without_profile: [
                'Best for individual sellers.',
                'Pay one time for 30 days.',
                'No monthly subscription required.',
                'Post unlimited items',
            ],
        }
    }
}
</script>
<style lang="scss" scoped>
    .automotive-card-wrapper {
        align-items: center;
        height: 100%;
        .automotive-card {
            font-weight: 500;
            .fp-card {
                overflow: hidden;
                min-height: 300px;
                .fp-card-title {
                    font-size: 16px;
                    font-weight: 500;
                }
                .fp-card-body {
                    display: flex;
                    flex-direction: column;
                    min-height: 231px;
                    p {
                        color: #64748B;
                        margin-bottom: 12px;
                        font-weight: 400;
                        font-size: 13.6px;
                    }
                }
            }
        }
    }
</style>