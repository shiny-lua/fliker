<template>
    <div class="col-lg-12">
        <div class="d-flex align-items-center mb-3">
             <h5 class="page-title mb-0">Manage Facts/Questions</h5>
            <form class="form-inline ml-auto" @submit.prevent="tab === 'Tags' ? searchTopics() : searchPosts()">
                <div class="icon-prefix-input">
                    <fp-icon name="search" class="fp-fs-18" />
                    <input v-if="tab === 'Posts'" type="text" class="form-control" style="width: 200px;" v-model="filter.keyword" placeholder="Search..." />
                    <input v-if="tab === 'Tags'" type="text" class="form-control" style="width: 200px;" v-model="topics_filter.keyword" placeholder="Search..." />
                </div>
            </form>
        </div>
        <ul class="nav nav-topics nav-pills fp-bg-color-1">
            <li class="nav-item">
                <a class="nav-link" :class="tab === 'Posts' && 'active'" href="javascript:;" @click.prevent="tab = 'Posts'">Posts</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="tab === 'Tags' && 'active'" href="javascript:;" @click.prevent="tab = 'Tags'"># Tags</a>
            </li>
        </ul>

        <transition>
            <div v-if="tab === 'Tags'" class="table-responsive mt-2 fp-table">
                <table class="table table-bordered table-topics">
                    <thead>
                        <tr>
                            <th style="width: 360px;">Tag Name</th>
                            <th>Insights</th>
                            <th>Created on</th>
                            <th>Status</th>
                            <th style="min-width: 90px;width: 90px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="topics.length == 0"><td colspan="10" class="text-center text-muted">No tags found!</td></tr>
                        <tr v-if="topics.length > 0" v-for="(item, index) in topics" :key="index">
                            <td class="subject text-primary"><a href="javascript:;" @click.prevent="selectTopic(item)">{{item.name}}</a></td>
                            <td>
                                <div class="d-flex justify-content-around">
                                    <span class="like">
                                        <fp-icon name="thumbs-up" class="fp-fs-20" />
                                        {{item.likes}}
                                    </span>
                                    <span class="like ml-2">
                                        <fp-icon name="thumbs-down" class="fp-fs-20" />
                                        {{item.unlikes}}
                                    </span>
                                    <span class="like ml-2">
                                        <fp-icon name="comment-dots" class="fp-fs-20" />
                                        {{item.comments_count}}
                                    </span>
                                </div>
                            </td>
                            <td>{{$moment(item.created_at).format('MM/DD/YYYY')}}</td>
                            <td>
                                <span
                                    style="font-weight: 600;"
                                    :class="{
                                        'text-success': item.status,
                                        'text-danger': !item.status,
                                    }"
                                >
                                    {{item.status ? 'Active' : 'Offline'}}
                                </span>
                            </td>
                            <td>
                                <a href="javascript:;" class="btn-edit ml-1" v-tooltip="'Edit'" @click="editTopic(item)">
                                    <fp-icon name="edit" class="fp-fs-20" />
                                </a>
                                <a href="javascript:;" class="btn-remove ml-1" v-tooltip="'Delete'" @click="removeTopic(item, index)">
                                    <fp-icon name="trash" class="fp-fs-20" />
                                </a>
                                <a href="javascript:;" v-if="item.status === 'active' || item.status === 'inactive'" class="btn-approve ml-1" v-tooltip="'Change Status'" @click="changeTopicStatus(item)">
                                    <fp-icon v-if="item.status === 'active'" name="ban" class="fp-fs-18" />
                                    <fa v-else icon="check" />
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="tab === 'Posts'" class="mt-2 fp-table">
                <div class="table-responsive">
                    <h6 v-if="filter.topic_id" class="text-primary">
                        <a href="javascript:;" class="text-underline" @click.prevent="selectTopic({id: ''})">Tags</a>
                        &gt;
                        <a href="javascript:;" class="text-underline">{{topics.find(i => i.id === filter.topic_id).name}}</a>
                    </h6>
                    <table class="table table-bordered table-posts">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Insights</th>
                                <th>Posted on</th>
                                <th>Status</th>
                                <th style="min-width: 110px;width: 110px;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="posts.length == 0"><td colspan="10" class="text-center">No posts found</td></tr>
                            <tr v-for="(item, index) in posts" :key="index">
                                <td class="subject">
                                    <router-link :to="{name: 'topic.detail', params: {slug: item.slug}}">{{item.subject}}</router-link>
                                </td>
                                <td>
                                    <div class="d-flex justify-content-around">
                                        <span class="like" @click="openLikes(item)">
                                             <fp-icon name="thumbs-up" class="fp-fs-20" />
                                            {{item.likes}}
                                        </span>
                                        <span class="like ml-4">
                                            <fp-icon name="thumbs-down" class="fp-fs-20" />
                                            {{item.unlikes}}
                                        </span>
                                        <span class="like ml-4" @click="openComments(item)">
                                            <fp-icon name="comment-dots" class="fp-fs-20" />
                                            {{item.comments_count}}
                                        </span>
                                    </div>
                                </td>
                                <td>{{$moment(item.created_at).format('MM/DD/YYYY')}}</td>
                                <td>
                                    <span
                                        style="font-weight: 600;"
                                        :class="{
                                            'text-success': item.status === true,
                                            'text-danger': item.status === false,
                                        }"
                                    >
                                        {{item.status ? 'Active' : 'Offline'}}
                                    </span>
                                </td>
                                <td class="action">
                                    <a href="javascript:;" class="btn-edit ml-1" v-tooltip="'Edit'" @click="edit(item)">
                                        <fp-icon name="edit" class="fp-fs-20" />
                                    </a>
                                    <a href="javascript:;" class="btn-remove ml-1" v-tooltip="'Delete'" @click="remove(item, index)">
                                        <fp-icon name="trash" class="fp-fs-20" />
                                    </a>
                                    <a href="javascript:;" class="btn-approve ml-1" v-tooltip="item.status ? 'Set to offline' : 'Set to online'" @click="changeStatus(item)">
                                        <fp-icon v-if="item.status" name="ban" class="fp-fs-18" />
                                        <fa v-else icon="check" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <p class="fp-text-color">Total {{ total }}</p>
                    </div>
                    <div>
                        <paginate
                            v-model="filter.page"
                            :page-count="page_count"
                            :page-range="3"
                            :margin-pages="2"
                            :prev-class="'page-item'"
                            :next-class="'page-item'"
                            :prev-link-class="'page-link'"
                            :next-link-class="'page-link'"
                            :click-handler="searchPosts"
                            :container-class="'pagination'"
                            :page-class="'page-item'"
                            :prev-text="'Previous'"
                            :next-text="'Next'"
                            :page-link-class="'page-link'">
                        </paginate>
                    </div>
                </div>
            </div>
        </transition>

        <modal
            name="topicLikesModal"
            width="300"
            height="auto"
        >
            <div class="p-1">
                <div class="card card-body card-post">
                    <h5>Likes</h5>
                    <div>
                        <div class="post-user mb-2" v-for="(item, index) in likes" :key="index">
                            <img :src="item.user.photo_url" alt="" />
                            <div class="ml-2">
                                <p class="mb-0 username">{{ item.user.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </modal>

        <modal
            name="topicCommentsModal"
            width="500"
            height="auto"
            :scrollable="true"
            :adaptive="true"
        >
            <div class="p-1">
                <div class="card card-body card-post" style="max-height: 600px;overflow-y:auto;">
                    <h5>Comments</h5>
                    <div>
                        <comment-item :comment="item" v-for="(item, index) in comments" :key="index"></comment-item>
                    </div>
                </div>
            </div>
        </modal>

        <div class="top-modal">
            <modal
                name="editTopicModal"
                width="500"
                height="auto"
                :scrollable="true"
                :adaptive="true"
            >
                    <div class="p-2">
                        <div class="card card-body">
                            <topic-form v-if="selected_topic"
                                mode="edit"
                                :topic="selected_topic"
                                @submit="searchTopics"
                            ></topic-form>
                        </div>
                    </div>

            </modal>
        </div>
    </div>
</template>
<script>
import CommentItem from "~/components/topic/CommentItem.vue";
import TopicForm from "~/components/topic/TopicForm.vue";
import Swal from "sweetalert2";
export default {
    name: 'ProfileTopics',
    components: {
        CommentItem, TopicForm,
    },
    data() {
        return {
            topics: [],
            topics_filter: {
                user_id: '',
                keyword: '',
            },
            selected_topic: null,
            posts: [],
            filter: {
                is_profile: true,
                user_id: '',
                keyword: '',
                page: 1,
                topic_id: '',
            },
            show_ask_form: false,
            selected_user_id: null,
            page_count: 0,
            total: 0,
            per_page: 15,
            likes: [],
            comments: [],
            tab: 'Posts'
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.filter.user_id = this.topics_filter.user_id = this.auth_user.id;
        this.searchTopics()
        this.searchPosts()
    },
    methods: {
        init() {
            this.topics_filter = {
                user_id: '',
                keyword: '',
            }
            this.filter = {
                is_profile: true,
                user_id: '',
                keyword: '',
                page: 1,
                topic_id: '',
            }
        },
        async searchPosts() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/search`, this.filter)
            if (response.data.status == 'Success') {
                let result = response.data.data
                this.posts = result.data;
                this.page_count = result.last_page;
                this.per_page = result.per_page;
                this.total = result.total;
            }
        },
        async searchTopics() {
            const response = await this.axios.post(`${process.env.topicsApiUrl}/topic/search_topics`, this.topics_filter)
            this.topics = response.data.data
        },
        openLikes(item) {
            this.axios.post(`${process.env.topicsApiUrl}/topic/get_likes`, {id: item.id}).then(response => {
                if (response.data.status == 'Success') {
                    this.likes = response.data.data
                    this.$modal.show('topicLikesModal')
                }
            })
        },
        openComments(item) {
            this.axios.post(`${process.env.topicsApiUrl}/topic/get_comments`, {id: item.id}).then(response => {
                if (response.data.status == 'Success') {
                    this.comments = response.data.data
                    this.$modal.show('topicCommentsModal')
                }
            })
        },
        edit(item) {
            this.$router.push({name: 'topic.edit', params: {id: item.id}})
        },
        remove(item, index) {
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                reverseButtons: true,
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`${process.env.topicsApiUrl}/topic/delete/${item.id}`).then((response) => {
                        this.posts.splice(index, 1);
                        this.$toast.success("Deleted successfully");
                    });
                }
            });
        },
        changeStatus(item) {
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                reverseButtons: true,
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.post(`${process.env.topicsApiUrl}/topic/change_status`, {id: item.id}).then((response) => {
                        item.status = !item.status
                        this.$toast.success("Successfully Done");
                    });
                }
            });
        },
        async selectTopic(item) {
            this.filter.topic_id = item.id
            await this.searchPosts()
            this.tab = 'Posts'
        },
        editTopic(item) {
            this.selected_topic = item
            this.$modal.show('editTopicModal')
        },
        removeTopic(item, index) {
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                reverseButtons: true,
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`${process.env.topicsApiUrl}/topic/delete_topic/${item.id}`).then(response => {
                        this.topics.splice(index, 1);
                        this.$toast.success("Deleted successfully");
                    });
                }
            });
        },
        changeTopicStatus(item) {
            if (item.status != 'active' && item.status != 'inactive') {
                this.$toast.error('You can not change status');
                return false;
            }
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                reverseButtons: true,
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.post(`${process.env.topicsApiUrl}/topic/change_topic_status`, {id: item.id, status: item.status === 'inactive' ? 'active' : 'inactive'}).then((response) => {
                        item.status = !item.status
                        this.$toast.success("Successfully Done");
                    });
                }
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    @media (max-width: 600px) {
        .page-title {
            font-size: 16px;
        }
    }
    .like {
        cursor: pointer;
        white-space: nowrap;
    }
    .nav-topics {
        display: inline-flex;
        border-radius: 8px;
        padding: 4px;
        .nav-link {
            width: 150px;
            text-align: center;
            border-radius: 8px;
            color: #212529;
            padding-top: 6px;
            padding-bottom: 6px;
            &.active {
                color: #FFF;
                background-color: #FF22A1;
            }
        }
        @media (max-width: 600px) {
            display: flex;
            background: none !important;
            border-radius: 0;
            .nav-item {
                flex-grow: 1;
                .nav-link {
                    width: unset;
                    border-radius: 0;
                    border-bottom: solid 3px #D3DDEB;
                    &.active {
                        color: #FF22A1;
                        background: none;
                        border-bottom-color: #FF22A1 !important;
                    }
                }
            }
        }
    }
    [data-theme=dark] {
        .nav-topics {
            .nav-link {
                color: #FFF;
            };
             @media (max-width: 600px) {
                .nav-item {
                    .nav-link {
                        border-bottom: solid 3px #334557;
                    }
                }
            }
        }
        .card-body {
            background: #18243E;
        }
    }
    td.subject {
        min-width: 300px;
        a {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>