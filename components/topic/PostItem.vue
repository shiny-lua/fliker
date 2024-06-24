<template>
    <div class="topic-post-card" :class="!post.image && 'has-no-image'">
        <div class="fp-card p-0" :class="{ 'card-mini': type == 'mini' }">
            <div class="card-body post-mini-body" v-if="type === 'mini'">
                <div class="post-topics mb-2 text-uppercase">
                    <router-link v-if="post.topic" :to="{ name: 'topic.topic_detail', params: { slug: post.topic.slug } }" class="fp-text-color-primary">
                        {{ post.topic.name }}
                    </router-link>
                </div>
                <div class="post-detail">
                    <p class="subject mb-2 cursor-pointer" @click="viewDetail()">
                        {{ post.subject.substring(0, 80) }}
                    </p>
                    <p class="diff_time mb-0 text-success"><fa icon="circle" class="mr-2" /> {{ post.diff_time }}</p>
                </div>
            </div>
            <div v-else class="post-body">
                <div v-if="post.image" class="post-image cursor-pointer" :class="!post.image && 'no_image'" @click="viewDetail()">
                    <img :src="post.image.thumbnail_url" alt="" />
                </div>
                <div class="fp-card post-detail">
                    <div class="post-header">
                        <div class="post-topics mb-2 text-uppercase">
                            <router-link v-if="post.topic"
                                :to="{
                                    name: 'topic.topic_detail',
                                    params: { slug: post.topic.slug },
                                }"
                                class="fp-text-color-primary"
                            >
                                {{ post.topic.name }}
                            </router-link>
                            <!-- <span v-else class="invisible">No Topic</span> -->
                        </div>
                        <div class="post-user mb-2 align-items-start">
                            <p class="subject my-0 cursor-pointer" @click="viewDetail()">
                                {{ post.subject.substring(0, 80) }}
                            </p>
                            <div class="dropdown dropdown-context-menu">
                                <a href="javascript:;" class="btn-hide-report dropdown-toggle no-caret" data-toggle="dropdown">
                                    <fa icon="ellipsis-h" />
                                </a>
                                <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                    <template v-if="page == 'page'">
                                        <a v-if="auth_user && auth_user.id === post.user_id" href="javascript:;" class="dropdown-item" @click="hide()">
                                            <fa icon="eye-slash" />
                                            Hide this post
                                        </a>
                                        <a href="javascript:;" class="dropdown-item" @click="showReportModal()">
                                            <fa :icon="['far', 'file-alt']" />
                                            Report
                                        </a>
                                        <a href="javascript:;" class="dropdown-item" @click="share()">
                                            <fa icon="share-alt" />
                                            Share
                                        </a>
                                    </template>
                                    <template v-else>
                                        <a href="javascript:;" class="dropdown-item" @click="changeStatus()">{{ post.status ? "Hide this post" : "Show" }}</a>
                                        <a href="javascript:;" class="dropdown-item" @click="edit()">Edit</a>
                                        <a href="javascript:;" class="dropdown-item" @click="remove()">Remove</a>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p v-if="post.detail" class="detail" @click="viewDetail()">
                        {{ post.detail && post.detail.length > 100 ? post.detail.substring(0, 100) + "..." : post.detail }}
                    </p>
                    <p class="diff_time mb-0 mt-n1">
                        {{ post.diff_time }}
                    </p>
                </div>
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
    import Form from "vform";
    import Swal from "sweetalert2";
    import FpModal from "~/components/ui/Modal.vue";
    export default {
        name: "PostItem",
        props: ["post", "page", "type"],
        components: {
            FpModal
        },
        data() {
            return {
                report_form: new Form({
                    post_id: this.post.id,
                    detail: "",
                }),
                descriptionExpand: false,
            };
        },
        computed: {
            auth_user() {
                return this.$store.getters["auth/user"];
            },
            detailUrl() {
                return `${process.env.serverUrl}/topics/detail/${this.post.id}`;
            },
            reportModalName() {
                return `report_modal_${Math.round(Math.random() * 100000)}`;
            },
        },
        methods: {
            async share() {
                const payload = {
                    model: 'topics',
                    id: this.post.id,
                    url: this.detailUrl,
                }
                this.$share(payload);
            },
            viewDetail() {
                this.$router.push({ name: "topic.detail", params: { slug: this.post.slug } });
            },
            hide() {
                if (!this.auth_user) return this.$login(this.$route.path);
                Swal.fire({
                    title: "Are you sure?",
                    text: "Hidden posts and related content will be invisible from your homepage.",
                    icon: "warning",
                    showCancelButton: true,
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios
                            .post(`${process.env.topicsApiUrl}/topic/hide`, {
                                id: this.post.id,
                            })
                            .then((response) => {
                                if (response.data.status == "Success") {
                                    this.$emit("hide");
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
            },
            showReportModal() {
                if (!this.auth_user) return this.$login(this.$route.path);
                this.$modal.show(this.reportModalName);
            },
            report() {
                this.report_form.post(`${process.env.topicsApiUrl}/topic/report`).then((response) => {
                    if (response.data.status == "Success") {
                        this.$modal.hide(this.reportModalName);
                    }
                });
            },
            edit() {
                if (this.auth_user.id != this.post.user_id) return false;
                this.$router.push({ name: "topic.edit", params: { id: this.post.id } });
            },
            remove() {
                if (this.auth_user.id != this.post.user_id) return false;
                Swal.fire({
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios
                            .delete(`${process.env.topicsApiUrl}/topic/delete/${this.post.id}`)
                            .then((response) => {
                                if (response.data.status == "Success") {
                                    this.$toast.success("Deleted successfully");
                                    this.$emit("deleted");
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
            },
            changeStatus() {
                this.axios
                    .post(`${process.env.topicsApiUrl}/topic/change_status`, {
                        id: this.post.id,
                    })
                    .then((response) => {
                        this.post.status = response.data.data;
                    });
            },
            follow() {
                this.axios.post(`${process.env.topicsApiUrl}/topic/follow`, { id: this.post.id }).then((response) => {
                    this.post.is_following = !this.post.is_following;
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .card-mini {
        margin-bottom: 0.5rem;
        .post-mini-body {
            .post-topics {
                font-size: 12px;
            }
            .post-detail {
                .subject {
                    color: #212529;
                    font-weight: 500;
                    font-size: 16px;
                    text-decoration: none;
                    margin-top: 0;
                    line-height: 20px;
                }
                .diff_time {
                    font-size: 12.5px;
                }
            }
        }
    }
    .topic-post-card {
        .post-body {
            .post-image {
                width: 100%;
                position: relative;
                padding-bottom: 80%;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                overflow: hidden;
                img {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                @media (max-width: 600px) {
                    &.no_image {
                        display: none;
                    }
                }
            }
            .post-detail {
                display: flex;
                flex-direction: column;
                border-radius: 10px !important;
                .post-topics {
                    font-size: 12px;
                }
                .detail {
                    font-size: 14px;
                    color: #64748B;
                    margin-bottom: 16px;
                    font-weight: 400;
                     display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .post-header {
                    .post-user {
                        display: flex;
                        justify-content: space-between;
                        .dropdown-toggle::after {
                            display: none;
                        }
                    }
                    .subject {
                        cursor: pointer;
                        max-width: calc(100% - 25px);
                        font-size: 16px;
                        line-height: 20px;
                        font-weight: 500;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                .diff_time {
                    font-size: 14.4px;
                    font-weight: 400;
                    color: #64748B;
                }
            }
        }
    }
    .btn-hide-report {
        color: #BFBFBF;
    }
    [data-theme=dark] {
        .post-body {
            .post-image {
                &.no_image {
                    background: rgba(255, 34, 161, 0.078);
                }
            }
        }
    }
</style>
