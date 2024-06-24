<template>
    <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9 mt-2 mt-md-4 mb-5">
            <channel-form v-if="channel" mode="edit" :channel="channel" />
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
    data() {
        return {
            channel: null,
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        async load() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/get_detail`, {channel_id: this.$route.params.id});
                if (response.data.status === 'Success') {
                    this.channel = response.data.data;
                }
            } catch (error) {
                return this.$router.back();
            }
        }
    }
}
</script>