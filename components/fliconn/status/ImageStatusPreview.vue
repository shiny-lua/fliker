<template>
    <div class="status-preview">
        <div class="status-content">
            <a href="javascript:;" class="btn-close" @click.prevent="$emit('close')">
                <fp-icon name="dots-circle-h" />
            </a>
            <a href="javascript:;" class="btn-remove-slide" @click.prevent="remove()">
                <fp-icon name="trash" />
            </a>
            <div class="status-detail">
                <div v-if="images.length === 1" class="one-image-progress">
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
                    <div v-for="(img, index) in images"
                         :key="index"
                         class="slide slide-image-status"
                    >
                        <img :src="img" alt="">
                    </div>
                    <template #customPaging>
                        <div class="custom-dot" :style="{width: `${dotWidth}px`}">
                            <div class="dot-slider"></div>
                        </div>
                    </template>
                </VueSlickCarousel>
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
import VueSlickCarousel from "vue-slick-carousel"
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
export default {
    name: 'ImageStatusPreview',
    props: {
        images: { type: Array, required: true },
        tagged_users: { type: Array, default: [] },
        title: { type: String, default: '' },
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
                return 280 / this.images.length - 10;
        },
    },
    mounted() {
        if(this.images.length === 1) {
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
            if (index === this.images.length - 1) {
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
            let nextIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
            if (this.images.length === 1) {
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
            aspect-ratio: 9 / 16;
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
        .slide-image-status {
            aspect-ratio: 9 / 16;
            height: calc(100vh - 100px);
            max-height: 700px;
            object-fit: cover;
            border-radius: 12px;
            display: inline-flex !important;
            align-items: center;
            font-size: 24px;
            color: #FFF;
            position: relative;
            @media (max-width: 600px) {
                height: 100vh;
                border-radius: 0;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
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