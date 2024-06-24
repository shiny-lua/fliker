<template>
    <div class="clips-form d-lg-flex">
        <div class="card-video-source mb-3 mb-md-0">
            <div v-if="previewData" class="video-wrapper border">
                <a href="javascript:;" class="btn-remove" @click.prevent="removeVideo">
                    <fa :icon="['far', 'trash-alt']" />
                </a>
                <video :src="previewData.src_url" controls autoplay width="100%" height="100%"></video>
            </div>
            <div v-else
                 class="btn-add-video"
                 :class="showErrors && form.file === null && 'border-danger'"
                 @click="$refs.fileSelector.open('video')"
            >
                <svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.25 11.8752L22.0729 11.4638C24.5053 10.2476 25.7215 9.6395 26.6107 10.1891C27.5 10.7387 27.5 12.0984 27.5 14.8179V15.1826C27.5 17.9021 27.5 19.2618 26.6107 19.8114C25.7215 20.361 24.5053 19.7529 22.0729 18.5367L21.25 18.1252V11.8752Z" stroke="#64748B" stroke-width="2"/>
                    <path d="M2.5 14.375C2.5 10.2656 2.5 8.21097 3.63495 6.82803C3.84272 6.57486 4.07486 6.34272 4.32803 6.13495C5.71097 5 7.76565 5 11.875 5C15.9844 5 18.039 5 19.422 6.13495C19.6751 6.34272 19.9073 6.57486 20.1151 6.82803C21.25 8.21097 21.25 10.2656 21.25 14.375V15.625C21.25 19.7344 21.25 21.789 20.1151 23.172C19.9073 23.4251 19.6751 23.6573 19.422 23.8651C18.039 25 15.9844 25 11.875 25C7.76565 25 5.71097 25 4.32803 23.8651C4.07486 23.6573 3.84272 23.4251 3.63495 23.172C2.5 21.789 2.5 19.7344 2.5 15.625V14.375Z" stroke="#64748B" stroke-width="2"/>
                    <path d="M8.75 15H11.875M11.875 15H15M11.875 15V18.125M11.875 15V11.875" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h6 class="text-center mb-2 mt-2">Upload or Record</h6>
                <ol class="mb-0 fp-text-color-main" style="padding-left: 25px;">
                    <li>Recommended 1080 x 1920px</li>
                    <li>Use aspect ratio 9:16 portrait</li>
                    <li>Recommended MP4 format</li>
                </ol>
            </div>
            <p v-if="showErrors && form.file === null" class="text-center invalid-feedback">{{ errors.file }}</p>
        </div>
        <div class="clips-form-content ml-lg-3 mb-3">
            <form class="form-clips" @submit.prevent="submit">
                <div class="mb-2">
                    <h6 class="mb-2">#Tag People <span class="fp-text-color-main fp-fs-14">(Up to 20 people)</span></h6>
                    <search-users v-model="form.tagged_users"
                         :url="taggableSearchUrl"
                         placeholder="Search name or @username"
                         all-user-modal-title="All Tagged People"
                    >
                        <template #image>
                            <fp-icon name="user-tag" class="fp-fs-24 fp-text-color-main" />
                        </template>
                    </search-users>
                    <span v-if="showErrors && form.tagged_users.length > 20" class="text-danger">{{ errors.tagged_users }}</span>
                </div>
                <div class="form-group caption">
                    <textarea v-model="form.description"
                         rows="4"
                         class="form-control"
                         maxlength="150"
                         placeholder="#Tag a short note..."
                    ></textarea>
                    <span class="text-muted">{{ form.description.length }}/150</span>
                </div>
                <p v-if="showErrors && errors.uploader" class="text-danger mt-n2 mb-3">
                    <fp-icon name="error-triangle" class="fp-fs-22 fp-text-color-main mt-n-2px" />
                    {{ errors.uploader }}
                </p>
                <div class="d-flex align-items-end text-center text-lg-left mb-2">
                    <router-link :to="{ name: 'index', query: { tab: 'clips' } }" class="btn btn-cancel px-3 ml-auto">Cancel</router-link>
                    <button type="submit"
                         class="btn fp-btn-gradient px-4 ml-2"
                         :class="form.busy && 'btn-loading'"
                         :disabled="form.busy"
                    >Post</button>
                </div>
            </form>
        </div>
        <file-selector ref="fileSelector"
             @selected="fileSelected"
             descriptionUploadVideo="Upload a short video upto 1 min or less"
             descriptionCameraVideo="Record a short video upto 1 min or less"
             :max-size="268435456"
             :max-duration="1"
             title="Create a short flick"
             @error="handleError"
        />
        <!-- Max file size 256 MB -->
    </div>
</template>
<script>
    import Form from "vform";
    import { mapGetters } from "vuex";
    import FileSelector from "../../ui/FileSelector.vue";
    import Uploading from "../../elements/Uploading.vue";
    import SearchUsers from "../../ui/SearchUsers.vue";
    export default {
        name: "ClipsForm",
        components: {
            FileSelector,
            Uploading,
            SearchUsers,
        },
        data() {
            return {
                form: new Form({
                    id: "",
                    tagged_users: [],
                    description: "",
                    file: null,
                }),
                previewData: null,
                errors: [],
                showErrors: false,
                users: [],
                tagged_users: [],
                timerSearchUser: null,
                loadingUsers: false,
            };
        },
        provide() {
            return {
                duration: '60',
            }
        },
        computed: {
            taggableSearchUrl() {
                return `${process.env.timelineApiUrl}/fliconn/get_taggable_users`;
            },
            ...mapGetters({
                auth_user: "auth/user",
                files: 'fliconn/files',
                previews: 'fliconn/previews'
            }),
        },
        mounted() {
            if (this.files && this.previews) {
                this.form.file = this.files[0];
                this.previewData = this.previews[0];
            }
        },
        beforeDestroy() {
            this.$store.dispatch('fliconn/setFiles', {files: null, previews: null});
        },
        methods: {
            async submit() {
                if (this._validate() === false) {
                    this.showErrors = true;
                    return false;
                }
                this.errors = [];
                this.showErrors = false;
                try {
                    this.$showLoading();
                    const response = await this.form.post(`${process.env.clipsApiUrl}/clips/save`, {
                        onUploadProgress: e => {
                            this.$store.dispatch('setLoadingPercent', Math.ceil(e.loaded * 100 / e.total));
                        }
                    });
                    this.$hideLoading();
                    if (response.data.status === "Success") {
                        this.form.reset();
                        this.$fpSuccess('Your short flick has been stored successfully. We will notify you once it is live on your timeline.');
                        this.$router.back();
                    }
                } catch (error) {
                    this.$fpError("Something went wrong!");
                    this.$hideLoading();
                }
            },
            fileSelected(payload) {
                this.form.file = payload.files[0];
                this.previewData = payload.previews[0];
            },
            _validate() {
                this.errors = [];
                if (this.form.tagged_users.length > 20) {
                    this.errors.tagged_users = "You can tag max 20 users.";
                    return false;
                }
                if (!this.form.file) {
                    this.errors.file = "Upload or record a video";
                    return false;
                }
            },
            removeVideo() {
                this.form.file = null;
                this.previewData = null;
            },
            handleError(error) {
                if (error.type === 'duration') {
                    this.$fpError('Upload a short video of length 60 sec (1 min) or less!');
                    this.errors.uploader = 'Select a short video of length 60 sec (1 min) or less!';
                    this.showErrors = true;
                } else if (error.type === 'size') {
                    this.$fpError('Maximum allowed video size 256MB. Please reduce size and reupload!');
                    this.errors.uploader = 'Selected video is too large. Allowed 256MB or less!';
                    this.showErrors = true;
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
    .card-video-source {
        width: 184px;
        height: 321px;
        border-radius: 10px;
        @media (max-width: 600px) {
            width: 100%;
            height: 180px;
            margin-bottom: 16px;
        }
        .btn-add-video {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
            border: dashed 1px #FF22A1;
            border-radius: 10px;
            background-color: #FF22A114;
            p {
                font-size: 13px;
                white-space: pre-line;
            }
        }
        .video-wrapper {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            video {
                border-radius: 10px;
                object-fit: cover;
                width: calc(100% + 1px);
                height: calc(100% + 1px);
            }
            .btn-remove {
                position: absolute;
                top: 10px;
                right: 10px;
                color: #28A745;
                background-color: #FFF;
                border-radius: 3px;
                padding: 1px 3px 0px;
                z-index: 1;
            }
        }
    }
    .clips-form-content {
        flex-grow: 1;
        form.form-clips {
            height: 100%;
            display: flex;
            flex-direction: column;
            .form-group {
                &.caption {
                    flex-grow: 1;
                    position: relative;
                    textarea {
                        border-radius: 10px;
                        height: 100%;
                    }
                    span.text-muted {
                        position: absolute;
                        bottom: 3px;
                        right: 14px;
                    }
                }
            }
        }
        h6 {
            white-space: nowrap;
        }
        input {
            border-radius: 10px;
        }
    }
    .agree-terms-policy {
        font-size: 13px;
        margin-bottom: 0;
        font-weight: 600;
    }
    .btn-cancel {
        color: #FF7272;
        border-color: #FF7272 !important;
        padding: 5px 16px;
    }
</style>
