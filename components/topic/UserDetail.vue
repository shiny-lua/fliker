<template>
    <div>
        <div v-if="user" class="topic-user bg-light">
            <img :src="auth_user.photo_url" alt="">
            <div class="user-detail">
                <h6 class="name">
                    {{auth_user.name}}
                    <router-link :to="{name: 'account.topics'}" class="badge badge-primary ml-auto">View</router-link>
                </h6>
                <p v-if="auth_user.location" class="location text-primary"><fa icon="map-marker-alt" /> {{ auth_user.location.city }}</p>
                <div class="user-topic-info p-1 rounded-lg">
                    <div>
                        <p class="text-muted mb-0">My Posts</p>
                        {{user.post_count}}
                    </div>
                    <div class="ml-3">
                        <p class="text-muted mb-0">My Topics</p>
                        {{user.topic_count}}
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <h5 class="mb-0">My Posts</h5>
            <div
                v-for="(item, index) in my_posts"
                :key="index"
                class="mb-3"
            >
                <post-item
                    :post="item"
                    type="mini"
                ></post-item>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import PostItem from './PostItem.vue'
export default {
    name: 'TopicUser',
    components: {
        PostItem,
    },
    data() {
        return {
            user: null,
            my_posts: [],
        }
    },
    computed: mapGetters({
        auth_user: 'auth/user'
    }),
    mounted() {
        this.getDetail()
        this.getMyPosts()
    },
    methods: {
        async getDetail() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/get_user_detail`, {id: this.auth_user.id})
            if (response.data.status == 'Success') {
                this.user = response.data.data;
                this.user.location = this.auth_user.location
            }
        },
        async getMyPosts() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/search`, {user_id: this.auth_user.id})
            this.my_posts = response.data.data.data
        }
    }
}
</script>
<style lang="scss" scoped>
    .topic-user {
        display: flex;
        align-items: center;
        border-radius: 12px;
        padding: 1rem;
        img {
            width: 90px;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;
        }
        .user-detail {
            flex-grow: 1;
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            height: 90px;
            .name {
                display: flex;
                align-items: center;
                margin-bottom: 3px;
            }
            .location {
                font-size: 13px;
                margin-bottom: 0;
            }
            .user-topic-info {
                display: flex;
                align-items: center;
                margin-top: auto;
                background: #FFF;
                font-size: 13px;
            }
        }
    }
</style>