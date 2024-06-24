<template>
    <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-8 mt-2 mt-md-4 mb-5">
            <router-link :to="{ name: 'index' }" class="font-weight-bold d-none d-md-flex align-items-center">
                <fp-icon name="home" class="fp-fs-24 mt-n-2px" />
                <span class="ml-1">Home</span>
            </router-link>
            <p class="mt-2 d-none d-md-block">
                Please review
                <router-link :to="{ name: 'terms_of_use' }" target="_blank" class="fp-text-active">Terms of use</router-link>
                and
                <router-link :to="{ name: 'privacy_policies' }" target="_blank" class="fp-text-active">Content Policy</router-link>
                before posting.
            </p>
            <div class="fp-card">
                <channel-post-form
                    :id="id"
                    mode="edit"
                />
            </div>
        </div>
    </div>
</template>
<script>
import ChannelPostForm from "~/components/fliconn/channel/PostForm.vue"
export default {
    name: 'EditChannelPost',
    middleware: 'auth',
    components: {
        ChannelPostForm,
    },
    data() {
        return {
            id: this.$route.params.id,
        }
    }
}
</script>