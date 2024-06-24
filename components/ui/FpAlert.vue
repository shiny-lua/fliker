<template>
    <fp-modal ref="alertModal"
        name="fpAlertModal"
        :show-header="false"
        @before-close="closed"
        @opened="opened"
        :middle-on-mobile="true"
        :show-close-button="false"
        class="fp-alert-modal"
    >
        <div class="fp-alert-content d-flex py-2 px-md-3">
            <span class="fp-alert-icon mr-2">
                <fp-icon v-if="type === 'success'" name="check-success" class="fp-fs-24" />
                <fp-icon v-if="type === 'error'" name="times-error" class="fp-fs-24" />
            </span>
            <p v-if="title" class="fp-alert-description">{{ title }}</p>
        </div>
    </fp-modal>
</template>
<script>
import FpModal from "./Modal.vue";
export default {
    name: 'FpAlert',
    components: {
        FpModal,
    },
    computed: {
        open_alert() {
            return this.$store.getters['open_alert'];
        },
        type() {
            return this.$store.getters['alert_data'].type;
        },
        title() {
            return this.$store.getters['alert_data'].title;
        },
        description() {
            return this.$store.getters['alert_data'].description;
        },
    },
    watch: {
        open_alert(value) {
            if (value) {
                this.$refs.alertModal.open();
            } else {
                this.$refs.alertModal.close();
            }
        }
    },
    methods: {
        closed() {
            this.$store.dispatch('toggleAlert', false);
        },
        opened() {
            setTimeout(() => {
                this.$refs.alertModal.close();
            }, 2500);
        }
    }
}
</script>
<style lang="scss" scoped>
    .fp-alert-modal {
        &::v-deep {
            .vm--container {
                z-index: 1001;
            }
        }
    }
    .fp-alert-description {
        color: #FF22A1;
        margin-bottom: 0;
        font-size: 16px;
    }
</style>