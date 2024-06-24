<template>
    <div class="row justify-content-center">
        <div class="col-lg-8 pt-3 pt-md-5">
            <div class="test-page">
                <div class="image-container">
                    <img v-if="!openEditor && imageData"
                        width="400"
                        :src="imageData"
                        @click="openEditor = true"
                        alt="Image Result"
                    />
                </div>
                <label class="btn fp-btn-gradient">
                    <input type="file" hidden accept="image/*" @change="handleFile" />
                    Select Image
                </label>
                <FilerobotImageEditor v-if="openEditor"
                    :config="config"
                    :src="imageData"
                    @complete="onComplete"
                    @beforeComplete="onBeforeComplete"
                    @close="onClose"
                    @error="onError"
                />
            </div>
        </div>
    </div>
</template>
<script>
import FilerobotImageEditor  from "@rotsen/vue-filerobot-image-editor";
export default {
    name: 'TestPage',
    components: {
        FilerobotImageEditor,
    },
    data() {
        return {
            openEditor: false,
            config: {
                tools: ['adjust', 'filters', 'rotate', 'crop', 'watermark', 'text'],
                finishButtonLabel: 'Save',
            },
            imageData: null,
            colorScheme: 'light' //  'dark'|'light'
        };
    },
    methods: {
        onComplete(url, file) {
            console.log("url: ", url);
            console.log("file: ", file);
        },
        onBeforeComplete(element) {
            if (element && element.canvas) {
                this.imageData = element.canvas.toDataURL();
            }
        },
        onClose(status) {
            console.log("close" + JSON.stringify(status, null, 3));
            this.openEditor = false;
        },
        onError(error) {
            console.log(" error " + error);
        },
        handleFile(event) {
            const file = event.target.files[0];
            if (!file) return false
            let reader = new FileReader();
            reader.onload = e => {
                this.imageData = e.target.result;
                this.openEditor = true;
            };
            reader.readAsDataURL(file);
        }
    }
}
</script>