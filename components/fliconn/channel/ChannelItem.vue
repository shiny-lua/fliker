<template>
    <div class="channel-item" @click="openDetail()">
        <img v-if="channel.image" :src="channel.image_url" width="80" height="80" class="channel-image" alt="" />
        <img v-else src="@/assets/images/avatar.png" width="80" height="80" class="channel-image" alt="" />
        <div class="channel-data">
            <div class="channel-info">
                <p class="name">{{ channel.title }}</p>
                <p class="join-count fp-text-color-main">{{ $nFormatter(channel.joined_count) }} People Joined</p>
            </div>
            <a v-if="channel.is_joined"
                 href="javascript:;"
                 class="btn btn-sm fp-btn-outline btn-join active"
                 @click.stop="leave()"
            >
                <span class="joined">Joined</span>
                <span class="leave">Leave</span>
            </a>
            <a v-else href="javascript:;" class="btn btn-sm fp-btn-outline btn-join" @click.stop="join()">Join</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ChannelItem',
    props: {
        channel: { type: Object, required: true },
    },
    methods: {
        async join() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/join`, {channel_id: this.channel.id})
                let result = response.data.data;
                this.channel.joined_count= result.joined_count
                this.channel.is_joined= result.is_joined
                this.$fpSuccess(response.data.message)
                this.$emit('joined')
                if (this.channel.enable_notification) {
                    this.$store.dispatch('fetchNotifications');
                    let notiFb = this.$fire.database.ref('notifications/' + this.channel.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: 'join_channel',
                    });
                }
            } catch (error) {
                if (error.response) {
                    let result = error.response.data
                    this.$toast.error(result.message)
                }
            }
        },
        async leave() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/leave`, {channel_id: this.channel.id})
                let result = response.data.data;
                this.channel.joined_count= result.joined_count
                this.channel.is_joined= result.is_joined
                this.$fpSuccess(response.data.message)
                this.$emit('left')
                if (this.channel.enable_notification) {
                    this.$store.dispatch('fetchNotifications');
                    let notiFb = this.$fire.database.ref('notifications/' + this.channel.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: 'join_channel',
                    });
                }
            } catch (error) {
                if (error.response) {
                    let result = error.response.data
                    this.$toast.error(result.message)
                }
            }
        },
        openDetail() {
            this.$router.push({name: 'channel.detail', params: {slug: this.channel.slug}});
        }
    }
}
</script>
<style lang="scss" scoped>
    .channel-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;
        border-radius: 8px;
        cursor: pointer;
        &:last-child {
            margin-bottom: 0;
        }
        .channel-image {
            width: 80px;
            height: 80px;
            border-radius: 100%;
            object-fit: cover;
            margin-bottom: 8px;
        }
        .channel-data {
            text-align: center;
            margin-top: 4px;
        }
        .channel-info {
            .name {
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 14px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .join-count {
                margin-bottom: 0;
                font-weight: 400;
                font-size: 12px;
            }
        }
        .btn-join {
            margin-top: 16px;
            width: 70px;
            &.active {
                padding-top: 5px;
                padding-bottom: 5px;
                .joined {display: inline;}
                .leave {display: none;}
                &:hover {
                    .joined {display: none;}
                    .leave {display: inline;}
                }
            }
        }
        &.mini {
            flex-direction: row;
            align-items: flex-start;
            .channel-image {
                width: 50px;
                height: 50px;
            }
            .channel-data {
                text-align: left;
                margin-left: 10px;
            }
        }
        &:not(.mini) {
            height: 200px;
            .channel-data {
                height: calc(100% - 88px);
                display: flex;
                align-items: center;
                flex-direction: column;
                .btn-join {
                    margin-top: auto;
                }
            }
        }

    }
</style>