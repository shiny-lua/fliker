<template>
    <modal
        name="uploading"
        width="330"
        :shiftY="0.1"
        height="auto"
    >
        <div class="uploading-modal">
            <div v-if="success" class="d-flex align-items-center">
                <fa icon="check-circle" />
                <p class="ml-3 success-msg">{{ successMsg }}</p>
            </div>
            <div v-else class="d-flex align-items-center">
                <fa icon="exclamation-circle" />
                <div class="flex-grow-1 ml-3">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped" :style="{width: `${percentage}%`}"></div>
                    </div>
                    <p class="mb-n1">{{ percentage }}% uploaded... please wait</p>
                </div>
            </div>
        </div>
    </modal>
</template>
<script>
export default {
    name: 'uploading',
    props: {
        progress: { type: [Number, String], require: true },
        success: { type: Boolean, default: false },
        successMsg: { type: String, default: 'Uploaded successfully!' },
    },
    computed: {
        percentage() {
            return parseInt(this.progress);
        }
    },
    watch: {
        percentage(value) {
            if (value > 5) {
                this.$modal.show('uploading')
            }
        },
        success(value) {
            if (value) {
                setTimeout(() => {
                    this.$modal.hide('uploading')
                }, 5000);
            }
        }
    },
    methods: {
        close() {
            this.$modal.hide('uploading');
        }
    }
}
</script>
<style lang="scss" scoped>
    .progress {
        height: 8px;
        margin-bottom: 8px;
    }

    .uploading-modal {
        padding: 16px;
        svg {
            font-size: 32px;
        }
        background-color: #47d78a;
        color: #FFF;
        p {
            margin-bottom: 0;
            font-weight: 400;
        }
    }
</style>