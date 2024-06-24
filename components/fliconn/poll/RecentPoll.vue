<template>
    <div class="side-poll-item" :class="!post && 'd-none'">
        <div v-if="post" class="fp-post-user">
            <img :src="post.user.photo_url" class="fp-post-user-photo" width="38" height="38" alt="" />
            <div class="ml-2">
                <p class="name">{{ post.user.name }}</p>
                <p class="location-time fp-text-color-main">
                    {{ post.user_location }}
                    <fa v-if="post.user_location" icon="circle" class="divider-dot" />
                    {{ post.diff_time ? post.diff_time : "Just now" }}
                    <fa icon="circle" class="divider-dot" />
                    <span class="visible_to">
                        <fp-icon v-if="post.visible_to === 'public'" name="globe" />
                        <fp-icon v-if="post.visible_to === 'followers'" name="user-check" />
                        <fp-icon v-if="post.visible_to === 'mutual_followers'" name="users-check" />
                        <fp-icon v-if="post.visible_to === 'custom'" name="privacy_policy" />
                        <fp-icon v-if="post.visible_to === 'nobody'" name="eye-slash" />
                    </span>
                </p>
            </div>
        </div>
        <poll-item v-if="post" :poll="post.poll" @voted="getLatestPoll" />
        <p v-if="post" class="fp-text-color-main mt-2 mb-2">
            <fp-icon name="poll" class="fp-fs-18" />
            {{ $nFormatter(post.poll.voted_count) }} Answered
        </p>
        <div class="d-flex justify-content-end actions fp-fs-18 fp-text-color-main">
            <fp-icon name="thumbs-up" />
            <fp-icon name="thumbs-down" class="ml-3" />
            <fp-icon name="share" class="ml-3" />
        </div>
    </div>
</template>
<script>
import PollItem from "./PollItem.vue";
export default {
    name: 'RecentPoll',
    components: {
        PollItem,
    },
    data() {
        return {
            post: null,
        }
    },
    mounted() {
        this.getLatestPoll();
    },
    methods: {
        async getLatestPoll() {
            const response = await this.axios.get(`${process.env.timelineApiUrl}/poll/get_latest_poll`);
            if (response.data.status === 'Success') {
                this.post = response.data.data;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .side-poll-item {
        &::v-deep {
            .poll-item {
                border: none;
                padding: 0;
                border-radius: 0;
                margin-top: 12px;
                .poll-question {
                    font-size: 14.4px;
                    font-weight: 500;
                }
                .vote-users {
                    img {
                        width: 28px;
                        height: 28px;
                    }
                }
            }
        }
    }
    .fp-post-user {
        display: flex;
        align-items: center;
        .fp-post-user-photo {
            border-radius: 100%;
            object-fit: cover;
        }
        .name {
            margin-bottom: 0;
            line-height: 1.2;
        }
        .location-time {
            margin-bottom: 0;
            display: flex;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            line-height: 15.47px;
            .visible_to {
                svg {
                    font-size: 15px;
                }
            }
        }
    }
    .poll-choice {
        border-style: solid;
        border-width: 1px;
        border-color: #D3DDEB;
        padding: 6px 12px;
        border-radius: 6px;
        margin-bottom: 16px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    [data-theme=dark] {
        .poll-choice {
            border-color: rgba(255, 255, 255, 0.2);
        }
    }
</style>