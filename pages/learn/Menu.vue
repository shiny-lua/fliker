<template>
    <nav class="navbar p-0">
        <ul class="navbar-nav w-100">
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'about_us'}" class="nav-link">
                    <fp-icon class="nav-icon" name="about_us" /> About
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'services_features'}" class="nav-link">
                    <fp-icon class="nav-icon" name="setting" /> Services &amp; Features
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'account_settings'}" class="nav-link">
                    <fp-icon class="nav-icon" name="account_settings" /> Account Settings
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'platform_terms'}" class="nav-link">
                    <fp-icon class="nav-icon" name="platform_terms" /> Platform Terms
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'safety_guide'}" class="nav-link">
                    <fp-icon class="nav-icon" name="safety_guide" /> Safety Guide
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'you_and_app'}" class="nav-link">
                    <fp-icon class="nav-icon" name="user" /> You &amp; FlickerPage
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'terms_of_use'}" class="nav-link">
                    <fp-icon class="nav-icon" name="page" /> Terms Of Use
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'privacy_policies'}" class="nav-link">
                    <fp-icon class="nav-icon" name="privacy_policy" /> Privacy &amp; Security Policy
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'data_policy'}" class="nav-link">
                    <fp-icon class="nav-icon" name="data_policy" /> Data Policy
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'cookies'}" class="nav-link">
                    <fp-icon class="nav-icon" name="cookies" /> Cookies
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'payments_and_refunds'}" class="nav-link">
                    <fp-icon class="nav-icon" name="refund" /> Payments and Refunds
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'platform_gaurantee'}" class="nav-link">
                    <fp-icon class="nav-icon" name="platform_guarantee" /> Platform Gaurantee
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'platform_funding'}" class="nav-link">
                    <fp-icon class="nav-icon" name="dollar-circle" /> Our Platform &amp; Funding
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'prohibited'}" class="nav-link">
                    <fp-icon class="nav-icon" name="ban" /> What is Prohibited?
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'avoid_scams'}" class="nav-link">
                    <fp-icon class="nav-icon" name="alert-triangle" /> Avoid Scams
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'posting_tips'}" class="nav-link">
                    <fp-icon class="nav-icon" name="tip" /> Posting Tips
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'report_us'}" class="nav-link">
                    <fp-icon class="nav-icon" name="report" /> Report
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'faqs'}" class="nav-link">
                    <fp-icon class="nav-icon" name="faq" /> FAQs
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'contact_us'}" class="nav-link">
                    <fp-icon class="nav-icon" name="headphone" /> Contact Us
                </router-link>
            </li>
            <li class="nav-item fp-border-color-1">
                <router-link :to="{name: 'careers'}" class="nav-link">
                    <fp-icon class="nav-icon" name="careers" /> Careers
                </router-link>
            </li>
        </ul>
    </nav>
</template>
<script>
export default {
    name: 'LearnMenu',
}
</script>
<style lang="scss" scoped>
    .nav-item {
        border-bottom-style: solid;
        border-bottom-width: 1px;
        .nav-link {
            color: #64748B;
            font-size: 14px;
            white-space: nowrap;
            padding: 8px 0;
            .nav-icon {
                margin-right: 8px;
                font-size: 20px;
            }
            &.router-link-exact-active {
                color: #FF22A1 !important;
            }
        }
        &:last-child {
            border-bottom: none !important;
        }
    }
    [data-theme=dark] {
        .nav-item {
            .nav-link {
                color: #8598B2;
            }
        }
    }
</style>