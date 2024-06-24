<template>
    <div class="comment-form">
        <img v-if="auth_user" :src="auth_user.photo_url" alt="" class="img-comment-user" />
        <img v-else src="~assets/images/avatar.png" class="img-comment-user" alt="" />
        <textarea rows="1"
                 class="form-control ml-2"
                 v-model="form.detail"
                 :maxlength="max_characters"
                 :placeholder="commentableText"
                 @focus="checkCommentable"
        ></textarea>
        <button type="button"
             class="btn"
             :class="form.busy && 'btn-loading'"
             @click="saveComment()"
        >
            <fp-icon name="share" class="fp-text-color-main fp-fs-22" />
        </button>
    </div>
</template>
<script>
import Form from "vform"
export default {
    name: 'FliconnCommentForm',
    props: ['commentable_id', 'model','comment_id', 'clip_id', 'editable'],
    data() {
        return {
            form: new Form({
                id: '',
                commentable_id: this.commentable_id,
                clip_id: this.clip_id,
                comment_id: this.comment_id,
                model: this.model,
                detail: '',
            }),
            max_characters: 500,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        commentableText() {
            if (!this.auth_user) return 'Login to write a comment...';
            return this.comment_id ? `Reply to comment...` : `Write comment...`;
        }
    },
    watch: {
        editable: function (val) {
            if (val) {
                this.form.id = val.id
                this.form.detail = val.detail
            } else {
                this.form.reset()
            }
        }
    },
    mounted() {
        if (this.editable) {
            this.form.id = this.editable.id
            this.form.detail = this.editable.detail
        }
    },
    methods: {
        saveComment() {
            if (this.form.detail === '') {
                return false;
            }
            if (this.charCount > this.max_characters) {
                this.$toast.error(`Enter maximum ${this.max_characters} characters or less`);
                return false;
            }
            let url = this.editable ? `${process.env.timelineApiUrl}/fliconn/comment/update` : `${process.env.timelineApiUrl}/fliconn/comment`
            if (this.model === 'clips') {
                url = this.editable ? `${process.env.clipsApiUrl}/clips/comment/update` : `${process.env.clipsApiUrl}/clips/comment`
            }
            this.form.post(url).then(response => {
                if (response.data.status == 'Success') {
                    this.form.reset()
                    this.$emit('posted', response.data.data);
                }
            });
        },
        checkCommentable() {
            if (!this.auth_user) return this.$login(this.$route.path);
        },
    }
}
</script>
<style lang="scss" scoped>
    .comment-form {
        display: flex;
        align-items: center;
        border-radius: 0 0 12px 12px;
        color: #BBB;
        position: relative;
        img.img-comment-user {
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 100%;
            object-fit: cover;
        }
        textarea {
            height: 40px;
            resize: none;
            font-size: 14px;
            line-height: 14.76px;
            padding: 12px 48px 12px 18px;
            overflow: hidden;
            border-radius: 10px;
        }
        button {
            position: absolute;
            top: 0;
            right: 0;
            height: 40px;
            border-radius: 10px;
            line-height: 1;
            &:focus {
                box-shadow: none;
            }
        }
    }
</style>