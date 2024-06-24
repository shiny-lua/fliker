<template>
    <div class="channel-post-detail mb-4 mb-lg-5">
        <div v-if="loading" class="text-center pt-3 pt-md-4">
            <img src="~assets/images/logo_loading.gif" width="50" alt="" />
        </div>
        <div v-if="post" class="post-header mb-2 mb-lg-3">
            <img :src="post.user.photo_url" class="user-photo" width="50" height="50" alt="" />
            <div class="flex-grow-1">
                <p class="post-title">{{ post.title }}</p>
                <div class="d-flex align-items-center fp-text-color-main mb-2">
                    Posted by &nbsp;<router-link :to="{name: 'fliconn.profile', params: {username: post.user.username}}" class="fp-text-active">@{{ post.user.username }}</router-link>
                    <fa icon="circle" class="divider-dot" />
                    <span class="fp-text-color-main">{{ $moment(post.created_at).format('MMM DD, YYYY') }}</span>

                    <div v-if="!isMyPost" class="ml-2">
                        <a v-if="!post.user.is_following && !post.user.is_requested_follow"
                                href="javascript:;"
                                @click.stop="follow(post.user)"
                                class="fp-btn-outline-round-active"
                        >
                            Follow
                        </a>
                        <a v-else-if="!post.user.is_following || post.user.is_requested_follow"
                                href="javascript:;"
                                style="color: #7F7F7F;"
                                clss="fp-btn-outline-round-active"
                                disabled
                        >
                            Request sent
                        </a>
                        <a v-else-if="post.user.is_following && post.user.contact_me"
                                href="javascript:;"
                                class="fp-btn-outline-round-active"
                                @click.stop="openChat()"
                        >
                            Message
                        </a>
                    </div>
                </div>
                <div v-if="post.post_reacts && post.post_reacts.length" class="d-flex align-items-center mb-3">
                    <div class="post-reacts d-flex">
                        <div class="reacted_emojis d-flex cursor-pointer">
                            <div v-for="(item, index) in post.post_reacts.slice(0, 3)"
                                :key="index"
                                class="reacted-item"
                            >
                                <img :src="require(`@/assets/images/emojis/${item.alias}.gif`)" width="30" height="30" class="circle_emoji fp-bg-body zoom zoom-12" />
                                <!-- <span class="reacted-count">{{ item.last_user }}</span> -->
                            </div>
                            <div v-if="post.post_reacts.length > 3" class="mt-1 ml-1">
                                <span v-if="post.is_reacted">You and</span> +{{$nFormatter(post.post_reacts.length - 3)}} more
                            </div>
                        </div>
                    </div>
                </div>
                <div class="channel-react-section">
                    <reaction-emoji v-if="auth_user" @selected="selectEmoji" />
                    <span v-else class="ml-md-4 cursor-pointer" @click="$login($route.path)">
                        <fp-icon name="emoji" class="fp-fs-22 fp-text-color-main" /> React
                    </span>
                    <div class="timeline-like">
                        <a href="javascript:;" :class="{liked: auth_user && post.is_liked}" @click.prevent="like()">
                            <fp-icon v-if="auth_user && post.is_liked" name="heart-fill" class="fp-fs-20 zoom zoom-14" style="color: #FF0000;" />
                            <fp-icon v-else name="heart" class="fp-fs-22 zoom zoom-14 fp-text-color-main" />
                        </a>
                        <span class="cursor-pointer" @click="openLikesModal()">
                            <span v-if="post.is_liked">You {{ post.likes_count > 1 ? '& +' : '' }}</span>
                            <span v-if="post.is_liked && post.likes_count > 1 || !post.is_liked">{{$nFormatter(post.likes_count - (post.is_liked ? 1 : 0))}}</span>
                        </span>
                    </div>
                    <span v-if="post.enable_comments" class="post-comments-count cursor-pointer">
                        <fp-icon name="comment" class="fp-fs-22 fp-text-color-main" />
                        <span v-if="post.is_commented">You {{ post.comments_count > 1 ? '& +' : '' }}</span>
                        <span v-if="post.is_commented && post.comments_count > 1 || !post.is_commented">{{$nFormatter(post.comments_count - (post.is_commented ? 1 : 0))}}</span>
                    </span>
                    <a href="javascript:;" class="timeline-shares ml-3 text-decoration-none" @click.prevent="share()">
                        <fp-icon name="share" class="fp-fs-20 fp-text-color-main" />
                        {{ $nFormatter(post.shared_count || 0) }}
                    </a>
                </div>
            </div>
        </div>
        <div v-if="post" class="post-body">
            <div v-if="post.images && post.images.length" class="mb-4">
                <div v-if="post.images" :class="`row fliconn-media count-${postMedia.length}`">
                    <div v-for="(image, index) in postMedia.slice(0, 4)"
                        :key="index"
                        class="media col-6 mb-2"
                        :class="{
                            'col-12': postMedia.length === 1,
                            'fixed-height': postMedia.length > 1,
                        }"
                    >
                        <video
                            v-if="image.type === 'video'"
                            :src="image.src"
                            :poster="image.thumb"
                            width="100%"
                            height="100%"
                            style="min-width: 150px;"
                            @click="openGallery(index)"
                            onmouseover="this.play()"
                            onmouseleave="this.pause();"
                            muted
                        ></video>
                        <img v-else
                                :src="image.src"
                                alt=""
                                class="mb-2"
                                width="100%"
                                height="100%"
                                style="min-width: 150px;"
                                @click="openGallery(index)"
                        />
                        <div v-if="index === 1 || index === 3" class="mask" @click="openGallery(index)">
                            +{{ postMedia.length - index - 1 }}
                        </div>
                    </div>
                </div>
                <div v-if="postAttachments" class="row timeline-attachments">
                    <div class="col-12">
                        <a v-for="(item, index) in postAttachments"
                                :key="index"
                                :href="item.src_url"
                                class="timeline-attachment"
                                target="_blank"
                        >
                            <img :src="item.thumbnail_url" alt="">
                            <span v-if="item.file_name" class="file-name">{{ item.file_name }}</span>
                            <span class="attachment-description">Click to download</span>
                        </a>
                    </div>
                </div>
            </div>
            <p v-if="post.detail" class="fliconn-post-detail fp-text-color-main"
                v-html="post.detail"
            ></p>
        </div>
        <div v-if="post" class="post-comments">
            <hr class="mb-3 mb-md-4" />
            <comment-form :commentable_id="post.id"
                model="channel_post"
                @posted="commentPosted"
            ></comment-form>
            <div class="post-comments-wrapper nice-scrollbar">
                <comment-card v-for="(item, index) in comments"
                     :key="index"
                     :comment="item"
                     :is_main="true"
                     @deleted="comments.splice(index, 1)"
                />
                <div v-if="loading_comments" class="text-center"><div class="spinner-border fp-text-color-main" style="width: 20px;height:20px;border-width:0.2em;"></div></div>
                <div
                    v-if="
                        comment_total > 2 &&
                        comment_total > comment_per_page * (comment_page - 1)
                    "
                >
                    <a href="javascript:;" class="btn-read-more" @click="getComments()">Read more...</a>
                </div>
            </div>
        </div>
        <div v-if="post" class="modals">
            <likes-modal :modal-name="`timelineLikesModal_${post.id}`"
                ref="timelineLikesModal"
                :url="getLikesUrl"
                :params="{
                    model: 'channel_post',
                    id: this.post.id
                }"
            ></likes-modal>

            <light-box ref="fliconnLightBox"
                 :media="postMedia"
                 :show-light-box="false"
            />
        </div>
    </div>
</template>
<script>
import ReactionEmoji from "~/components/ui/Reaction.vue";
import FpModal from "~/components/ui/Modal.vue";
import LikesModal from "~/components/fliconn/LikesModal.vue";
import LightBox from "vue-it-bigger";
import CommentCard from "~/components/fliconn/CommentCard.vue";
import CommentForm from "~/components/fliconn/CommentForm.vue";
export default {
    name: 'ChannelPostDetail',
    components: {
        FpModal,
        ReactionEmoji,
        LikesModal,
        LightBox,
        CommentCard,
        CommentForm,
    },
    data() {
        return {
            post: null,
            loading: false,
            comments: [],
            comment_per_page: 3,
            comment_page: 1,
            comment_total: 0,
            loading_comments: false,
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        isMyPost() {
            return this.auth_user && this.post && this.auth_user.id === this.post.user_id;
        },
        characterDetail() {
            return this.post.detail ? this.post.detail.replace(/<[^>]+>/g, " ") : "";
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
        postAttachments() {
            return this.post.images.filter(i => i.mime !== 'image' && i.mime !== 'video' && i.mime !== 'audio').map(file => {
                let thumbnailUrl = file.thumbnail_url;
                if (file.mime === 'text') {
                    thumbnailUrl = require("@/assets/images/icons/text-format.png");
                } else if (file.mime === 'pdf') {
                    thumbnailUrl = require("@/assets/images/icons/pdf.png");
                } else {
                    thumbnailUrl = require("@/assets/images/icons/word.png");
                }
                return {
                    type: file.mime,
                    src_url: file.src_url,
                    thumbnail_url: thumbnailUrl,
                    file_name: file.file_name,
                }
            });
        },
        getLikesUrl() {
            return `${process.env.timelineApiUrl}/fliconn/get_likes`;
        },
    },
    async mounted() {
        await this.getDetail();
        this.getComments();
    },
    methods: {
        async getDetail() {
            this.loading = true;
            const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/get_post_detail`, {slug: this.$route.params.slug});
            if (response.data.status === 'Success') {
                this.post = response.data.data;
            }
            this.loading = false;
        },
        async selectEmoji(emoji) {
            if (!this.post.user.likable) {
                this.$toast.error("Sorry! You can not react to this post.");
                return false;
            }
            let params = {
                id: this.post.id,
                alias: emoji.alias,
                model: 'channel_post',
            };
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/react`, params);
            this.post.my_emoji = emoji.alias;
            if (this.is_reacted == false) {
                this.is_reacted = true;
                this.reacts_count++;

                if (this.post.enable_notification) {
                    let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "react_timelime_post",
                    });
                }
            }
            this.getReacts();
            this.post.post_reacts = response.data.data.post_reacts;
        },
        openLikesModal() {
            this.$refs[`timelineLikesModal_${this.post.id}`].open();
        },
        like() {
            if (!this.post.user.likable) {
                this.$toast.error("Sorry! You can not like this post.");
                return false;
            }
            if (!this.auth_user) {
                this.$login(this.$route.path);
                return false;
            }
            this.axios
                .post(`${process.env.timelineApiUrl}/fliconn/like`, {
                    id: this.post.id,
                    model: 'channel_post'
                })
                .then((response) => {
                    if (response.data.status == "Success") {
                        if (this.post.is_liked) {
                            this.post.likes_count--;
                        } else {
                            this.post.likes_count++;
                        }
                        this.post.is_liked = !this.post.is_liked;
                        this.post.is_liked = this.post.is_liked;
                        if (this.post.enable_notification) {
                            let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                            notiFb.set({
                                notifier_id: this.auth_user.id,
                                type: this.is_liked ? "like_channel_post" : "unlike_channel_post",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        async getReacts() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_reacts`, { id: this.post.id, model: "channel_post" });
            this.reacts = response.data.data;
        },
        openGallery(index) {
            this.$refs.fliconnLightBox.showImage(index);
        },
        async getComments() {
            let params = {
                id: this.post.id,
                per_page: this.comment_per_page,
                page: this.comment_page,
                model: 'channel_post',
            };
            this.loading_comments = true
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_comments`, params);
            let result = response.data.data;
            if (this.comment_page === 1) this.comments = [];
            this.comments.push(...result.data);
            this.comment_page++;
            this.comment_total = result.total;
            this.loading_comments = false;
        },
        commentPosted(data) {
            this.comments.unshift(data);
            this.post.comments_count++;
            this.post.is_commented = true;

            if (this.post.enable_notification) {
                let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                notiFb.set({
                    notifier_id: this.auth_user.id,
                    type: "commented_to_channel_post",
                });
            }
        },
        share() {
            const payload = {
                model: 'channel_post',
                id: this.post.id,
                url: `${process.env.serverUrl}/fliconn/channel/post/detail/${this.post.id}`,
            }
            this.$share(payload);
        },
        async shared(payload) {
            if (payload.model === 'channel_post' && payload.id === this.post.id) {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/share`, { id: this.post.id, model: 'timeline_post' });
                if (response.data.status === "Success") {
                    this.post.shared_count++;
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .channel-post-detail {
        padding-top: 30px;
        max-width: 850px;
        margin: 0 auto;
    }
    .post-header {
        display: flex;
        .user-photo {
            width: 50px;
            height: 50px;
            border-radius: 100%;
            object-fit: cover;
            margin-right: 12px;
        }
        .post-title {
            font-size: 17px;
            font-weight: 500;
            margin-top: 8px;
            margin-bottom: 4px;
        }

        .fp-btn-outline-round-active {
            border: solid 1px #FF22A1;
            border-radius: 12px;
            color: #FF22A1;
            font-weight: 400;
            padding: 2px 8px;
            font-size: 13px;
            text-decoration: none;
        }

        .channel-react-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 415px;
            margin-left: -3px;
        }

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
                    color: #007BFF;
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
                    @media (max-width: 600px) {
                        width: 25px;
                        height: 25px;
                        border-width: 1.5px;
                    }

                    &:hover + .reacted-count {
                        display: inline-block;
                    }
                }
            }
        }
    }
    .post-body {
        padding-left: 62px;
        .fliconn-media {
            margin: 0 -5px;
            .media {
                padding: 0 5px;
                margin-bottom: 10px;
                img {
                    border-radius: 10px;
                }
                &.col-12 {
                    img {
                        object-fit: contain;
                    }
                }
            }
        }
        .btn-read-more {
            padding-left: 50px;
        }
        .timeline-attachment {
            display: inline-block;
            max-width: 120px;
            text-align: center;
            img {
                width: 100px;
                height: 100px;
            }
            .file-name {
                color: #999999;
                margin-top: 3px;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            span {
                display: block;
                font-size: 13px;
            }
        }
        .fliconn-post-detail {
            white-space: pre-line;
        }
    }
    .post-comments {
        margin-left: 62px;
        .post-comments-wrapper {
            margin-top: 20px;
            margin-left: 42px;
        }
    }
</style>