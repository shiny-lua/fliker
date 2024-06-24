<template>
    <div class="media-recorder">
        <div class="controls my-5">
            <div class="timer">
                <div v-if="this.webcam === 'nothing'">{{ timerStr[0] }}</div>
                <div v-if="this.webcam === 'start'">{{ timerStr[1] }} {{ timerCount}} {{ timerStr[3] }}</div>
                <div v-if="this.webcam === 'stop'">{{ timerStr[2] }} {{ timerCount}} {{ timerStr[3] }}</div>
            </div>
            <button v-if="showStartRecordingButton" class="btn btn-success" @click="onStartPreview" title="Start recording">Record</button>
            <button v-else class="btn btn-danger ml-3" title="Stop" @click="onTimerRecording()">Stop</button>
            <button class="btn btn-primary ml-3" :disabled="downloadButtonDisabled" title="Download" @click="onDownloadRecord">Download</button>
            <button class="btn btn-primary ml-3" title="Upload" @click="onUploadRecord">Upload</button>
        </div>
        <div class="mt-5">
            <label class="btn btn-primary">
                <input type="file" accept="video/*" hidden @change="handleFile">
                Select File
            </label>
        </div>
    </div>
</template>

<script>
    const RECORDER_STATE = {
        RECORDING: 'recording',
        INACTIVE: 'inactive',
        PAUSED: 'paused',
    };

    const getCombinedStream = (...streams) => {
        const tracks = streams.map(stream => stream && stream.getTracks())
            .filter(val => !!val)
            .flat();
        return new MediaStream(tracks);
    };

    const STATE = {
        NOTHING: 'nothing',
        STARTRECORD: 'start',
        STOPRECORD: 'stop',
    };

    //import RecorderPage from '@/components/RecorderPage';
    import Form from "vform";
    export default {
        name: 'AppMediaRecorder',
        props: {
            videoStream: {
                type: [MediaStream, Boolean],
                default: false,
            },
            audioStream: {
                type: [MediaStream, Boolean],
                default: false,
            },
            duration: {
                type: [String, Number],
                default: 180,
            }
        },
        data() {
            return {
                recordBlob: null,
                recordVideo: true,
                recordAudio: true,
                recorderState: RECORDER_STATE.INACTIVE,

                // Timer
                timerStr: ["Please click the red button to start recording ","Recording starts in: ","Recording ends in: ", " seconds"],
                timerCount: 0,
                webcam: STATE.NOTHING,
                form: new Form({
                    file: null,
                }),
            };
        },
        computed: {
            toggleVideoTitle() {
                return this.recordVideo ? 'Disable video recording' : 'Enable video recording';
            },
            toggleAudioTitle() {
                return this.recordAudio ? 'Disable audio recording' : 'Enable audio recording';
            },
            showVideo() {
                return this.recordUrl !== '';
            },
            combinedStream() {
                if (!this.waitForAudioStream && !this.waitForVideoStream) {
                    return getCombinedStream(...[ this.recordAudio && this.audioStream, this.recordVideo && this.videoStream ]);
                }
                return null;
            },
            waitForAudioStream() {
                return this.recordAudio && !this.audioStream && this.audioStream !== false;
            },
            waitForVideoStream() {
                return this.recordVideo && !this.videoStream && this.videoStream !== false;
            },
            recorder() {
                if (!this.combinedStream) {
                    return null;
                }
                var options = {
                    videoBitsPerSecond: 2500000,
                    mimeType: 'video/webm',
                }
                const recorder = new MediaRecorder(this.combinedStream, options);
                //recorder.mimeType;
                recorder.ondataavailable = (dataObj) => this.recordBlob = dataObj.data;//new Blob(dataObj.data, { type: "video/webm"});

                // Delete if it does not work
                //recorder.ondataavailable = this.handleDataAvailable((dataObj) => this.recordBlob = dataObj.data);
                //console.log((dataObj) => this.recordBlob = dataObj.data)
                return recorder;
            },
            showStartRecordingButton() {
                return this.recorderState === RECORDER_STATE.INACTIVE;
            },
            showPauseRecordingButton() {
                return this.recorderState === RECORDER_STATE.RECORDING;
            },
            recordUrl() {
                if (this.recordBlob) {
                    return URL.createObjectURL(this.recordBlob);
                }
                return '';
            },
            resumeButtonDisabled() {
                return this.recorderState !== RECORDER_STATE.PAUSED;
            },
            downloadButtonDisabled() {
                return !this.recordBlob;
            },
        },
        watch: {
            timerCount: {
                handler(value) {
                    if (value > 0) {
                        setTimeout(() => {
                            this.timerCount--;
                        }, 1000);
                    } else if (value < 0) {
                        this.timerCount = 0;
                    }

                    if (this.timerCount === 0) {
                        this.onTimerState()
                    }
                },
                immediate: true,
            }
        },
        methods: {
            onToggleRecordAudio() {
                this.recordAudio = !this.recordAudio;
            },
            onToggleRecordVideo() {
                this.recordVideo = !this.recordVideo;
            },
            onStopRecording() {
                this.recorder.stop();
                this.recorderState = this.recorder.state;
            },
            onStartPreview() {
                this.webcam = STATE.STARTRECORD;
                this.recordBlob = null;
                this.timerCount = 1;
            },
            async onStartRecording() {
                this.timerCount = this.duration;
                this.webcam = STATE.STOPRECORD

                await this.$nextTick();
                this.recorder.start();
                this.recorderState = this.recorder.state;
                this.$emit('start');
            },
            async onTimerRecording() {
                this.webcam = STATE.NOTHING
                this.recorder.stop();
                this.recorderState = this.recorder.state;
                await this.$nextTick();
                setTimeout(() => {
                    console.log('stop: ', this.recordBlob)
                    this.$emit('stop', this.recordBlob);
                }, 1000);
            },

            onPauseRecording() {
                this.recorder.pause();
                this.recorderState = this.recorder.state;
            },
            onResumeRecording() {
                this.recorder.resume();
                this.recorderState = this.recorder.state;
            },
            onDownloadRecord() {
                if (this.recordUrl !== '') {
                    var a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = this.recordUrl;
                    a.download = `0000-${Date.now()}.webm`;
                    a.click();
                    window.URL.revokeObjectURL(this.recordUrl);
                }
            },
            async onUploadRecord() {
                this.form.file = this.recordBlob;
                await this.$nextTick();
                try {
                    const response = await this.form.post(`${process.env.timelineApiUrl}/fliconn/upload_video`)
                    console.log(response.data.data)
                } catch (error) {

                }
            },
            onTimerState() {
                if (this.webcam === STATE.STARTRECORD) {
                    this.onStartRecording()
                } else if (this.webcam === STATE.STOPRECORD) {
                    this.onTimerRecording()
                }
            },
            async handleFile(event) {
                this.form.file = event.target.files[0];
                await this.$nextTick();
                try {
                    const response = await this.form.post(`${process.env.timelineApiUrl}/fliconn/upload_video`)
                    console.log(response.data.data)
                } catch (error) {

                }
            }
        },
    }
</script>

<style scoped>
    .controls {
        display: flex;
        justify-content: center;

        padding: 5px 10px;
        border: 1px solid lightgray;
    }
    .timer {
        display: flex;
        flex: 50%;
        justify-content: flex-start;
        padding: 5px 10px;

        font-size: 1.5em;
        font-weight: bold;
        margin: 5px 4px;
        padding: 4px;
        min-width: 3em;
        width: fit-content;
    }
</style>
