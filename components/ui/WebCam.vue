<template>
    <div class="webcam-area">
        <div v-if="imageData || recordBlob" class="captured-image">
            <div class="captured-image-editor bg-success">
                <div class="d-flex align-items-center py-1 px-3">
                    <a href="javascript:;" class="btn btn-sm py-1 fp-btn-gradient ml-auto" @click.prevent="save"><fa :icon="['far', 'save']" /> Save</a>
                    <a href="javascript:;" class="text-white ml-3 btn-cancel" @click="cancel" ><fa icon="times" /></a>
                </div>
            </div>
            <img v-if="imageData" :src="imageData" alt="" class="captured-image-data" />
            <video-player v-if="recordBlob" class="captured-video-player"
                ref="recordedVideoPlayer"
                :options="videoPlayerOptions"
                :playsinline="true"
            ></video-player>
        </div>
        <vue-web-cam
            v-show="!imageData && !recordBlob"
            ref="webcam"
            :device-id="deviceId"
            width="100%"
            height="100%"
            :selectFirstDevice="true"
            @started="onStarted"
            @stopped="onStopped"
            @error="onError"
            @cameras="onCameras"
            @camera-change="onCameraChange"
            class="webcam-component"
        />
        <div v-if="!imageData && !recordBlob" class="controls">
            <div class="row mx-n1">
                <div class="col-4 px-1">
                    <select v-model="camera" class="camera-selector form-control form-control-sm has-bg mt-1" :class="{'d-block' : devices.length > 1}">
                        <option>-- Select Device --</option>
                        <option
                            v-for="device in devices"
                            :key="device.deviceId"
                            :value="device.deviceId"
                        >{{ device.label }}</option>
                    </select>
                </div>
                <div class="col-4 px-1 text-center">
                    <a v-if="type === 'video' && !recording" href="javascript:;" @click="startRecord" class="camera-control"><fp-icon name="recording" /></a>
                    <a v-else-if="type === 'video' && recording" href="javascript:;" @click="stopRecord" class="camera-control"><fp-icon name="recording-stop" /></a>
                    <a v-else href="javascript:;" @click="onCapture" class="camera-control"><fp-icon name="camera" /></a>
                </div>
                <div class="col-4 px-1 text-right">
                    <media-recorder v-if="type === 'video'"
                        ref="recorder"
                        :videoStream="videoStream"
                        @start="recording = true"
                        @stop="onStopRecording"
                    />
                </div>
            </div>
            <div class="gradient"></div>
        </div>
    </div>
</template>
<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import { WebCam } from "vue-web-cam";
import MediaRecorder from "./MediaRecorder.vue"
export default {
    name: 'WebCam',
    props: {
        type: { type: String, default: 'image' },
    },
    components: {
        "vue-web-cam": WebCam,
        MediaRecorder,
        videoPlayer,
    },
    data() {
        return {
            imageData: null,
            camera: null,
            deviceId: null,
            devices: [],
            videoStream: false,
            recordBlob: null,
            recording: false,
        }
    },
    computed: {
        device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
        },
        videoPlayerOptions() {
            return {
                controls: true,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/webm",
                    src: this.recordBlob ? URL.createObjectURL(this.recordBlob) : ''
                }],
            }
        }
    },
    watch: {
        camera: function(id) {
            this.deviceId = id;
            this.imageData = null;
        },
        devices: function() {
            // Once we have a list select the first one
            const [first, ...tail] = this.devices;
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        }
    },
    methods: {
        onCapture() {
            this.imageData = this.$refs.webcam.capture();
        },
        onStarted(stream) {
            // console.log("On Started Event", stream);
            this.videoStream = stream
        },
        onStopped(stream) {
            // console.log("On Stopped Event", stream);
        },
        onStop() {
            this.$refs.webcam.stop();
        },
        onStart() {
            this.$refs.webcam.start();
        },
        onError(error) {
            console.log("On Error Event", error);
        },
        onCameras(cameras) {
            this.devices = cameras;
            // console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            // console.log("On Camera Change Event", deviceId);
        },
        async saveImageData() {
            if (!this.imageData) return;
            this.$emit('save', this.imageData);
            await this.$nextTick();
            this.imageData = null;
        },
        async saveVideoData() {
            if (!this.recordBlob) return;
            this.$emit('save', this.recordBlob);
            await this.$nextTick();
            this.recordBlob = null;
        },
        startRecord() {
            this.recordBlob = null;
            this.$refs.recorder.onStartPreview();
        },
        stopRecord() {
            this.$refs.recorder.onTimerRecording();
        },
        onStopRecording(data) {
            this.recordBlob = data
            this.recording = false;
        },
        save() {
            if (this.type === 'video') {
                this.saveVideoData();
            } else {
                this.saveImageData();
            }
        },
        cancel() {
            this.imageData = null;
            this.recordBlob = null;
        }
    }
}
</script>
<style lang="scss" scoped>
    .webcam-area {
        position: relative;
        .webcam-component {
            position: absolute;
            top: 0;
            left: 0;
            object-fit: cover;
        }
        .controls {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 4px 8px;
            z-index: 1;
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 99.99%, rgba(255, 255, 255, 0) 100%);
            @media (max-width: 600px) {
                padding: 12px 8px;
            }
            .camera-selector {
                display: none;
            }
            .camera-control {
                font-size: 40px;
                color: #FFF;
            }
        }
        .captured-image {
            height: 100%;
            img.captured-image-data {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .captured-image-editor {
                position: absolute;
                top: 0;
                width: 100%;
                z-index: 2;
                .btn-cancel {
                    font-size: 18px;
                    line-height: 20px;
                }
            }
            .captured-video-player {
                width: 100%;
                height: 100%;
                padding-top: 39px;
                &::v-deep {
                    .video-js {
                        width: 100%;
                        height: 100%;
                        .vjs-big-play-button {
                            width: 40px;
                            height: 40px;
                            bottom: 5px;
                            left: 46%;
                            top: unset;
                            line-height: 38px;
                            border-radius: 100%;
                            border-width: 2px;
                        }
                    }
                }
            }
        }
    }
</style>