<template>
    <div class="top-rated-clips fp-card" :class="{'d-none' : clips.length === 0}">
        <h6 class="d-flex align-items-center">
            <fp-icon name="clips" class="fp-fs-20 mr-2" style="color: #E83E8C;" />
            Short Flicks
            <a v-if="clips.length === 8"
                 href="javascript:;"
                 class="text-success ml-auto"
                 @click.prevent="$emit('show-all')"
            >
                See All
            </a>
        </h6>
        <fp-slider v-if="clips.length"
             :slide-count="clips.length"
             :slide-width="176"
             :item-padding="5"
        >
            <div v-for="(item, index) in clips"
                 :key="index"
                 class="clips-item"
            >
                <clips-item :clips="item" @open="openClipsOverview(item)" />
            </div>
        </fp-slider>
    </div>
</template>
<script>
import ClipsItem from './ClipsItem.vue'
import ClipsOverview from './ClipsOverview.vue'
import FpSlider from "~/components/ui/FpSlider.vue";
import Cookies from "js-cookie";
export default {
    name: 'TopRatedClips',
    props: ['in_sidebar'],
    components: {
        ClipsItem,
        ClipsOverview,
        FpSlider,
    },
    data() {
        return {
            clips: [],
        }
    },
    mounted() {
        this.getClips()
    },
    methods: {
        async getClips() {
            let params = {
                order_by: 'view_count',
                top_rated: true,
                page: 1,
            };
            const response = await this.axios.post(`${process.env.clipsApiUrl}/clips/search`, params)
            this.clips = response.data.data.data
        },
        openClipsOverview(item) {
            Cookies.set("clips_id", item.id);
            this.$emit('clips-selected', item.id);
        },
    }
}
</script>
<style lang="scss" scoped>
    .top-rated-clips {
        border-radius: 15px;
        padding: 12px 16px;
        &::v-deep {
            .slick-slide {
                &.slick-active {
                    .clips-item {
                        .dropdown-menu {
                            width: 170px;
                            min-width: 170px;
                            .dropdown-item p {
                                white-space: pre-wrap;
                            }
                        }
                    }
                }
            }
        }
    }
    .clips-item {
        width: 186px !important;
        min-width: 140px;
        padding: 0 5px;
        text-align: center;
        cursor: pointer;
    }
</style>