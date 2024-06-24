<template>
    <div class="card-comment" :class="comment.comment_id && 'sub-comment'">
        <div class="card-post mb-2">
            <div class="post-header">
                <div class="post-user">
                    <img :src="comment.user_photo" width="40" height="40" alt="" />
                    <div class="ml-2">
                        <p class="mb-0 username">{{ comment.user_first_name }}</p>
                        <p class="mb-0 fp-text-color-main diff_time">
                            {{ comment.diff_time }}
                        </p>
                    </div>
                    <div v-if="editable" class="dropdown dropdown-context-menu ml-auto">
                        <a class="dropdown-toggle no-caret" href="javascript:;" data-toggle="dropdown">
                            <fa icon="ellipsis-h" />
                        </a>
                        <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                            <template v-if="isMyComment">
                                <li class="dropdown-item" @click="openEditModal()">
                                    <fp-icon name="edit" />
                                    <div>
                                        <p>Edit</p>
                                        <p>Update review</p>
                                    </div>
                                </li>
                                <li class="dropdown-item" @click="remove()">
                                    <fp-icon name="trash" />
                                    <div>
                                        <p>Delete</p>
                                        <p>Delete review</p>
                                    </div>
                                </li>
                            </template>
                            <template v-else>
                                <li v-if="!comment.is_reported" class="dropdown-item" @click="report()">
                                    <fp-icon name="flag" />
                                    <div>
                                        <p>Report</p>
                                        <p>Flag review</p>
                                    </div>
                                </li>
                                <li v-if="comment.user_followable" class="dropdown-item" @click="follow()">
                                    <fp-icon name="user-check" />
                                    <div>
                                        <p>Follow {{ comment.user_first_name }}</p>
                                        <p>Follow this user</p>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
            <p class="detail comment-detail fp-text-color-main">
                {{ expanded ? comment.detail : comment.detail.slice(0, 300) }}
                <a v-if="!in_timeline && comment.detail.length > 300" href="javascript:;" class="fp-text-active" @click="expanded = !expanded">{{ expanded ? 'less..' : 'more..'}}</a>
            </p>
            <div v-if="editable" class="comment-footer">
                <span class="comment-likes" :class="comment.is_liked && 'liked'" @click="like()">
                    <fa :icon="comment.is_liked ? 'heart' : ['far', 'heart']" />
                    <span class="count fp-text-color-main">({{ $nFormatter(comment.likes_count) }})</span>
                </span>
                <span v-if="is_main" class="count cursor-pointer ml-3" @click.prevent="showCommentForm()">
                    Reply <span class="comments-count">({{ comment.comments_count }})</span>
                </span>
                <a href="javascript:;" class="ml-3">
                    <fp-icon name="gif" class="fp-fs-16" />
                </a>
                &nbsp;
            </div>
            <comment-form v-if="is_main && show_comment_form"
                    :comment_id="comment.id"
                    model="comment"
                    :editable="editable_comment"
                    @posted="postedComment"
                    class="mt-3 mb-4"
                    style="margin-left: 50px;"
            ></comment-form>
        </div>
        <div v-if="is_main" class="sub-comments">
            <fliconn-comment-card v-for="(item, index) in comments"
                     :key="index"
                     :comment="item"
                     @deleted="comments.splice(index, 1)"
                     @edit="editComment"
                     :is_main="false"
                     :model="model"
            />
            <div v-if="comment_total > 2 && comment_total > comment_per_page * (comment_page - 1)">
                <a href="javascript:;" class="btn-read-more" @click="getComments()">Read more...</a>
            </div>
        </div>
        <fp-modal :name="`comment_edit_modal_${comment.id}`"
            title="Edit Comment"
        >
            <form @submit.prevent="saveComment">
                <div class="form-group">
                    <textarea rows="5" class="form-control" v-model="edit_form.detail" required placeholder="Comment.."></textarea>
                </div>
                <div class="mt-2 text-center">
                    <button type="submit" class="btn btn-success px-4">Save</button>
                </div>
            </form>
        </fp-modal>
    </div>
</template>
<script>
    import CommentForm from "./CommentForm.vue";
    import FpModal from "~/components/ui/Modal.vue";
    import Swal from "sweetalert2";
    import emojis from "../ui/emoji";
    import Form from "vform";
    import eventBus from '~/plugins/event-bus';
    export default {
        name: "FliconnCommentCard",
        props: {
            comment: { type: Object, required: true },
            is_main: { type: Boolean, default: true },
            model: { type: String, default: "" },
            editable: { type: Boolean, default: true },
            in_timeline: { type: Boolean, default: false },
        },
        components: {
            CommentForm,
            FpModal,
        },
        data() {
            return {
                show_comment_form: false,
                editable_comment: null,
                emojis: emojis,
                reacts: [],
                comments: [],
                comment_per_page: 3,
                comment_page: 1,
                comment_total: 0,
                edit_form: new Form({
                    id: this.comment.id,
                    detail: this.comment.detail,
                }),
                expanded: false,
            };
        },
        computed: {
            isMyComment() {
                return this.auth_user && this.auth_user.id === this.comment.user_id;
            },
            reportUrl() {
                if (this.model === 'timeline' || this.model === 'status' || !this.model) {
                    return `${process.env.timelineApiUrl}/fliconn/report`;
                } else if (this.model === 'clips') {
                    return `${process.env.clipsApiUrl}/clips/report`;
                }
            },
            deleteUrl() {
                if (this.model === 'timeline' || this.model === 'status' || !this.model) {
                    return `${process.env.timelineApiUrl}/fliconn/comment/${this.comment.id}`;
                } else if (this.model === 'clips') {
                    return `${process.env.clipsApiUrl}/clips/comment/${this.comment.id}`;
                }
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        created() {
            eventBus.$on('reported', (payload) => {
                this.reported(payload);
            });
        },
        beforeDestroy() {
            eventBus.$off('reported', (payload) => {
                this.reported(payload);
            });
        },
        methods: {
            login(redirect = "") {
                if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
                if (this.$route.name !== "login") this.$router.push({ name: "login" });
            },
            showCommentForm() {
                if (!this.auth_user) {
                    this.login(this.$route.path);
                    return false;
                }
                this.show_comment_form = !this.show_comment_form;
                if (this.show_comment_form) {
                    this.getComments();
                } else {
                    this.comments = [];
                    this.comment_total = 0;
                    this.comment_page = 1;
                }
            },
            async getComments() {
                let params = {
                    id: this.comment.id,
                    model: "comment",
                    per_page: this.comment_per_page,
                    page: this.comment_page,
                };
                let url = this.model === "clips" ? `${process.env.clipsApiUrl}/clips/get_comments` : `${process.env.timelineApiUrl}/fliconn/get_comments`;
                const response = await this.axios.post(url, params);
                let result = response.data.data;
                this.comments.push(...result.data);
                this.comment_page++;
                this.comment_total = result.total;
            },
            like() {
                if (!this.auth_user) {
                    this.login(this.$route.path);
                    return false;
                }
                let url = this.model === "clips" ? `${process.env.clipsApiUrl}/clips/like` : `${process.env.timelineApiUrl}/fliconn/like`;
                this.axios
                    .post(url, { id: this.comment.id, model: "comment" })
                    .then((response) => {
                        if (response.data.status == "Success") {
                            if (this.comment.is_liked) {
                                this.comment.likes_count--;
                            } else {
                                this.comment.likes_count++;
                            }
                            this.comment.is_liked = !this.comment.is_liked;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            postedComment(data) {
                this.comments.unshift(data);
                this.comment.comments_count++;
            },
            remove() {
                Swal.fire({
                    title: "Do you really want to remove this comment?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    confirmButtonColor: '#DC3545',
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios.delete(this.deleteUrl)
                            .then((response) => {
                                if (response.data.status == "Success") {
                                    this.$emit("deleted");
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
            },
            editComment(item) {
                this.show_comment_form = true;
                this.editable_comment = item;
            },
            async selectEmoji(emoji) {
                let params = {
                    id: this.comment.id,
                    emoji: emoji.emoji,
                    alias: emoji.alias,
                    model: "comment",
                };
                let url = this.model === "clips" ? `${process.env.clipsApiUrl}/clips/react` : `${process.env.timelineApiUrl}/fliconn/react`;
                await this.axios.post(url, params);
                this.comment.last_emoji = emoji.emoji;
                if (this.comment.is_reacted == false) {
                    this.comment.is_reacted = true;
                    this.comment.reacts_count++;
                }
                this.getReacts();
                this.comment.my_comment_emoji = emoji.emoji;
            },
            async getReacts() {
                let url = this.model === "clips" ? `${process.env.clipsApiUrl}/clips/get_reacts` : `${process.env.timelineApiUrl}/fliconn/get_reacts`;
                const response = await this.axios.post(url, {
                    id: this.comment.id,
                    model: "comment",
                });
                this.reacts = response.data.data;
            },
            clickEmojiDropdown(e) {
                e.stopPropagation();
            },
            goToProfile(user) {
                this.$router.push({
                    name: "fliconn.profile",
                    params: { username: user.username },
                });
            },
            openEditModal() {
                this.edit_form.detail = this.comment.detail;
                this.$modal.show(`comment_edit_modal_${this.comment.id}`);
            },
            async saveComment() {
                let url = `${process.env.timelineApiUrl}/fliconn/comment/update`;
                const response = await this.edit_form.post(url);
                if (response.data.status == "Success") {
                    this.edit_form.reset();
                    this.comment.detail = response.data.data.detail;
                    this.$modal.hide(`comment_edit_modal_${this.comment.id}`);
                }
            },
            async follow() {
                const data = await this.$store.dispatch("requestFollow", this.comment.user_id);
                if (data.status === "Success") {
                    this.$toast.success(data.message);
                    let notiFb = this.$fire.database.ref("notifications/" + this.comment.user_id).push();
                    notiFb.set({ notifier_id: this.auth_user.id, type: "follow_request" });
                }
            },
            report() {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                if (this.comment.is_reported) {
                    return this.$toast.error("This comment has already been reported");
                }
                const payload = {
                    url: this.reportUrl,
                    params: {
                        id: this.comment.id,
                        model: 'comment',
                    },
                }
                this.$report(payload);
            },
            reported(payload) {
                if (payload.model === 'comment' && payload.id === this.comment.id) {
                    this.comment.is_reported = true;
                    if (this.comment.enable_notification) {
                        let notiFb = this.$fire.database.ref("notifications/" + this.comment.user_id).push();
                        notiFb.set({
                            notifier_id: this.auth_user.id,
                            type: "report_comment",
                        });
                    }
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
    .card-comment {
        &:not(:last-child) {
            margin-bottom: 20px;
        }
        .username {
            font-size: 13.6px;
            line-height: 16.76px;
        }
        .diff_time {
            font-size: 13px;
        }
        .post-header {
            .btn-hide-report {
                color: #bfbfbf;
            }
        }
        &.sub-comment {
            .post-user img {
                width: 35px;
                height: 35px;
            }
            .detail, .comment-footer,
            &::v-deep .comment-form {
                padding-left: 46px;
            }

        }
    }
    .btn-read-more {
        padding-left: 50px;
    }

    .comment-detail {
        font-size: 13px;
    }

    .comment_reacted_emojis {
        flex-grow: 1;
        .circle_emoji {
            margin-left: -5px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: white;
            border: solid 2px red;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
                font-size: 19px;
            }
        }
    }
    .comment-footer {
        display: flex;
        align-items: center;
        .count {
            font-size: 13.6px;
        }
        padding-left: 50px;
        .comment-likes {
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            .count {
                margin-left: 8px;
            }
            &.liked svg {
                color: #F00;
            }
        }
        .comments-count {
            color: #007BFF;;
        }
    }
    .dropdown-context-menu {
        .dropdown-toggle {
            color: #999999;
        }
    }
</style>
