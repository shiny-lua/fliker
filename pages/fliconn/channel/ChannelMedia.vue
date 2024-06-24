<template>
    <div class="channel-media">
        <div class="row mx-n2">
            <div v-for="(item, index) in medias"
                :key="index"
                class="col-md-6 col-lg-3 px-2"
            >
                <div class="channel-media-item">
                    <div class="media-container">
                        <img v-if="item.thumbnail_url" :src="item.thumbnail_url" alt="" @click="openGallery(item)">
                        <img v-else-if="item.mime === 'pdf'" src="~/assets/images/icons/pdf.png" alt="" @click="downloadFile(item)" />
                        <img v-else-if="item.mime === 'word'" src="~/assets/images/icons/word.png" alt="" @click="downloadFile(item)" />
                    </div>
                    <p class="post-title">{{ item.imageable.title }}</p>
                    <p class="post-view-count fp-text-color-main">
                        <span>{{ $nFormatter(item.view_count) }}</span>
                        <fa icon="circle" class="divider-dot mx-2" />
                        <span>{{ item.diff_time }}</span>
                    </p>
                </div>
            </div>
        </div>
        <infinite-loading :distance="300"
            :identifier="infiniteId"
            @infinite="search"
        >
            <div slot="no-more"></div>
            <div class="text-center" slot="no-results">No media found!</div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>

        <light-box ref="channelMediaLightBox" :media="galleryMedia" :show-light-box="false" />
    </div>
</template>
<script>
import LightBox from "vue-it-bigger";
export default {
    name: 'ChannelMedia',
    props: {
        channel_id: {type: [String, Number], required: true},
    },
    components: {
        LightBox,
    },
    data() {
        return {
            medias: [],
            page: 1,
            infiniteId: +new Date(),
        };
    },
    computed: {
        galleryMedia() {
            return this.medias.filter(i => ['video', 'image'].includes(i.mime)).map(file => {
                let item = {
                    id: file.id,
                    type: file.mime,
                    src: file.src_url,
                    thumb: file.thumbnail_url,
                }

                if (file.mime === 'video') {
                    const extension = file.src.substring(file.src.lastIndexOf('.') + 1);
                    item.thumb = file.thumbnail ? file.thumbnail_url : '',
                    item.sources = [
                        {
                            src: file.src_url,
                            type: `video/${extension}`
                        }
                    ]
                    item.width = 800;
                    item.height = 600;
                    item.autoplay = true;
                }
                return item;
            });
        },
    },
    methods: {
        async search($state) {
            try {
                let payload = {
                    page: this.page,
                    channel_id: this.channel_id,
                }
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/get_media`, payload);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.medias = [];
                    if (result.data.length) {
                        this.page++;
                        this.medias.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
                this.loading = false;
            } catch (error) { }
        },
        async openGallery(item) {
            const index = this.galleryMedia.findIndex(i => i.thumb === item.thumbnail_url);
            if (index !== -1) {
                this.$refs.channelMediaLightBox.showImage(index);
                const response = await this.axios.get(`${process.env.timelineApiUrl}/fliconn/view_image/${item.id}`);
                if (response.data.status === 'Success') {
                    item.view_count = response.data.data;
                }
            }
        },
        async downloadFile(item) {
            const url = item.src_url;
            const filename = url.split("/").pop();
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank'
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
            }, 100);
            const response = await this.axios.get(`${process.env.timelineApiUrl}/fliconn/view_image/${item.id}`);
            if (response.data.status === 'Success') {
                item.view_count = response.data.data;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .channel-media {
        .media-container {
            position: relative;
            padding-bottom: 80%;
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
            }
        }
        .post-title {
            font-size: 15px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 6px;
            margin-bottom: 0;
        }
        .post-view-count {
            font-size: 13px;
            display: flex;
            align-items: center;
            margin-bottom: 0;
        }
    }
</style>