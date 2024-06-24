<template>
    <div class="text-status-preview">
        <div class="status-content">
            <a href="javascript:;" class="btn-close" @click.prevent="$emit('close')">
                <fp-icon name="close" class="fp-fs-24" />
            </a>
            <a href="javascript:;" class="btn-remove-slide" @click.prevent="remove()">
                <fp-icon name="trash" class="fp-fs-24 text-white" />
            </a>
            <div class="status-detail">
                <div v-if="slides.length === 1" class="one-image-progress">
                    <div class="progress-container">
                        <div class="progress">
                            <div class="progress-bar"></div>
                        </div>
                    </div>
                </div>
                <VueSlickCarousel
                    v-if="showSlide"
                    ref="textStatusSlick"
                    v-bind="slickSettings"
                    @beforeChange="beforeChange"
                    @afterChange="afterChange"
                >
                    <div v-for="(slide, index) in slides"
                         :key="index"
                         class="slide slide-text-status"
                         :style="{
                            background: slide.bgImage
                                ? `url('https://timeline.flickerpage.com/assets/images/${slide.bgImage}')`
                                : slide.color,
                            fontFamily: slide.font ? slide.font : 'unset',
                         }"
                    >
                        <p>{{ slide.text }}</p>
                    </div>
                    <template #customPaging>
                        <div class="custom-dot" :style="{width: `${dotWidth}px`}">
                            <div class="dot-slider"></div>
                        </div>
                    </template>
                </VueSlickCarousel>
            </div>
        </div>
    </div>
</template>
<script>
import VueSlickCarousel from "vue-slick-carousel"
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
export default {
    name: 'TextStatusPreview',
    props: {
        slides: { type: Array, required: true },
    },
    components: {
        VueSlickCarousel,
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
            showSlide: true,
            currentIndex: 0,
        }
    },
    computed: {
        dotWidth() {
                return 280 / this.slides.length - 10;
        },
    },
    mounted() {
        if(this.slides.length === 1) {
            let oneProgress = document.querySelector('.one-image-progress .progress .progress-bar')
            oneProgress.classList.add('active')
        } else {
            let firstDot = document.querySelector('.status-dot-class li:first-child .custom-dot .dot-slider')
            firstDot.classList.add('first-progress')
        }
    },
    methods: {
        next() {
            this.$refs.textStatusSlick.next();
        },
        prev() {
            this.$refs.textStatusSlick.prev();
        },
        play() {
            this.$refs.textStatusSlick.play()
        },
        pause() {
            this.$refs.textStatusSlick.pause()
        },
        beforeChange(index) {
            if (index === this.slides.length - 1) {
                this.$emit('slide-ended')
            }
        },
        afterChange(index) {
            this.currentIndex = index
        },
        select(index) {
            this.$refs.textStatusSlick.goTo(index)
        },
        async remove() {
            let nextIndex = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
            if (this.slides.length === 1) {
                this.showSlide = false;
                await this.$nextTick()
                this.$emit('close', 0);
            } else {
                this.select(nextIndex)
                this.$emit('remove', this.currentIndex);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .text-status-preview {
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
            height: calc(100vh - 40px);
            max-height: 640px;
            position: relative;
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
            .btn-remove-slide {
                position: absolute;
                top: 45px;
                right: -40px;
                color: #FFF;
                border: solid 1px #FFF;
                border-radius: 4px;
                font-size: 15px;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
            }
        }
        .one-image-progress {
            position: absolute;
            top: 20px;
            @media (max-width: 600px) {
                top: 85px;
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
                    background-color: #FFF !important;
                    width: 0;
                    &.active {
                        width: 100%;
                        transition: width 5s linear;
                    }
                }
            }
        }
        .slide-text-status {
            width: 100%;
            height: calc(100vh - 40px);
            max-height: 640px;
            object-fit: cover;
            border-radius: 12px;
            display: inline-flex !important;
            align-items: center;
            padding: 6px 12px;
            font-size: 24px;
            color: #FFF;
            position: relative;
            @media (max-width: 600px) {
                height: 100vh;
                border-radius: 0;
            }
        }
        .status-detail {
            position: relative;
            &::v-deep {
                .status-dot-class {
                    top: 30px;
                    height: 17px;
                    @media (max-width: 600px) {
                        top: 85px;
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
                            background-color: #FFF;
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
                                    background-color: #FFF !important;
                                    width: 100%;
                                    transition: width 5s linear;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>