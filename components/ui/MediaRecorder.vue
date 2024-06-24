<template>
    <div class="media-recorder">
        <div class="timer">{{ timerString }}</div>
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

    var timeOut = null;

    export default {
        name: 'MediaRecorder',
        props: {
            videoStream: {
                type: [MediaStream, Boolean],
                default: false,
            },
            audioStream: {
                type: [MediaStream, Boolean],
                default: false,
            },
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
            };
        },
        inject: {
            duration: { default: 60 },
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
            timerString() {
                let seconds = this.duration - this.timerCount;
                let timerString = new Date(seconds * 1000).toISOString().substring(14, 19);
                if (!this.recordBlob && this.webcam === 'nothing') return '00:00';
                if (this.webcam != 'start') return timerString;
                return '00:00';
            }
        },
        watch: {
            timerCount: {
                handler(value) {
                    if (value > 0) {
                        timeOut = setTimeout(() => {
                            this.timerCount--;
                        }, 1000);
                    } else if (value < 0) {
                        this.timerCount = 0;
                        clearTimeout(timeOut);
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
                    this.$emit('stop', this.recordBlob);
                    clearTimeout(timeOut);
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
            onTimerState() {
                if (this.webcam === STATE.STARTRECORD) {
                    this.onStartRecording()
                } else if (this.webcam === STATE.STOPRECORD) {
                    this.onTimerRecording()
                }
            },
        },
    }
</script>

<style scoped>
    .timer {
        padding: 5px 10px;
        font-size: 1.5em;
        padding: 0 10px;
        color: #FFF;
    }
</style>
