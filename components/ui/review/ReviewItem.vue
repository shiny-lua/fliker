<template>
    <div class="profile-review-item fp-border-color-1">
        <div class="d-flex align-items-center">
            <img :src="review.user.photo_url" width="40" height="40" class="user-img" alt="">
            <div class="user-info">
                <p class="user-name mb-0">{{ review.user.name }}</p>
                <p class="diff_time fp-text-color-main mb-0">{{ review.diff_time }}</p>
            </div>
            <div class="ml-auto">
                <star-rating :rating="review.rating"
                        :star-size="15"
                        read-only
                        :show-rating="false"
                />
                <div v-if="auth_user && auth_user.id === review.user_id" class="actions text-right px-1 mt-1">
                    <a href="javascript:;" class="btn-edit-review" @click.prevent="$emit('edit', review)">
                        <fp-icon name="edit" class="fp-fs-16" />
                    </a>
                </div>
            </div>
        </div>
        <div class="review-content">
            <p class="content">{{ expand ? review.content : review.content.slice(0, 100) + '...' }} <a v-if="review.content.length > 100 && !expand" href="javascript:;" @click.prevent="expand = true">Read more..</a></p>
        </div>
        <div class="reply-box">
            <div v-if="review.reply && !showReplyForm" class="reply fp-bg-body">
                <h6>
                    {{ replyLabel }}
                    <a v-if="auth_user && auth_user.id === profileUserId"
                         href="javascript:;"
                         class="btn-edit-reply ml-auto"
                         @click.prevent="editReply()"
                    >
                        <fp-icon name="edit" class="fp-fs-16" />
                    </a>
                </h6>
                <p class="mb-0 fp-text-color-main">
                    {{ expand_reply ? review.reply : review.reply.slice(0, 100) + '...' }} <a v-if="review.reply.length > 100 && !expand_reply" href="javascript:;" class="fp-text-color-primary" @click.prevent="expand_reply = true">Read more..</a>
                </p>
            </div>
            <div v-else-if="auth_user && auth_user.id === profileUserId" class="show-reply-form text-right mb-1">
                <a href="javascript:;" @click.prevent="showReplyForm = true">{{ replyLabel }}</a>
            </div>
            <form v-if="showReplyForm" class="reply-form" @submit.prevent="reply()">
                <div class="reply-content">
                    <img :src="profileImg" width="35" height="35" class="rounded-circle" alt="" />
                    <textarea rows="1" v-model="reply_form.detail" class="form-control" placeholder="Reply to this view..." required maxlength="1000"></textarea>
                    <button type="submit" class="btn fp-btn-gradient" :class="reply_form.busy && 'btn-loading'">
                        <fp-icon name="share" class="fp-fs-20" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    import StarRating from 'vue-star-rating';
    import Form from "vform";
    export default {
        name: 'ReviewItem',
        props: {
            model: { type: String, default: 'automotive_seller' },
            review: { type: Object, required: true },
            profileImg: { type: String, required: true },
            profileUserId: { type: Number, default: null },
        },
        components: {
            StarRating,
        },
        data() {
            return {
                expand: false,
                expand_reply: false,
                showReplyForm: false,
                reply_form: new Form({
                    id: this.review.id,
                    detail: '',
                }),
            }
        },
        computed: {
            auth_user() {
                return this.$store.getters['auth/user'];
            },
            replyLabel() {
                if (this.model === 'automotive_seller') return 'Reply from seller';
                if (this.model === 'merchant') return 'Reply from merchant';
            },
            replyUrl() {
                if (this.model === 'automotive_seller') return `${process.env.adsApiUrl}/automotive/review/reply`;
                if (this.model === 'merchant') return `${process.env.merchantApiUrl}/merchant/review/reply`;
            }
        },
        methods: {
            async reply() {
                const response = await this.reply_form.post(this.replyUrl);
                if (response.data.status === 'Success') {
                    this.review.reply = response.data.data.reply;
                    this.showReplyForm = false;
                }
            },
            editReply() {
                this.showReplyForm = true;
                this.reply_form.detail = this.review.reply
            }
        }
    }
</script>
<style lang="scss" scoped>
    .profile-review-item {
        padding: 12px;
        border-radius: 6px;
        border-style: solid;
        border-width: 1px;
        .user-img {
            border-radius: 100%;
            object-fit: cover;
        }
        .user-info {
            flex-grow: 1;
            max-width: calc(100% - 130px);
            margin-left: 10px;
            .user-name {
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .diff_time {
                font-size: 13px;
            }
        }
        .review-content {
            padding-left: 50px;
            .content {
                font-size: 13.6px;
                margin-top: 4px;
                margin-bottom: 0;
            }
        }
        .show-reply-form {
            font-size: 13px;
        }
        .reply-box {
            padding-left: 50px;
            .reply-content {
                display: flex;
                align-items: center;
                img {
                    border-radius: 100%;
                    object-fit: cover;
                    min-width: 35px;
                }
                textarea {
                    margin-left: 8px;
                    font-size: 14.4px;
                }
                .btn {
                    margin-left: 8px;
                    padding: 5px 10px;
                }
            }
        }
        .reply {
            padding: 8px 12px;
            border-radius: 8px;
            margin-top: 12px;
            h6 {
                font-size: 14.4px;
                margin-bottom: 4px;
                display: flex;
                align-items: center;
            }
            p {
                font-size: 13.6px;
            }
        }
    }

</style>