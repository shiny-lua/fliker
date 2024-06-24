<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h2>Current Camera</h2>
                <code v-if="device">{{ device.label }}</code>
                <div class="border">
                    <vue-web-cam
                        ref="webcam"
                        :device-id="deviceId"
                        width="100%"
                        @started="onStarted"
                        @stopped="onStopped"
                        @error="onError"
                        @cameras="onCameras"
                        @camera-change="onCameraChange"
                    />
                </div>

                <div class="row">
                    <div class="col-md-12 mb-2">
                        <select v-model="camera">
                            <option>-- Select Device --</option>
                            <option
                                v-for="device in devices"
                                :key="device.deviceId"
                                :value="device.deviceId"
                            >{{ device.label }}</option>
                        </select>
                    </div>
                    <div class="col-md-12">
                        <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button>
                        <button v-if="!recording" type="button" class="btn btn-primary" @click="startRecord">Record Video</button>
                        <button v-else type="button" class="btn btn-primary" @click="stopRecord">Stop Record</button>
                        <button type="button" class="btn btn-danger" @click="onStop">Stop Camera</button>
                        <button type="button" class="btn btn-success" @click="onStart">Start Camera</button>
                        <a id="downloadButton" class="btn btn-info">Download</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <h2>Captured Image</h2>
                <figure class="figure">
                    <img :src="img" class="img-responsive" />
                </figure>
            </div>

            <div class="col-12 mt-4">
                <app-media-recorder ref="recorder"
                    :videoStream="videoStream"
                    :audioStream="audioStream"
                    @start="recording = true"
                    @stop="onStopRecording"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { WebCam } from "vue-web-cam";
import AppMediaRecorder from "../../components/ui/AppMediaRecorder.vue"

export default {
    name: "App",
    components: {
        "vue-web-cam": WebCam,
        AppMediaRecorder,
    },
    data() {
        return {
            img: null,
            camera: null,
            deviceId: null,
            devices: [],
            videoStream: false,
            audioStream: false,
            recording: false,
        };
    },
    computed: {
        device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
        }
    },
    watch: {
        camera: function(id) {
            this.deviceId = id;
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
    mounted() {
        this.getAudioStream()
    },
    methods: {
        onCapture() {
            this.img = this.$refs.webcam.capture();
        },
        onStarted(stream) {
            console.log("On Started Event", stream);
            this.videoStream = stream
        },
        onStopped(stream) {
            console.log("On Stopped Event", stream);
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
            console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            console.log("On Camera Change Event", deviceId);
        },
        startRecord() {
            this.$refs.recorder.onStartPreview();
        },
        stopRecord() {
            this.$refs.recorder.onTimerRecording();
        },
        onStopRecording(data) {
            console.log(data);
            this.recording = false;
        },
        async getAudioStream() {
            try {
                this.audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
            } catch (error) {
                this.$toast.error('No microphone found')
            }
        }
    }
};
</script>