<template>
    <div>
        <div v-if="isVisible" class="fliconn-post fp-card">
            <div class="fliconn-post--container">
                <div class="post-header">
                    <div class="post-user flex-grow-1">
                        <img :src="post.user.photo_url" class="photo" alt="" />
                        <div class="ml-2 cursor-pointer" @click="$emit('user-selected')">
                            <p class="mb-1 username">
                                {{ post.user.name }}
                                <template v-if="auth_user && post.user_id != auth_user.id">
                                    <span v-if="
                                        !post.user.is_following || (post.user.is_following && post.user.contact_me)
                                    "
                                     class="fp-text-color-main">•</span>
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
                                         class="fp-btn-outline-round-success"
                                         @click.stop="openChat()"
                                    >
                                        Message
                                    </a>
                                </template>
                            </p>
                            <p class="mb-0 diff_time d-flex align-items-center">
                                {{ post.user_location }}
                                <fa v-if="post.user_location" icon="circle" class="divider-dot" />
                                {{ post.diff_time ? post.diff_time : "Just now" }}
                                <fa icon="circle" class="divider-dot" />
                                <span class="visible_to">
                                    <fp-icon v-if="post.visible_to === 'public'" name="globe" v-tooltip="'Public Post'" />
                                    <fp-icon v-if="post.visible_to === 'followers'" name="user-check" v-tooltip="'Only Followers can view'" />
                                    <fp-icon v-if="post.visible_to === 'mutual_followers'" name="users-check" v-tooltip="'Only Mutual Followers can view'" />
                                    <fp-icon v-if="post.visible_to === 'custom'" name="privacy_policy" v-tooltip="'Restricted Post'" />
                                    <fp-icon v-if="post.visible_to === 'nobody'" name="eye-slash" v-tooltip="'Nobody can view'" />
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="dropdown ml-auto dropdown-context-menu align-self-start"
                        :class="{
                            'd-none': auth_user && page == 'profile' && auth_user.id != post.user_id,
                        }"
                    >
                        <a href="javascript:;" class="dropdown-toggle btn-context-menu no-caret" data-toggle="dropdown">
                            <fp-icon name="dots-circle-h" />
                        </a>
                        <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                            <template v-if="isMyPost">
                                <li class="dropdown-item" @click="changeVisibility()">
                                    <fp-icon name="eye" />
                                    <div>
                                        <p>Change Post Visibility</p>
                                        <p>Set who can see this post</p>
                                    </div>
                                </li>
                                <li v-if="!post.poll" class="dropdown-item" @click="edit()">
                                    <fp-icon name="edit" />
                                    <div>
                                        <p>Edit Post</p>
                                        <p>Update post content</p>
                                    </div>
                                </li>
                                <li class="dropdown-item" @click="remove()">
                                    <fp-icon name="trash" />
                                    <div>
                                        <p>Delete Post</p>
                                        <p>Permanently remove post</p>
                                    </div>
                                </li>
                                <li class="dropdown-item" @click="changeCommentStatus()">
                                    <fp-icon name="comment-dots" />
                                    <div>
                                        <p>{{ post.enable_comments ? "Disable Comments" : "Enable Comments" }}</p>
                                        <p>{{ post.enable_comments ?  'Do not allow' : 'Allow'}} comments on this post</p>
                                    </div>
                                </li>
                                <li class="dropdown-item" @click="toggleNotification()">
                                    <fp-icon :name="post.enable_notification ? 'bell-slash' : 'bell'" />
                                    <div>
                                        <p>{{ post.enable_notification ? "Turn off notifications" : "Turn on notifications" }}</p>
                                        <p>{{ post.enable_notification ?  'Disable' : 'Enable'}} notifications for this post</p>
                                    </div>
                                </li>
                            </template>
                            <template v-else>
                                <li v-if="post.user.is_following" class="dropdown-item" @click="unfollow()">
                                    <fp-icon name="user-minus" />
                                    <div>
                                        <p>Unfollow {{ post.user.name }}</p>
                                        <p>Stop following user</p>
                                    </div>
                                </li>
                                <li v-if="auth_user" class="dropdown-item" @click="hide()">
                                    <fp-icon name="eye" />
                                    <div>
                                        <p>Hide</p>
                                        <p>Remove this post from your timeline</p>
                                    </div>
                                </li>
                                <li v-if="!post.is_reported" class="dropdown-item" @click="report()">
                                    <fp-icon name="flag" />
                                    <div>
                                        <p>Report</p>
                                        <p>Flag for admin review</p>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
                <template v-if="post.detail">
                    <p v-if="this.characterDetail.length > 200 && !detailExpand"
                        class="fliconn-post-detail">
                        {{ this.characterDetail.slice(0, 200) }}
                        <a v-if="!detailExpand" href="javascript:;" class="fp-text-color-info" @click="detailExpand = true">read more..</a>
                    </p>
                    <p v-if="(detailExpand && this.characterDetail.length > 200) || this.characterDetail.length <= 200"
                        class="fliconn-post-detail"
                        v-html="post.detail"
                    ></p>
                </template>
                <poll-item v-if="post.poll" :poll="post.poll" class="mb-3" />
                <div v-if="post.images" class="d-flex justify-content-center">
                    <div v-if="post.images" :class="`row fliconn-media count-${postMedia.length}`">
                        <div
                            v-for="(image, index) in postMedia.slice(0, 4)"
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
                                style="min-width: 150px; border-radius: 20px; "
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
                                 style="min-width: 150px; border-radius: 20px;"
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
                    <div v-if="postAudios.length" class="row">
                        <div v-for="(item, index) in postAudios" :key="index" class="col-md-6">
                            <audio :src="item.src_url" controls>
                                <source :src="item.src_url" type="audio/ogg">
                                <source :src="item.src_url" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>
            </div>
            <div class="timeline-footer">
                <div class="d-flex align-items-center border-bottom fp-border-color-1 pb-2">
                    <div v-if="post.total_reacts.length" class="timeline-total-reacted">
                        <span class="reacted-users">
                            <img v-for="(item, index) in post.total_reacts" :key="index" :src="item" width="30" height="30" alt="">
                        </span>
                        <span>{{ total_reacted_count > post.total_reacts.length ? '+' : '' }}{{ $nFormatter(total_reacted_count > post.total_reacts.length ? (total_reacted_count - post.total_reacts.length) : total_reacted_count) }} people reacted</span>
                    </div>
                    <div class="timeline-reacts d-flex ml-auto">
                        <div v-if="post.post_reacts" class="reacted_emojis d-flex cursor-pointer" @click="showReacts()">
                            <div v-for="(item, index) in post.post_reacts.slice(0, 3)"
                                :key="index"
                                class="reacted-item"
                            >
                                <img :src="require(`@/assets/images/emojis/${item.alias}.gif`)" width="30" height="30" class="circle_emoji zoom zoom-14" />
                                <span class="reacted-count">{{ item.last_user }}</span>
                            </div>
                            <div v-if="post.post_reacts.length > 4" class="mt-1 ml-1">
                                <span v-if="is_reacted">You and</span> +{{$nFormatter(post.post_reacts.length - 3)}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="timeline-react-section fp-border-color-1 mb-2">
                    <reaction-emoji v-if="auth_user" @selected="selectEmoji" class="ml-md-4" />
                    <span v-else class="ml-md-4 cursor-pointer" @click="$login($route.path)">
                        <fp-icon name="emoji" class="fp-fs-22 fp-text-color-main" /> React
                    </span>
                    <div class="timeline-like">
                        <a href="javascript:;" :class="{liked: auth_user && is_liked}" @click.prevent="like()">
                            <fp-icon v-if="auth_user && is_liked" name="heart-fill" class="fp-fs-20 zoom zoom-14" style="color: #FF0000;" />
                            <fp-icon v-else name="heart" class="fp-fs-22 zoom zoom-14 fp-text-color-main" />
                        </a>
                        <span class="cursor-pointer" @click="openLikesModal()">
                            <span v-if="is_liked">You {{ likes_count > 1 ? '& +' : '' }}</span>
                            <span v-if="is_liked && likes_count > 1 || !is_liked">{{$nFormatter(likes_count - (is_liked ? 1 : 0))}}</span>
                        </span>
                    </div>
                    <span v-if="post.enable_comments" class="timeline-comments cursor-pointer" @click.prevent="comments_count ? showComments() : null">
                        <fp-icon name="comment" class="fp-fs-22 fp-text-color-main" />
                        <span v-if="my_comments_count">You<span v-if="comments_count - my_comments_count"> &amp;&nbsp;+ {{$nFormatter(comments_count - my_comments_count)}}</span></span>
                        <span v-else>{{$nFormatter(comments_count)}}</span>
                    </span>
                    <a href="javascript:;" class="timeline-shares ml-3 text-decoration-none" @click.prevent="share()">
                        <fp-icon name="share" class="fp-fs-20 fp-text-color-main" />
                        {{ $nFormatter(post.shared_count || 0) }}
                    </a>
                </div>
            </div>
            <div v-if="post.enable_comments" class="timeline-actions">
                <img v-if="auth_user" :src="auth_user.photo_url" alt="" class="img-user" />
                <img v-else src="~assets/images/avatar.png" class="img-user" alt="" />
                &nbsp;&nbsp;
                <div class="actions-links fp-input-placeholder">
                    <span class="cursor-pointer flex-grow-1" @click="showCommentForm()">
                        {{ commentableText }}
                    </span>
                    <a href="javascript:;" class="ml-2">
                        <fp-icon name="gif" class="fp-fs-18" />
                    </a>
                </div>
            </div>
            <div class="comments pt-3 pr-3" v-if="post.last_comment && post.enable_comments">
                <comment-card :comment="post.last_comment"
                     :is_main="true"
                     :editable="false"
                     model="timeline"
                />
                <div v-if="post.last_comment && comments_count > 1" class="mb-2">
                    <a href="javascript:;" class="btn-read-more fp-text-color-info" @click.prevent="showComments()">Read more comments..</a>
                </div>
            </div>
            <div v-if="post.poll" class="poll-voted fp-text-color-main pr-3">
                <span>
                    <fp-icon name="poll" class="fp-fs-20" />&nbsp;
                    {{ post.poll.voted_count }} people voted
                </span>
                <span v-if="post.poll.expires_on" class="ml-auto font-italic text-danger">
                    <fa icon="star" class="blink" />
                    Expires
                    <span class="fp-text-color-main">{{ post.poll.expires_on }}</span>
                </span>
            </div>

        </div>

        <light-box ref="fliconnLightBox" :media="postMedia" :show-light-box="false"></light-box>

        <fp-modal :name="`timeline_comments_modal_${post.id}`"
             :show-header="false"
        >
            <comment-form v-if="post.likable"
                :commentable_id="post.id"
                model="post"
                @posted="commentPosted"
                class="mr-4 mt-3"
            ></comment-form>
            <div class="timeline-comments-wrapper nice-scrollbar" :class="!post.likable && 'ml-0'">
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
        </fp-modal>
        <div class="top-modal fp-modal">
            <modal :name="`timeline_reacts_modal_${post.id}`" :width="400" height="auto">
                <div class="p-2 timeline_reacts_modal">
                    <div class="card">
                        <fa icon="times" class="close btn-close-modal" @click="$modal.hide(`timeline_reacts_modal_${post.id}`)" />
                        <div class="card-body">
                            <div v-for="(item, index) in reacts.slice(0, 8)" :key="index" class="react-item">
                                <img :src="item.user.photo_url" alt="">
                                <router-link :to="{name: 'fliconn.profile', params: {username: item.user.username}}" class="username">{{ item.user.name }}</router-link>
                                <span v-if="auth_user && auth_user.id === item.user_id" class="fp-text-color-main my-react">(You)</span>
                                <a href="javascript:;" v-if="auth_user
                                                 && item.user_id != auth_user.id
                                                 && !item.user.is_following
                                                 && !item.user.is_requested_follow
                                            "
                                            class="btn btn-primary btn-follow-react-user"
                                            @click="follow(item.user)"
                                >Follow</a>
                                <img :src="require(`@/assets/images/emojis/${item.alias}.gif`)" width="30" height="30" class="ml-auto" />
                            </div>
                            <div v-if="reacts.length > 8">
                                <a href="javascript:;" class="btn-read-more">{{ $nFormatter(reacts.length - 8) }} more...</a>
                            </div>
                        </div>
                    </div>
                </div>
            </modal>

            <modal v-if="post.enable_comments"
                 :name="`timeline_comment_form_modal_${post.id}`"
                 :width="500"
                 height="auto"
                 :adaptive="true"
            >
                <div class="p-2">
                    <timeline-comment-form :commentable_id="post.id" @posted="commentPosted"></timeline-comment-form>
                </div>
            </modal>

            <modal :name="`timeline_detail_modal_${post.id}`"
                 :width="1000"
                 height="auto"
                 :adaptive="true"
                 :scrollable="true"
            >
                <div class="position-relative">
                    <a href="javascript:;" class="btn-close-modal" @click.prevent="$modal.hide(`timeline_detail_modal_${post.id}`)">
                        <fp-icon name="close" class="fp-fs-22" />
                    </a>
                    <timeline-detail :post="post"
                         @like="like"
                         @emoji-selected="selectEmoji"
                         @comment-posted="commentPosted"
                    />
                </div>
            </modal>
        </div>

        <likes-modal :modal-name="`timelineLikesModal_${post.id}`"
             :ref="`timelineLikesModal_${post.id}`"
             :url="getLikesUrl"
             :params="{
                model: 'post',
                id: this.post.id
             }"
        ></likes-modal>
        <visible-modal ref="visibleModal"
            v-model="visible_form.visible_to"
            @user-selected="userSelected"
            @input="visibleChanged"
        />
    </div>
</template>
<script>
    import Form from "vform";
    import Swal from "sweetalert2";
    import LightBox from "vue-it-bigger";
    import("vue-it-bigger/dist/vue-it-bigger.min.css");
    import CommentCard from "../CommentCard.vue";
    import CommentForm from "../CommentForm.vue";
    import TimelineCommentForm from "./TimelineCommentForm.vue";
    import ReactionEmoji from "~/components/ui/Reaction.vue";
    import ReactionGif from "~/components/ui/ReactionGif.vue";
    import FpModal from "~/components/ui/Modal.vue";
    import LikesModal from "../LikesModal.vue";
    import PollItem from "../poll/PollItem.vue";
    import VisibleModal from "./TimelineVisibleModal.vue";
    import TimelineDetail from "./TimelineDetail.vue";
    import eventBus from '~/plugins/event-bus';
    export default {
        props: ["post", "page", "is_detail_page"],
        name: "TimelineItem",
        components: {
            LightBox,
            CommentCard,
            CommentForm,
            TimelineCommentForm,
            ReactionEmoji,
            ReactionGif,
            FpModal,
            LikesModal,
            PollItem,
            VisibleModal,
            TimelineDetail,
        },
        data() {
            return {
                likes_count: this.post.likes_count,
                is_liked: this.post.is_liked,
                comments_count: this.post.comments_count,
                my_comments_count: this.post.my_comments_count,
                comment_form: new Form({
                    post_id: this.post.id,
                    detail: "",
                }),
                comments: [],
                comment_per_page: 3,
                comment_page: 1,
                comment_total: 0,
                loading_comments: false,
                detailExpand: false,
                reacts: [],
                reacts_count: this.post.reacts_count,
                is_reacted: this.post.is_reacted,
                show_more_tagged_users: false,
                visible_form: new Form({
                    post_id: this.post.id,
                    visible_to: this.post.visible_to,
                    visible_users: [],
                }),
            };
        },
        computed: {
            characterDetail() {
                return this.post.detail ? this.post.detail.replace(/<[^>]+>/g, " ") : "";
            },
            taggedUserNames() {
                let displayedUsers = this.post.tagged_user_names;
                if (this.post.tagged_user_names.length > 3 && !this.show_more_tagged_users) {
                    displayedUsers = this.post.tagged_user_names.slice(0, 3);
                }
                return displayedUsers.join(", ");
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
            postAudios() {
                return this.post.images.filter(i => i.mime === 'audio');
            },
            detailUrl() {
                return `${process.env.serverUrl}/fliconn/timeline/detail/${this.post.id}`;
            },
            getLikesUrl() {
                return `${process.env.timelineApiUrl}/fliconn/get_likes`;
            },
            reportUrl() {
                return `${process.env.timelineApiUrl}/fliconn/report`;
            },
            isVisible() {
                if (this.post.poll && this.post.poll.is_expired) return false;
                return true;
            },
            isMyPost() {
                return this.auth_user && this.auth_user.id === this.post.user_id;
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
            total_reacted_count() {
                // const shared_count = this.post.shared_count || 0;
                // return this.comments_count + this.likes_count + this.reacts_count + shared_count;
                return this.reacts_count;
            },
            commentableText() {
                if (!this.auth_user) return 'Login to write a comment...';
                return this.post.enable_comments ? `Write comment...` : `${this.post.user.first_name} disabled comments`;
            }
        },
        created() {
            eventBus.$on('shared', (payload) => {
                this.shared(payload);
            });
            eventBus.$on('reported', (payload) => {
                this.reported(payload);
            });
        },
        beforeDestroy() {
            eventBus.$off('shared', (payload) => {
                this.shared(payload);
            });
            eventBus.$off('reported', (payload) => {
                this.reported(payload);
            });
        },
        methods: {
            viewDetail() {
                if (this.$route.name != "fliconn.timeline.detail") {
                    this.$router.push({
                        name: "fliconn.timeline.detail",
                        params: { id: this.post.id },
                    });
                }
            },
            openGallery(index) {
                // this.$refs.fliconnLightBox.showImage(index);
                this.$modal.show(`timeline_detail_modal_${this.post.id}`);
            },
            openEditedGallery(index) {
                this.$refs.fliconnGalleryLightBox.showImage(index);
            },
            async getComments() {
                let params = {
                    id: this.post.id,
                    per_page: this.comment_per_page,
                    page: this.comment_page,
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
            showComments() {
                this.getComments();
                this.$modal.show(`timeline_comments_modal_${this.post.id}`)
            },
            showCommentForm() {
                if (!this.auth_user) {
                    return this.$login(this.$route.path);
                }
                if (!this.post.user.likable) {
                    this.$toast.error("Sorry! You can not comment to this post.");
                    return false;
                }
                if (!this.post.enable_comments) return false;
                this.comment_page = 1;
                this.getComments();
                this.$modal.show(`timeline_comment_form_modal_${this.post.id}`);
            },
            commentPosted(data) {
                this.$modal.hide(`timeline_comment_form_modal_${this.post.id}`);
                this.comments.unshift(data);
                this.comments_count++;
                this.my_comments_count++;

                if (this.post.enable_comments && !this.post.last_comment) {
                    this.post.last_comment = data;
                }

                if (this.post.enable_notification) {
                    let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                    notiFb.set({
                        notifier_id: this.auth_user.id,
                        type: "commented_to_timelime_post",
                    });
                }
            },
            hide() {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                Swal.fire({
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios
                            .post(`${process.env.timelineApiUrl}/fliconn/hide`, {
                                id: this.post.id,
                            })
                            .then((response) => {
                                if (response.data.status == "Success") {
                                    this.$emit('hide');
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
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
                    })
                    .then((response) => {
                        if (response.data.status == "Success") {
                            if (this.is_liked) {
                                this.likes_count--;
                            } else {
                                this.likes_count++;
                            }
                            this.is_liked = !this.is_liked;
                            this.post.is_liked = this.is_liked;
                            if (this.post.enable_notification) {
                                let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                                notiFb.set({
                                    notifier_id: this.auth_user.id,
                                    type: this.is_liked ? "like_timelime_post" : "unlike_timelime_post",
                                });
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            async follow(user) {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                user.is_requested_follow = true;
                this.$emit("follow", user);
            },
            closeModal(modalId) {
                this.$modal.hide(modalId);
            },
            edit() {
                if (this.auth_user.id != this.post.user_id) return false;
                this.$router.push({
                    name: "fliconn.create.timeline",
                    query: { id: this.post.id },
                });
            },
            remove() {
                if (this.auth_user.id != this.post.user_id) return false;
                Swal.fire({
                    title: "Do you really want to delete this post?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    confirmButtonColor: '#DC3545'
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios
                            .delete(`${process.env.timelineApiUrl}/fliconn/delete/${this.post.id}`)
                            .then((response) => {
                                if (response.data.status == "Success") {
                                    this.$fpSuccess("Your post has been deleted successfully!");
                                    this.$emit("deleted");
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
            },
            async changeStatus() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/change_status`, { id: this.post.id });
                this.post.status = response.data.data;
                this.$fpSuccess(this.post.status ? "Your post is now visible on the timeline." : "Your post is hidden from the timeline.");
            },
            async changeCommentStatus() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/change_comment_status`, { id: this.post.id });
                this.post.enable_comments = response.data.data;
                this.$fpSuccess(`You have ${this.post.enable_comments ? "enabled" : "disabled"} comments on this post.`);
            },
            openLikesModal() {
                this.$refs[`timelineLikesModal_${this.post.id}`].open();
            },
            async selectEmoji(emoji) {
                if (!this.post.user.likable) {
                    this.$toast.error("Sorry! You can not react to this post.");
                    return false;
                }
                let params = {
                    id: this.post.id,
                    alias: emoji.alias,
                };
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/react`, params);
                console.log("response", response)
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
                this.post.total_reacts = response.data.data.total_reacts;
            },
            async showReacts() {
                this.$modal.show(`timeline_reacts_modal_${this.post.id}`);
                await this.getReacts();
            },
            async getReacts() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_reacts`, { id: this.post.id, model: "fliconn" });
                this.reacts = response.data.data;
            },
            clickEmojiDropdown(e) {
                e.stopPropagation();
            },
            goToProfile(user) {
                this.$router.push({
                    name: "fliconn.profile",
                    params: { username: user.username },
                });
            },
            async openChat() {
                if (this.auth_user) {
                    if (this.auth_user.id === this.post.user_id) return false;
                    if (this.post.user.is_requested_follow) return false;
                    if (!this.post.user.is_following) {
                        const res = await this.confirmFollow();
                        if (res.isConfirmed) {
                            await this.proceedFollow();
                        }
                        return false;
                    }
                    if (!this.$store.getters.enable_chat) {
                        this.$store.dispatch("setEnableChat", true);
                    }
                    let payload = {
                        user_id: this.post.user_id,
                        is_online: this.post.user.is_online,
                    }
                    this.$store.dispatch("message/openUserChatBox", payload);
                } else {
                    this.$login(this.$route.path);
                }
            },
            confirmFollow() {
                return new Promise(async (resolve) => {
                    const result = await Swal.fire({
                        title: `Follow ${this.user.first_name} to send a message`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Follow",
                        cancelButtonText: "Cancel",
                    });
                    resolve(result);
                });
            },
            async proceedFollow() {
                const data = await this.$store.dispatch("requestFollow", this.user_id);
                if (data.status === "Success") {
                    this.$fpSuccess(data.message);
                    this.$emit("follow");
                }
            },
            unfollow() {
                this.$emit('unfollow', this.post.user);
                this.post.user.is_following = false;
            },
            changeVisibility() {
                this.$refs.visibleModal.open();
            },
            async userSelected(data) {
                if (data.length === 0 && this.visible_form.visible_to === 'custom') {
                    this.$fpError('Select at least 1 follower or change visibility level.');
                } else if (this.visible_form.visible_to === 'custom') {
                    this.visible_form.visible_users = data;
                    const response = await this.visible_form.post(`${process.env.timelineApiUrl}/fliconn/change_visibility`);
                    if (response.data.status === 'Success') {
                        this.post.visible_to = 'custom';
                        this.$refs.visibleModal.close();
                    }
                }
            },
            async visibleChanged(value) {
                if (value !== 'custom') {
                    const response = await this.visible_form.post(`${process.env.timelineApiUrl}/fliconn/change_visibility`);
                    if (response.data.status === 'Success') {
                        this.post.visible_to = value;
                    }
                }
            },
            async toggleNotification() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/toggle_notification`, {id: this.post.id});
                if (response.data.status === 'Success') {
                    this.post.enable_notification = response.data.data;
                    this.$fpSuccess(`You have ${this.post.enable_notification ? "enabled" : "disabled"} notification on this post.`);
                }
            },
            report() {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                const payload = {
                    url: this.reportUrl,
                    params: {
                        id: this.post.id,
                        model: 'timeline',
                    },
                }
                this.$report(payload);
            },
            reported(payload) {
                if (payload.model === 'timeline' && payload.id === this.post.id) {
                    this.post.is_reported = true;
                    if (this.post.enable_notification) {
                        let notiFb = this.$fire.database.ref("notifications/" + this.post.user_id).push();
                        notiFb.set({
                            notifier_id: this.auth_user.id,
                            type: "report_timelime_post",
                        });
                    }
                }
            },
            share() {
                const payload = {
                    model: 'timeline',
                    id: this.post.id,
                    url: this.detailUrl,
                }
                this.$share(payload);
            },
            async shared(payload) {
                if (payload.model === 'timeline' && payload.id === this.post.id) {
                    const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/share`, { id: this.post.id });
                    if (response.data.status === "Success") {
                        this.post.shared_count++;
                    }
                }
            }
        },
    };
</script>

<style lang="scss" scoped>
    .slider-img {
        height: 305px;
        width: 100%;
        object-fit: cover;
    }
    .comments {
        margin-left: 48px;
        @media (max-width: 600px) {
            margin-left: 10px;
        }
    }
    .fliconn-post {
        border-radius: 12px;
        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .post-user {
                display: flex;
                align-items: center;
                img.photo {
                    width: 52px;
                    height: 52px;
                    border-radius: 3em;
                    object-fit: cover;
                }
                .username {
                    font-size: 16px;
                    line-height: 1.2;
                    font-weight: 600;
                }
                .diff_time {
                    color: #64748B;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 15.47px;
                }
                .btn-follow-img img {
                    width: 22px;
                    height: 22px;
                    border-radius: 0;
                }
            }
        }
        .fliconn-post-detail {
            color: #0C0C0C;
            font-size: 16px;
            font-weight: 500;
        }

        .timeline-actions {
            display: flex;
            align-items: center;
            padding-top: 4px;
            color: #BBB;
            .img-user {
                width: 40px;
                height: 40px;
                border-radius: 100%;
                object-fit: cover;
            }
            .actions-links {
                flex-grow: 1;
                border-radius: 8px;
                display: flex;
                align-items: center;
                padding: 8px 12px;
                font-size: 13px;
                font-weight: 500;
            }
        }
        .timeline-footer {
            font-size: 13.6px;
            @media (max-width: 600px) {
                font-size: 12px;
                svg {
                    width: 20px;
                    height: 20px;
                }
            }
            .timeline-comments, .timeline-shares {
                line-height: 19px;
            }
            .timeline-react-section {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding: 8px;
                background-color: #F0F3F9;
                @media (max-width: 600px) {
                    padding: 6px 8px;
                }
            }
        }
    }
    [data-theme=dark] {
        .timeline-footer {
            .timeline-react-section {
                background-color: #18243E;
            }
        }
    }

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
                background-color: white;
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
    .timeline_reacts_modal {
        .react-item {
            display: flex;
            align-items: center;
            font-size: 22px;
            margin: 0 20px 8px;
            .username {
                color: #212529;
                font-size: 14.4px;
                font-weight: bold;
                display: inline-block;
                width: 180px;
                max-width: 180px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-left: 8px;
            }
            img {
                width: 32px;
                height: 32px;
                object-fit: cover;
                border-radius: 100%;
                border: solid 2px #004080;
            }
            .my-react {
                font-size: 13.6px;
            }
            .btn-follow-react-user {
                font-size: 12px;
                padding: 1px 8px;
                margin: 0 4px;
            }
        }
    }

    .timeline-comments-wrapper {
        // height: calc(100vh - 140px);
        max-height: 500px;
        overflow-y: auto;
        margin-top: 20px;
        margin-left: 42px;
        &::-webkit-scrollbar {
            width: 8px;
        }
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
    .poll-voted {
        margin-left: 60px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }
    .visible_to {
        svg {
            font-size: 15px;
        }
    }

    .timeline-total-reacted {
        .reacted-users {
            img {
                border-radius: 100%;
                margin-left: -8px;
                border: solid 2px #FF22A1;
                &:first-child {
                    margin-left: 0;
                }
                @media (max-width: 600px) {
                    width: 25px;
                    height: 25px;
                    border-width: 1.5px;
                }
            }
        }
    }

    [data-theme=dark] {
        .circle_emoji {
            background-color: #00162D !important;
        }
        .fliconn-post {
            &-detail {
                color: #8299BA;
            }
        }
    }
</style>
