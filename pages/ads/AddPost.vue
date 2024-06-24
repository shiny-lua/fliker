<template>
    <div class="add-post pt-md-4">
        <post-form mode="add"></post-form>
    </div>
</template>
<script>
import PostForm from '~/components/ads/PostForm.vue';
export default {
    name: 'AddPost',
    middleware: 'auth',
    components: {
        PostForm,
    },
}
</script>