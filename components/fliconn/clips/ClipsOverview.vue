<template>
    <div class="clips-overview" :class="showComments && 'show-comments'">
        <div class="clips-thumbnail-wrapper">
            <div v-for="(item, index) in clips"
                :key="index"
                class="clips-thumbnail"
                :class="index === 0 && 'active'"
            >
                <video
                    :src="item.path"
                    :poster="item.thumbnail_url"
                    @click="select(item)"
                ></video>
            </div>
        </div>
        <div class="clips-content" v-touch:swipe.left="selectNext" v-touch:swipe.right="selectPrev">
            <clips-detail
                v-if="showDetail"
                ref="clipContent"
                :clips="clips[0]"
                :show-comments="showComments"
                @close="$emit('close')"
                @prev="selectPrev"
                @next="selectNext"
                @show-comments="toggleShowComments"
            ></clips-detail>
            <a href="javascript:;" class="btn-close" @click.prevent="$emit('close')">
                <fp-icon name="close" class="fp-fs-24 fp-text-color-main" />
            </a>
        </div>
    </div>
</template>
<script>
import ClipsDetail from "./ClipsDetail.vue"
import VueSlickCarousel from "vue-slick-carousel"
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
    name: 'ClipsOverview',
    props: ['clips'],
    components: {
        VueSlickCarousel,
        ClipsDetail,
    },
    data() {
        return {
            slickSettings: {
                centerMode: true,
                dots: false,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                swipeToSlide: true,
                variableWidth: true,
                focusOnSelect: true,
            },
            showDetail: false,
            showComments: false,
            keyCode: null,
        }
    },
    watch: {
        keyCode(value) {
            if (value) {
                if (value === 38) this.selectPrev();
                if (value === 40) this.selectNext();
                this.keyCode = null;
            }
        },
        async clips() {
            this.showDetail = null;
            await this.$nextTick();
            this.showDetail = true
        }
    },
    mounted() {
        window.addEventListener('keyup', (e) => {
            this.keyCode = e.keyCode
        });
        this.showDetail = true
    },
    methods: {
        async select(item, mode = null) {
            this.$emit('select', {id: item.id, mode: mode})
        },
        selectNext() {
            let activeIndex = this.clips.findIndex(i => i.id === this.clips[0].id);
            if (activeIndex === this.clips.length - 1) {
                this.select(this.clips[0], 'next');
            } else {
                let nextItem = this.clips[activeIndex + 1];
                this.select(nextItem);
            }
        },
        selectPrev() {
            let activeIndex = this.clips.findIndex(i => i.id === this.clips[0].id);
            if (activeIndex === 0) {
                this.select(this.clips[0], 'prev')
            } else {
                let prevItem = this.clips[activeIndex - 1];
                this.select(prevItem);
            }
        },
        toggleShowComments(data) {
            this.showComments = data
        },
    }
}
</script>
<style lang="scss" scoped>
    .clips-overview {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1051;
        background-color: rgba(0, 0, 0, .85);
        display: flex;
        justify-content: center;
        align-items: center;
        &.show-comments {
            .clips-content {
                @media (min-width: 601px) {
                    margin-right: 250px;
                }
            }
        }
        .clips-thumbnail-wrapper {
            padding: 0 12px;
            white-space: nowrap;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            @media (min-width: 600px) {
                width: 125px;
                height: 80vh;
                max-height: 700px;
                margin-left: -125px;
            }
            @media (max-width: 600px) {
                background: rgba(0, 0, 0, 0.5);
                padding: 10px 12px;
                flex-direction: row;
                position: absolute;
                top: 0;
                z-index: 1;
                max-width: 100%;
            }
            .clips-thumbnail {
                display: block;
                cursor: pointer;
                width: 90px;
                min-width: 90px;
                height: 90px;
                min-height: 90px;
                margin-bottom: 20px;
                border-radius: 100%;
                border: solid 2px #007BFF;
                position: relative;
                @media (max-width: 600px) {
                    width: 65px;
                    min-width: 65px;
                    height: 65px;
                    min-height: 65px;
                    margin-right: 12px;
                    margin-bottom: 0;
                    &:last-child {
                        margin-right: 0;
                    }
                }
                video {
                    width: 100%;
                    height: 100%;
                    padding: 1px;
                    border-radius: 100%;
                    margin: auto;
                    object-fit: cover;
                }
                &.active {
                    animation: blinking-border 1s infinite;
                }
                @keyframes blinking-border {
                    50% {
                        border-color: #28A745;
                    }
                }
                img.img-user {
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    bottom: 8px;
                    left: 12px;
                    border: solid 2px #FFF;
                    border-radius: 100%;
                    object-fit: cover;
                    @media (max-width: 600px) {
                        width: 26px;
                        height: 26px;
                        bottom: 5px;
                        left: 8px;
                    }
                }
            }
        }
        .clips-content {
            position: relative;
            transition: all .1s ease-in;
            @media (max-width: 600px) {
                width: 100%;
                height: 100vh;
            }
        }
        .btn-close {
            position: absolute;
            top: 10px;
            right: -58px;
            z-index: 2;
            color: #FFF;
            padding: 0px;
            border-radius: 100%;
            font-size: 30px;
            outline: none;
            text-decoration: none;
            text-align: center;
            line-height: 1;
            @media (max-width: 600px) {
                right: 6px;
            }
        }
    }
</style>