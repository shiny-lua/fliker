<template>
    <div :class="{
            'd-none': !profile.detail,
        }"
    >
        <div v-if="isVisible" class="detail pt-3" v-html="profile.detail"></div>
    </div>
</template>
<script>
    export default {
        name: "AboutMe",
        props: {
            user_id: { type: Number, required: true },
        },
        data() {
            return {
                profile: {},
            };
        },
        computed: {
            isVisible() {
                const profile_option = this.$store.getters['fliconn/profile_option'];
                return profile_option && profile_option.visible_about_me && this.profile.detail;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            async init() {
                const profile_res = await this.axios.post(`${process.env.timelineApiUrl}/profile/get`, { user_id: this.user_id });
                this.profile = profile_res.data.data;
            },
        },
    };
</script>
<style lang="scss" scoped>
    .detail {
        color: #64748B;
        line-height: 16px;
    }
</style>
