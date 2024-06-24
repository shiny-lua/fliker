<template>
    <div class="image-editor">
        <filerobot-image-editor v-if="openEditor"
             :config="config"
             :src="src"
             @beforeComplete="onBeforeComplete"
             @close="onClose"
        />
    </div>
</template>
<script>
import FilerobotImageEditor  from "@rotsen/vue-filerobot-image-editor";
export default {
    name: 'ImageEditor',
    props: ['src'],
    components: {
        FilerobotImageEditor,
    },
    data() {
        return {
            imageData: null,
            openEditor: false,
            config: {
                tools: ['adjust', 'filters', 'rotate', 'crop', 'watermark', 'text'],
                finishButtonLabel: 'Save',
                noCrossOrigin: true,
            },
        };
    },
    methods: {
        open() {
            this.openEditor = true;
        },
        close() {
            this.openEditor = false;
        },
        onBeforeComplete(element) {
            if (element && element.canvas) {
                const imageData = element.canvas.toDataURL();
                this.$emit('save', imageData);
            }
        },
        onClose(status) {
            this.close();
        },
    }
}
</script>