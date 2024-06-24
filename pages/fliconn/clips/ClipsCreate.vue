<template>
    <div class="clips-form-container">
        <h5 class="text-center d-none d-md-block mb-0">Post a Short Flick</h5>
        <hr class="my-3"/>
        <clips-form></clips-form>
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">Post a Short Flick</h6>
        </portal>
    </div>
</template>
<script>
import ClipsForm from '~/components/fliconn/clips/ClipsForm.vue'
export default {
    name: 'ClipsCreate',
    components: {
        ClipsForm,
    }
}
</script>
<style lang="scss" scoped>
    hr {
        background-color: #ECF1F6;
    }
    [data-theme=dark] {
        hr {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
</style>