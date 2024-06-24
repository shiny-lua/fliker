<template>
    <div class="fp-card">
        <div class="fp-card-header">
            <p class="fp-card-title">
                About {{ auth_user && user.id === auth_user.id ? 'Me' : user.first_name }}
            </p>
        </div>
        <div class="fp-card-body">
            <about-me :user_id="user.id" :isAccountPage="true" :user="user" />
            <lifestyle v-if="!!profile"
                :isAccountPage="true"
                :user="user"
                :profile="profile"
                @updated="getProfile"
                class="d-none d-md-block"
            />
        </div>
    </div>
</template>
<script>
import AboutMe from "./profile/AboutMe.vue"
import Lifestyle from "./profile/Lifestyle.vue"
export default {
    name: 'AccountLeftPanel',
    props: ['user'],
    components: {
        AboutMe,
        Lifestyle,
    },
    data() {
        return {
            profile: null,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.getProfile();
    },
    methods: {
        async getProfile() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/get`, {user_id: this.user.id})
            this.profile = response.data.data
        },
    },
}
</script>