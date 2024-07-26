<template>
    <div class="topic-index pt-3 pt-md-4" :class="showRecent && 'd-flex'">
        <div>
            <div class="post-container mb-md-5" :class="showRecent && 'show-recent'">
                <div class="topics-wrapper flex-wrap mb-2">
                    <a href="javascript:;" class="btn-add btn fp-btn-outline mb-2 mr-2"
                       @click="$refs.topicFilterModal.open()">
                        <fp-icon name="plus" class="fp-fs-18 mt-n-2px" />
                        Add interests
                    </a>
                    <a href="javascript:;" class="fp-filter-item mr-2 mb-2" v-if="filter.topics.length > 0"
                       v-for="(item, index) in filter.topics" :key="index">
                            {{ getTopicName(item) }}
                        <!-- {{ topics.find((i) => i.id === item).name }} -->
                        
                        <fp-icon name="times" class="fp-fs-24 ml-2 fp-text-active"
                                 @click="filter.topics.splice(index, 1)" />
                    </a>
                </div>
                <div>
                    <masonry-wall :items="posts" :ssr-columns="1" :column-width="250" :gap="16">
                        <template #default="{ item }">
                            <post-item :post="item" @hide="searchForm" @deleted="searchForm" page="page"></post-item>
                        </template>
                    </masonry-wall>
                </div>
                <div v-if="loadingPosts" class="text-center pt-3 pt-md-5">
                    <img src="~assets/images/logo_loading.gif" width="50" alt="">
                </div>
            </div>
            <div v-if="showRecent" class="right-panel d-none d-md-block">
                <h5>Recent</h5>
                <div class="recent-posts">
                    <div v-for="(item, index) in recent_posts" :key="index" class="mb-3">
                        <post-item :post="item" type="mini"></post-item>
                    </div>
                </div>
            </div>
        </div>
        <fp-modal name="topicFilterModal" ref="topicFilterModal" title="Most Popular Topics" @before-open="initTags()">
            <div class="d-none d-md-flex justify-content-center position-relative">
                <!-- <button class="btn fp-btn-gradient btn-post-content mb-3" @click="createTopic()">
                    Create a new #Tag
                </button>
                <button class="btn fp-btn-outline btn-post-content ml-md-3 mb-3" @click="postInTopic()">
                    <fp-icon name="platform_terms" class="fp-fs-20" />
                    Post a discussion/question
                </button> -->
                <router-link class="btn fp-btn-gradient btn-post-content mb-3" :to="{ name: 'topic.create_topic' }">
                    Create a new #Tag
                </router-link>
                <router-link class="btn fp-btn-outline btn-post-content ml-md-3 mb-3" :to="{ name: 'topic.post' }">
                    <fp-icon name="platform_terms" class="fp-fs-20" />
                    Post a discussion/question
                </router-link>
                
                <fp-icon v-if="topics.length > 30" name="search" class="btn-show-search" @click="showSearch = true" />
            </div>
            <div class="post-filter">
                <div v-if="showSearch" class="d-flex align-items-center mb-1">
                    <p class="mb-0 fp-text-color mr-2">Popular Tags</p>
                    <div class="search-wrapper ml-2">
                        <input v-model="tagFilter.keyword" type="text" class="form-control" placeholder="Search tags..."
                               @input="debounceSearchTags" />
                        <fp-icon name="search" class="icon-search" />
                    </div>
                </div>
                <div class="d-flex align-tems-center flex-wrap">
                    <a href="javascript:;" v-if="tags.length > 0" v-for="(item, index) in tags" :key="index"
                       class="fp-filter-item hoverable mt-2 mr-2" :class="filter.topics.includes(item.id) && 'active'"
                       @click.prevent="toggleTag(item)">
                        {{ item.name ?? '' }}
                    </a>
                </div>
                <div class="text-center">
                    <a href="javascript:;" v-if="tagTotalCount > 12" @click="searchTags()">Load more...</a>
                </div>
            </div>
        </fp-modal>
        <portal to="top-search">
            <search-box v-model="filter.keyword" mode="top" />
        </portal>
        <portal to="fp-sidebar">
            <div class="sidebar-menu pt-1 px-3 pt-3">
                <button class="btn fp-btn-outline btn-block mb-3" @click="postInTopic()">
                    <fp-icon name="platform_terms" class="fp-fs-20" />
                    Post a discussion
                </button>
                <button class="btn fp-btn-gradient btn-block mb-3" @click="createTopic()">
                    Create a #Tag
                </button>
                <div class="sidebar-tags">
                    <div class="sidebar-tag-item fp-border-color-1">
                        <a href="javascript:;" class="sidebar-tag-link fp-text-color-main"
                           :class="filter.topics.length === 0 && 'active'" @click.prevent="filter.topics = []">All
                            Topics</a>
                    </div>
                    <div v-if="topics.length > 0" v-for="(tag, index) in topics" :key="index"
                         class="sidebar-tag-item fp-border-color-1">
                        <a href="javascript:;" class="sidebar-tag-link fp-text-color-main"
                           :class="filter.topics.includes(tag.id) && 'active'" @click="toggleTag(tag)">
                            {{ tag.name.slice(0, 20) }}{{ tag.name.length > 20 ? '...' : '' }} ({{
                                $nFormatter(tag.posts_count) }})
                        </a>
                    </div>
                </div>
            </div>
        </portal>
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">Topics</h6>
        </portal>
    </div>
</template>
<script>
import UserDetail from "~/components/topic/UserDetail.vue";
import PostItem from "~/components/topic/PostItem.vue";
import Cookies from "js-cookie";
import TopicForm from "~/components/topic/TopicForm.vue";
import FpModal from "~/components/ui/Modal.vue";
import SearchBox from "~/components/elements/SearchBox.vue";
import MasonryWall from '@yeger/vue2-masonry-wall'
export default {
    name: "TopicIndex",
    components: {
        UserDetail,
        PostItem,
        TopicForm,
        FpModal,
        SearchBox,
        MasonryWall
    },
    data() {
        return {
            posts: [],
            filter: {
                keyword: "",
                user_id: "",
                page: 1,
                topics: [],
                status: 'active',
            },
            recent_posts: [],
            total_posts: 0,
            tagTimeout: null,
            tags: [],
            tagFilter: {
                page: 1,
                keyword: '',
            },
            tagTotalCount: 0,
            showSearch: false,
            timer: null,
            loadingPosts: false,
        };
    },
    computed: {
        showRecent() {
            // return this.total_posts > 50;
            return false;
        },
        auth_user() {
            return this.$store.getters["auth/user"];
        },
        topics() {
            return this.$store.getters['topics/topics'];
        }
    },
    watch: {
        "filter.topics": function (newVal) {
            this.searchForm();
        },
        "filter.keyword": function (value) {
            if (value) {
                this.searchForm();
            }
        },
    },
    async mounted() {
        Cookies.set("last_visited_route", this.$route.name);
        this.getRecentPosts();
        this.$store.dispatch("setHasSidebar", true);
        this.$store.dispatch("topics/getTopics");
        window.addEventListener('scroll', this.handleScroll);
        this.searchQuestions()
    },
    beforeDestroy() {
        Cookies.remove("last_visited_route");
        this.$store.dispatch("setHasSidebar", false);
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            let scrollHeight = window.scrollY
            let maxHeight = window.document.body.scrollHeight - window.document.documentElement.clientHeight

            if (scrollHeight >= maxHeight - 200) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.searchQuestions();
                }, 500);
            }
        },
        async getRecentPosts() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/get_recent_posts`);
            this.recent_posts = response.data.data;
        },
        searchForm() {
            this.posts = [];
            this.filter.page = 1;
            this.searchQuestions();
        },
        searchQuestions() {
            if (this.posts.length > 0 && this.posts.length >= this.total_posts) return false;
            this.loadingPosts = true;
            this.axios.post(`${process.env.topicsApiUrl}/topic/search`, this.filter).then((response) => {
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    this.total_posts = result.total;
                    if (result.current_page == 1) this.posts = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.posts.push(...result.data);
                    }
                }
                this.loadingPosts = false;
            });
        },
        selectUser(user_id) {
            this.filter.user_id = user_id;
            this.searchForm();
        },
        login(redirect = "") {
            console.log("redirect", redirect)
            if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
            if (this.$route.name !== "login") this.$router.push({ name: "login" });
        },
        createTopic() {
            this.$store.dispatch('toggleLeftMenu', false);
            this.login("/topics/create_topic");
        },
        postInTopic() {
            this.$store.dispatch('toggleLeftMenu', false);
            this.login("/topics/post");
        },
        toggleTag(item) {
            if (this.filter.topics.includes(item.id)) {
                const index = this.filter.topics.findIndex(i => item.id === i);
                this.filter.topics.splice(index, 1);
            } else {
                this.filter.topics.push(item.id);
            }
        },
        getTopicName(topicId) {
            const topic = this.tags.find(t => t.id === topicId);
            return topic ? topic.name : "";
        },
        debounceSearchTags() {
            clearTimeout(this.tagTimeout);

            this.tagTimeout = setTimeout(() => {
                this.initTags();
            }, 500);
        },
        async searchTags() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/search_topics`, this.tagFilter);
            let result = response.data.data;
            if (result.current_page == 1) this.tags = [];
            this.tagTotalCount = result.total;
            if (result.data.length) {
                this.tagFilter.page++;
                this.tags.push(...result.data);
            }
        },
        initTags() {
            this.tagFilter.page = 1;
            this.searchTags();
        }
    },
};
</script>
<style lang="scss" scoped>
.topic-index {
    .right-panel {
        width: 400px;
        padding-left: 0.75rem;
    }

    .post-container {
        width: 100% !important;
        flex-grow: 1;

        &.show-recent {
            @media (min-width: 600px) {
                max-width: calc(100% - 400px);
            }
        }

        .topics-wrapper {
            display: flex;
            align-items: center;
            min-height: 36px;
        }
    }

    .btn-add {
        font-size: 15px;
    }
}

.recent-posts::v-deep {
    .diff_time {
        color: #dc3545 !important;

        svg {
            display: inline !important;
        }
    }
}

.post-filter {
    button {
        font-size: 14.4px;
    }
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: calc(100% - 100px);

    input {
        padding-right: 30px;
    }

    .icon-search {
        color: #64748B;
        margin-left: -26px;
    }
}

.sidebar-tags {
    .sidebar-tag-item {
        border-top-style: solid;
        border-top-width: 1px;

        .sidebar-tag-link {
            display: block;
            padding: 8px 0;
            font-size: 15px;
            text-decoration: none;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &.active {
                color: #FF22A1 !important;
            }
        }
    }
}

.btn-show-search {
    position: absolute;
    color: #64748B;
    top: 10px;
    right: 0;
    font-size: 18px;
}
</style>
