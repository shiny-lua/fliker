<template>
    <div class="fliconn-file-selector top-modal" :class="deviceType === 'camera' && 'camera-modal'">
        <fp-modal name="fileSelectorModal"
             :show-header="!!title"
             :title="title"
             :middle-on-mobile="true"
             @before-open="init()"
        >
            <div class="position-relative" :class="{'pt-4': title === ''}">
                <div :class="{ 'my-md-4': !deviceType }">
                    <div v-if="fileType === 'image' && !deviceType" class="device-options">
                        <label class="device-option fp-border-color-1">
                            <fp-icon name="image-gallery" />
                            <p class="fp-text-color mt-1">Upload Images</p>
                            <p class="description fp-text-color-main">{{ descriptionUploadImage }}</p>
                            <input type="file" @change="handleImageFiles" multiple hidden accept="image/*" />
                        </label>
                        <a href="javascript:;" class="device-option fp-border-color-1" @click="openCamera()">
                            <fp-icon name="camera" />
                            <p class="fp-text-color mt-1">Open Camera</p>
                            <p class="description fp-text-color-main">{{ descriptionCameraImage }}</p>
                        </a>
                    </div>
                    <div v-else-if="fileType === 'video' && !deviceType" class="device-options">
                        <label class="device-option fp-border-color-1">
                            <fp-icon name="upload-video" style="font-size: 38px;" />
                            <p class="fp-text-color mt-1">Upload Video</p>
                            <p class="description fp-text-color-main">{{ descriptionUploadVideo }}</p>
                            <input type="file" @change="handleVideoFile" multiple hidden accept="video/*" />
                        </label>
                        <a href="javascript:;" class="device-option fp-border-color-1" @click="openCamera()">
                            <fp-icon name="video-camera" />
                            <p class="fp-text-color mt-1">Open Camera</p>
                            <p class="description fp-text-color-main">{{ descriptionCameraVideo }}</p>
                        </a>
                    </div>
                    <div v-if="deviceType === 'camera'" class="camera-view">
                        <web-cam ref="webCamView" :type="fileType" @save="saveCameraData" />
                    </div>
                </div>
            </div>
        </fp-modal>
    </div>
</template>
<script>
    import WebCam from "./WebCam.vue";
    import FpModal from "./Modal.vue";
    export default {
        name: "FileSelectorModal",
		props: {
			descriptionUploadImage: { type: String, default: '* Upload max 10 images at a time' },
			descriptionCameraImage: { type: String, default: '* Take max 10 images at a time' },
			descriptionUploadVideo: { type: String, default: '* Max length allowed 5 Mins or less' },
			descriptionCameraVideo: { type: String, default: '* Record up to 5 Mins length video' },
            title: { type: String, default: '' },
            maxSize: { type: [String, Number], required: false }, // Byte
            maxDuration: { type: Number, default: 5 } // Duration as Min
		},
        components: {
            WebCam, FpModal,
        },
        data() {
            return {
                fileType: "image",
                deviceType: "",
                files: [],
                previews: [],
                previewTypes: ["video/mp4", "video/webm", "audio/ogg"],
            };
        },
        methods: {
            init() {
                this.deviceType = "";
                this.files = [];
                this.previews = [];
            },
            open(type = "image") {
                this.fileType = type;
                this.$modal.show("fileSelectorModal");
            },
            close() {
                this.$modal.hide("fileSelectorModal");
            },
            async handleImageFiles(event) {
                let files = event.target.files;
                if (files.length > 10) {
                    this.$toast.error("You can upload max 10 images");
                    return false;
                }
                this.pushFiles(files, "image");
            },
            async handleVideoFile(event) {
                let files = event.target.files;
                if (files.length <= 4) {
                    let errorNum = 0;
                    for (var i = 0; i < files.length; i++) {
                        const fileType = files[i].type;
                        if (this.previewTypes.includes(fileType)) {
                            var videoTag = document.createElement("video");
                            videoTag.preload = "metadata";
                            videoTag.src = URL.createObjectURL(files[i]);
                            videoTag.onloadedmetadata = () => {
                                window.URL.revokeObjectURL(videoTag.src);
                                let duration = videoTag.duration;
                                if (!isNaN(duration) && duration > 60 * this.maxDuration) {
                                    errorNum = errorNum + 1;
                                    this.$emit('error', {type: 'duration'});
                                }
                            };
                            if (this.maxSize) {
                                if (files[i].size > this.maxSize) {
                                    errorNum = errorNum + 1;
                                    this.$emit('error', {type: 'size'});
                                    return false;
                                }
                            }
                        }
                    }
                    setTimeout(() => {
                        if (errorNum === 0) this.pushFiles(files, "video");
                    }, 500);
                } else {
                    this.$toast.error("You can upload max 4 videos");
                    return false;
                }
            },
            pushFiles(files, type) {
                this.files = files;
                this.previews = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        this.previews.push({
                            mime: type,
                            src_url: e.target.result,
                            unsupport: type === "video" && !this.previewTypes.includes(file.type),
                        });
                        if (this.previews.length === files.length) {
                            this.$emit("selected", {
                                files: this.files,
                                previews: this.previews,
                            });
                            this.close();
                        }
                    };
                    reader.readAsDataURL(file);
                }
            },
            saveCameraData(data) {
                this.files = [data];
                let src_url = data;
                if (this.fileType === "video") {
                    src_url = URL.createObjectURL(data);
                }
                this.previews = [{ mime: this.fileType, src_url: src_url }];
                this.$emit("selected", { files: this.files, previews: this.previews });
                if (this.fileType === "video" && this.deviceType === "camera") this.close();
            },
            openCamera() {
                this.deviceType = "camera";
            },
        },
    };
</script>
<style lang="scss" scoped>
    .fliconn-file-selector {
        &::v-deep {
            .vm--container {
                z-index: 1000;
            }
            .vm--modal {
                border-radius: 12px;
            }
        }
        &.camera-modal::v-deep {
            .vm--modal {
                @media (max-width: 600px) {
                    top: 0 !important;
                    border-radius: 0;
                    margin-bottom: 0;
                }
            }
        }
    }
    .device-options {
        display: flex;
        align-items: center;
        justify-content: space-around;
        @media (max-width: 600px) {
            justify-content: space-between;
        }
        .device-option {
            width: 192px;
            height: 140px;
            border-style: solid;
            border-width: 1px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-decoration: none;
            margin-bottom: 0;
            padding: 12px 24px;
            cursor: pointer;
			transition: all .1s ease-in;
            svg {
                font-size: 40px;
            }
            @media (max-width: 600px) {
                width: 155px;
                padding: 12px 18px;
            }
            p {
                margin-bottom: 0;
                &.description {
                    font-size: 12px;
                    text-align: center;
                }
            }
			&:hover {
				background-color: #FF22A1;
                border-color: #FF22A1;
				p {
					color: #FFF !important;
				}
                .fp-svg-fill {
                    fill: #FFF;
                }
			}
        }
    }
    .camera-view {
        height: 400px;
        padding: 0;
        @media (max-width: 600px) {
            height: var(--app-height);
        }
        &::v-deep {
            .webcam-area {
                height: 100%;
            }
        }
    }
    .btn-close {
        cursor: pointer;
        position: absolute;
        top: 14px;
        right: 17px;
        color: #999999;
        z-index: 1;
    }
</style>
