<template>
    <div ref="slideContainer"
         :class="{
            'slide-container': true,
            'hide-next': hideNextButton,
         }"
         :style="{
            marginLeft: `${-1 * itemPadding}px`,
            marginRight: `${-1 * itemPadding}px`,
         }"
    >
        <VueSlickCarousel v-bind="slickSettings" @afterChange="sliderChanged">
            <slot />
            <template #prevArrow>
                <div class="custom-arrow">
                    <a href="javascript:;" class="slick-arrow prev">
                        <fa icon="chevron-left" />
                    </a>
                </div>
            </template>
            <template #nextArrow>
                <div class="custom-arrow">
                    <a href="javascript:;" class="slick-arrow next">
                        <fa icon="chevron-right" />
                    </a>
                </div>
            </template>
        </VueSlickCarousel>
    </div>
</template>
<script>
    import VueSlickCarousel from "vue-slick-carousel"
    import 'vue-slick-carousel/dist/vue-slick-carousel.css'
    export default {
        name: 'FpSlider',
        props: {
            slideCount: { type: Number, default: 0 },
            slideWidth: { type: Number, default: 0 },
            itemPadding: { type: Number, default: 6 },
            settings: { type: Object, required: false },
        },
        components: {
            VueSlickCarousel,
        },
        data() {
            return {
                sliderSettings: {
                    dots: false,
                    infinite: false,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    swipeToSlide: false,
                    variableWidth: true,
                },
                currentSlideIndex: 0,
                slideContainerWidth: 0,
            }
        },
        computed: {
            slickSettings() {
                const propSettings = typeof this.settings === Object ? this.settings : {};
                return {...this.sliderSettings, ...this.settings};
            },
            hideNextButton() {
                if (this.slideContainerWidth === 0 || this.slideWidth === 0) return false;
                const remainingSlideCount = this.slideCount - this.currentSlideIndex;
                const remaingWidth = remainingSlideCount * (this.slideWidth + 2 * this.itemPadding);
                return remaingWidth - this.slideContainerWidth < 20;
            },
        },
        mounted() {
            this.getSlideContainerWidth();
        },
        methods: {
            getSlideContainerWidth() {
                if (this.$refs.slideContainer) {
                    this.slideContainerWidth = this.$refs.slideContainer.clientWidth;
                }
            },
            sliderChanged(index) {
                this.currentSlideIndex = index;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .slide-container {
        &::v-deep {
            .slick-arrow {
                &::before {
                    display: none;
                }
                img {
                    width: 30px;
                    height: 30px;
                }
            }
            .slick-prev {
                left: -5px;
                z-index: 1;
                &.slick-disabled {
                    display: none;
                }
            }
            .slick-next {
                right: -5px;
                z-index: 1;
            }
            .slick-arrow {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #212529;
                background-color: #FFF;
                border-radius: 100%;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                color: #FF22A1;
                svg {
                    font-size: 12px;
                }
            }
        }
        &.hide-next {
            &::v-deep {
                .slick-next {
                    display: none !important;
                }
            }
        }
        &.hide-prev {
            &::v-deep {
                .slick-prev {
                    display: none !important;
                }
            }
        }
    }
</style>