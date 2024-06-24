<template>
    <div class="image-slider">
        <vue-slick-carousel v-bind="slickSettings">
            <div v-for="img in images" :key="img.id" class="image-wrapper">
                <img :src="img" width="100%" height="100%" />
            </div>
            <template #prevArrow>
                <fa icon="chevron-left" />
            </template>
            <template #nextArrow>
                <fa icon="chevron-right" />
            </template>
        </vue-slick-carousel>
    </div>
</template>
<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
export default {
    name: 'FpImageSlider',
    props: {
        images: { type: Array, required: true },
    },
    components: {
        VueSlickCarousel
    },
    data() {
        return {
            slickSettings: {
                arrows: true,
                dots: false,
                edgeFriction: 0.35,
                infinite: true,
                speed: 300,
                autoplay: true,
                autoplaySpeed: 5000,
                slidesToShow: 1,
                slidesToScroll: 1,
                swipe: true,
            },
        }
    }
}
</script>
<style lang="scss" scoped>
    .image-slider {
        width: 100%;
        height: 100%;
        .image-wrapper {
            img {
                object-fit: cover;
            }
        }
        &::v-deep {
            .slick-arrow {
                height: 18px;
                color: #FFF;
                opacity: 0;
                transition: opacity 0.1s linear;
                z-index: 1;
                &.slick-next {
                    right: 5px;
                }
                &.slick-prev {
                    left: 5px;
                }
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>