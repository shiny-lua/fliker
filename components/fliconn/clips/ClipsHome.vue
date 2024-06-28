<template>
    <div class="clips-home position-relative" :class="{'show-comments': show_comments}" @keydown="keyDownListener">
        <template v-if="clips">
            <div class="clips-filter mb-2">
                <add-clips-button redirect-url="/fliconn/create/short_flick" class="add-button d-none d-md-block">
                    <fp-icon name="camera-dashed" />
                </add-clips-button>
                <span class="filter-item"
                    :class="filter === 'most_recent' && 'active'"
                    @click="filter = 'most_recent'"
                >
                    <fp-icon name="filter_most_recent" />
                </span>
                <span class="filter-item"
                    :class="filter === 'popular' && 'active'"
                    @click="filter = 'popular'"
                >
                    <fp-icon name="filter_popular" />
                </span>
                <span class="filter-item"
                    :class="filter === 'following' && 'active'"
                    @click="filter = 'following'"
                >
                    <fp-icon name="filter_following" />
                </span>
                <span class="filter-item"
                    :class="filter === 'tagged_me' && 'active'"
                    @click="filter = 'tagged_me'"
                >
                    <fp-icon name="filter_tagged_me" />
                </span>
            </div>
            <div class="clips-content"
                v-touch:swipe.left="selectNext"
                v-touch:swipe.right="selectPrev"
            >
                <clips-detail v-if="showDetail"
                    ref="clipsDetail"
                    :clips="clips"
                    @prev="selectPrev"
                    @next="selectNext"
                    @show-comments="showComments"
                ></clips-detail>

            </div>
            <div class="clips-home-mobile-overlay d-md-none"></div>
        </template>
        <div v-else-if="loading" class="text-center pt-3 pt-md-4">
            <img src="~assets/images/logo_loading.gif" width="50" alt="" />
        </div>
    </div>
</template>
<script>
import AddClipsButton from './AddClipsButton.vue';
import ClipsDetail from "./ClipsHomeDetail.vue";
import Cookies from "js-cookie";
export default {
    middleware: 'auth',
    name: 'ClipsHome',
    components: {
        AddClipsButton,
        ClipsDetail,
    },
    data() {
        return {
            filter: 'most_recent',
            showDetail: false,
            clips: null,
            show_comments: false,
            loading: false,
        }
    },
    watch: {
        filter(value) {
            this.getClipsDetail({filter: value});
        },
    },
    mounted() {
        window.addEventListener('keydown', this.keyDownListener);
        let id = Cookies.get("clips_id");
        this.getClipsDetail({id: id});
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.keyDownListener);
        Cookies.remove("clips_id")
    },
    methods: {
        keyDownListener(e) {
            const keyCode = e.keyCode;
            if (keyCode && (keyCode === 38 || keyCode === 40)) {
                e.preventDefault()
                if (keyCode === 38) this.selectPrev();
                if (keyCode === 40) this.selectNext();
            }
        },
        selectNext() {
            const payload = {
                filter: this.filter,
                mode: 'next',
                current_id: this.clips ? this.clips.id : '',
            }
            this.getClipsDetail(payload);
        },
        selectPrev() {
            const payload = {
                filter: this.filter,
                mode: 'prev',
                current_id: this.clips ? this.clips.id : '',
            }
            this.getClipsDetail(payload);
        },
        async getClipsDetail(payload) {
            this.loading = true;
            try {
                const response = await this.axios.post(`${process.env.clipsApiUrl}/clips/get_home_clip`, payload);
                if (response.data.status === 'Success') {
                    const result = response.data.data;
                    if (result === null) return;
                    this.showDetail = false;
                    await this.$nextTick();
                    this.clips = result;
                    this.showDetail = true;
                }
                this.loading = false;
            } catch (error) {
                this.loading = false;
            }
        },
        showComments(value) {
            this.show_comments = value;
        },
    }
}
</script>
<style lang="scss" scoped>
    .clips-home {
        @media (min-width: 601px) {
            display: flex;
            justify-content: center;
            &.show-comments {
                justify-content: flex-start;
            }
        }
    }
    .clips-filter {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 10px;
        @media (min-width: 601px) {
            height: 350px;
            .add-button {
                font-size: 50px;
                line-height: 1;
            }
        }
        @media (max-width: 600px) {
            position: absolute;
            z-index: 2;
            top: calc(50% - 100px);
            left: 10px;
            height: 200px;
        }
        align-items: center;
        height: 60px;
        max-width: 100%;
        padding-left: 6px;
        .filter-item {
            width: 50px;
            height: 50px;
            color: #00162D;
            font-size: 30px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #FFF;
            border-radius: 100%;
            cursor: pointer;
            &.active {
                background-color: #FF22A1;
                color: #FFF;
            }
            @media (max-width: 600px) {
                width: 30px;
                height: 30px;
                background: none;
                color: #FFF;
                &.active {
                    background-color: unset;
                    color: #FF22A1;
                }
            }
        }
    }
    .clips-content {
        @media (min-width: 601px) {
            padding-left: 28px;
        }
    }
    .clips-home-mobile-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        border-radius: 12px;
    }
</style>