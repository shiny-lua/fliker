<template>
    <div class="clips-detail-container">
        <div class="clips-detail">
            <div class="progress-container d-md-none">
                <div class="mx-auto" style="width: 250px; background-color: rgba(0, 0, 0, 0.5); padding: 5px;">
                    <div class="progress">
                        <div class="progress-bar" :style="{ width: `${playerPercent}%` }"></div>
                    </div>
                </div>
            </div>
            <div class="clips-video-container">
                <video-player class="video-player-box" ref="clipPlayer" :options="playerOptions" :playsinline="true" @ended="onPlayerEnded($event)" @timeupdate="playerTimeupdate($event)"></video-player>
            </div>
            <div class="clips-footer">
                <p v-if="clips.tags.length" class="tags mb-0">
                    {{ clips.tags.map((i) => i.name).join(" ") }}
                </p>
                <p v-if="clips.description" class="description mb-2">
                    {{ clips.description.length > 100 ? `${clips.description.substring(0, 100)}...` : clips.description }}
                </p>
                <div class="d-flex align-items-center">
                    <div class="clips-user d-md-none" :title="clips.user.name">
                        <img :src="clips.user.photo_url" alt="" />
                    </div>
                    <p class="mb-0 ml-2 text-white d-md-none">{{ clips.user.name }}</p>
                    <a v-if="
                            clips.user_id != auth_user.id &&
                            !clips.user.if_following &&
                            !clips.user.is_requested_follow
                        "
                        href="javascript:;"
                        class="btn fp-btn-gradient px-3 py-1 rounded-sm ml-auto"
                        @click.prevent="requestFollow"
                    >
                        Follow
                    </a>
                </div>
            </div>
        </div>

        <div class="clips-actions">
            <div class="action-icons">
                <div class="dropdown dropdown-context-menu mb-auto">
                    <a href="javascript:;" class="dropdown-toggle no-caret" data-toggle="dropdown">
                        <fp-icon name="dots-circle-h" class="fp-fs-24 fp-text-color-main" />
                    </a>
                    <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                        <li class="dropdown-item" @click="bookmark()">
                            <fp-icon name="heart" class="fp-fs-16" />
                            <div>
                                <p>{{ clips.is_bookmarked ? "Remove from Favourite" : "Favourite" }}</p>
                                <p>{{ clips.is_bookmarked ?  'Remove' : 'Save'}} this post in your favourite</p>
                            </div>
                        </li>
                        <li class="dropdown-item">
                            <fp-icon name="eye" class="fp-fs-16" />
                            <div>
                                <p>Don't show this again</p>
                                <p>This flick will not display again for you</p>
                            </div>
                        </li>
                        <li v-if="!clips.is_reported" class="dropdown-item" @click="report()">
                            <fp-icon name="flag" class="fp-fs-16" />
                            <div>
                                <p>Report</p>
                                <p>Flag for admin review</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="btn-actions">
                    <a href="javascript:;" class="btn-action view-count" title="Views">
                        <span class="action-icon">
                            <fp-icon name="eye" />
                        </span>
                        <p class="mb-0">{{ $nFormatter(clips.view_count) }}</p>
                    </a>
                    <a href="javascript:;" class="btn-action like" :class="clips.is_liked && 'is_liked'" title="Likes">
                        <span class="action-icon" @click="like()">
                            <fp-icon :name="clips.is_liked ? 'heart-fill' : 'heart-like'" />
                        </span>
                        <p class="mb-0" @click="$emit('show-likes')">
                            {{ $nFormatter(clips.likes_count) }}
                        </p>
                    </a>
                    <a href="javascript:;" class="btn-action comment show-modal d-md-none" @click.prevent="showCommentForm()" title="Comments">
                        <span class="action-icon">
                            <fp-icon name="comment-dots" />
                        </span>
                        <p class="mb-0">{{ $nFormatter(clips.comments_count) }}</p>
                    </a>
                    <a href="javascript:;" class="btn-action comment d-none d-md-inline" @click.prevent="showComments = true" title="Comments">
                        <span class="action-icon">
                            <fp-icon name="comment-dots" />
                        </span>
                        <p class="mb-0">{{ $nFormatter(clips.comments_count) }}</p>
                    </a>
                    <a href="javascript:;" class="btn-action share" title="Share">
                        <span class="action-icon">
                            <fp-icon name="share-arrow" />
                        </span>
                    </a>
                </div>
                <a href="javascript:;" class="btn-action prev d-none d-md-block" @click.prevent="$emit('prev')">
                    <fp-icon name="chevron-up-round" />
                </a>
                <div class="clips-user d-none d-md-block" :title="clips.user.name">
                    <img :src="clips.user.photo_url" alt="" />
                </div>
                <a href="javascript:;" class="btn-action next d-none d-md-block" @click.prevent="$emit('next')">
                    <fp-icon name="chevron-down-round" />
                </a>
            </div>
        </div>
        
        <div v-if="showComments" class="clips-comments d-none d-md-block">
            <div class="fp-card border-0 h-100">
                <a href="javascript:;" class="btn-close-comments" @click="showComments = false">
                    <fp-icon name="close" class="fp-fs-22" />
                </a>
                <div class="comments-block">
                <div class="mt-3 pt-1 comments  nice-scrollbar">
                    <div class="mt-3">
                        <div v-if="comments.length > 0"> 
                            <comment-card v-for="(item, index) in comments"
                                :key="index"
                                :comment="item"
                                model="clips"
                        />
                    </div>
                        <div v-else> 
                        <p class="text-center">No Comments Found</p>
                    </div>
                    </div>
                </div>
                <div class="mt-3 pt-1 comments">
                    
                        <comment-form :clip_id="clips.id"
                            model="clips"
                            @posted="commentPosted"
                            class="mt-1"
                        />
                    
                   
                </div>
            </div>
            </div>
        </div>
    

        <fp-modal name="clipCommentModal"
             :width="550"
             @opened="pausePlayer()"
             @closed="playPlayer()"
             title="Comments"
             :middleOnMobile="true"
        >
            <div class="p-1" style="overflow-y: auto; height: 100%;">
                <div class="card-post" v-if="clips">
                    <comment-form :clip_id="clips.id" model="clips" @posted="commentPosted"></comment-form>
                    <div class="comments mt-3 ml-2 ml-md-4">
                        <comment-card v-for="(item, index) in comments" :comment="item" :key="index" @deleted="comments.splice(index, 1)" model="clips"></comment-card>
                    </div>
                </div>
            </div>
        </fp-modal>

        <modal name="clipLikesModal" width="300" height="auto" :scrollable="true" :adaptive="true" @opened="pausePlayer()" @closed="playPlayer()">
            <div class="p-1 fliconn-footer">
                <div class="card card-body p-1 card-post dropdown-likes">
                    <div class="dropdown-logo">
                        <fa icon="heart" />
                    </div>
                    <div class="pt-4">
                        <div v-for="(item, index) in likes" :key="index" class="liker px-2 cursor-pointer">
                            <img :src="item.user.photo_url" alt="" @click="goToProfile(item.user)" />
                            <span class="mr-2" @click="goToProfile(item.user)">{{ item.user.name }}</span>
                            <span v-if="item.user_id === auth_user.id" class="ml-auto">You</span>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
    import CommentCard from "../CommentCard.vue";
    import CommentForm from "../CommentForm.vue";
    import "video.js/dist/video-js.css";
    import { videoPlayer } from "vue-video-player";
    import FpModal from "@/components/ui/Modal.vue";
    import eventBus from '~/plugins/event-bus';
    export default {
        name: "ClipsDetail",
        props: {
            clips: { type: Object, required: true },
        },
        components: {
            CommentCard,
            CommentForm,
            videoPlayer,
            FpModal,
        },
        data() {
            return {
                playerOptions: {
                    autoplay: true,
                    loop: true,
                    controls: true,
                    language: "en",
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources: [
                        {
                            type: "video/mp4",
                            src: this.clips.path,
                        },
                    ],
                },
                showComments: false,
                comments: [],
                likes: [],
                playerPercent: 0,
            };
        },
        computed: {
            player() {
                return this.$refs.clipPlayer;
            },
            reportUrl() {
                return `${process.env.clipsApiUrl}/clips/report`;
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        watch: {
            showComments(value) {
                this.$emit('show-comments', value);
            },
        },
        async mounted() {
            this.getDetail();
            eventBus.$on('reported', (payload) => {
                this.reported(payload);
            });
        },
        beforeDestroy() {
            eventBus.$off('reported', (payload) => {
                this.reported(payload);
            });
        },
        methods: {
            async getDetail() {
                if (!this.clips) return false;
                const response = await this.axios.post(`${process.env.clipsApiUrl}/clips/get_detail`, { id: this.clips.id });
                if (response.data.status === "Success") {
                    let result = response.data.data;
                    this.comments = result.comments;
                }
            },
            login(redirect = "") {
                if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
                if (this.$route.name !== "login") this.$router.push({ name: "login" });
            },
            async like() {
                if (!this.clips.user.likable) {
                    this.$toast.error("Sorry! You can not like this post.");
                    return false;
                }
                if (!this.auth_user) {
                    this.login(this.$route.path);
                    return false;
                }
                const response = await this.axios.post(`${process.env.clipsApiUrl}/clips/like`, { id: this.clips.id, model: "clips" });
                if (response.data.status === "Success") {
                    if (this.clips.is_liked) {
                        this.clips.likes_count--;
                    } else {
                        this.clips.likes_count++;
                    }
                    this.clips.is_liked = !this.clips.is_liked;
                }
            },
            async showLikes() {
                const { data } = await this.axios.post(`${process.env.clipsApiUrl}/clips/get_likes`, { id: this.clips.id, model: "clips" });
                this.likes = data.data;
                this.$modal.show("clipLikesModal");
            },
            async showCommentForm() {
                if (!this.auth_user) {
                    this.login(this.$route.path);
                    return false;
                }
                this.$modal.show("clipCommentModal");
            },
            commentPosted(data) {
                this.comments.push(data);
                this.clips.comments_count++;
            },
            beforeChange(index) {
                if (index === this.clips.images.length - 1) {
                    this.$emit("slide-ended");
                }
            },
            goToProfile(user) {
                this.$router.push({
                    name: "fliconn.profile",
                    params: { username: user.username },
                });
            },
            onPlayerEnded(player) {
                this.$emit("ended");
            },
            playerTimeupdate(player) {
                let playerPercent = Math.round((player.currentTime() * 100) / player.duration());
                this.playerPercent = playerPercent;
            },
            pausePlayer() {
                this.player.player.pause();
            },
            playPlayer() {
                this.player.player.play();
            },
            async requestFollow() {
                const data = await this.$store.dispatch("requestFollow", this.clips.user_id);
                if (data.status === "Success") {
                    this.clips.user.is_requested_follow = true;
                }
            },
            bookmark() {
                this.axios.post(`${process.env.clipsApiUrl}/clips/bookmark`, {
                        id: this.clips.id,
                    })
                    .then((response) => {
                        if (response.data.status == "Success") {
                            this.clips.is_bookmarked = response.data.data;
                            if (!response.data.data) {
                                this.$emit('bookmark-removed');
                            }
                        }
                    });
            },
            report() {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                if (this.clips.is_reported) {
                    return this.$toast.error("This short flicks has already been reported");
                }
                const payload = {
                    url: this.reportUrl,
                    params: {
                        id: this.clips.id,
                        model: 'clips',
                    },
                }
                this.$report(payload);
            },
            reported(payload) {
                if (payload.model === 'clips' && payload.id === this.clips.id) {
                    this.clips.is_reported = true;
                    if (this.clips.enable_notification) {
                        let notiFb = this.$fire.database.ref("notifications/" + this.clips.user_id).push();
                        notiFb.set({
                            notifier_id: this.auth_user.id,
                            type: "report_clips",
                        });
                    }
                }
            },
        },
    };
</script>
<style lang="scss" scoped>

    .clips-detail-container {
        position: relative;
        // aspect-ratio: 9 / 16;
        @media (min-width: 601px) {
            aspect-ratio: 9 / 16;
            height: calc(100vh - 148px);
            max-height: 570px;
        }
        @media (max-width: 600px) {
            height: calc(100vh - 160px);
        }
        .clips-detail {
            position: relative;
        }
        .video-player-box::v-deep {
            .video-js {
                width: 100%;
                height: calc(100vh - 160px);
                max-height: 570px;
                border-radius: 10px;
                .vjs-big-play-button,
                .vjs-fullscreen-control {
                    display: none !important;
                }
                video {
                    border-radius: 10px;
                }
                @media (max-width: 600px) {
                    max-height: unset;
                    height: calc(100vh - 148px);
                }
            }
            .vjs-control-bar {
                display: none;
                @media (min-width: 600px) {
                    display: flex;
                    top: 14px;
                    width: calc(100% - 28px);
                    margin-left: 14px;
                }
            }
        }
        .progress-container {
            position: absolute;
            top: 20px;
            width: 100%;
            text-align: center;
            z-index: 1;
            .progress {
                background-color: #b7aeae;
                height: 7px;
                border-radius: 0;
                .progress-bar {
                    background-color: #fff;
                }
            }
        }
        .clips-comments {
            aspect-ratio: 11 / 16;
            position: absolute;
            top: 0;
            margin-left: calc(100% + 76px);
            height: calc(100vh - 148px);
            max-width: 376px;
            max-height: 570px;
            .comments {
                max-height: calc(100% - 75px);
                overflow: auto;                
            }
            .btn-close-comments {
                position: absolute;
                top: 10px;
                right: 10px;
                color: #000;
                cursor: pointer;
            }
        }
        .clips-footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 6px 15px;
            min-height: 60px;
            z-index: 2;
            // background-color: rgba(0, 0, 0, 0.45);
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 40.83%);
            border-radius: 0 0 10px 10px;
            .tags {
                font-size: 12.4px;
                color: #fff;
                max-width: calc(100% - 20px);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .description {
                color: #fff;
                font-size: 12.4px;
                line-height: 1.2;
            }
        }
        .clips-actions {
            position: absolute;
            top: 0;
            right: -76px;
            height: 100%;
            padding: 8px;
            z-index: 1;
            @media (max-width: 600px) {
                top: 10px;
                right: 2px;
                padding: 6px;
                height: 80%;
                z-index: 2;
            }
            .action-icons {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                height: 100%;
                .dropdown-context-menu {
                    .dropdown-toggle {
                        @media (max-width: 600px) {
                            .fp-svg-fill-3 {
                                fill: #FFF;
                            }
                            .fp-svg-stroke-3 {
                                stroke: #FFF;
                            }
                        }
                    }
                }
            }
            .btn-actions {
                height: 50%;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                margin-bottom: 30px;
                @media (max-width: 600px) {
                    height: 55%;
                }
            }
            .btn-action {
                font-size: 14.4px;
                text-align: center;
                text-decoration: none;
                @media (max-width: 600px) {
                    right: 18px;
                }
                .action-icon {
                    display: flex;
                    width: 36px;
                    height: 36px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 100%;
                    margin-bottom: 3px;
                }
                &.view-count {
                    .action-icon {
                        color: #A665FF;
                        background-color: #F5EEFF;
                    }
                }
                &.comment {
                    .action-icon {
                        color: #468FEA;
                        background-color: #E2EFFF;
                    }
                }
                &.like {
                    .action-icon {
                        color: #FF7272;
                        background-color: #FFE7E7;
                    }
                    &.is_liked .action-icon {
                        font-size: 20px;
                        color: red;
                    }
                }
                &.share {
                    .action-icon {
                        color: #FF850D;
                        background-color: #FFECDB;
                    }
                    svg {
                        font-size: 22px;
                    }
                }
                &.prev, &.next {
                    svg {
                        font-size: 26px;
                        color: #FF22A1;
                    }
                    @media (max-width: 600px) {
                        display: none;
                    }
                }
                svg {
                    font-size: 24px;
                }
            }
        }
    }
    .clips-user {
        margin: 16px 0;
        img {
            border-radius: 100%;
            border: solid 2px #FF22A1;
            width: 60px;
            height: 60px;
            object-fit: cover;
            padding: 3px;
            @media (max-width: 600px) {
                width: 50px;
                height: 50px;
                border: solid 1px #FF22A1;
            }
        }
    }

    [data-theme=dark] {
        .action-icon {
            background-color: #00162D !important;
        }
    }
</style>
