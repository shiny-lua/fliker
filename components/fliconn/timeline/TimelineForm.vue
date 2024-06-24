<template>
    <div class="timeline-form h-100">
        <form action="" method="post" class="d-flex flex-column h-100 position-relative" @submit.prevent="submit">
            <span class="max-words">{{ detailCharCount }}/{{ max_characters }}</span>
            <div class="post-user mb-2">
                <img :src="auth_user.photo_url" width="40" height="40" alt="" />
                <div class="ml-2">
                    <p class="mb-0 username">{{ auth_user.name }}</p>
                </div>
            </div>
            <div class="detail-box mb-2">
                <picker-area
                    v-model="form.detail"
                    set="apple"
                    :sheetSize="32"
                    :include="['search', 'recent', 'people']"
                    :showCategories="false"
                    placeholder="Ahoy, share something interesting.."
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
                    <div v-if="!group_id" class="visible-to d-inline-block mr-2">
                        <a href="javascript:;" class="visible-selector" @click.prevent="$refs.visibleModal.open()">
                            <span v-if="form.visible_to === 'public'">
                                <fp-icon name="globe" style="color: #28A745;" />
                                &nbsp;Public
                            </span>
                            <span v-if="form.visible_to === 'followers'">
                                <fp-icon name="user-check" style="color: #468FEA;" />
                                &nbsp;Followers
                            </span>
                            <span v-if="form.visible_to === 'mutual_followers'">
                                <fp-icon name="users-check" style="color: #FFC107;" />
                                &nbsp;Mutual Followers
                            </span>
                            <span v-if="form.visible_to === 'custom'">
                                <fp-icon name="privacy_policy" style="color: #DA3544;" />
                                &nbsp;Restricted ({{ form.visible_users.length }})
                            </span>
                        </a>
                        <visible-modal ref="visibleModal"
                            v-model="form.visible_to"
                            :is_form="true"
                            @user-selected="userSelected"
                        />
                    </div>
                    <button type="submit" class="btn fp-btn-gradient px-4" :class="{ 'btn-loading': form.busy }" :disabled="form.busy || !postable">
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
            <h6 class="mb-0 mobile-page-title">Timeline Post</h6>
        </portal>
    </div>
</template>
<script>
    import Form from "vform";
    import Swal from "sweetalert2";
    import PickerArea from "vue-emoji-mart-picker";
    import FileSelector from "~/components/ui/FileSelector.vue";
    import Uploading from "~/components/elements/Uploading.vue";
    import VisibleModal from "./TimelineVisibleModal.vue";
    export default {
        props: ["mode", "id", "group_id"],
        components: {
            PickerArea,
            FileSelector,
            Uploading,
            VisibleModal,
        },
        data() {
            return {
                form: new Form({
                    id: null,
                    detail: "",
                    visible_to: "public",
                    images: [],
                    group_id: this.group_id,
                    visible_users: [],
                }),
                post: null,
                previews: [],
                errors: {},
                showErrors: false,
                max_characters: 2400,
                taggable_users: [],
                show_more_tagged_users: false,
            };
        },
        provide() {
            return {
                duration: '300',
            }
        },
        computed: {
            detailCharCount() {
                let detail = this.form.detail ? this.form.detail.replace(/<[^>]+>/g, " ") : "";
                // let arr = detail.split(' ')
                // return arr.filter(i => i !== '').length
                return detail.length;
            },
            postable() {
                return this.detailCharCount > 0 || this.form.images.length > 0;
            },
            hasVideo() {
                return this.previews.length && !!this.previews.find((i) => i.mime === "video");
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        watch: {
            detailCharCount(value) {
                if (value > this.max_characters) {
                    this.$toast.error(`Enter maximum ${this.max_characters} words or less`);
                }
            },
        },
        mounted() {
            if (this.mode == "edit") {
                this.getDetail();
            }
            // this.getTaggableUsers();
        },
        methods: {
            async getDetail() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_detail`, { id: this.id });
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    this.post = result;
                    this.form.id = result.id;
                    this.form.group_id = result.group_id;
                    this.form.detail = result.detail ? result.detail : "";
                    this.form.visible_to = result.visible_to;
                    if (result.images) {
                        result.images.map((img) => {
                            this.previews.push({ mime: img.mime, src_url: img.src_url });
                        });
                    }
                }
            },
            async getTaggableUsers() {
                const response = await this.axios.get(`${process.env.timelineApiUrl}/fliconn/get_taggable_users`);
                this.taggable_users = response.data.data;
            },
            async submit() {
                if (this._validate() === false) {
                    this.showErrors = true;
                    return false;
                }
                this.errors = {};
                this.showErrors = false;
                if (!!this.$route.query.group_id) this.form.group_id = this.$route.query.group_id;
                try {
                    this.$showLoading();
                    const response = await this.form.post(`${process.env.timelineApiUrl}/fliconn/save`, {
                        onUploadProgress: e => {
                            this.$store.dispatch('setLoadingPercent', Math.ceil(e.loaded * 100 / e.total));
                        }
                    });
                    this.$hideLoading();
                    if (response.data.status == "Success") {
                        this.form.reset();
                        const message = this.mode === 'edit' ? 'Your post has been modified successfully!' : 'Your post has been submitted successfully on timeline!';
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
                if (this.form.visible_to === "custom" && this.form.visible_users.length === 0) {
                    this.errors.visible_to = "Select at least 1 follower or change visibility level.";
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
            userSelected(data) {
                this.form.visible_users = data;
            }
        },
    };
</script>
<style lang="scss" scoped>
    .max-words {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #737791;
    }
    .post-user {
        .username {
            font-size: 16px;
            @media (max-width: 600px) {
                font-size: 14.4px;
            }
        }
    }
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
    .visible-to {
        .visible-selector {
            text-decoration: none;
            svg {
                font-size: 20px;
            }
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
