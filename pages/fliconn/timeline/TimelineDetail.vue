<template>
    <div class="d-flex justify-content-center pt-3 pt-md-5">
        <div class="fliconn-post-container">
            <timeline-item
                v-if="post"
                :post="post"
                page="page"
                :is_detail_page="true"
                @commented="getDetail"
            ></timeline-item>
        </div>
    </div>
</template>
<script>
import TimelineItem from "~/components/fliconn/timeline/TimelineItem.vue"
export default {
    middleware: 'auth',
    name: 'TimelineDetail',
    components: {
        TimelineItem
    },
    data() {
        return {
            id: '',
            post: null,
        };
    },
    watch: {
        id: function (newVal) {
            if (newVal) {
                this.getDetail();
            }
        }
    },
    mounted() {
        this.id = this.$route.params.id;
    },
    methods: {
        getDetail() {
            this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_detail`, {id: this.id}).then(response => {
                if (response.data.status == 'Success') {
                    this.post = response.data.data;
                }
            });
        },
        async shareQuestion(item) {
            let postUrl = process.env.serverUrl + '/fliconn/' + item.id
            await this.$copyText(postUrl);
            this.$toast.success('URL copied!')
        },
    }
}
</script>
<style lang="scss" scoped>
    .fliconn-post-container {
        width: 100%;
        max-width: 578px;
    }
</style>