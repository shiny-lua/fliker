<template>
    <div class="pt-3 pt-md-4">
        <div class="container-posts justify-content-center mx-n2">
            <div v-if="post && post.post_as === 'display_name'" class="post-left-section d-none d-md-block px-2">
                <user-card :user_id="post.user_id" />
            </div>
            <div class="post-list px-2">
                <div class="page-header d-none text-center">
                    <router-link :to="{name: 'topic'}" class="link-topic-index">&lt;&lt; Back</router-link>
                    <div v-if="post" class="pagination">
                        <router-link class="page-item btn-prev" :to="{name: 'topic.detail', params: {slug: post.prev_slug}}">Prev</router-link>
                        <span class="pagination-icons mx-2"><fa icon="angle-double-left" />&nbsp;&nbsp;<fa icon="circle" style="font-size: 8px;" />&nbsp;&nbsp;<fa icon="angle-double-right" /></span>
                        <router-link class="page-item btn-next" :to="{name: 'topic.detail', params: {slug: post.next_slug}}">Next</router-link>
                    </div>
                </div>
                <div class="fp-card p-0">
                    <div v-if="post" class="post-detail">
                        <div v-if="post.image" class="post-image mb-3">
                            <img :src="post.image.src_url" alt="" width="100%" />
                        </div>
                        <div class="post-header px-3" :class="{'mt-3': !post.image}">
                            <div class="post-user d-flex align-items-start mb-3">
                                <img v-if="post.post_as === 'private'" src="~/assets/images/icons/anonymous.png" class="mr-2" width="40" height="40" alt="">
                                <div class="flex-grow-1 cursor-pointer">
                                    <p class="subject mb-0">
                                        {{post.subject.substring(0, 80)}}
                                    </p>
                                    <p class="fp-text-color-main diff_time mb-0"><span v-if="post.post_as === 'private'">Private &#x2022;</span>  {{post.diff_time}} </p>
                                </div>
                                <div class="dropdown ml-auto">
                                    <a class="dropdown-toggle" href="javascript:;"
                                        data-toggle="dropdown"
                                    ><span><fa icon="ellipsis-h" /></span></a>
                                    <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                        <a href="javascript:;" class="dropdown-item" @click="hide()">
                                            <fp-icon name="eye" class="fp-fs-18" />
                                            Hide this post</a>
                                        <a href="javascript:;" class="dropdown-item" @click="showReportModal()">
                                            <fp-icon name="flag" class="fp-fs-18" />
                                            Report</a>
                                        <a href="javascript:;" class="dropdown-item" @click="share()">
                                            <fp-icon name="share" class="fp-fs-18" />
                                            Share
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-2 px-3" v-if="post.detail">
                            <p class="detail">{{descriptionExpand ? post.detail : post.detail.substring(0, 250)}} <a href="javascript:;" style="font-weight: 600;" v-if="post.detail.length > 250" @click="descriptionExpand = !descriptionExpand">({{descriptionExpand ? 'less...' : 'more...'}})</a></p>
                        </div>
                    </div>
                    <div v-if="post" class="post-footer px-3 pb-3 mt-2">
                        <span class="btn-like" @click="like()" title="Like">
                            <fp-icon name="thumbs-up" class="fp-fs-22" />
                            {{ $nFormatter(post.likes) }}
                        </span>
                        <span class="btn-like ml-4 ml-md-5" @click="unlike()" title="Unlike">
                            <fp-icon name="thumbs-down" class="fp-fs-22" />
                            {{ $nFormatter(post.unlikes) }}
                        </span>
                        <span class="btn-reply ml-4 ml-md-5">
                            <fp-icon name="comment-dots-1" class="fp-fs-22" />
                            {{ $nFormatter(post.comments_count) }}
                        </span>
                        <a href="javascript:;" class="btn-share fp-text-color-main ml-auto" @click="share()" title="Share">
                            <fp-icon name="share" class="fp-fs-22" />
                        </a>
                    </div>
                </div>
                <div class="fp-card fp-sm-no-card mt-3 mb-5" :class="{'d-none': !auth_user && comments.length === 0}">
                    <comment-form v-if="auth_user && post"
                             model="post"
                             :post_id="post.id"
                             @commented="saveComment"
                    />
                    <div class="comments" style="margin-left: 50px;">
                        <comment-item v-for="(item, index) in comments"
                             :key="index"
                             :comment="item"
                             class="comment-item"
                        />
                        <div v-if="comments.length > 5" class="text-center">
                            <a href="javascript:;" @click.prevent="show_all_comments = !show_all_comments">{{show_all_comments ? 'less comments…' : 'more comments…'}}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="post && post.post_as === 'display_name' && post.topic"
                 class="post-right-section px-2"
                 :class="{
                    'd-none': similarPosts.length === 0
                 }"
            >
                <h6 class="mb-3">Similar Posts</h6>
                <post-item
                    :post="item"
                    type="mini"
                    page="page"
                    v-for="(item, index) in similarPosts"
                    :key="index"
                ></post-item>
            </div>
        </div>

        <!-- Report Modal -->
        <fp-modal :name="reportModalName"
             title="Found something wrong?"
        >
            <form action="" method="post" @submit.prevent="report">
                <div class="form-group">
                    <textarea rows="5" class="form-control" v-model="report_form.detail" placeholder="Describe details here"></textarea>
                </div>
                <div class="text-right">
                    <button type="submit" class="btn fp-btn-gradient">Submit</button>
                </div>
            </form>
        </fp-modal>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import PostItem from "~/components/topic/PostItem.vue"
import UserCard from "~/components/topic/UserCard.vue"
import CommentItem from "~/components/topic/CommentItem.vue"
import CommentForm from "~/components/topic/CommentForm.vue"
import FpModal from "~/components/ui/Modal.vue";
import Form from "vform"
import Swal from 'sweetalert2'
export default {
    name: 'TopicPostDetail',
    components: {
        CommentItem, UserCard, PostItem, CommentForm, FpModal,
    },
    data() {
        return {
            slug: '',
            post: null,
            similarPosts: [],
            show_all_comments: false,
            comments: [],
            comment_form: new Form({
                post_id: '',
                detail: ''
            }),
            report_form: new Form({
                post_id: '',
                detail: ''
            }),
            descriptionExpand: false,
        };
    },
    computed: {
        displayedComments() {
            return this.show_all_comments ? this.comments : this.comments.slice(0, 5);
        },
        detailUrl() {
            return `${process.env.serverUrl}${this.$route.path}`;
        },
        reportModalName() {
            return `report_modal_${Math.round(Math.random() * 100000)}`;
        },
        ...mapGetters({
            auth_user: 'auth/user',
        }),
    },
    watch: {
        slug: function (value) {
            if (value) {
                this.getPost();
            }
        }
    },
    mounted() {
        this.slug = this.$route.params.slug;
    },
    methods: {
        async getPost() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/get_detail`, {slug: this.$route.params.slug})
            this.post = response.data.data;
            const payload = {
                topic_id: this.post.topic_id,
                post_as: 'display_name',
            }
            const response_similar = await this.axios.post(`${process.env.topicsApiUrl}/topic/search`, payload);
            this.similarPosts = response_similar.data.data.data.filter(i => i.id !== this.post.id);
            await this.$nextTick()
            this.getComments()
        },
        async getComments() {
            const { data } = await this.axios.post(`${process.env.topicsApiUrl}/topic/get_comments`, {id: this.post.id})
            this.comments = data.data
        },
        saveComment() {
            this.post.comments_count++;
            this.getComments();
        },
        hide() {
            if (!this.auth_user) return this.$login(this.$route.path);
            Swal.fire({
                title: 'Are you sure?',
                text: 'Hidden posts and related content will be invisible from your homepage.',
                icon: "warning",
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    this.axios.post(`${process.env.topicsApiUrl}/topic/hide`, {id: this.post.id}).then(response =>{
                        if (response.data.status == 'Success') {
                            this.$emit('hide');
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        },
        async like() {
            if (!this.auth_user) return this.$login(this.$route.path);
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/like`, {id: this.post.id})
            if (response.data.status == 'Success') {
                if (this.post.is_liked) {
                    this.post.likes--
                } else {
                    this.post.likes++
                    if (this.post.is_unliked) {
                        this.post.unlikes--
                        this.post.is_unliked = false
                    }
                }
                this.post.is_liked = !this.post.is_liked
            }
        },
        async unlike() {
            if (!this.auth_user) return this.$login(this.$route.path);
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/unlike`, {id: this.post.id})
            if (response.data.status == 'Success') {
                if (this.post.is_unliked) {
                    this.post.unlikes--
                } else {
                    this.post.unlikes++
                    if (this.post.is_liked) {
                        this.post.likes--
                        this.post.is_liked = false
                    }
                }
                this.post.is_unliked = !this.post.is_unliked
            }
        },
        showReportModal() {
            if (!this.auth_user) return this.$login(this.$route.path);
            this.$modal.show(this.reportModalName);
        },
        report() {
            this.report_form.post_id = this.post.id
            this.report_form.post(`${process.env.topicsApiUrl}/topic/report`).then(response => {
                if (response.data.status == 'Success') {
                    this.$modal.hide(this.reportModalName);
                }
            });
        },
        share() {
            const payload = {
                model: 'topics',
                id: this.post.id,
                url: this.detailUrl,
            }
            this.$share(payload);
        },
    }
}
</script>
<style lang="scss" scoped>
    .link-topic-index {
        font-weight: 600;
        position: absolute;
        left: 0;
        z-index: 1;
        @media (min-width: 600px) {
            display: none;
        }
    }
    .page-header {
        margin-top: 5px;
        position: relative;
        .breadcrumb {
            z-index: 1;
            .breadcrumb-item {
                text-decoration: underline;
                display: inline-block;
            }
        }
        .pagination {
            // position: absolute;
            // width: calc(100% - 30px);
            justify-content: center;
            .page-item {
                color: #007bff;
                font-weight: 500;
            }
            .pagination-icons {
                display: flex;
                align-items: center;
                color: #6C757D;
            }
        }
    }
    .post-detail {
        display: flex;
        flex-direction: column;
        .post-topics {
            font-size: 12px;
        }
        .post-image {
            img {
                border-radius: 10px 10px 0 0;
                max-height: 400px;
                object-fit: cover;
            }
        }
        .detail {
            color: #64748B;
            font-size: 14.4px;
            margin-bottom: 8px;
            white-space: pre-line;
        }
        .post-header {
            .post-user {
                display: flex;
                justify-content: space-between;
                .dropdown-toggle {
                    color: #64748B;
                    &::after {
                        display: none;
                    }
                }
            }
            .subject {
                cursor: pointer;
                max-width: calc(100% - 65px);
                font-size: 16px;
                font-weight: 500;
            }
        }
        .diff_time {
            font-size: 14.4px;
        }
    }
    .user-posts {
        &::v-deep {
            .card-mini {
                border: none;
                border-bottom: 1px solid #e8eced;
                border-radius: 0;
                .card-body {
                    padding: .5rem;
                }
            }
        }
        .user-post-item {
            &:last-child::v-deep {
                .card-mini {
                    border-bottom: none;
                }
            }
        }
    }
    .post-footer {
        display: flex;
        .btn-like, .btn-reply {
            color: #64748B;
            font-size: 14.4px;
            font-weight: 400;
            cursor: pointer;
        }
    }

    .post-left-section {
        width: 300px;
        min-width: 300px;
    }
    .post-list {
        max-width: 880px;
        flex-grow: 1;
    }
</style>