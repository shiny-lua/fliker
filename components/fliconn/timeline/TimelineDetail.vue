<template>
    <div class="timeline-detail d-lg-flex">
        <div class="timeline-images position-relative">
            <fp-slider :slide-width="500"
                 :slide-count="postMedia.length"
                 :item-padding="1"
                 class="ml-md-0"
            >
                <div v-for="(image, index) in postMedia"
                    :key="index"
                    class="post-media"
                >
                    <video v-if="image.type === 'video'"
                        :src="image.src"
                        :poster="image.thumb"
                        width="100%"
                        height="100%"
                        controls
                        autoplay
                    ></video>
                    <img v-else
                        :src="image.src"
                        alt=""
                        class="mb-2"
                        width="100%"
                        height="100%"
                    />
                </div>
            </fp-slider>
            <div class="timeline-reacts d-flex">
                <div v-if="post.post_reacts" class="reacted_emojis d-flex cursor-pointer">
                    <div v-for="(item, index) in post.post_reacts.slice(0, 4)"
                        :key="index"
                        class="reacted-item"
                    >
                        <img :src="require(`@/assets/images/emojis/${item.alias}.gif`)" width="30" height="30" class="circle_emoji fp-bg-color-2 zoom zoom-14" />
                        <span class="reacted-count">{{ item.last_user }}</span>
                    </div>
                    <div v-if="post.post_reacts.length > 4" class="mt-1 ml-1">
                        <span v-if="is_reacted">You and</span> +{{$nFormatter(post.post_reacts.length - 4)}}
                    </div>
                </div>
            </div>
        </div>
        <div class="post-details fp-border-color-1 d-flex flex-column p-2 p-md-4">
            <div class="post-user">
                <img :src="post.user.photo_url" width="50" height="50" alt="">
                <span class="ml-2 pl-1">{{ post.user.name }}</span>
                <span class="fp-text-color-main ml-3">{{ post.diff_time }}</span>
            </div>
            <div class="post-information nice-scrollbar">
                <p class="fp-text-color-main">{{ post.detail }}</p>
                <div class="post-reactions fp-border-color-1">
                    <reaction-emoji @selected="selectEmoji" />
                    <div class="timeline-like ml-4">
                        <a href="javascript:;" :class="{liked: auth_user && is_liked}" @click.prevent="$emit('like')">
                            <fp-icon v-if="auth_user && is_liked" name="heart-fill" class="fp-fs-20" style="color: red;" />
                            <fp-icon v-else name="heart" class="fp-fs-20 fp-text-color-main" />
                        </a>
                        <span v-if="likes_count > 0" class="cursor-pointer">
                            <span v-if="is_liked">You {{ likes_count > 1 ? 'and' : '' }}</span>
                            <span v-if="is_liked && likes_count > 1 || !is_liked">+{{$nFormatter(likes_count - (is_liked ? 1 : 0))}}</span>
                        </span>
                    </div>
                    <reaction-gif @selected="selectGif" class="ml-4" />
                </div>
                <div class="post-comments mt-3">
                    <comment-card v-for="(item, index) in comments"
                         :key="index"
                         :comment="item"
                         :is_main="true"
                         @deleted="comments.splice(index, 1)"
                         class="post-comment fp-border-color-1"
                    />
                    <infinite-loading :distance="100"
                        :identifier="infiniteId"
                        @infinite="getComments"
                    >
                        <div slot="no-more"></div>
                        <div class="text-center" slot="no-results"></div>
                        <div slot="spinner" class="pt-3">
                            <img src="~assets/images/logo_loading.gif" width="40" alt="" />
                        </div>
                    </infinite-loading>
                </div>
            </div>
            <div class="post-comment-form mt-3 mt-md-auto mb-4 mb-md-0">
                <comment-form :commentable_id="post.id" model="post"
                    @posted="commentPosted"
                />
            </div>
        </div>
    </div>
</template>
<script>
import FpSlider from "~/components/ui/FpSlider.vue";
import CommentCard from "../CommentCard.vue";
import CommentForm from "../CommentForm.vue";
import ReactionEmoji from "~/components/ui/Reaction.vue";
import ReactionGif from "~/components/ui/ReactionGif.vue";
export default {
    name: 'TimelineDetail',
    props: {
        post: { type: Object, required: true },
    },
    components: {
        FpSlider,
        CommentCard,
        CommentForm,
        ReactionEmoji,
        ReactionGif,
    },
    data() {
        return {
            comments_count: this.post.comments_count,
            reacts_count: this.post.reacts_count,
            is_reacted: this.post.is_reacted,
            comments: [],
            comment_page: 1,
            loading_comments: false,
            infiniteId: +new Date(),
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        postMedia() {
            return this.post.images.filter(i => ['video', 'image'].includes(i.mime)).map(file => {
                let item = {
                    type: file.mime,
                    src: file.src_url,
                    thumb: file.thumbnail_url,
                }

                if (file.mime === 'video') {
                    const extension = file.src.substring(file.src.lastIndexOf('.') + 1);
                    item.thumb = file.thumbnail ? file.thumbnail_url : '',
                    item.sources = [
                        {
                            src: file.src_url,
                            type: `video/${extension}`
                        }
                    ]
                    item.width = 800;
                    item.height = 600;
                    item.autoplay = true;
                }
                return item;
            });
        },
        is_liked() {
            return this.post.is_liked;
        },
        likes_count() {
            return this.post.likes_count;
        },
    },
    methods: {
        async getComments($state) {
            let params = {
                id: this.post.id,
                per_page: 3,
                page: this.comment_page,
            };
            try {
                this.loading_comments = true
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_comments`, params);
                let result = response.data.data;
                if (result.comment_page == 1) this.comments = [];
                if (result.data.length) {
                    this.comment_page++;
                    this.comments.push(...result.data);
                    $state.loaded();
                } else {
                    $state.complete();
                }
                this.loading_comments = false;
            } catch (error) { }
        },
        commentPosted(data) {
            this.comments.unshift(data);
            this.comments_count++;
            this.$emit('comment-posted', data);

            if (this.post.enable_notification) {
                let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                notiFb.set({
                    notifier_id: this.auth_user.id,
                    type: "commented_to_timelime_post",
                });
            }
        },
        selectEmoji(data) {
            this.$emit('emoji-selected', data);
        },
        selectGif(data) {

        }
    }
}
</script>
<style lang="scss" scoped>
    .timeline-detail {
        @media (min-width: 601px) {
            height: calc(100vh - 100px);
            max-height: 600px;
            & > div {
                width: 50%;
            }
        }
        .post-details {
            @media (min-width: 600px) {
                border-left-style: solid;
                border-left-width: 1px;
            }
        }
        .post-information {
            padding-left: 53px;
            max-height: calc(100% - 90px);
            min-height: 330px;
            overflow: auto;
            padding-right: 8px;
            .post-reactions {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-top-style: solid;
                border-top-width: 1px;
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding: 8px;
                background-color: #F0F3F9;
                @media (max-width: 600px) {
                    padding: 6px 8px;
                }
            }
            .post-comments {
                border-left-style: solid;
                border-left-width: 2.5px;
                border-color: #33455780;
                padding-left: 12px;
                .post-comment {
                    border-top-style: solid;
                    border-top-width: 1px;
                    margin-bottom: 0;
                    padding-top: 16px;
                    padding-bottom: 6px;
                    &:first-child {
                        border-top: none;
                    }
                }
            }
        }
        .timeline-images {
            @media (max-width: 600px) {
                padding-left: 2px;
                padding-right: 2px;
            }
            .post-media {
                width: calc(100vw - 10px) !important;
                height: 310px;
                @media (min-width: 601px) {
                    height: calc(100vh - 100px);
                    max-height: 600px;
                    width: 500px !important;
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                    overflow: hidden;
                }
                img, video {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
            &::v-deep {
                .slick-prev {
                    left: 12px;
                }
                .slick-next {
                    right: 12px;
                }
            }

        }
        .timeline-reacts {
            position: absolute;
            top: 20px;
            left: 20px;
            .reacted_emojis {
                margin-left: 5px;
                .reacted-item {
                    position: relative;
                    .reacted-count {
                        font-size: 13px;
                        display: none;
                        position: absolute;
                        top: -25px;
                        left: -12px;
                    }
                    .circle_emoji {
                        margin-left: -5px;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        border: solid 2px #FF22A1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 18px;

                        &:hover + .reacted-count {
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
    [data-theme=dark] {
        .timeline-detail {
            .post-information {
                .post-reactions {
                    background-color: #18243E;
                }
            }
        }
    }
</style>