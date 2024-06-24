<template>
    <div class="channel-posts">
        <div v-for="(item, index) in posts"
             :key="index"
             class="post-item fp-border-color-1 mb-3 mb-md-4"
        >
            <post-item :post="item"
                 @deleted="postDeleted(index)"
            />
        </div>
        <infinite-loading :distance="300"
            :identifier="infiniteId"
            @infinite="search"
        >
            <div slot="no-more"></div>
            <div class="text-center" slot="no-results">No posts found!</div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>
    </div>
</template>
<script>
import PostItem from "./ChannelPostItem.vue"
export default {
    name: 'ChannelPosts',
    props: {
        channel_id: { type: [String, Number], required: true },
    },
    components: {
        PostItem,
    },
    data() {
        return {
            posts: [],
            filter: {
                channel_id: this.channel_id,
                page: 1,
            },
            infiniteId: +new Date(),
        };
    },
    methods: {
        async search($state) {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/search_posts`, this.filter);
                if (response.data.status === "Success") {
                    let result = response.data.data;
                    if (result.current_page === 1) this.posts = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.posts.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>