<template>
    <more-page :breadcrumbs="breadcrumbs">
        <div class="card card-body">
            <ul>
                <li v-for="item in links" :key="item.label">
                    <router-link :to="{name: item.route}">{{item.label}}</router-link>
                </li>
            </ul>
        </div>
    </more-page>
</template>
<script>
import MorePage from "./MorePage.vue"
export default {
    name: 'MoreSettings',
    components: {
        MorePage,
    },
    data() {
        return {
            breadcrumbs: [
                {label: 'Learn'},
            ],
            links: [
                { label: 'About FliConn', route: 'about_fliconn' },
                { label: 'About Topics', route: 'about_topics' },
                { label: 'Posting Tips', route: 'posting_tips' },
                { label: 'Avoid Scams', route: 'avoid_scams' },
                { label: 'Prohibited', route: 'prohibited' },
                { label: 'About Us', route: 'about_us' },
                { label: 'Contact Us', route: 'contact_us' },
                { label: 'Privacy Policies', route: 'about_fliconn' },
                { label: 'Terms of Use', route: 'terms_of_use' },
                { label: 'Careers', route: 'careers' },
                { label: 'FAQs', route: 'faqs' },
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
    ul {
        list-style: none;
        margin-bottom: 0;
        padding-left: 20px;
        li {
            a {
                display: block;
                padding: 3px 0;
                font-size: 16px;
                text-decoration: underline;
                font-weight: 500;
            }
        }
    }
</style>