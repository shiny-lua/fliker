<template>
    <div class="topic-user-card fp-card p-0">
        <div v-if="user && user.cover_image_url" class="cover-image-wrapper">
            <img v-if="user.cover_image" class="cover-image" :src="user.cover_image_url" />
            <img v-else class="cover-image" src="@/assets/images/fp-default-bg.webp" alt="" />
        </div>
        <div v-if="user" class="user-info">
            <img :src="user.photo_url" alt="" />
            <p class="mb-0">
                <span class="info-count">{{user.topic_count}}</span>
                <span class="info-type">Tags</span>
            </p>
            <p class="mb-0">
                <span class="info-count">{{user.post_count}}</span>
                <span class="info-type">Posts</span>
            </p>
        </div>
        <div v-if="user" class="mt-3 text-center mb-3">
            <h6 class="mb-1 username">{{user.name}}</h6>
            <p v-if="location" class="location">
                <fp-icon name="location" class="fp-fs-16" />
                {{location.display_address}}
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props: ['user_id'],
    data() {
        return {
            user: null,
            location: null,
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    watch: {
        user_id: function (newVal) {
            this.getDetail();
        }
    },
    mounted() {
        this.getDetail();
    },
    methods: {
        async getDetail() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/get_user_detail`, {id: this.user_id})
            if (response.data.status == 'Success') {
                this.user = response.data.data;
            }
            const { data } = await this.axios.post(`/user/get_detail`, {id: this.user_id})
            this.location = data.data.location
        },
    },
}
</script>
<style lang="scss" scoped>
    .topic-user-card {
        border-radius: 12px;
        overflow: hidden;
    }
    .cover-image-wrapper {
        position: relative;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px 10px 0 0;
        background-color: #F0F3F9;
        img.cover-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
            border-radius: 10px 10px 0 0;
        }
        .buttons {
            position: absolute;
            top: 6px;
            right: 9px;
            .btn {
                font-size: 15px;
                margin-bottom: 0;
                background-color: #fff;
                border-radius: 6px;
                padding: 2px 4px;
            }
            .dropdown-toggle {
                &::after {
                    display: none;
                }
            }
            .dropdown-menu {
                padding: 2px 0;
                min-width: 90px;
                .dropdown-item {
                    font-size: 13.5px;
                }
            }
        }
    }
    .user-info {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        margin-top: 8px;
        img {
            width: 90px;
            height: 90px;
            border-radius: 10px;
            border: solid 2px #FFF;
            object-fit: cover;
            margin-top: -48px;
            z-index: 1;
        }
        p {
            margin-bottom: 0;
            text-align: center;
            width: 50px;
            .info-count {
                display: block;
                font-size: 16px;
                line-height: 1;
            }
            .info-type {
                font-size: 14px;
                font-weight: 400;
                color: #64748B;
            }
        }
    }
    .location {
        color: #64748B;
        margin-bottom: 0;
        font-size: 13.6px;
        font-weight: 400;
    }
    [data-theme=dark] {
        .user-info {
            img {
                border: solid 2px #00162D;
            }
        }
        .cover-image-wrapper {
            background: rgba(255, 34, 161, 0.078);
        }
    }
</style>