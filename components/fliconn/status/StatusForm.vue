<template>
    <div class="status-form position-relative">
        <h5 v-if="form.type === 'text'" class="text-center mb-0 d-none d-md-block">Create a Text Story</h5>
        <h5 v-else-if="form.type === 'image'" class="text-center mb-0 d-none d-md-block">Create a Image Story</h5>
        <h5 v-else-if="form.type === 'video'" class="text-center mb-0 d-none d-md-block">Create a Video Story</h5>
        <h5 v-else class="text-center mb-0 d-none d-md-block">Create a Story</h5>
        <hr class="my-3"/>
        <div>
            <a v-if="form.type" href="javascript:;" class="fp-text-active btn-back d-none d-md-block" @click="init()"><fa icon="arrow-left" /> Back</a>
            <div v-if="form.type === ''" class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="card-group">
                        <div class="status-type-item text" @click="form.type = 'text'">
                            <p class="type text-center">Text</p>
                            <fp-icon name="text-format" />
                            <p class="description">
                                Create a text story
                            </p>
                        </div>
                        <label class="status-type-item image">
                            <p class="type text-center">Images</p>
                            <fp-icon name="image-gallery" />
                            <input type="file" multiple hidden @change="handleFile($event, 'image')" accept="image/*" />
                            <p class="description">
                                Create an image story
                            </p>
                        </label>
                        <label class="status-type-item video">
                            <p class="type text-center">Flicks</p>
                            <fp-icon name="flicks" />
                            <input type="file" hidden @change="handleFile($event, 'video')" accept="video/*" />
                            <p class="description">
                                Create a short clips story
                            </p>
                        </label>
                    </div>
                    <p class="agree-terms-pricvacy font-weight-500 mb-0 mt-3 text-center">
                        By posting a Status Story, I agree to the
                        <a href="/learn/terms_of_use" class="fp-text-color-main" target="_blank">Terms of Use</a>
                        and read
                        <a href="/learn/privacy_policies" class="fp-text-color-main" target="_blank">Privacy Policy</a>
                        statement.
                    </p>
                </div>
            </div>
            <div v-if="form.type === 'text'" class="form-text-status d-md-flex">
                <div v-if="form.text_slides.length" class="status-slides d-none d-md-block nice-scrollbar">
                    <div v-for="(item, index) in form.text_slides"
                        :key="index"
                        class="status-slide-item"
                        :style="{
                            fontFamily: item.font ? item.font : 'unset',
                            background: item.bgImage
                                ? `url('https://timeline.flickerpage.com/assets/images/${item.bgImage}')`
                                : item.color,
                        }"
                        @click="openTextSlideInPreview(index)"
                    >
                        <p class="mb-0">{{ item.text }}</p>
                    </div>
                </div>
                <div class="status-item-container" :class="form.text_slides.length && 'pl-md-2'">
                    <form @submit.prevent="addTextSlide">
                        <label class="text-status-input"
                             :style="{
                                background: text_status_form.bgImage
                                 ? `url('https://timeline.flickerpage.com/assets/images/${text_status_form.bgImage}')`
                                 : text_status_form.color,
                             }"
                        >
                            <textarea
                                v-model="text_status_form.text"
                                placeholder="Type here..."
                                @input="resizeTextarea"
                                required
                                :style="{
                                    height: text_status_form_input_height,
                                    fontSize: text_status_form_font_size,
                                    color: text_status_form_words_count > 50 && text_status_form.color != '#DC3545' ? '#DC3545' : '#FFF',
                                    fontFamily: text_status_form.font,
                                }"
                            ></textarea>
                            <!-- <span class="text-light words-count">{{ text_status_form_words_count }} / 50</span> -->
                            <div class="text-status-actions">
                                <button type="submit" class="add-status ml-2">
                                    <div class="circle">
                                        <fp-icon name="plus" class="fp-fs-20 text-white" />
                                    </div>
                                </button>
                            </div>
                        </label>
                    </form>
                    <div class="d-flex align-items-center">
                        <div class="d-flex align-items-center">
                            <a href="javascript:;" class="btn-select-bg-image" @click.prevent="changeTextStatusBg()">
                                <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.75" y="0.75" width="42.5" height="42.5" rx="4.25" stroke="#28A745" stroke-width="1.5"/>
                                    <path d="M32 22C32 26.714 32 29.0711 30.5355 30.5355C29.0711 32 26.714 32 22 32C17.286 32 14.9289 32 13.4645 30.5355C12 29.0711 12 26.714 12 22C12 17.286 12 14.9289 13.4645 13.4645C14.9289 12 17.286 12 22 12" stroke="#28A745" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M12 22.5001L13.7516 20.9675C14.6629 20.1702 16.0363 20.2159 16.8925 21.0721L21.1822 25.3618C21.8694 26.0491 22.9512 26.1428 23.7464 25.5839L24.0446 25.3744C25.1888 24.5702 26.7369 24.6634 27.7765 25.599L31 28.5001" stroke="#28A745" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M28.562 12.9354L28.9791 12.5183C29.6702 11.8272 30.7906 11.8272 31.4817 12.5183C32.1728 13.2094 32.1728 14.3298 31.4817 15.0209L31.0646 15.438M28.562 12.9354C28.562 12.9354 28.6142 13.8217 29.3962 14.6038C30.1783 15.3858 31.0646 15.438 31.0646 15.438M28.562 12.9354L24.7275 16.77C24.4677 17.0297 24.3379 17.1595 24.2262 17.3027C24.0945 17.4716 23.9815 17.6544 23.8894 17.8478C23.8112 18.0117 23.7532 18.1859 23.637 18.5344L23.2651 19.65M31.0646 15.438L27.23 19.2725C26.9703 19.5323 26.8405 19.6621 26.6973 19.7738C26.5284 19.9055 26.3456 20.0185 26.1522 20.1106C25.9883 20.1888 25.8141 20.2468 25.4656 20.363L24.35 20.7349M24.35 20.7349L23.6281 20.9755C23.4567 21.0327 23.2676 20.988 23.1398 20.8602C23.012 20.7324 22.9673 20.5433 23.0245 20.3719L23.2651 19.65M24.35 20.7349L23.2651 19.65" stroke="#28A745" stroke-width="1.5"/>
                                </svg>
                            </a>
                            <a href="javascript:;" class="btn-select-font ml-2" @click.prevent="changeTextStatusFont()">
                                <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.75" y="0.75" width="42.5" height="42.5" rx="4.25" stroke="#28A745" stroke-width="1.5"/>
                                    <path d="M17.2227 17.3369L12.9863 29H11.2549L16.1328 16.2031H17.249L17.2227 17.3369ZM20.7734 29L16.5283 17.3369L16.502 16.2031H17.6182L22.5137 29H20.7734ZM20.5537 24.2627V25.6514H13.3643V24.2627H20.5537ZM29.5889 27.374V22.4785C29.5889 22.1035 29.5127 21.7783 29.3604 21.5029C29.2139 21.2217 28.9912 21.0049 28.6924 20.8525C28.3936 20.7002 28.0244 20.624 27.585 20.624C27.1748 20.624 26.8145 20.6943 26.5039 20.835C26.1992 20.9756 25.959 21.1602 25.7832 21.3887C25.6133 21.6172 25.5283 21.8633 25.5283 22.127H23.9023C23.9023 21.7871 23.9902 21.4502 24.166 21.1162C24.3418 20.7822 24.5938 20.4805 24.9219 20.2109C25.2559 19.9355 25.6543 19.7188 26.1172 19.5605C26.5859 19.3965 27.1074 19.3145 27.6816 19.3145C28.373 19.3145 28.9824 19.4316 29.5098 19.666C30.043 19.9004 30.459 20.2549 30.7578 20.7295C31.0625 21.1982 31.2148 21.7871 31.2148 22.4961V26.9258C31.2148 27.2422 31.2412 27.5791 31.2939 27.9365C31.3525 28.2939 31.4375 28.6016 31.5488 28.8594V29H29.8525C29.7705 28.8125 29.7061 28.5635 29.6592 28.2529C29.6123 27.9365 29.5889 27.6436 29.5889 27.374ZM29.8701 23.2344L29.8877 24.377H28.2441C27.7812 24.377 27.3682 24.415 27.0049 24.4912C26.6416 24.5615 26.3369 24.6699 26.0908 24.8164C25.8447 24.9629 25.6572 25.1475 25.5283 25.3701C25.3994 25.5869 25.335 25.8418 25.335 26.1348C25.335 26.4336 25.4023 26.7061 25.5371 26.9521C25.6719 27.1982 25.874 27.3945 26.1436 27.541C26.4189 27.6816 26.7559 27.752 27.1543 27.752C27.6523 27.752 28.0918 27.6465 28.4727 27.4355C28.8535 27.2246 29.1553 26.9668 29.3779 26.6621C29.6064 26.3574 29.7295 26.0615 29.7471 25.7744L30.4414 26.5566C30.4004 26.8027 30.2891 27.0752 30.1074 27.374C29.9258 27.6729 29.6826 27.96 29.3779 28.2354C29.0791 28.5049 28.7217 28.7305 28.3057 28.9121C27.8955 29.0879 27.4326 29.1758 26.917 29.1758C26.2725 29.1758 25.707 29.0498 25.2207 28.7979C24.7402 28.5459 24.3652 28.209 24.0957 27.7871C23.832 27.3594 23.7002 26.8818 23.7002 26.3545C23.7002 25.8447 23.7998 25.3965 23.999 25.0098C24.1982 24.6172 24.4854 24.292 24.8604 24.0342C25.2354 23.7705 25.6865 23.5713 26.2139 23.4365C26.7412 23.3018 27.3301 23.2344 27.9805 23.2344H29.8701Z" fill="#28A745"/>
                                </svg>
                            </a>
                            <color-picker v-model="text_status_form.color"
                                    class="ml-2"
                                    @input="text_status_form.bgImage = ''"
                            />
                        </div>
                        <div class="ml-auto">
                            <button v-if="form.text_slides.length" type="button" class="btn fp-btn-outline mr-2" @click="openPreview()">
                                Preview
                            </button>
                            <button type="button" class="btn fp-btn-gradient px-4" :class="{ 'btn-loading': form.busy }" :disabled="form.busy" @click="save()">
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="form.type" class="d-md-flex">
                <div v-if="form.type === 'image' && preview_files.length" class="image-lists nice-scrollbar">
                    <div class="file-wrapper position-relative" v-for="(item, index) in preview_files" :key="index">
                        <a href="javascript:;" class="btn-remove-image btn-sm" @click="removeFile(index)"><fp-icon name="trash" /></a>
                        <img v-if="form.type === 'image'" :src="item" alt="" width="100%" height="100%" />
                    </div>
                </div>
                <div v-if="form.type === 'video' && preview_files.length" class="video-container">
                    <video :src="preview_files[0]"
                        alt=""
                        autoplay
                        controls
                    ></video>
                </div>
                <div class="flex-grow-1 ml-md-3">
                    <div class="mb-3">
                        <label class="mb-1">#Tag People</label>
                        <search-users v-model="form.tagged_users"
                             :url="taggableSearchUrl"
                             placeholder="Search name or @username"
                             @selected="changeTaggedUserNames"
                        >
                            <template #image>
                                <fp-icon name="user-tag" class="fp-fs-24" />
                            </template>
                        </search-users>
                    </div>
                    <div class="mb-3">
                        <div class="position-relative">
                            <textarea rows="6" class="form-control" maxlength="150" placeholder="#Tag a short note..." v-model="form.title"></textarea>
                            <span class="text-muted position-absolute" style="bottom: 6px;right: 10px;">{{form.title.length}}/150</span>
                        </div>
                        <has-error :form="form" field="title" />
                    </div>
                    <div class="text-center">
                        <button v-if="form.files.length" type="button" class="btn fp-btn-outline mr-2" @click="openPreview()">
                            Preview
                        </button>
                        <button type="button" class="btn fp-btn-gradient px-4" :class="{ 'btn-loading': form.busy }" :disabled="form.busy" @click="save()">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <text-status-preview ref="textStatusPreview"
             v-if="form.type === 'text' && openPreviewTextSlides"
             :slides="form.text_slides"
             @close="closeTextPreview"
             @remove="removeTextSlide"
        ></text-status-preview>
        <image-status-preview ref="imageStatusPreview"
             v-if="form.type === 'image' && openImagePreview"
             :images="preview_files"
             :title="form.title"
             :tagged_users="taggedUserNames"
             @close="closeImagePreview"
             @remove="removeImageSlide"
        ></image-status-preview>
        <video-status-preview ref="videoStatusPreview"
             v-if="form.type === 'video' && openVideoPreview"
             :files="preview_files"
             :title="form.title"
             :tagged_users="taggedUserNames"
             @close="closeVideoPreview"
             @remove="removeVideo"
        ></video-status-preview>
        <uploading v-if="form.type === 'image'"
             ref="uploading"
             :progress="form.progress ? form.progress.percentage : 0"
             :success="form.successful"
        ></uploading>
        <portal to="mobile-page-title">
            <h6 v-if="form.type === 'text'" class="mb-0 mobile-page-title">Create a Text Story</h6>
            <h6 v-else-if="form.type === 'image'" class="mb-0 mobile-page-title">Create a Image Story</h6>
            <h6 v-else-if="form.type === 'video'" class="mb-0 mobile-page-title">Create a Video Story</h6>
            <h6 v-else class="mb-0 mobile-page-title">Create a Story</h6>
        </portal>
    </div>
</template>
<script>
    import Form from "vform";
    import ColorPicker from "../../ui/ColorPicker.vue";
    import SearchUsers from "../../ui/SearchUsers.vue";
    import TextStatusPreview from "./TextStatusPreview.vue";
    import ImageStatusPreview from "./ImageStatusPreview.vue";
    import VideoStatusPreview from "./VideoStatusPreview.vue";
    import Uploading from "~/components/elements/Uploading.vue";
    import FpModal from "../../ui/Modal.vue";
    export default {
        name: "StatusForm",
        components: {
            ColorPicker,
            TextStatusPreview,
            ImageStatusPreview,
            VideoStatusPreview,
            Uploading,
            SearchUsers,
            FpModal,
        },
        data() {
            return {
                form: new Form({
                    id: "",
                    type: "",
                    title: "",
                    tagged_users: [],
                    text_slides: [],
                    files: [],
                }),
                text_status_form: {
                    text: "",
                    color: "",
                    font: "'Anton', sans-serif",
                    bgImage: "status_bg_1.jpg",
                },
                taggedUserNames: [],
                preview_files: [],
                default_color: "#DC3545",
                openPreviewTextSlides: false,
                openImagePreview: false,
                openVideoPreview: false,
                text_status_form_font_size: "14.4px",
                text_status_form_input_height: "24px",
                fonts: [
                    "'Bebas Neue', sans-serif",
                    "'Henny Penny', cursive",
                    "'Black Ops One', cursive",
                    "'Bungee Shade', cursive",
                    "'UnifrakturMaguntia', cursive",
                    "'Qwitcher Grypen', cursive",
                    "'Tilt Prism', cursive",
                    "'Tulpen One', cursive",
                    "'Sedgwick Ave Display', cursive",
                    "'Dancing Script', cursive",
                    "'Rubik Iso', cursive",
                    "'Anton', sans-serif",
                    "'Pacifico', cursive",
                    "'Gluten', cursive",
                    "'Press Start 2P', cursive",
                ],
                text_status_bg_images: [
                    'status_bg_1.jpg',
                    'status_bg_2.jpg',
                    'status_bg_3.jpg',
                    'status_bg_4.jpg',
                ],
            };
        },
        computed: {
            text_status_form_words_count() {
                return this.$wordsCount(this.text_status_form.text);
            },
            modalTitle() {
                switch (this.form.type) {
                    case 'image':
                        return 'Create an Image Story';
                        break;
                    case 'video':
                        return 'Create a Video Story';
                        break;
                    case 'text':
                        return 'Create a Text Story';
                        break;
                    default:
                        return 'Create a Story';
                        break;
                }
            },
            taggableSearchUrl() {
                return `${process.env.timelineApiUrl}/fliconn/get_taggable_users`;
            }
        },
        watch: {
            text_status_form_words_count(value) {
                if (value <= 15) {
                    this.text_status_form_font_size = "16px";
                } else if (value > 15 && value < 30) {
                    this.text_status_form_font_size = "14.4px";
                } else {
                    this.text_status_form_font_size = "13px";
                }
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.form.reset();
                this.preview_files = [];
            },
            addTextSlide() {
                if (this.text_status_form_words_count > 50) {
                    this.$toast.error("Enter maximum 50 words or less.");
                    return false;
                }
                this.form.text_slides.push(this.text_status_form);
                this.text_status_form = {
                    text: "",
                    color: '',
                    font: "'Bebas Neue', sans-serif",
                    bgImage: "status_bg_1.jpg",
                };
            },
            changeTextStatusFont() {
                const index = this.fonts.findIndex(f => f === this.text_status_form.font);
                let nextIndex = 0;
                if (index !== -1 && index < this.fonts.length - 1) {
                    nextIndex = index + 1;
                }
                this.text_status_form.font = this.fonts[nextIndex];
            },
            changeTextStatusBg() {
                const index = this.text_status_bg_images.findIndex(f => f === this.text_status_form.bgImage);
                let nextIndex = 0;
                if (index !== -1 && index < this.text_status_bg_images.length - 1) {
                    nextIndex = index + 1;
                }
                this.text_status_form.bgImage = this.text_status_bg_images[nextIndex];
            },
            async removeTextSlide(index) {
                this.openPreviewTextSlides = false;
                await this.$nextTick();
                this.form.text_slides.splice(index, 1);
                await this.$nextTick();
                this.openPreviewTextSlides = true;
            },
            async removeImageSlide(index) {
                this.openImagePreview = false;
                await this.$nextTick();
                this.removeFile(index);
                await this.$nextTick();
                this.openImagePreview = true;
            },
            async removeVideo() {
                this.openVideoPreview = false;
                this.removeFile(0);
            },
            resizeTextarea(event) {
                let element = event.target;
                if (element.value == '') {
                    this.text_status_form_input_height = "24px";
                } else {
                    this.text_status_form_input_height = element.scrollHeight + "px";
                }
            },
            async handleFile(event, type) {
                let files = event.target.files;
                if (files.length > 10) {
                    this.$toast.error("You can upload max 10 images");
                    return false;
                }
                this.form.type = type;

                if (type === "video") {
                    var videoTag = document.createElement("video");
                    videoTag.preload = "metadata";
                    videoTag.src = URL.createObjectURL(files[0]);
                    videoTag.onloadedmetadata = () => {
                        window.URL.revokeObjectURL(videoTag.src);
                        let duration = videoTag.duration;
                        if (!isNaN(duration) && duration > 180) {
                            this.$toast.error("Duration of video clips should be maximum 3 mins!");
                        } else {
                            this.pushFiles(files, "video");
                        }
                    };
                } else if (type === "image") {
                    this.pushFiles(files);
                }
            },
            pushFiles(files) {
                let fileArray = Array.from(this.form.files);

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.preview_files.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                    fileArray.push(file);
                }
                this.form.files = fileArray;
            },
            removeFile(index) {
                this.preview_files.splice(index, 1);
                let imageArray = Array.from(this.form.files);
                imageArray.splice(index, 1);
                this.form.files = imageArray;
                if (this.form.files.length === 0) {
                    this.form.type = "";
                }
            },
            save() {
                if (this.form.type === "text" && this.form.text_slides.length === 0) {
                    if (this.text_status_form.text.trim()) {
                        this.addTextSlide();
                    } else {
                        this.$toast.error("You must add at least 1 status card!");
                        return false;
                    }
                }
                if (this.form.text_slides.length > 10) {
                    this.$toast.error("You must add less than 10 status card!");
                    return false;
                }
                this.$showLoading();
                this.form
                    .post(`${process.env.timelineApiUrl}/status/save`, {
                        onUploadProgress: e => {
                            this.$store.dispatch('setLoadingPercent', Math.ceil(e.loaded * 100 / e.total));
                        }
                    })
                    .then((response) => {
                        this.$hideLoading();
                        if (response.data.status === "Success") {
                            this.$fpSuccess("Your status has been submitted successfully!");
                            this.preview_files = [];
                            this.form.reset();
                            this.$router.push({name: 'index', query: {tab: 'timeline'}});
                        }
                    })
                    .catch(() => {
                        this.$hideLoading();
                        this.$refs.uploading.close();
                        this.$toast.error("Sorry, something went wrong. Try again adding to timeline");
                    });
            },
            openPreview() {
                if (this.form.type === 'text') this.openPreviewTextSlides = true;
                if (this.form.type === 'image') this.openImagePreview = true;
                if (this.form.type === 'video') this.openVideoPreview = true;
            },
            async openTextSlideInPreview(index) {
                this.openPreviewTextSlides = true;
                await this.$nextTick();
                this.$refs.textStatusPreview.select(index);
            },
            closeTextPreview(index) {
                this.openPreviewTextSlides = false;
                if (index !== undefined) {
                    this.form.text_slides.splice(index, 1);
                }
            },
            closeImagePreview(index) {
                this.openImagePreview = false;
                if (index !== undefined) {
                    this.removeFile(index);
                }
            },
            closeVideoPreview(index) {
                this.openVideoPreview = false;
            },
            changeTaggedUserNames(data) {
                this.taggedUserNames = data;
            }
        },
    };
</script>
<style lang="scss" scoped>
    .card-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        @media (max-width: 420px) {
            flex-direction: column;
            gap: .5em;
        }
    }
    .status-type-item {
        cursor: pointer;
        border-radius: 10px;
        color: #FFF;
        width: 32%;
        height: 260px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        @media (max-width: 420px) {
            width: 100%;
            height: 150px;
        }
        &.text {
            background-color: #e8540f;
        }
        &.image {
            background-color: #22b14c;
        }
        &.video {
            background-color: #00a2e8;
        }
        svg {
            color: #FFF;
            font-size: 48px;
            margin-bottom: 12px;
        }
        .type {
            font-size: 16px;
            margin-bottom: 16px;
            @media (max-width: 600px) {
                font-size: 14.4px;
                margin-bottom: 10px;
            }
        }
        .description {
            font-size: 14.4px;
            line-height: 15px;
            text-align: center;
            margin-bottom: 0;
            @media (max-width: 600px) {
                font-size: 13px;
            }
        }
    }
    .form-text-status {
        .status-slides {
            width: 110px;
            min-width: 110px;
            margin-right: 8px;
            max-height: 320px;
            overflow: auto;
            @media (max-width: 600px) {
                width: 100%;
                margin-right: 0;
            }
            .status-slide-item {
                border-radius: 10px;
                overflow: hidden;
                height: 130px;
                margin-bottom: 12px;
                color: #fff;
                padding: 10px;
                line-height: 15px;
                font-size: 13px;
                cursor: pointer;
                background-size: cover !important;
                background-repeat: no-repeat !important;
                @media (max-width: 600px) {
                    width: 100px;
                    min-width: 100px;
                    margin-right: 10px;
                }
                p {
                    max-height: 100%;
                    overflow: hidden;
                }
            }
        }
        .status-item-container {
            flex-grow: 1;
            .text-status-input {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 269px;
                border-radius: 10px;
                position: relative;
                margin-bottom: 15px;
                flex-direction: column;
                background-size: 100% !important;
                background-repeat: no-repeat !important;
                .text-status-actions {
                    position: absolute;
                    bottom: 11px;
                    right: 6px;
                    display: flex;
                    align-items: center;
                }
                .words-count {
                    position: absolute;
                    bottom: 6px;
                    right: 40px;
                }
                textarea {
                    text-align: center;
                    width: 100%;
                    max-height: calc(100% - 12px);
                    border: none;
                    border-radius: 10px;
                    overflow: hidden;
                    resize: none;
                    background-color: transparent;
                    color: #fff;
                    line-height: 1.3;
                    padding-left: 8px;
                    padding-right: 8px;
                    &::placeholder {
                        color: #fff;
                    }
                    &:focus {
                        outline: none;
                        border: none;
                    }
                }
                .add-status {
                    background: transparent;
                    border: none;
                    outline: none;
                    .circle {
                        width: 28px;
                        height: 28px;
                        margin-bottom: 0;
                        &::before {
                            border-width: 2px;
                            border-color: #FFF;
                        }
                    }
                }
            }
        }
    }
    .btn-close-modal {
        position: absolute;
        top: 4px;
        right: 8px;
        text-decoration: none;
    }
    .btn-back {
        position: absolute;
        top: 4px;
        left: 0px;
        font-size: 14px;
    }
    .agree-terms-pricvacy {
        font-size: 13.6px;
        font-weight: 400;
        color: #64748B;
    }
    .btn {
        @media (max-width: 600px) {
            font-size: 14.4px;
        }
    }
    .image-lists {
        max-height: 320px;
        overflow-y: auto;
        @media (min-width: 601px) {
            min-width: 100px;
        }
        @media (max-width: 600px) {
            display: flex;
        }
    }
    .video-container {
        @media (min-width: 601px) {
            width: 150px;
            min-width: 150px;
        }
        video {
            width: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
    }
    .file-wrapper {
        width: 100px;
        min-width: 100px;
        margin-bottom: 8px;
        @media (max-width: 600px) {
            width: 107px;
            margin-right: 8px;
        }
        img,
        video {
            width: 100%;
            object-fit: cover;
            border-radius: 6px;
        }
    }
    hr {
        background-color: #ECF1F6;
    }
    [data-theme=dark] {
        hr {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
</style>
