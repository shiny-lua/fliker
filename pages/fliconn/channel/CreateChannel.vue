<template>
    <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9 mt-4 pb-sm-5 mb-sm-5 mb-md-0">
            <channel-form></channel-form>
        </div>
    </div>
</template>
<script>
import ChannelForm from "~/components/fliconn/channel/ChannelForm.vue"
export default {
    name: 'CreateChannel',
    middleware: 'auth',
    components: {
        ChannelForm,
    },
}
</script>

<style lang="scss" scoped>
    .row {
        margin-inline: 0px !important;
    }
</style>