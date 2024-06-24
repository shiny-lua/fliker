<template>
    <div class="group-item-card fp-card p-0">
        <div class="wallpaper">
            <img v-if="group.image" class="cover-image" :src="group.wallpaper" alt="" />
            <img v-else class="cover-image" src="@/assets/images/fp-default-bg.webp" alt="" />
        </div>
        <div class="detail">
            <h6 class="group-title">{{group.title}}</h6>
            <div class="group-info">
                {{group.posts_count}} Posts
            </div>
            <div class="text-center mt-3 mb-1">
                <a href="javascript:;" class="btn fp-btn-gradient px-5" @click.prevent="join()">
                    {{ group.type === 'page' ? 'Follow Page' : 'Join Group' }}
                </a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'GroupItemCard',
    props: {
        group: { type: Object, required: true },
    },
    methods: {
        async join() {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/join`, {group_id: this.group.id})
                let result = response.data.data;
                this.group.joined= result.joined
                this.group.is_joined= result.is_joined
                this.group.is_join_requested= result.is_join_requested
                this.$toast.success(response.data.message)
                this.$emit('joined')
            } catch (error) {
                let result = error.response.data
                this.$toast.error(result.message)
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .group-item-card {
        cursor: pointer;
        border-radius: 12px;
        .wallpaper {
            height: 150px;
            position: relative;
            border-radius: 12px 12px 0 0;
            background-size: cover !important;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 12px 12px 0 0;
            }
        }
        .detail {
            padding: 6px 12px;
            border-radius: 0 0 12px 12px;
            .group-title {
                margin-bottom: 0;
                font-size: 15px;
                line-height: 1.29;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 4px;
                @media (max-width: 600px) {
                    font-size: 14.4px;
                    line-height: 1;
                }
            }
            .group-info {
                color: #999999;
                font-size: 13px;
            }
        }
    }
</style>