<template>
    <div class="favourite-index">
        <div class="bookmarkable-types mb-3">
            <a href="javascript:;"
                 class="fp-filter-item mr-2 mb-2"
                 :class="type === 'channel' && 'active'"
                 @click.prevent="selectType('channel')"
            >Channels</a>
            <a href="javascript:;"
                 class="fp-filter-item mr-2 mb-2"
                 :class="type === 'group' && 'active'"
                 @click.prevent="selectType('group')"
            >Groups</a>
            <a href="javascript:;"
                 class="fp-filter-item mr-2 mb-2"
                 :class="type === 'page' && 'active'"
                 @click.prevent="selectType('page')"
            >Pages</a>
            <!-- <a href="javascript:;"
                 class="fp-filter-item mr-2 mb-2"
                 :class="type === 'timeline' && 'active'"
                 @click.prevent="selectType('timeline')"
            >Posts</a> -->
        </div>
        <div class="row mx-n2">
            <div v-for="(item, index) in posts"
                 :key="index"
                 class="px-2 mb-4 col-sm-6 col-md-3"
                 :class="itemClass"
            >
                <timeline-item v-if="type === 'timeline'"
                     :post="item"
                     page="favourite"
                     @bookmark-removed="posts.splice(index, 1)"
                />
                <clips-item v-if="type === 'clips'"
                     :clips="item"
                     @bookmark-removed="posts.splice(index, 1)"
                />
                <group-item v-if="type === 'group' || type === 'page'"
                     :group="item"
                     class="favourite-group-item"
                     @bookmark-removed="posts.splice(index, 1)"
                />
                <offer-item v-if="type === 'offer'"
                     :offer="item"
                     @bookmark-removed="posts.splice(index, 1)"
                />
                <channel-item v-if="type === 'channel'"
                     :channel="item"
                     @bookmark-removed="posts.splice(index, 1)"
                />
            </div>
        </div>
        <infinite-loading :distance="300"
            :identifier="infiniteId"
            @infinite="search"
        >
            <div slot="no-more"></div>
            <div class="text-center" slot="no-results"></div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>
    </div>
</template>
<script>
import OfferItem from "./merchant_offers/OfferItem.vue";
import TimelineItem from "./timeline/TimelineItem.vue";
import ClipsItem from "./clips/ClipsItem.vue";
import GroupItem from "./group/GroupItem.vue";
import ChannelItem from "./channel/ChannelItem.vue";
export default {
    name: 'FavouriteIndex',
    components: {
        OfferItem,
        TimelineItem,
        ClipsItem,
        GroupItem,
        ChannelItem,
    },
    data() {
        return {
            posts: [],
            type: 'channel',
            filter: {
                is_bookmarked: true,
                page: 1,
            },
            infiniteId: +new Date(),
        }
    },
    computed: {
        itemClass() {
            if (this.type === 'clips' || this.type === 'channel') {
                return 'col-lg-4';
            } else if (this.type === 'offer') {
                return 'col-lg-6';
            } else {
                return 'col-12';
            }
        },
        url() {
            if (this.type === 'timeline') {
                return `${process.env.timelineApiUrl}/fliconn/search`;
            } else if (this.type === 'clips') {
                return `${process.env.clipsApiUrl}/clips/search`;
            } else if (this.type === 'group' || this.type === 'page') {
                return `${process.env.timelineApiUrl}/group/search`;
            } else if (this.type === 'offer') {
                return `${process.env.merchantApiUrl}/merchant/search_offer`;
            } else if (this.type === 'channel') {
                return `${process.env.timelineApiUrl}/channel/search`;
            }
        }
    },
    methods: {
        searchPosts() {
            this.posts = [];
            this.filter.page = 1;
            this.infiniteId += 1;
        },
        async search($state) {
            try {
                if (this.type === 'group' || this.type === 'page') {
                    this.filter.type = this.type;
                }
                const response = await this.axios.post(this.url, this.filter);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.posts = [];
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
        },
        selectType(type) {
            this.type = type;
            this.searchPosts();
        }
    }
}
</script>
<style lang="scss" scoped>
    .bookmarkable-types {
        display: flex;
        flex-wrap: wrap;
    }
    .favourite-group-item {
        margin-bottom: 0;
        padding: 12px;
        border-radius: 12px;
    }
    [data-theme=dark] {
        .category-item {
            border: 1px solid rgba(255, 255, 255, 0.2)
        }
    }
</style>