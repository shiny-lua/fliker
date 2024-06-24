<template>
    <div class="step-header" :data-step="`step_${selected + 1}`">
        <ul class="step-pills">
            <li v-for="(item, index) in steps"
                :key="index"
                class="step-item"
                :class="selected == index && 'active'"
                :style="{width: 100 / steps.length + '%'}"
            >
                <a href="javascript:;" class="step-link" @click="select(index)">
                    <span class="tabStatus">{{index}}</span>
                    <span class="tabLabel">{{item}}</span>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
import 'vue-step-wizard/dist/vue-step-wizard.css'
export default {
    name: 'StepsHeader',
    props: ['steps', 'selected'],
    methods: {
        select(index) {
            this.$emit('selected', index)
        }
    }
}
</script>
<style lang="scss" scoped>
    .step-header {
        .step-pills {
            box-shadow: none !important;
            margin-bottom: 0;
            border: none;
            box-shadow: none !important;
            background: none !important;
        }
    }
</style>