<template>
    <div class="add-post-link fp-card" :class="bgReverseSm && 'bg-reverse-sm'" @click="goToPage()">
        <div v-if="auth_user" class="auth-user text-left">
            <img :src="auth_user.photo_url" class="img-user" alt="" />
            &nbsp;&nbsp;
            {{ auth_user.name }}
        </div>
        <div class="d-flex align-items-center fp-input-placeholder" :class="bgReverseSm && 'bg-reverse-sm'">
            <p class="detail">{{ placeholder }}</p>
            <div class="options ml-auto">
                <fp-icon name="add-image" class="add-image" />
                <fp-icon name="add-video" class="ml-2 ml-md-4 add-video" />
                <fp-icon name="attachment" class="ml-2 ml-md-4 add-attachment" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AddPostLink',
    props: {
        placeholder: { type: String, default: 'Ahoy, share something..' },
        query: { type: Object, required: false },
        bgReverseSm: { type: Boolean, default: true },
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        goToPage() {
            this.$router.push({name: 'fliconn.create.timeline', query: this.query});
            this.$emit('moved');
        }
    }
}
</script>
<style lang="scss" scoped>
    .add-post-link {
        border-radius: 12px;
        margin-bottom: 20px;
        cursor: pointer;
        .auth-user {
            font-size: 14.4px;
            margin-bottom: 12px;
        }
        img.img-user {
            width: 40px;
            height: 40px;
            border-radius: 100%;
            object-fit: cover;
        }
        .fp-input-placeholder {
            border-radius: 12px;
            padding: 12px;
        }
        .detail {
            font-size: 13.6px;
            font-weight: 400;
            color: #737791;
            line-height: 16.76px;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }
        .options {
            white-space: nowrap;
            svg {
                font-size: 20px;
                @media (max-width: 600px) {
                    font-size: 18px;
                }
            }
            .add-image {
                color: #468FEA;
            }
            .add-video {
                color: #F17E3D;
            }
            .add-attachment {
                color: #FF7272;
            }
        }
    }
    [data-theme=dark] {
        .detail {
            color: #4C5A6E;
        }
    }
</style>
