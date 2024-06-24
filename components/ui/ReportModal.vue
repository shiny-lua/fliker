<template>
    <fp-modal ref="reportModal"
        name="reportModal"
        title="Found something wrong?"
        @before-close="closed"
    >
        <form @submit.prevent="send">
            <div class="form-group">
                <textarea v-model="form.detail"
                     rows="5"
                     class="form-control"
                     placeholder="Describe details here"
                     required
                ></textarea>
            </div>
            <div>
                <button type="submit"
                        class="btn fp-btn-gradient px-3"
                        :class="form.busy && 'btn-loading'"
                        :disabled="form.busy"
                ><fp-icon name="share" class="fp-fs-22" /> Submit</button>
            </div>
        </form>
    </fp-modal>
</template>
<script>
import FpModal from "./Modal.vue"
import eventBus from '~/plugins/event-bus';
import Form from "vform";
export default {
    name: 'ReportModal',
    components: {
        FpModal,
    },
    data() {
        return {
            form: new Form({
                detail: '',
            }),
        }
    },
    computed: {
        report_data() {
            return this.$store.getters['report_data'];
        },
        open_report() {
            return this.$store.getters['open_report'];
        }
    },
    watch: {
        open_report(value) {
            if (value) {
                this.$refs.reportModal.open();
            } else {
                this.$refs.reportModal.close();
            }
        }
    },
    methods: {
        async send() {
            this.form.update(this.report_data.params);
            const response = await this.form.post(this.report_data.url);
            if (response.data.status === 'Success') {
                this.$refs.reportModal.close();
                this.$fpSuccess('Your report have been submitted!');
                eventBus.$emit('reported', this.report_data.params);
            }
        },
        open() {
            this.$refs.reportModal.open();
        },
        closed() {
            this.form.reset();
            this.$store.dispatch('toggleReport', false);
        },
    }
}
</script>