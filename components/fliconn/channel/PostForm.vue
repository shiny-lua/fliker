<template>
    <div class="channel-post-form">
        <form action="" method="post" class="d-flex flex-column h-100 position-relative" @submit.prevent="submit">
            <div class="form-group">
                <input v-model="form.title" type="text" class="form-control" maxlength="100" required placeholder="Post title" />
            </div>
            <div class="detail-box mb-2">
                <picker-area
                    v-model="form.detail"
                    set="apple"
                    :sheetSize="32"
                    :include="['search', 'recent', 'people']"
                    :showCategories="false"
                    placeholder="Share interesting content..."
                    :backgroundImageFn="(set, sheetSize) => require('@/assets/images/icons/emoji-sheet.png')"
                />
                <div class="d-flex align-items-center">
                    <span v-if="showErrors && errors.detail" class="text-danger">{{ errors.detail }}</span>
                </div>
            </div>
            <div v-if="showErrors" class="d-flex align-items-center mb-2">
                <span v-if="errors.images" class="text-danger">{{ errors.images }}</span>
                <span v-if="errors.visible_to && form.visible_to === 'custom'" class="text-danger ml-auto">{{ errors.visible_to }}</span>
            </div>
            <div class="w-100" v-if="previews.length">
                <div class="preview-files nice-scrollbar mb-2">
                    <div v-for="(item, index) in previews" :key="index" class="preview-item">
                        <div class="image-container fp-border-color-1 mb-0">
                            <a href="javascript:;" class="btn-remove-image btn-sm" @click="removePreviewItem(index)">
                                <fp-icon name="trash" />
                            </a>
                            <fp-icon v-if="item.unsupport" name="flicks" class="fp-text-color-main" style="font-size: 80px;" />
                            <video v-else-if="item.mime === 'video'" :src="item.src_url" width="100%" height="100%">
                                <source :src="item.src_url" type="video/mp4" />
                                <source :src="item.src_url" type="video/ogg" />
                            </video>
                            <audio v-else-if="item.mime === 'audio'" :src="item.src_url" controls>
                                <source :src="item.src_url" type="audio/ogg">
                                <source :src="item.src_url" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                            <img v-else-if="item.mime === 'image'" :src="item.src_url" alt="" width="100%" height="100%" />
                            <img v-else-if="item.mime === 'word'" src="~/assets/images/icons/word.png" alt="" width="90%" height="90%" />
                            <img v-else-if="item.mime === 'pdf'" src="~/assets/images/icons/pdf.png" alt="" width="90%" height="90%" />
                            <fp-icon v-else-if="item.mime === 'text'" name="text-format" class="fp-text-color-main" style="font-size: 80px;" />
                            <!-- <img v-else-if="item.mime === 'audio'" src="~/assets/images/icons/audio.png" alt="" width="90%" height="90%" /> -->
                            <img v-else :src="item.src_url" alt="" width="100%" height="100%" />
                        </div>
                        <p v-if="item.name" class="filename">{{item.name}}</p>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center mt-auto">
                <div>
                    <a href="javascript:;" class="btn-add add-image" @click.prevent="openFileSelector('image')">
                        <fp-icon name="add-image" />
                    </a>
                    <label class="btn-add ml-3 mb-0 d-lg-none add-video">
                        <fp-icon name="add-video" />
                        <input type="file" hidden accept="video/*" @change="handleVideoFile" />
                    </label>
                    <a href="javascript:;" class="btn-add add-video d-none d-lg-inline ml-3" @click.prevent="openFileSelector('video')">
                        <fp-icon name="add-video" />
                    </a>
                    <label class="btn-add ml-3 cursor-pointer mb-0 add-attachment">
                        <fp-icon name="attachment" />
                        <input type="file"
                             hidden
                             accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain,audio/*"
                             @change="handleOtherFiles"
                        />
                    </label>
                </div>
                <div class="ml-auto">
                    <span class="max-words fp-text-color-main mr-3">{{ detailCharCount }}/{{ max_characters }}</span>
                    <button type="submit" class="btn fp-btn-gradient px-4" :class="{ 'btn-loading': form.busy }" :disabled="form.busy">
                        Post
                    </button>
                </div>
            </div>
        </form>
        <file-selector ref="fileSelector"
             @selected="fileSelected"
        />
        <uploading
            v-if="previews.length && !hasVideo"
            :progress="form.progress ? form.progress.percentage : 0"
            :success="form.successful"
        ></uploading>
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">Channel Post</h6>
        </portal>
    </div>
</template>
<script>
    import Form from "vform";
    import FileSelector from "~/components/ui/FileSelector.vue";
    import Uploading from "~/components/elements/Uploading.vue";
    import PickerArea from "vue-emoji-mart-picker";
    import Swal from "sweetalert2";
    export default {
        name: 'ChannelPostForm',
        props: {
            mode: { type: String, default: 'add' },
            id: { type: [String, Number], required: false },
            channel_id: { type: [String, Number], required: false },
        },
        components: {
            FileSelector,
            Uploading,
            PickerArea,
        },
        data() {
            return {
                form: new Form({
                    id: null,
                    title: '',
                    detail: '',
                    images: [],
                    channel_id: this.channel_id,
                }),
                previews: [],
                errors: {},
                showErrors: false,
                max_characters: 10000,
            }
        },
        computed: {
            auth_user() {
                return this.$store.getters['auth/user'];
            },
            hasVideo() {
                return this.previews.length && !!this.previews.find((i) => i.mime === "video");
            },
            detailCharCount() {
                let detail = this.form.detail ? this.form.detail.replace(/<[^>]+>/g, " ") : "";
                return detail.length;
            },
        },
        mounted() {
            if (this.mode == "edit") {
                this.getDetail();
            }
        },
        methods: {
            async getDetail() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/channel/get_post_detail`, {post_id: this.id});
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    this.post = result;
                    this.form.id = result.id;
                    this.form.title = result.title;
                    this.form.channel_id = result.channel_id;
                    this.form.detail = result.detail ? result.detail : "";
                    if (result.images) {
                        result.images.map((img) => {
                            this.previews.push({ mime: img.mime, src_url: img.src_url });
                        });
                    }
                }
            },
            async submit() {
                if (this._validate() === false) {
                    this.showErrors = true;
                    return false;
                }
                this.errors = {};
                this.showErrors = false;
                try {
                    this.$showLoading();
                    const response = await this.form.post(`${process.env.timelineApiUrl}/channel/save_post`, {
                        onUploadProgress: e => {
                            this.$store.dispatch('setLoadingPercent', Math.ceil(e.loaded * 100 / e.total));
                        }
                    });
                    this.$hideLoading();
                    if (response.data.status == "Success") {
                        this.form.reset();
                        const message = this.mode === 'edit' ? 'Your post has been modified successfully!' : 'Your post has been submitted successfully on channel!';
                        this.$fpSuccess(message);
                        this.$router.back();
                    }
                } catch (error) {
                    this.$hideLoading();
                }
            },
            _validate() {
                if (this.detailCharCount > this.max_characters) {
                    this.errors.detail = `Enter maximum ${this.max_characters} words or less`;
                    return false;
                }
                if (this.form.images.length > 10) {
                    this.errors.images = "You can upload max 10 images or videos.";
                    return false;
                }
                return true;
            },
            removePreviewItem(index) {
                let item = this.previews[index];
                if (item.src_url.startsWith("http") && this.post.images && this.post.images[index]) {
                    Swal.fire({
                        title: "Are you sure?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Cancel",
                    }).then((willDelete) => {
                        if (willDelete.isConfirmed) {
                            this.axios
                                .delete(`${process.env.timelineApiUrl}/fliconn/image/delete/${this.post.images[index].id}`)
                                .then((response) => {
                                    if (response.data.status == "Success") {
                                        this.$toast.success("Deleted successfully");
                                        this.previews.splice(index, 1);
                                        this.post.images.splice(index, 1);
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        }
                    });
                } else {
                    this.previews.splice(index, 1);
                    let imageArray = Array.from(this.form.images);
                    imageArray.splice(index, 1);
                    this.form.images = imageArray;
                }
            },
            checkVideo(data) {
                return data.includes("video") || data.includes(".mp4") || data.includes(".3gp");
            },
            openFileSelector(type) {
                this.$refs.fileSelector.open(type);
            },
            fileSelected(payload) {
                if (this.form.images.length + payload.files.length > 30) {
                    this.$toast.error("You can upload max 30 images images, videos or documents.");
                    return;
                }
                this.form.images.push(...payload.files);
                this.previews.push(...payload.previews);
            },
            handleImageFiles(event) {
                let files = event.target.files;
                if (files.length > 10) {
                    this.$toast.error("You can upload max 10 images images or videos.");
                    return false;
                }
                this.pushFiles(files, "image");
            },
            handleVideoFile(event) {
                let files = event.target.files;

                var videoTag = document.createElement("video");
                videoTag.preload = "metadata";
                videoTag.src = URL.createObjectURL(files[0]);
                videoTag.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(videoTag.src);
                    let duration = videoTag.duration;
                    if (!isNaN(duration) && duration > 3600) {
                        this.$toast.error("Duration of video clips should be maximum 60 mins!");
                    } else {
                        this.pushFiles(files, "video");
                    }
                };
            },
            handleOtherFiles(event) {
                const file = event.target.files[0];
                if (!file) return false;
                if (file.size > 50000000) {
                    this.$toast.error(`File ${file.name} exceeds 50MB.`);
                    return false;
                } else {
                    let mime = 'other';
                    if (file.type === 'text/plain') {
                        mime = 'text';
                    } else if (file.type === 'application/pdf') {
                        mime = 'pdf';
                    } else if (file.type.includes('word')) {
                        mime = 'word';
                    } else if (file.type.includes('audio')) {
                        mime = 'audio';
                    }
                    this.pushFiles([file], mime);
                }
            },
            pushFiles(files, type) {
                this.form.images = files;
                this.previews = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.previews.push({
                                mime: type,
                                src_url: e.target.result,
                                name: file.name,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .detail-box {
        flex-grow: 1;
        min-height: 130px;
        &::v-deep {
            .emojipicker {
                height: 100%;
                .emojipicker-area {
                    max-height: unset;
                    border-radius: 8px;
                    &:empty:before {
                        color: #64748B;
                    }
                }
            }
        }
    }
    .post_as {
        div {
            text-align: center;
            padding: 0 7px;
            cursor: pointer;
            border: solid 1px transparent;
            border-radius: 10px;
            &.active {
                border-color: #004080;
            }
        }
    }
    .preview-files {
        display: flex;
        max-width: 100%;
        overflow-x: auto;
        .image-container {
            position: relative;
            border-style: solid;
            border-width: 1px;
            border-radius: 10px;
            overflow: hidden;
            width: 120px;
            height: 120px;
            margin-right: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            img, video {
                object-fit: contain;
            }
        }
        .filename {
            max-width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 0;
            text-align: center;
            font-size: 13px;
        }
    }
    .btn-add {
        font-size: 22px;
        &.add-image {
            color: #468FEA;
        }
        &.add-video {
            color: #F17E3D;
        }
        &.add-attachment {
            color: #FF7272;
        }
    }
</style>