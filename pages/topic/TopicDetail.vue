<template>
    <div class="topic-detail-page pt-3 pt-md-4 mx-n2">
        <div class="left-panel px-2 mb-3">
            <div v-if="topic" class="fp-card p-0">
                <div class="image-container">
                    <img v-if="topic.image_url" :src="topic.image_url" alt="" />
                    <img v-else src="@/assets/images/fp-default-bg.webp" alt="" />
                    <span class="name fp-bg-color-2"># {{ topic.name }}</span>
                </div>
            </div>
            <div class="topic-posts mt-3">
                <div class="posts-wrapper row mx-n2">
                    <div
                        v-for="(item, index) in posts"
                        :key="index"
                        class="col-md-6 col-lg-4 px-2 mb-3"
                    >
                        <post-item
                            :post="item"
                            @hide="searchForm"
                            page="page"
                        ></post-item>
                    </div>
                </div>
                <infinite-loading
                    :distance="300"
                    :identifier="infiniteId"
                    @infinite="search"
                >
                    <div slot="no-more"></div>
                    <div class="text-center" slot="no-results">
                        <p class="fp-text-color-main">No results found!</p>
                    </div>
                </infinite-loading>
            </div>
        </div>
        <div class="right-panel px-2 mb-3">
            <user-card v-if="topic" :user_id="topic.user_id" class="mb-3"></user-card>
            <div v-if="topic && topic.description" class="fp-card">
                <h6>Description</h6>
                <p class="mb-0 fp-text-color-main">
                    {{ topic.description }}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import PostItem from "~/components/topic/PostItem.vue"
import UserCard from "~/components/topic/UserCard.vue"
export default {
    name: 'TopicDetail',
    components: {
        UserCard, PostItem,
    },
    data() {
        return {
            topic: null,
            posts: [],
            filter: {
                post_as: '',
                keyword: '',
                topic_id: '',
                page: 1,
            },
            infiniteId: +new Date(),
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            const slug = this.$route.params.slug
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/get_topic_detail`, {slug: slug});
            this.topic = response.data.data
        },
        searchForm() {
            this.posts = [];
            this.filter.page = 1;
            this.infiniteId += 1;
        },
        async search($state) {
            this.filter.topic_id = Number(this.$route.params.id)
            try {
                const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/search`, this.filter);
                if (response.data.status == 'Success') {
                    let result = response.data.data
                    if (result.current_page == 1) this.posts = [];
                    if(result.data.length) {
                        this.filter.page++;
                        this.posts.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .topic-detail-page {
        display: flex;
        .left-panel {
            flex-grow: 1;
            max-width: calc(100% - 300px);
        }
        .right-panel {
            width: 300px;
        }
        @media (max-width: 600px) {
            flex-direction: column;
            .left-panel, .right-panel {
                max-width: 100%;
                width: 100%;
            }
        }
    }
    .image-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        max-height: 310px;
        margin-bottom: 0;
        overflow: hidden;
        border-radius: 8px;
        @media (max-width: 600px) {
            width: 100%;
            margin-bottom: 8px;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px 8px 0 0;
        }
        .name {
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #28A745;
            padding: 0.5rem 0.75rem;
            border-radius: 8px 0 8px 0;
            color: #FFF;
        }
    }
    .user-detail {
        width: 100%;
        display: flex;
        flex-direction: column;
        @media (min-width: 600px) {
            max-width: 300px;
            margin-left: 15px;
        }
        .description {
            flex-grow: 1;
            margin-top: 8px;
            border-radius: 8px;
            @media (min-width: 600px) {
                height: 202px;
                overflow: auto;
            }
        }
        &::v-deep {
            .card-user {
                border: 1px solid #e8eced;
            }
        }
    }
</style>