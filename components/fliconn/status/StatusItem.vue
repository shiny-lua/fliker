<template>
    <div class="status" @click="$emit('open')">
        <VueSlickCarousel v-if="status.type === 'text'" v-bind="slickSettings">
            <div v-for="slide in status.text_slides"
                 :key="slide.id"
                 class="thumbnail thumbnail-text-status"
                 :style="{
                    background: slide.bgImage
                        ? `url('https://timeline.flickerpage.com/assets/images/${slide.bgImage}')`
                        : slide.color,
                    fontFamily: slide.font ? slide.font : 'unset',
                 }"
            >
                <p class="mb-0">{{ slide.text }}</p>
            </div>
        </VueSlickCarousel>
        <VueSlickCarousel v-else-if="status.type" v-bind="slickSettings">
            <div v-for="img in status.images" :key="img.id" class="thumbnail">
                <img :src="img.thumbnail_url" />
            </div>
        </VueSlickCarousel>
        <div class="status-user">
            <div class="status-user-image">
                <img :src="status.user.photo_url" alt="" />
            </div>
            <a v-if="removable" href="javascript:;" class="status-user-username">You</a>
            <router-link v-else :to="{ name: 'fliconn.profile', params: { username: status.user.username } }" class="status-user-username" target="_blank">
                {{ status.user.first_name }}
            </router-link>
        </div>
        <div class="gradient"></div>
        <a v-if="removable" href="javascript:;" class="btn-remove-image" @click.stop="remove()">
            <fp-icon name="trash" />
        </a>
    </div>
</template>
<script>
    import VueSlickCarousel from "vue-slick-carousel";
    import "vue-slick-carousel/dist/vue-slick-carousel.css";
    import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
    import Swal from "sweetalert2";
    export default {
        name: "status-item",
        props: {
            status: { type: Object, required: true },
            removable: { type: Boolean, default: false },
        },
        components: {
            VueSlickCarousel,
        },
        data() {
            return {
                slickSettings: {
                    arrows: false,
                    dots: false,
                    edgeFriction: 0.35,
                    infinite: true,
                    speed: 300,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    swipe: false,
                },
            };
        },
        methods: {
            remove() {
                Swal.fire({
                    title: "Do you want to delete your Timeline status?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    confirmButtonColor: '#FF0000',
                    iconColor: '#FF0000'
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios.delete(`${process.env.timelineApiUrl}/status/delete/${this.status.id}`).then((response) => {
                            this.$emit("deleted", this.status.id);
                        });
                    }
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .status {
        cursor: pointer;
        width: 135px !important;
        height: 240px;
        position: relative;
        border-radius: 10px;
        .thumbnail {
            width: 100%;
            height: 240px;
            overflow: hidden;
            border-radius: 10px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
            }
            video {
                width: calc(100% + 2px);
                height: calc(100% + 2px);
                object-fit: cover;
                border-radius: 10px;
            }
            &.thumbnail-text-status {
                display: inline-flex !important;
                align-items: center;
                font-size: 13px;
                padding: 4px 8px;
                color: #fff;
                height: 240px;
                background-size: 100% 100% !important;
                background-repeat: no-repeat !important;
                p {
                    max-height: 240px;
                    overflow: hidden;
                }
            }
        }
        .status-user {
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 2;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 8px 8px;
            .status-user-username {
                margin-left: 5px;
                color: #fff;
                font-size: 12px;
                line-height: 15.47px;
                max-width: calc(100% - 40px);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .status-user-image {
                img {
                    width: 35px;
                    height: 35px;
                    object-fit: cover;
                    border: 1.5px solid #fff;
                    border-radius: 100%;
                }
            }
        }
        .gradient {
            width: 100%;
            height: 50%;
            position: absolute;
            bottom: 0;
            z-index: 1;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 99.99%, rgba(255, 255, 255, 0) 100%);
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
            border-radius: 10px 10px 0 0;
        }
        &::v-deep {
            .slick-slide {
                height: 240px;
            }
        }
    }
</style>
