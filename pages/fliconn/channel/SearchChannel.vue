<template>
    <div class="d-flex justify-content-center pt-3 pt-md-4">
        <div class="fliconn-channels">
            <div class="input-container">
                <input type="text"
                        class="form-control has-bg"
                        v-model="filter.keyword"
                        :placeholder="`Search channels`"
                        @input="debounceSearchChannels"
                />
                <fp-icon name="search" class="fp-fs-18 fp-text-color-main" />
            </div>

            <div class="search-channels-list">
                <div class="row mx-n2">
                    <div v-for="(item, index) in channels" :key="index" class="col-6 col-md-6 col-xl-4 px-2 mb-4">
                        <channel-item :channel="item"
                            @joined="joined"
                        />
                    </div>
                </div>
                <infinite-loading
                    :distance="300"
                    :identifier="infiniteId"
                    @infinite="search"
                >
                    <div slot="no-more"></div>
                    <div slot="no-results">No results found...</div>
                </infinite-loading>
            </div>
        </div>
    </div>
</template>
<script>
import ChannelItem from "~/components/fliconn/channel/ChannelItem.vue"
export default {
    name: 'SearchChannel',
    components: {
        ChannelItem,
    },
    data() {
        return {
            channels: [],
            filter: {
                page: 1,
                keyword: '',
            },
            infiniteId: +new Date(),
            tm: null,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        debounceSearchChannels() {
            clearTimeout(this.tm);
            this.tm = setTimeout(() => {
                this.searchChannels();
            }, 500);
        },
        searchChannels() {
            this.channels = [];
            this.filter.page = 1;
            this.infiniteId += 1;
        },
        async search($state) {
            const response  = await this.axios.post(`${process.env.timelineApiUrl}/channel/search`, this.filter);
            if (response.data.status == 'Success') {
                let result = response.data.data
                if (result.current_page == 1) this.users = [];
                if(result.data.length) {
                    this.filter.page++;
                    this.channels.push(...result.data);
                    $state.loaded();
                } else {
                    $state.complete();
                }
            }
        },
    }

}
</script>
<style lang="scss" scoped>
    .input-container {
        position: relative;
        margin-bottom: 12px;
        input {
            padding-right: 30px;
            border: none;
            font-size: 14.4px;
        }
        svg {
            position: absolute;
            top: 9px;
            right: 9px;
            z-index: 1;
        }
    }
    .fliconn-channels {
        width: 100%;
        max-width: 520px;
    }
</style>