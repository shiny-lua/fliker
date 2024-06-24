<template>
    <div class="status-overview" id="statusOverview" :class="commentsShown && 'comment-shown'">
        <div class="status-content" v-touch:swipe.left="selectPrev" v-touch:swipe.right="selectNext">
            <div class="status-slides">
                <div v-for="(slide, index) in statuses"
                    :key="index"
                    class="slide-item"
                    :class="index === 0 && 'active'"
                    @click="select(slide)"
                >
                    <div v-if="mode === 'fliconn_index'" class="slide-item-index">
                        <img :src="slide.user.photo_url" class="status-user-photo" alt="">
                        <p class="status-user-name">{{slide.user.first_name}}</p>
                    </div>
                    <div v-else
                         class="slide-item-profile fp-border-color-1"
                         :style="{
                             background: slide.type === 'text' ? slide.text_slides[0].color : slide.thumbnail
                         }"
                    >
                        <p v-if="slide.type === 'text'" class="slide-item-text">{{ slide.text_slides[0].text.slice(0, 30) }}</p>
                        <img v-else :src="slide.thumbnail" class="slide-item-image" />
                        <img :src="slide.user.photo_url" width="25" height="25" class="slide-item-user" alt="" />
                    </div>
                </div>
            </div>
            <status-detail
                v-if="showDetail"
                ref="statusDetail"
                :status="statuses[0]"
                @slide-ended="selectNext"
                @show-likes="showLikes"
                @show-comments="showComments"
                @show-comments-modal="showCommentsModal"
                @prev="selectPrev"
                @next="selectNext"
                @follow="follow"
            ></status-detail>
            <a href="javascript:;" class="btn-close" @click.prevent="$emit('close')">
                <fp-icon name="close" />
            </a>
            <div v-if="commentsShown" class="status-comments">
                <div class="fp-card border-0 h-100">
                    <a href="javascript:;" class="btn-close-modal" style="top: 10px;right: 10px;" @click.prevent="commentsShown = false">
                        <fp-icon name="close" />
                    </a>
                    <comment-form
                        :commentable_id="activeStatusId"
                        model="status"
                        @posted="commentPosted"
                        class="mt-4"
                    ></comment-form>
                    <div class="comments nice-scrollbar mt-3">
                        <comment-card
                            v-for="(item, index) in comments"
                            :comment="item"
                            :key="index"
                            :is_main="true"
                            @deleted="comments.splice(index, 1)"
                        ></comment-card>
                        <div v-if="comment_total > 2 && comment_total > (comment_per_page * (comment_page - 1))">
                            <a href="javascript:;" class="btn-read-more" @click="getComments()">Read more...</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <fp-modal name="statusCommentModal"
             :width="550"
             @opened="$refs.statusDetail.pause()"
             @closed="$refs.statusDetail.play()"
             title="Comments"
             :middleOnMobile="true"
        >
            <div class="status-comment-modal">
                <div class="card-post">
                    <comment-form
                        :status_id="activeStatusId"
                        model="status"
                        @posted="commentPosted"
                    ></comment-form>
                    <div class="comments mt-3 nice-scrollbar">
                        <comment-card
                            v-for="(item, index) in comments"
                            :comment="item"
                            :key="index"
                            :is_main="true"
                            @deleted="comments.splice(index, 1)"
                        ></comment-card>
                        <div v-if="comment_total > 2 && comment_total > (comment_per_page * (comment_page - 1))">
                            <a href="javascript:;" class="btn-read-more" @click="getComments()">Read more...</a>
                        </div>
                    </div>
                </div>
            </div>
        </fp-modal>

        <fp-modal name="statusLikesModal"
            :width="300"
            @opened="$refs.statusDetail.pause()"
            @closed="$refs.statusDetail.play()"
            :middleOnMobile="true"
            title="Likes"
        >
            <div class="fp-likes">
                <div v-for="(item, index) in likes" :key="index" class="d-flex align-items-center cursor-pointer">
                    <img :src="item.photo_url" width="30" height="30" class="rounded-circle" alt="" @click="goToProfile(item)" />
                    <span class="ml-2" @click="goToProfile(item)">{{item.name}}</span>
                    <span v-if="item.id === auth_user.id" class="fp-text-color-main ml-1">(You)</span>
                </div>
            </div>
        </fp-modal>
    </div>
</template>
<script>
import StatusDetail from "./StatusDetail.vue"
import CommentCard from "../CommentCard.vue"
import CommentForm from "../CommentForm.vue"
import { mapGetters } from "vuex"
import FpModal from "@/components/ui/Modal.vue";
export default {
    name: 'StatusOverview',
    props: {
        statuses: { type: Array, required: true },
        mode: { type: String, default: 'fliconn_index' },
    },
    components: {
        StatusDetail,
        CommentCard,
        CommentForm,
        FpModal,
    },
    data() {
        return {
            comments: [],
            comment_per_page: 3,
            comment_page: 1,
            comment_total: 0,
            likes: [],
            keyCode: null,
            showDetail: false,
            commentsShown: false,
        }
    },
    computed: {
        activeStatusId() {
            return this.statuses[0].id
        },
        ...mapGetters({
            auth_user: 'auth/user',
        }),
    },
    watch: {
        keyCode(value) {
            if (value) {
                if (value === 38) this.selectPrev();
                if (value === 40) this.selectNext();
                this.keyCode = null;
            }
        },
        async statuses() {
            this.showDetail = false;
            await this.$nextTick();
            this.showDetail = true
        },
        commentsShown(value) {
            if (value) {
                this.$refs.statusDetail.pause();
            } else {
                this.$refs.statusDetail.pause();
            }
        }
    },
    mounted() {
        window.addEventListener('keyup', (e) => {
            this.keyCode = e.keyCode
        });
        this.showDetail = true
    },
    beforeDestroy() {
        window.removeEventListener('keypress', function() {});
    },
    methods: {
        async select(item, mode = null) {
            this.$emit('select', {id: item.id, mode: mode});
            this.commentsShown = false;
        },
        selectNext() {
            let activeIndex = this.statuses.findIndex(i => i.id === this.statuses[0].id);
            if (activeIndex === this.statuses.length - 1) {
                this.select(this.statuses[0], 'next');
            } else {
                let nextItem = this.statuses[activeIndex + 1];
                this.select(nextItem);
            }
        },
        selectPrev() {
            let activeIndex = this.statuses.findIndex(i => i.id === this.statuses[0].id);
            if (activeIndex === 0) {
                this.select(this.statuses[0], 'prev')
            } else {
                let prevItem = this.statuses[activeIndex - 1];
                this.select(prevItem);
            }
        },
        async showLikes() {
            const { data } = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_likes`, {id: this.activeStatusId, model: 'status'})
            this.likes = data.data
            this.$modal.show('statusLikesModal')
        },
        async showComments() {
            this.comment_page = 1;
            await this.getComments()
            // this.$modal.show('statusCommentModal')
            this.commentsShown = true;
        },
        async showCommentsModal() {
            this.comment_page = 1;
            await this.getComments()
            this.$modal.show('statusCommentModal')
        },
        async getComments() {
            let params = {
                id: this.activeStatusId,
                per_page: this.comment_per_page,
                page: this.comment_page,
                model: 'status'
            }
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_comments`, params)
            let result = response.data.data
            if (this.comment_page === 1) this.comments = [];
            this.comments.push(...result.data)
            this.comment_page++;
            this.comment_total = result.total
        },
        commentPosted(data) {
            this.comments.unshift(data)
            if (this.statuses[0]) {
                this.statuses[0].comments_count++
            }
        },
        async follow(item) {
            const data = await this.$store.dispatch("requestFollow", item.id);
            if (data.status === "Success") {
                this.$toast.success(data.message);
                this.statuses[0].user.is_requested_follow = true;
            }
        },
        goToProfile(user) {
            this.$router.push({name: 'fliconn.profile', params: {username: user.username}})
        },
    }
}
</script>
<style lang="scss" scoped>
    .status-overview {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1051;
        background-color: rgba(0,0,0,.85);
        display: flex;
        justify-content: center;
        align-items: center;
        .status-slides {
            // background: rgba(0, 0, 0, 0.5);
            position: absolute;
            top: 0;
            left: -112px;
            z-index: 1;
            @media (min-width: 601px) {
                height: calc(100vh - 100px);
                max-height: 700px;
                overflow-y: auto;
                &::-webkit-scrollbar {
                    display: none;
                }
            }
            .slide-item {
                cursor: pointer;
                margin-bottom: 20px;
                .slide-item-index {
                    .status-user-name {
                        color: #FFF;
                        text-align: center;
                        font-size: 13.6px;
                        margin-bottom: 0;
                        max-width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .status-user-photo {
                        width: 80px;
                        height: 80px;
                        border-radius: 100%;
                        border: solid 2px #FF22A1;
                        padding: 3px;
                        object-fit: cover;
                        @media (max-width: 600px) {
                            width: 60px;
                            min-width: 60px;
                            height: 60px;
                            min-height: 60px;
                        }
                    }
                    &.active {
                        .status-user-name {
                            color: #FF22A1;
                        }
                        & > div {
                            border-color: #FF22A1 !important;
                        }
                    }
                }
                .slide-item-profile {
                    width: 90px;
                    min-width: 90px;
                    height: 90px;
                    min-height: 90px;
                    margin-bottom: 20px;
                    border-radius: 10px;
                    border-style: solid;
                    border-width: 1px;
                    position: relative;
                    overflow: hidden;
                    .slide-item-text {
                        margin-bottom: 0;
                        padding: 8px;
                        font-size: 13.6px;
                        word-break: break-all;
                        line-height: 1.2;
                        @media (max-width: 600px) {
                            font-size: 10px;
                        }
                    }
                    .slide-item-image {
                        width: 100%;
                        height: 100%;
                        border-radius: 10px;
                        object-fit: cover;
                    }
                    .slide-item-user {
                        object-fit: cover;
                        position: absolute;
                        border: solid 1px #FFF;
                        border-radius: 100%;
                        padding: 1px;
                        left: 5px;
                        bottom: 5px;
                    }
                    @media (max-width: 600px) {
                        width: 60px;
                        min-width: 60px;
                        height: 60px;
                        min-height: 60px;
                    }
                }
            }
            @media (max-width: 600px) {
                top: 10px;
                left: 0;
                width: 100%;
                display: flex;
                justify-content: center;
                .slide-item {
                    margin-left: 8px;
                    &:first-child {
                        margin-left: 0;
                    }
                }
            }
        }
        &.comment-shown {
            .status-content {
                margin-right: 250px;
            }
        }
        .status-content {
            aspect-ratio: 9 / 16;
            height: calc(100vh - 100px);
            max-height: 700px;
            position: relative;
            transition: all 0.1s ease-in;
            @media (max-width: 600px) {
                width: 100%;
                height: var(--app-height);
                max-height: unset;
            }
            .btn-close {
                position: absolute;
                top: 10px;
                right: -62px;
                z-index: 2;
                color: #FFF;
                padding: 0px;
                border-radius: 100%;
                font-size: 24px;
                line-height: 1;
                outline: none;
                text-decoration: none;
                text-align: center;
                line-height: 1;
                @media (max-width: 600px) {
                    right: 6px;
                }
            }
            .status-comments {
                aspect-ratio: 11 / 16;
                height: calc(100vh - 100px);
                max-height: 700px;
                position: absolute;
                margin-left: calc(100% + 101px);
                top: 0;
                .comments {
                    max-height: calc(100% - 80px);
                    overflow-y: auto;
                }
                &::v-deep {
                    .comment-footer {
                        .comments-count {
                            color: #FFF;
                        }
                    }
                }
            }
        }

        &::v-deep {
            .vm--modal {
                overflow: unset;
            }
        }
    }
    .status-comment-modal {
        .comments {
            max-height: 500px;
            overflow: auto;
            margin-left: 50px;
            @media (max-width: 600px) {
                margin-left: 30px;
            }
        }
    }
</style>