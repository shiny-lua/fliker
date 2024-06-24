<template>
    <div>
        <div class="d-flex justify-content-center">
            <div class="mt-3 mt-md-4 w-100" style="max-width: 700px;">
                <h5 class="mb-3 fp-text-color">Create a new #Tag</h5>
                <div class="fp-card fp-sm-no-card">
                    <topic-form></topic-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TopicForm from "~/components/topic/TopicForm.vue"
export default {
    middleware: 'auth',
    components: {
        TopicForm,
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        showTermsAndGuideLines() {
            this.$router.push({name: 'terms_of_use'});
        }
    }
}
</script>
