<template>
    <div class="top-modal fp-modal" :class="{'middle-on-mobile': middleOnMobile}">
        <modal
            :name="name"
            :width="width"
            :height="height"
            :scrollable="scrollable"
            :adaptive="adaptive"
            @before-open="$emit('before-open')"
            @before-close="$emit('before-close')"
            @opened="$emit('opened')"
            @closed="$emit('closed')"
            :click-to-close="clickToClose"
        >
            <div class="fp--modal-content">
                <a v-if="showCloseButton" href="javascript:;" class="btn-close" @click.prevent="close()">
                    <fp-icon name="close" />
                </a>
                <div v-if="showHeader" class="fp--modal-header">
                    <h6 v-if="title" class="fp--modal-title">{{ title }}</h6>
                    <slot name="header" />
                </div>
                <div class="fp--modal-body">
                    <slot />
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
import FpIconClose from "@/assets/icons/close.svg";
export default {
    name: 'fp-modal',
    props: {
        name: { type: String, required: true },
        width: { type: [String, Number], default: 500 },
        title: { type: String, default: '' },
        scrollable: { type: Boolean, default: true },
        adaptive: { type: Boolean, default: true },
        height: { type: [String, Number], default: 'auto' },
        clickToClose: { type: Boolean, default: true },
        showHeader: { type: Boolean, default: true },
        showCloseButton: { type: Boolean, default: true },
        middleOnMobile: { type: Boolean, default: false },
    },
    computed: {
        icons() {
            return { FpIconClose };
        }
    },
    methods: {
        close() {
            this.$modal.hide(this.name);
            this.$emit('close');
        },
        open() {
            this.$modal.show(this.name);
            this.$emit('open');
        }
    }
}
</script>