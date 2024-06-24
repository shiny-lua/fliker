<template>
    <div class="steps" ref="steps">
        <template v-for="(item, index) in steps">
            <input type="radio" :key="index" :for="`step-${index}`" value="steps" name="steps" class="steps__radio" :checked="step === item.value">
            <label :key="`label-${index}`" :for="`step-${index}`" class="steps__label" @click="changeValue(item.value)">{{ item.label }}</label>
        </template>
    </div>
</template>
<script>
export default {
    name: 'StepRadios',
    props: {
        value: { type: Number, required: true },
        steps: { type: Array, required: true },
    },
    data() {
        return {
            step: 0,
        }
    },
    mounted() {
        this.step = this.value;
    },
    methods: {
        changeValue(val) {
            this.step = val;
            this.$emit('input', this.step);
        }
    }
}
</script>
<style lang="scss" scoped>
    $highlight: #FF22A1;
    $lowlight: #64748B;
    .steps {
        background: transparent;
        box-sizing: border-box;
        display: block;
        height: 6em;
        overflow: hidden;
        padding: 1em 0;
        position: relative;
        width: 100%;
        &::before {
            border: 1px solid $lowlight;
            content: "";
            display: block;
            position: absolute;
            top: 51px;
            width: calc(100% - 68px);
        }
        &__radio {
            display: none;
            &:checked + label ~ label {
                color: #64748B;
                &::before {
                    background: white;
                    border-color: $lowlight;
                }
                &::after {
                    background: $lowlight;
                }
            }
        }
        &__label {
            color: #64748B;
            display: inline-block;
            font-weight: bold;
            position: relative;
            width: 68px;
            margin-bottom: 0;
            &::before {
                background: $highlight;
                border-radius: 50%;
                border: 2px solid $highlight;
                bottom: calc((100% - 3.7em) + 5px);
                content: "";
                display: block;
                width: 1.5em;
                height: 1.5em;
                left: 0;
                position: absolute;
                z-index: 9;
            }
            &::after {
                background: $highlight;
                content: "";
                display: block;
                height: 2px;
                position: absolute;
                right: 50px;
                top: 37px;
                width: 70px;
            }
        }
    }
</style>