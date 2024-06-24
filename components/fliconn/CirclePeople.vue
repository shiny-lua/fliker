<template>
    <div class="circle-people fp-card" :class="{'d-none' : users.length === 0}">
        <div class="fp-card-header">
            <p class="fp-card-title">People in your circle</p>
        </div>
        <div class="fp-card-body pt-3">
            <fp-slider :slide-width="176" :slide-count="users.length" :item-padding="5">
                <div v-for="(item, index) in users" :key="index" class="circle-user" @click="$emit('open-profile', item)">
                    <div class="circle-user-wrapper fp-border-color-1">
                        <div class="circle-user-cover-image">
                            <img v-if="item.cover_image" :src="item.cover_image_url" class="cover-image" alt="" />
                            <img v-else src="@/assets/images/fp-default-bg.webp" class="cover-image" alt="" />
                        </div>
                        <div class="circle-user-photo-image" :style="{backgroundImage: `url(${profilePhotoOutlineImage})`}">
                            <img :src="item.photo_url" width="100%" height="100%" />
                        </div>
                        <div class="circle-user-info">
                            <h6 class="mb-0 name">{{item.name}}</h6>
                            <p class="mb-0 followers fp-text-color-main">{{$nFormatter(item.followers.length)}} Followers</p>
                            <a href="javascript:;" class="btn fp-btn-gradient btn-block btn-circle-follow" @click.stop="$emit('follow', item)"><fa icon="plus" /> Follow</a>
                        </div>
                    </div>
                </div>
            </fp-slider>
            <div class="text-center mt-2">
                <router-link v-if="users.length === 8" :to="{name: 'fliconn.users'}" class="text-success">See All</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import FpSlider from "~/components/ui/FpSlider.vue";
import ProfilePhotoOutlineImage from '~/assets/images/outline_profile_photo.png'
export default {
    name: 'CirclePeople',
    props: ['users'],
    components: {
        FpSlider,
    },
    computed: {
        profilePhotoOutlineImage() {
            return ProfilePhotoOutlineImage;
        },
    }
}
</script>
<style lang="scss" scoped>
    .circle-people {
        border-radius: 15px;
    }
    .circle-user {
        width: 186px !important;
        min-width: 140px;
        padding: 0 5px;
        text-align: center;
        cursor: pointer;
        .circle-user-wrapper {
            border-style: solid;
            border-width: 1px;
            border-radius: 12px;
            padding: 10px;
        }
        .circle-user-cover-image {
            border-radius: 6px;
            width: 100%;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            .cover-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 6px;
            }
        }
        .circle-user-photo-image {
            position: relative;
            width: 56px;
            height: 56px;
            margin: auto;
            margin-top: -30px;
            background-size: 28px 56px;
            background-repeat: no-repeat;
            padding: 3px;
            img {
                border-radius: 100%;
                object-fit: cover;
            }
        }
        .circle-user-info {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-size: cover;
            margin-top: 12px;
            .btn-circle-follow {
                font-size: 14px;
                line-height: 18px;
                margin-top: 12px;
            }
            .name {
                font-size: 14.4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }
            .followers {
                font-size: 13px;
            }
        }
    }
</style>