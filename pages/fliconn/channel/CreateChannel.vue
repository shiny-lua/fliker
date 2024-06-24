<template>
    <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9 mt-2 mt-md-4 mb-5">
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