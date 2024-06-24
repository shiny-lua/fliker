<template>
    <div class="ads-post-detail pt-md-3">
        <div class="page-header" v-if="post">
            <div class="d-none d-md-block mb-3">
                <a href="javascript:;" class="fp-text-active" @click.prevent="$router.back()">
                    <fp-icon name="arrow-left" class="fp-fs-18" />
                    Back
                </a>
            </div>
            <div class="d-none my-2">
                <!-- <span href="javascript:;" class="text-primary font-weight-bold" style="z-index:1;" @click.prevent="$router.back()">&lt;-- Back</span> -->
                <div class="pagination" v-if="post">
                    <router-link class="page-item btn-prev" :to="{ name: 'ads.detail', params: { slug: post.prev_slug } }">Prev</router-link>
                    <span class="pagination-icons mx-2">
                        <fa icon="angle-double-left" />&nbsp;&nbsp; <fa icon="circle" style="font-size: 8px;" />&nbsp;&nbsp;
                        <fa icon="angle-double-right" />
                    </span>
                    <router-link class="page-item btn-next" :to="{ name: 'ads.detail', params: { slug: post.next_slug } }">Next</router-link>
                </div>
            </div>
            <h6 class="post-title">{{ post.title }}</h6>
        </div>
        <post-detail v-if="post" :post="post" />
        <div v-if="related_posts.length">
            <div class="d-md-none my-3">
                <a @click="$router.go(-1)" class="text-primary font-weight-bold">&lt;&lt; Back</a>
            </div>
            <h5 v-if="related_posts.length" class="mt-2 mt-md-4">Related Posts</h5>
            <div class="posts mb-5">
                <div class="row mx-n2">
                    <div class="col-xl-2 col-md-3 col-6 mb-3 px-2" v-for="(item, index) in related_posts" :key="index">
                        <Post :post="item" />
                    </div>
                </div>
            </div>
            <infinite-loading :distance="1" :identifier="infiniteId" @infinite="fetchRelatedPosts">
                <div slot="no-more"></div>
                <div slot="spinner" class="pt-3 pt-md-4">
                    <img src="~assets/images/logo_loading.gif" width="50" alt="" />
                </div>
            </infinite-loading>
        </div>
    </div>
</template>
<script>
    import PostDetail from "~/components/ads/PostDetail.vue";
    import Post from "~/components/ads/Post.vue";
    import { mapGetters } from "vuex";
    export default {
        components: {
            PostDetail,
            Post,
        },
        data() {
            return {
                post: null,
                related_posts: [],
                infiniteId: +new Date(),
                filter: {
                    related_post_id: this.$route.params.id,
                    category_id: "",
                    sub_category_id: "",
                    status: "active",
                    page: 1,
                },
            };
        },
        computed: mapGetters({
            auth_user: "auth/user",
            location: "ads/location",
        }),
        created() {
            this.fetchPost();
            this.$store.dispatch("setEnableChat", true);
        },
        beforeDestroy() {
            this.$store.dispatch("setEnableChat", false);
        },
        methods: {
            fetchPost() {
                let slug = this.$route.params.slug;
                this.axios.post(`${process.env.adsApiUrl}/post/get_detail`, { slug: slug }).then((response) => {
                    this.post = response.data.data;
                    this.filter.category_id = this.post.category_id;
                    this.filter.sub_category_id = this.post.sub_category_id;
                    this.infiniteId++;

                    if (this.auth_user) {
                        this.axios.post(`${process.env.adsApiUrl}/post/visit`, {
                            post_id: this.post.id,
                        });
                    }
                });
            },
            fetchRelatedPosts($state) {
                if (this.post && this.post.automotive_seller_id) {
                    this.filter.is_automotive = true;
                    this.filter.automotive_seller_id = this.post.automotive_seller_id;
                }
                if (!this.filter.category_id && !this.filter.automotive_seller_id) return false;
                this.filter.location = this.location;
                this.axios.post(`${process.env.adsApiUrl}/post/search`, this.filter).then((response) => {
                    let result = response.data.data;
                    if (result.data.length) {
                        this.related_posts.push(...result.data);
                        this.filter.page++;
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                });
            },
            searchCategory() {
                this.$router.push({
                    name: "ads",
                    query: { category_id: this.post.category_id },
                });
            },
            searchSubCategory() {
                this.$router.push({
                    name: "ads",
                    query: {
                        category_id: this.post.category_id,
                        sub_category_id: this.post.sub_category_id,
                    },
                });
            },
            searchAutomotive(automotive_category = null) {
                this.$router.push({
                    name: "ads",
                    query: {
                        category_id: "automotive_home",
                        automotive_category: automotive_category,
                    },
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .page-header {
        margin-top: 5px;
        position: relative;

        .breadcrumb {
            z-index: 1;
            background: transparent;

            .breadcrumb-item {
                text-decoration: underline;
                display: inline-block;

                @media (min-width: 992px) {
                    font-size: 17px;
                }

                &.post-title {
                    text-decoration: none;
                    font-weight: bold;
                }
            }
        }

        .pagination {
            // position: absolute;
            // width: calc(100% - 30px);
            justify-content: center;

            .page-item {
                color: #6c757d;
                font-weight: 500;
            }

            .pagination-icons {
                display: flex;
                align-items: center;
                color: #6c757d;
            }
        }
    }
</style>
