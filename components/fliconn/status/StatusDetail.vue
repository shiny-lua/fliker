<template>
    <div class="status-detail fp-card p-0">
        <div
            v-if="
                (status.type === 'image' && status.images.length === 1) ||
                (status.type === 'text' && status.text_slides.length === 1)
            "
            class="one-image-progress"
        >
            <div class="progress-container">
                <div class="progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        </div>
        <VueSlickCarousel v-if="status.type === 'text'" ref="textStatusSlick" v-bind="slickSettings" @beforeChange="beforeChange">
            <div v-for="(slide, index) in status.text_slides"
                 :key="index"
                 class="slide slide-text-status"
                 :style="{
                    background: slide.bgImage
                        ? `url('https://timeline.flickerpage.com/assets/images/${slide.bgImage}')`
                        : slide.color,
                    fontFamily: slide.font ? slide.font : 'unset',
                 }"
            >
                <p class="slide-status-text">
                    {{ slide.text.slice(0, 250) }} <span v-if="slide.text.length > 250">...</span>
                </p>
            </div>
            <template #customPaging>
                <div class="custom-dot" :style="{ width: `${dotWidth}px` }">
                    <div class="dot-slider"></div>
                </div>
            </template>
        </VueSlickCarousel>
        <VueSlickCarousel v-else-if="status.type === 'image'" ref="statusSlick" v-bind="slickSettings" @beforeChange="beforeChange">
            <div class="slide" v-for="(img, index) in status.images" :key="index">
                <img class="slider-img" :src="img.src_url" alt="" />
            </div>
            <template #customPaging>
                <div class="custom-dot" :style="{ width: `${dotWidth}px` }">
                    <div class="dot-slider"></div>
                </div>
            </template>
        </VueSlickCarousel>
        <div v-else-if="status.type === 'video'" class="status-video-container">
            <div class="progress-container d-md-none">
                <div class="mx-auto" style="width: 250px; background-color: rgba(0, 0, 0, 0.5); padding: 5px;">
                    <div class="progress">
                        <div class="progress-bar" :style="{ width: `${playerPercent}%` }"></div>
                    </div>
                </div>
            </div>
            <video-player class="video-player-box" ref="statusVideoPlayer" :options="playerOptions" :playsinline="true" @ended="onPlayerEnded($event)" @timeupdate="playerTimeupdate($event)"></video-player>
        </div>
        <div class="status-actions">
            <div class="action-icons">
                <div class="btn-actions">
                    <a href="javascript:;" class="btn-action view-count" title="Views">
                        <span class="action-icon">
                            <fp-icon name="eye" />
                        </span>
                        <p class="mb-0">{{ $nFormatter(status.view_count) }}</p>
                    </a>
                    <a href="javascript:;" class="btn-action like" :class="status.is_liked && 'is_liked'" title="Likes">
                        <span class="action-icon" @click="like">
                            <fp-icon :name="status.is_liked ? 'heart-fill' : 'heart-like'" />
                        </span>
                        <p class="mb-0" @click="$emit('show-likes')">
                            {{ $nFormatter(status.likes_count) }}
                        </p>
                    </a>
                    <a href="javascript:;" class="btn-action comment show-modal d-md-none" @click.prevent="$emit('show-comments-modal')" title="Comments">
                        <span class="action-icon">
                            <fp-icon name="comment-dots" />
                        </span>
                        <p class="mb-0">{{ $nFormatter(status.comments_count) }}</p>
                    </a>
                    <a href="javascript:;" class="btn-action comment d-none d-md-inline" @click.prevent="$emit('show-comments')" title="Comments">
                        <span class="action-icon">
                            <fp-icon name="comment-dots" />
                        </span>
                        <p class="mb-0">{{ $nFormatter(status.comments_count) }}</p>
                    </a>
                    <a href="javascript:;" class="btn-action share" title="Share">
                        <span class="action-icon">
                            <fp-icon name="share-arrow" />
                        </span>
                    </a>
                </div>
                <a href="javascript:;" class="btn-action prev" @click.prevent="$emit('prev')">
                    <fp-icon name="chevron-up-round" />
                </a>
                <div class="status-user" :title="status.user.name">
                    <img :src="status.user.photo_url" alt="" />
                </div>
                <a href="javascript:;" class="btn-action next" @click.prevent="$emit('next')">
                    <fp-icon name="chevron-down-round" />
                </a>
            </div>
        </div>
        <div v-if="status.title || followable" class="status-footer">
            <p v-if="status.tagged_user_names.length" class="mb-2 tagged-users">{{tagged_user_names.slice(0, 3).join(', ')}} <span v-if="tagged_user_names.length > 3">+{{ tagged_user_names.length - 3 }} more..</span> </p>
            <div class="d-flex">
                <div v-if="status.title" class="flex-grow-1">
                    <p class="title mb-1">
                        {{ status.title.length > 100 ? `${status.title.substring(0, 100)}...` : status.title }}
                    </p>
                </div>
                <div v-if="followable" class="mb-1 ml-auto">
                    <a href="javascript:;"
                        class="btn fp-btn-gradient"
                        @click.prevent="$emit('follow', status.user)"
                    >Follow</a>
                </div>
            </div>
        </div>
        <div class="status-detail-overlay"></div>
    </div>
</template>
<script>
    import VueSlickCarousel from "vue-slick-carousel";
    import "vue-slick-carousel/dist/vue-slick-carousel.css";
    // optional style for arrows & dots
    import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
    import "video.js/dist/video-js.css";
    import { videoPlayer } from "vue-video-player";
    export default {
        name: "StatusDetail",
        props: ["status", "page"],
        components: {
            VueSlickCarousel,
            videoPlayer,
        },
        data() {
            return {
                slickSettings: {
                    arrows: false,
                    dots: true,
                    dotsClass: "slick-dots status-dot-class",
                    edgeFriction: 0.35,
                    infinite: true,
                    speed: 300,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    pauseOnHover: false,
                    swipe: false,
                },
                playerOptions: {
                    autoplay: true,
                    controls: true,
                    language: "en",
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources:
                        this.status.type === "video"
                            ? [
                                  {
                                      type: "video/mp4",
                                      src: this.status.images[0].src_url,
                                  },
                              ]
                            : [],
                },
                comments: [],
                likes: [],
                playerPercent: 0,
            };
        },
        computed: {
            dotWidth() {
                if (this.status.type === "text") {
                    return 280 / this.status.text_slides.length - 10;
                } else {
                    return 280 / this.status.images.length - 10;
                }
            },
            videoPlayer() {
                return this.$refs.statusVideoPlayer;
            },
            followable() {
                return this.auth_user && this.status.user_id != this.auth_user.id && !this.status.user.is_following && !this.status.user.is_requested_follow;
            },
            tagged_user_names() {
                return this.status.tagged_user_names.map(i => `@${i}`);
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        mounted() {
            this.initProgressBar();
            this.viewStatusDetail();
        },
        methods: {
            async viewStatusDetail() {
                const response = await this.axios.get(`${process.env.timelineApiUrl}/status/view/${this.status.id}`);
                if (response.data.status === 'Success') {
                    this.status.view_count = response.data.data;
                }

            },
            initProgressBar() {
                if (this.status.type != "video") {
                    if (this.status.images.length === 1 || (this.status.type === "text" && this.status.text_slides.length === 1)) {
                        let oneProgress = document.querySelector(".one-image-progress .progress .progress-bar");
                        oneProgress.classList.add("active");
                    } else {
                        let firstDot = document.querySelector(".status-dot-class li:first-child .custom-dot .dot-slider");
                        firstDot.classList.add("first-progress");
                    }
                }
            },
            async getDetail() {
                if (!this.status) return false;
                const response = await this.axios.post(`${process.env.timelineApiUrl}/status/get_detail`, { id: this.status.id });
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
                if (!this.status.user.likable) {
                    this.$toast.error("Sorry! You can not like this status.");
                    return false;
                }
                if (!this.auth_user) {
                    this.login(this.$route.path);
                    return false;
                }
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/like`, { id: this.status.id, model: "status" });
                if (response.data.status === "Success") {
                    if (this.status.is_liked) {
                        this.status.likes_count--;
                    } else {
                        this.status.likes_count++;
                    }
                    this.status.is_liked = !this.status.is_liked;
                }
            },
            next() {
                if (this.status.type === "text") {
                    this.$refs.textStatusSlick.next();
                } else {
                    this.$refs.statusSlick.next();
                }
            },
            prev() {
                if (this.status.type === "text") {
                    this.$refs.textStatusSlick.prev();
                } else {
                    this.$refs.statusSlick.prev();
                }
            },
            play() {
                if (this.status.type === "image") {
                    this.$refs.statusSlick.play();
                } else if (this.status.type === "video") {
                    this.videoPlayer.player.play();
                } else if (this.status.type === "text") {
                    this.$refs.textStatusSlick.play();
                }
            },
            pause() {
                if (this.status.type === "image") {
                    this.$refs.statusSlick.pause();
                } else if (this.status.type === "video") {
                    this.videoPlayer.player.pause();
                } else if (this.status.type === "text") {
                    this.$refs.textStatusSlick.pause();
                }
            },
            beforeChange(index) {
                if (this.status.type === "image" && index === this.status.images.length - 1) {
                    this.$emit("slide-ended");
                }
                if (this.status.type === "text" && index === this.status.text_slides.length - 1) {
                    this.$emit("slide-ended");
                }
            },
            // Video Player
            onPlayerEnded(player) {
                this.$emit("slide-ended");
            },
            playerTimeupdate(player) {
                let playerPercent = Math.round((player.currentTime() * 100) / player.duration());
                this.playerPercent = playerPercent;
            },
        },
    };
</script>
<style lang="scss" scoped>
    .status-detail {
        position: relative;
        @media (min-width: 601px) {
            border-radius: 15px;
            height: calc(100vh - 100px);
            max-height: 700px;
        }
        &::v-deep {
            .status-dot-class {
                height: 30px;
                @media (max-width: 600px) {
                    top: 85px;
                }
                @media (min-width: 601px) {
                    transform: rotate(270deg);
                    top: calc(50% - 18px);
                    right: -47%;
                }
                li {
                    padding: 5px;
                    margin: 0;
                    height: 17px;
                    background-color: rgba(0, 0, 0, 0.5);
                    &.slick-active:first-child {
                        .custom-dot {
                            .dot-slider {
                                width: 0;
                                &.first-progress {
                                    width: 100%;
                                    transition: width 5s linear;
                                }
                            }
                        }
                    }
                    .custom-dot {
                        height: 7px;
                        background-color: #007BFF;
                        @media (max-width: 600px) {
                            width: 40px !important;
                        }
                        .dot-slider {
                            width: 0;
                            height: 100%;
                        }
                    }
                    &.slick-active {
                        & ~ li {
                            .custom-dot {
                                background-color: #b7aeae;
                            }
                        }
                        .custom-dot {
                            background-color: #b7aeae !important;
                            .dot-slider {
                                background-color: #007BFF !important;
                                width: 100%;
                                transition: width 5s linear;
                            }
                        }
                    }
                }
            }
        }
        .status-actions {
            position: absolute;
            top: 0;
            right: -100px;
            height: 100%;
            padding: 12px;
            z-index: 2;
            @media (max-width: 600px) {
                right: 0;
                padding: 6px;
                padding-bottom: 80px;
            }
            .action-icons {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                height: 100%;
            }
            .btn-actions {
                height: 40%;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                margin-bottom: 30px;
            }
            .status-user {
                margin: 16px 0;
                img {
                    border-radius: 100%;
                    border: solid 2.5px #FF22A1;
                    width: 75px;
                    height: 75px;
                    padding: 3px;
                    object-fit: cover;
                    @media (max-width: 600px) {
                        width: 60px;
                        height: 60px;
                        border: solid 2px #FF22A1;
                    }
                }
            }
            .btn-action {
                color: #fff;
                font-size: 13.6px;
                text-align: center;
                text-decoration: none;
                .action-icon {
                    display: flex;
                    width: 36px;
                    height: 36px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 100%;
                    margin-bottom: 3px;
                }
                @media (max-width: 600px) {
                    right: 18px;
                }
                &.view-count {
                    .action-icon {
                        background-color: #F5EEFF;
                        color: #A665FF;
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
                        font-size: 28px;
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
        .status-footer {
            position: absolute;
            bottom: 0;
            z-index: 1;
            width: 100%;
            padding: 6px 15px;
            min-height: 45px;
            @media (min-width: 600px) {
                border-bottom-left-radius: 15px;
                border-bottom-right-radius: 15px;
            }
            .tagged-users {
                color: #FF22A1;
            }
            .title {
                color: #fff;
                font-size: 13px;
                line-height: 1.2;
            }
            .btn {
                font-size: 14.4px;
                padding: 6px 16px;
                border-radius: 5px;
            }
        }
    }
    .slider-img {
        width: 100%;
        aspect-ratio: 9 / 16;
        height: calc(100vh - 100px);
        max-height: 700px;
        object-fit: contain;
        border-radius: 15px;
        @media (max-width: 600px) {
            height: var(--app-height);
            border-radius: 0;
            max-height: unset;
        }
    }
    .one-image-progress {
        position: absolute;
        @media (max-width: 600px) {
            top: 85px;
        }
        @media (min-width: 600px) {
            transform: rotate(270deg);
            top: calc(50% - 18px);
            right: -45%;
        }
        width: 100%;
        z-index: 1;
        .progress-container {
            width: 120px;
            padding: 5px;
            margin: auto;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .progress {
            background-color: #b7aeae;
            height: 7px;
            .progress-bar {
                background-color: #fff !important;
                width: 0;
                &.active {
                    width: 100%;
                    transition: width 5s linear;
                }
            }
        }
    }
    // Video
    .video-player-box::v-deep {
        .video-js {
            width: 100%;
            height: calc(100vh - 100px);
            max-height: 698px;
            @media (min-width: 600px) {
                border-radius: 15px;
            }
            @media (max-width: 600px) {
                width: 100vw;
                height: calc(var(--app-height) - 1px);
                max-height: unset;
            }
            .vjs-big-play-button,
            .vjs-fullscreen-control {
                display: none !important;
            }
        }
        .vjs-control-bar {
            @media (min-width: 600px) {
                width: calc(100% - 52px);
                transform: rotate(270deg);
                top: calc(50% - 18px);
                right: -36%;
                left: unset;
            }
        }
    }
    .slide-text-status {
        width: 100%;
        height: calc(100vh - 100px);
        max-height: 700px;
        object-fit: cover;
        border-radius: 15px;
        display: inline-flex !important;
        align-items: center;
        padding: 6px 12px;
        font-size: 24px;
        color: #fff;
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        @media (max-height: 900px) {
            font-size: 22px;
        }
        @media (max-height: 700px) {
            font-size: 20px;
        }
        @media (max-width: 600px) {
            height: var(--app-height);
            max-height: unset;
            border-radius: 0;
        }
        .slide-status-text {
            margin-bottom: 0;
            max-height: 100%;
        }
    }
    .status-video-container {
        .progress-container {
            position: absolute;
            top: 20px;
            width: 100%;
            text-align: center;
            z-index: 1;
            @media (max-width: 600px) {
                top: 80px;
            }
            .progress {
                background-color: #b7aeae;
                height: 7px;
                .progress-bar {
                    background-color: #fff;
                }
            }
        }
        &::v-deep {
            .vjs-tech {
                border-radius: 15px;
            }
        }
    }
    .status-detail-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(0deg, #000000 -9.08%, rgba(0, 0, 0, 0) 48.69%);
        border-radius: 15px;
    }

    [data-theme=dark] {
        .action-icon {
            background-color: #00162D !important;
        }
    }
</style>
