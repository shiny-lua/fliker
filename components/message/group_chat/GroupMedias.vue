<template>
    <div class="group-medias p-3">
        <div class="row mx-n2">
            <div class="col-12 px-2 mb-2 type-selector">
                <a href="javascript:;" class="media-type" :class="type === '' && 'active'" @click.prevent="selectType('')">All</a>
                <a href="javascript:;" class="media-type" :class="type === 'image' && 'active'" @click.prevent="selectType('image')">Images</a>
                <a href="javascript:;" class="media-type" :class="type === 'video' && 'active'" @click.prevent="selectType('video')">Videos</a>
                <a href="javascript:;" class="media-type" :class="type === 'document' && 'active'" @click.prevent="selectType('document')">Documents</a>
            </div>
            <div v-for="(item, index) in medias" :key="index" class="col-4 px-2 mb-3">
                <div class="media-container">
                    <img v-if="item.thumbnail_url" :src="item.thumbnail_url" alt="" @click="openGallery(item.thumbnail_url)">
                    <img v-else-if="item.mime === 'pdf'" src="~/assets/images/icons/pdf.png" alt="" @click="downloadFile(item)" />
                    <img v-else-if="item.mime === 'word'" src="~/assets/images/icons/word.png" alt="" @click="downloadFile(item)" />
                </div>
                <p v-if="item.file_name && (item.mime === 'pdf' || item.mime === 'word')" class="filename">{{ item.file_name }}</p>
            </div>
        </div>

        <infinite-loading :distance="300" :identifier="infiniteId" @infinite="getMedias">
            <div slot="no-more"></div>
            <div class="text-center text-muted" slot="no-results">Nothing found!</div>
            <div slot="spinner" class="pt-3">
                <img src="~assets/images/logo_loading.gif" width="40" alt="" />
            </div>
        </infinite-loading>

        <light-box ref="groupMediaLightBox" :media="galleryMedia" :show-light-box="false"></light-box>
    </div>
</template>
<script>
import LightBox from "vue-it-bigger";
import("vue-it-bigger/dist/vue-it-bigger.min.css");
export default {
    name: 'GroupMedias',
    props: {
        group: { type: Object, required: true },
    },
    components: {
        LightBox,
    },
    data() {
        return {
            medias: [],
            loading: false,
            type: '',
            infiniteId: +new Date(),
            page: 1,
        }
    },
    computed: {
        galleryMedia() {
            return this.medias.filter(i => ['video', 'image'].includes(i.mime)).map(file => {
                let item = {
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
        async getMedias($state) {
            try {
                let payload = {
                    page: this.page,
                    id: this.group.id,
                    type: this.type,
                }
                const response = await this.axios.post(`${process.env.chatApiUrl}/group/get_medias`, payload);
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
        openGallery(thumbnail_url) {
            const index = this.galleryMedia.findIndex(i => i.thumb === thumbnail_url);
            if (index !== -1) {
                this.$refs.groupMediaLightBox.showImage(index);
            }
        },
        selectType(type) {
            this.type = type;
            this.medias = [];
            this.page = 1;
            this.infiniteId++;
        },
        downloadFile(item) {
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .group-medias {
        height: 350px;
        overflow-y: auto;
        .media-container {
            position: relative;
            padding-bottom: 100%;
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
        .filename {
            margin-top: 2px;
            margin-bottom: 0;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .type-selector {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: -8px;
        .media-type {
            color: inherit;
            border: solid 1px #FF22A1;
            border-radius: 6px;
            font-size: 13.6px;
            font-weight: 400;
            padding: 0 10px;
            text-decoration: none;
            &.active {
                color: #FFF;
                background-color: #FF22A1;
            }
        }
    }
</style>