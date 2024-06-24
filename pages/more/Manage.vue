<template>
    <div class="mobile-more-page mt-n2">
        <div class="more-nav-item fp-border-color-1">
            <router-link :to="{name: 'account.ads'}" class="more-nav-link">
                <span class="more-nav-icon" style="background-color: #F2CC43;"><fp-icon name="ads" /></span>
                My Classified Ads
                <fp-icon name="chevron-right" class="ml-auto fp-fs-18" />
            </router-link>
        </div>
        <div class="more-nav-item fp-border-color-1">
            <router-link :to="{name: 'automotive.seller_profile'}" class="more-nav-link">
                <span class="more-nav-icon" style="background-color: #EE5B5B;"><fp-icon name="automotive" /></span>
                Automotive Seller Profile
                <fp-icon name="chevron-right" class="ml-auto fp-fs-18" />
            </router-link>
        </div>
        <div class="more-nav-item fp-border-color-1">
            <router-link :to="{name: 'account.topics'}" class="more-nav-link">
                <span class="more-nav-icon" style="background-color: #608DF6;"><fp-icon name="platform_terms" /></span>
                My Tags &amp; Discussions
                <fp-icon name="chevron-right" class="ml-auto fp-fs-18" />
            </router-link>
        </div>
        <div class="more-nav-item fp-border-color-1">
            <router-link :to="{name: 'index', query: {tab: 'merchant'}}" class="more-nav-link">
                <span class="more-nav-icon" style="background-color: #DC8757;"><fp-icon name="tag" /></span>
                Manage Offers &amp; Coupons
                <fp-icon name="chevron-right" class="ml-auto fp-fs-18" />
            </router-link>
        </div>
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">Manage</h6>
        </portal>
    </div>
</template>
<script>
export default {
    name: 'MoreManage',
    middleware: 'auth',
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
}
</script>
<style lang="scss" scoped>
    .more-nav-item {
        padding: 16px 0;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        &:last-child {
            border-bottom: none;
        }
        .more-nav-link {
            display: flex;
            align-items: center;
            font-size: 15px;
            font-weight: 500;
            text-decoration: none;
            .more-nav-icon {
                display: inline-block;
                padding: 6px;
                margin-right: 8px;
                border-radius: 7px;
                color: #FFF;
                svg {
                    font-size: 24px;
                }
            }
        }
    }
</style>