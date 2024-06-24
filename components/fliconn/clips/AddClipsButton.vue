<template>
    <div>
        <a href="javascript:;" class="btn-add-clips" @click.prevent="$refs.fileSelector.open('video')">
            <slot>
                <fp-icon name="camera-dashed-1" class="mr-2" style="font-size: 32px;" />
            </slot>
            {{ title }}
        </a>
        <file-selector ref="fileSelector"
             @selected="fileSelected"
             descriptionUploadVideo="Upload a short flick upto 3 mins length"
             descriptionCameraVideo="Record a short flick upto 3 mins length"
             title="Create a short flick"
        />
    </div>
</template>
<script>
    import FileSelector from "../../ui/FileSelector.vue";
    export default {
        name: 'ButtonAddClips',
        props: {
            redirectUrl: { type: String, default: '' },
            title: { type: String, default: '' },
        },
        components: {
            FileSelector,
        },
        methods: {
            fileSelected(payload) {
                this.$store.dispatch('fliconn/setFiles', payload);
                if (this.redirectUrl) {
                    this.$router.push(this.redirectUrl);
                }
                this.$refs.fileSelector.close();
            },
        }
    }
</script>
<style lang="scss" scoped>
    .btn-add-clips {
        display: inline-flex;
        align-items: center;
        color: #FF22A1;
        .circle {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            &::before {
                border-width: 2px;
                border-color: #D14D6C;
            }
        }
    }
</style>