<template>
    <div class="row mt-3">
        <post-form mode="edit" :id="post_id" :action="action" v-if="post_id"></post-form>
    </div>
</template>
<script>
import PostForm from '~/components/ads/PostForm.vue';
export default {
    name: 'EditPost',
    middleware: 'auth',
    components: {
        PostForm,
    },
    data() {
        return {
            post_id: null,
            action: null,
        };
    },
    created() {
        this.post_id = this.$route.params.id;
        this.action = this.$route.params.action
    }
}
</script>