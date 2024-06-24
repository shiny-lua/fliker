<template>
    <form class="comment-form" @submit.prevent="save()">
        <img v-if="auth_user" :src="auth_user.photo_url" alt="" />
        <img v-else src="~assets/images/avatar.png" alt="" />
        <textarea class="form-control mx-2"
             name="detail"
             rows="1"
             v-model="form.detail"
             placeholder="Write a comment here..."
             required
             maxlength="256"
        ></textarea>
        <button type="submit" class="btn fp-btn-primary" :class="form.busy && 'btn-loading'">
            <fp-icon name="share" class="fp-fs-20" />
        </button>
    </form>
</template>
<script>
import Form from "vform";
export default {
    name: 'CommentForm',
    props: {
        model: { type: String, required: true },
        post_id: { type: [String, Number], default: '' },
        comment_id: { type: [String, Number], default: '' },
    },
    data() {
        return {
            form: new Form({
                model: this.model,
                post_id: this.post_id,
                comment_id: this.comment_id,
                detail: '',
            }),
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        save() {
            if (!this.auth_user) {
                this.$store.dispatch("auth/setRedirectRoute", this.$route.path);
                return this.$router.push({ name: "login" });
            }

            this.form.post(`${process.env.topicsApiUrl}/topic/save_comment`).then(response => {
                if (response.data.status == 'Success') {
                    this.form.reset()
                    this.$emit('commented', response.data.data);
                }
            });
        }
    }

}
</script>
<style lang="scss" scoped>
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