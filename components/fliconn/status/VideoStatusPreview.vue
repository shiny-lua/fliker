<template>
    <div class="status-preview">
        <div class="status-content">
            <a href="javascript:;" class="btn-close" @click.prevent="$emit('close')">
                <fp-icon name="close" class="fp-fs-24" />
            </a>
            <div class="status-detail">
                <video-player ref="statusVideoPlayer"
                     class="video-player-box"
                     :options="playerOptions"
                     :playsinline="true"
                     @ended="onPlayerEnded($event)"
                     @timeupdate="playerTimeupdate($event)"
                ></video-player>
            </div>
            <div v-if="tagged_users.length" class="status-header">
                <p class="mb-0 tagged-users">{{tagged_users.slice(0, 3).join(', ')}} <span v-if="tagged_users.length > 3">+{{ tagged_users.length - 3 }} more..</span> </p>
            </div>
            <div v-if="title" class="status-footer">
                <p class="title mb-1">
                    {{ title.length > 100 ? `${title.substring(0, 100)}...` : title }}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
export default {
    name: 'ImageStatusPreview',
    props: {
        files: { type: Array, required: true },
        tagged_users: { type: Array, default: [] },
        title: { type: String, default: '' },
    },
    components: {
        videoPlayer,
    },
    data() {
        return {
            showSlide: true,
            playerOptions: {
                autoplay: true,
                controls: true,
                language: "en",
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [
                    {
                        type: "video/mp4",
                        src: this.files[0],
                    },
                ]
            },
            playerPercent: 0,
        }
    },
    computed: {
        videoPlayer() {
            return this.$refs.statusVideoPlayer;
        },
    },
    methods: {
        play() {
            this.videoPlayer.player.play();
        },
        pause() {
            this.videoPlayer.player.pause();
        },
        onPlayerEnded(player) {
            this.$emit("slide-ended");
        },
        playerTimeupdate(player) {
            let playerPercent = Math.round((player.currentTime() * 100) / player.duration());
            this.playerPercent = playerPercent;
        },
        async remove() {
            this.$emit('remove');
        }
    }
}
</script>
<style lang="scss" scoped>
    .status-preview {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1051;
        background-color: rgba(0,0,0,.85);
        display: flex;
        justify-content: center;
        align-items: center;
        .status-content {
            width: 360px;
            height: calc(100vh - 100px);
            max-height: 700px;
            position: relative;
            border: solid 1px #FFF;
            border-radius: 12px;
            @media (max-width: 600px) {
                width: 100%;
                height: 100vh;
            }
            .btn-close {
                position: absolute;
                top: 5px;
                right: -40px;
                z-index: 2;
            }
        }

        .video-player-box::v-deep {
            .video-js {
                width: 100%;
                height: calc(100vh - 100px);
                max-height: 698px;
                @media (min-width: 600px) {
                    border-radius: 10px;
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
        .status-detail {
            position: relative;
        }

        .status-header {
            position: absolute;
            top: 0;
            width: 100%;
            padding: 12px 15px;
            background-color: rgba(0, 0, 0, 0.45);
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            @media (max-width: 600px) {
                display: none;
            }
            .tagged-users {
                color: #00A1E6;
            }
        }
        .status-footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 6px 15px;
            min-height: 45px;
            background-color: rgba(0, 0, 0, 0.45);
            @media (min-width: 600px) {
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
            }
            .title {
                color: #fff;
                font-size: 13px;
                line-height: 1.2;
            }
        }
    }
</style>