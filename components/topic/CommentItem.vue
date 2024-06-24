<template>
    <div>
        <div class="card-post fp-border-color-1">
            <div class="post-header">
                <div class="post-user">
                    <img :src="comment.user.photo_url" style="width: 34px; height: 34px;" alt="" />
                    <p class="mb-0 username ml-2">{{ comment.user.name }}</p>
                    <p class="mb-0 ml-2 diff_time">{{ comment.diff_time }}</p>
                </div>
            </div>
            <p class="detail" style="white-space: pre-line;">{{ comment.detail }}</p>
            <div class="comment-footer fp-text-color-main">
                <a href="javascript:;" class="btn-comment-action" :class="comment.is_liked && 'active'" @click.prevent="like">
                    <fp-icon name="thumbs-up" class="fp-fs-18" />
                    {{ comment.likes_count }}
                </a>
                <a href="javascript:;" class="btn-comment-action ml-5" :class="comment.is_unliked && 'active'" @click.prevent="unlike">
                    <fp-icon name="thumbs-down" class="fp-fs-18" />
                    {{ comment.unlikes_count }}
                </a>
                <a href="javascript:;" v-if="!comment.comment_id" class="btn-comment-action ml-5" @click.prevent="show_comment_form = !show_comment_form">
                    <fp-icon name="comment-dots-1" class="fp-fs-18" />
                    {{ comment.comments.length }}
                </a>
            </div>
            <comment-form v-if="show_comment_form"
                 model="comment"
                 :comment_id="comment.id"
                 @commented="saveComment"
                 class="mt-3"
            />
        </div>
        <div v-if="comment.comments && comment.comments.length" class="sub-comments mt-2">
            <topic-comment-item v-for="(item, index) in comment.comments" :key="index" :comment="item"> </topic-comment-item>
        </div>
    </div>
</template>
<script>
    import CommentForm from "./CommentForm.vue"
    export default {
        name: "TopicCommentItem",
        props: {
            comment: { type: Object, required: true },
        },
        components: {
            CommentForm,
        },
        data() {
            return {
                show_comment_form: false,
            };
        },
        computed: {
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        methods: {
            login(redirect = "") {
                if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
                if (this.$route.name !== "login") this.$router.push({ name: "login" });
            },
            async like() {
                if (!this.auth_user) {
                    this.login(this.$route.path);
                    return false;
                }
                const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/like_comment`, { id: this.comment.id });
                if (response.data.status === "Success") {
                    if (this.comment.is_liked) {
                        this.comment.likes_count--;
                    } else {
                        this.comment.likes_count++;
                        if (this.comment.is_unliked) {
                            this.comment.unlikes_count--;
                            this.comment.is_unliked = false;
                        }
                    }
                    this.comment.is_liked = !this.comment.is_liked;
                }
            },
            async unlike() {
                if (!this.auth_user) {
                    this.login(this.$route.path);
                    return false;
                }
                const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/unlike_comment`, { id: this.comment.id });
                if (response.data.status === "Success") {
                    if (this.comment.is_unliked) {
                        this.comment.unlikes_count--;
                    } else {
                        this.comment.unlikes_count++;
                        if (this.comment.is_liked) {
                            this.comment.likes_count--;
                            this.comment.is_liked = false;
                        }
                    }
                    this.comment.is_unliked = !this.comment.is_unliked;
                }
            },
            saveComment(data) {
                this.comment.comments.unshift(data);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .card-post {
        padding: 16px 0;
        border-bottom-style: solid;
        border-bottom-width: 1px;
    }
    .btn-comment-action {
        text-decoration: none;
        &.active {
            color: #FF22A1;
        }
    }

    .post-user {
        .diff_time {
            color: #64748B;
        }
    }

    .detail {
        color: #64748B;
        margin-left: 42px;
        font-weight: 400;
    }

    .comment-footer {
        margin-left: 42px;
    }

    .sub-comments {
        margin-left: 42px;
    }
    .comment-form {
        display: flex;
        align-items: center;
        img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }
    }
</style>
