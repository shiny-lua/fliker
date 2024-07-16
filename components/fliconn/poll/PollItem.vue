<template>
    <div class="poll-item fp-border-color-1">
        <h6 class="poll-question">{{ poll.question }}</h6>
        <div class="votes">
            <div v-for="(item, index) in poll.votes"
                 :key="index"
                 class="choice-item"
                 @click="vote(item)"
            >
                <span class="choice">{{ item.choice }}</span>
                <fa v-if="item.is_my_choice" icon="check-circle" />
                <div v-if="item.user_images.length" class="vote-users ml-auto">
                    <img v-for="img in item.user_images" :key="img" :src="img" width="32" height="32" alt="" />
                    <span v-if="item.percentage" class="voted-percentage">{{ item.percentage }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PollItem',
    props: {
        poll: { type: Object, required: true },
    },
    methods: {
        async vote(item) {
            console.log("item" ,item)
            try {
                const payload = {
                    poll_id: this.poll.id,
                    choice: item.choice,
                };
                const response = await this.axios.post(`${process.env.timelineApiUrl}/poll/vote`, payload);
                if (response.data.status === 'Success') {
                    const poll = response.data.data;
                    this.poll.votes = poll.votes;
                    this.$emit('voted');
                }
            } catch (error) {

            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .poll-item {
        border-style: solid;
        border-width: 1px;
        border-radius: 12px;
        padding: 12px;
    }
    .choice-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        border-radius: 8px;
        padding: 6px 8px;
        border: solid 1px #ECF1F6;
        cursor: pointer;
        &:last-child {
            margin-bottom: 0;
        }
        .choice {
            line-height: 32px;
        }
        svg {
            color: #57677a;
            margin-left: 6px;
            font-size: 16px;
        }
        .vote-users {
            img {
                margin-left: -14px;
                border-radius: 100%;
                object-fit: cover;
                border: solid 1px #FFF;
            }
        }
    }


    [data-theme=dark] {
        .choice-item {
            border: solid 1px rgba(255, 255, 255, 0.2);
            background-color: #18243E;
            color: #64748B;
        }
    }
</style>