<template>
    <div class="dropdown">
        <a class="nav-link dropdown-toggle btn-learn" href="javascript:;" data-toggle="dropdown">
            Learn
            <fa icon="chevron-down" />
        </a>
        <div :class="`dropdown-menu dropdown-menu-${direction} mt-3`">
            <a href="javascript:;" @click.prevent="goToPage('about_us')" class="dropdown-item fp-text-color pt-0">
                <fp-icon name="about_us" />
                About Us
            </a>
            <a href="javascript:;" @click.prevent="goToPage('services_features')" class="dropdown-item fp-text-color">
                <fp-icon name="setting" />
                Services &amp; Features</a>
            <a href="javascript:;" @click.prevent="goToPage('account_settings')" class="dropdown-item fp-text-color">
                 <fp-icon name="account_settings" />
                Account Settings
            </a>
            <a href="javascript:;" @click.prevent="goToPage('platform_terms')" class="dropdown-item fp-text-color">
                <fp-icon name="platform_terms" />
                Platform Terms
            </a>
            <a href="javascript:;" @click.prevent="goToPage('saftey_guide')" class="dropdown-item fp-text-color">
                <fp-icon name="safety_guide" />
                Safety Guide
            </a>
            <a href="javascript:;" @click.prevent="goToPage('you_and_app')" class="dropdown-item fp-text-color">
                <fp-icon name="user" />
                You &amp; FlickerPage
            </a>
            <a href="javascript:;" @click.prevent="goToPage('terms_of_use')" class="dropdown-item fp-text-color">
                <fp-icon name="page" />
                Terms Of Use
            </a>
            <a href="javascript:;" class="dropdown-item text-primary pb-0 text-center" @click.prevent="goToPage('about_us')">(Read more...)</a>
        </div>
    </div>
</template>
<script>
export default {
    props: ['direction'],
    methods: {
        goToPage(route_name) {
            this.$modal.hide('mobile_menu_modal')
            this.$router.push({name: route_name})
        }
    }
}
</script>
<style lang="scss" scoped>
    .dropdown-item {
        font-size: 14px;
        font-weight: 500;
        padding-top: 8px;
        padding-bottom: 8px;
        svg {
            font-size: 20px;
            margin-right: 6px;
        }
        &:hover {
            color: #FF22A1;
            background: unset;
        }
    }
    .btn-learn {
        color: #FFF;
        font-size: 16px;
        line-height: 22px;
        font-weight: 400;
        svg {
            font-size: 12px;
        }
        &::after {
            display: none;
        }
    }
</style>