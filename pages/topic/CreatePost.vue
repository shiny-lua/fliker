<template>
    <div>
        <div class="d-flex justify-content-center">
            <div class="mt-3 mt-md-4 w-100" style="max-width: 700px;">
                <h5 class="fp-text-color mb-3">Post a Discussion/Question</h5>
                <div class="fp-card fp-sm-no-card">
                    <post-form mode="add"></post-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PostForm from "~/components/topic/PostForm.vue";
export default {
    middleware: 'auth',
    components: {
        PostForm
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
}
</script>