<template>
    <div class="channels fp-card" :class="channels.length === 0 && 'd-none'">
        <div class="fp-card-header">
            <p class="fp-card-title">Channels</p>
            <router-link :to="{name: 'fliconn.channel.create'}" class="btn fp-btn-gradient btn-create ml-auto">
                <fp-icon name="plus-square" />
                Create
            </router-link>
        </div>
        <div class="fp-card-body pt-3">
            <channel-item v-for="(item, index) in channels" :key="index" :channel="item" class="mini" />
        </div>
    </div>
</template>
<script>
import ChannelItem from "./channel/ChannelItem.vue";
export default {
    name: 'Channels',
    components: {
        ChannelItem,
    },
    data() {
        return {
            channels: [],
        };
    },
    mounted() {
        this.getChannels();
    },
    methods: {
        async getChannels() {
            try {
                const response = await this.axios.get(`${process.env.timelineApiUrl}/channel/get_recommends`);
                if (response.data.status === 'Success') {
                    this.channels = response.data.data;
                }
            } catch (e) {}
        },
    }
}
</script>
<style lang="scss" scoped>
    .btn-create {
        border-radius: 5px;
        font-size: 13.6px;
        svg {
            font-size: 18px;
        }
    }
</style>