<template>
    <form class="comment-form" @submit.prevent="saveComment()">
        <textarea rows="7"
                class="form-control"
                :maxlength="max_characters"
                required
                placeholder="Write comment here..."
                v-model="form.detail"
        ></textarea>
        <div class="actions text-muted">
            {{ form.detail.length }} / {{ max_characters }}
            <button type="submit" class="btn btn-success" :class="form.busy && 'btn-loading'" :disabled="form.busy"><fa icon="paper-plane" /></button>
        </div>
    </form>
</template>
<script>
import { mapGetters } from "vuex"
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
        ...mapGetters({
            auth_user: 'auth/user',
        })
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
            let url = this.editable ? `${process.env.timelineApiUrl}/fliconn/comment/update` : `${process.env.timelineApiUrl}/fliconn/comment`
            if (this.model === 'clips') {
                url = this.editable ? `${process.env.clipsApiUrl}/clips/comment/update` : `${process.env.clipsApiUrl}/clips/comment`
            }
            this.form.post(url).then(response => {
                if (response.data.status == 'Success') {
                    this.form.reset()
                    this.$emit('posted', response.data.data)
                }
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    .comment-form {
        position: relative;
        .actions {
            position: absolute;
            bottom: 6px;
            right: 6px;
        }
        textarea::placeholder {
            color: #c3c3c3;
        }
    }
</style>

