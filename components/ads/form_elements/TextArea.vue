<template>
    <div class="form-group position-relative">
        <label>{{label}} <span v-if="required" class="text-danger">*</span></label>
        <textarea :rows="rows" class="form-control" :value="value" @keyup="$emit('input', $event.target.value)" :placeholder="placeholder" :required="required"></textarea>
        <div v-if="hasError" class="text-danger">
            <div class="error">{{validationMessage}}</div>
        </div>
        <span v-if="showMax" class="max-length fp-text-color-main">{{ value.length }} / {{maxLength}}</span>
    </div>
</template>
<script>
export default {
    name: 'AutomotiveItemTextArea',
    props: {
        'value': {type: String, required: true},
        'label': {type: String, required: true},
        'placeholder': {type: String, required: true},
        'hasError': {type: Boolean, required: false},
        'validationMessage': {type: String, default: 'This field is required'},
        'maxLength': {type: [String, Number], required: false},
        'required': {type: Boolean, default: false},
        'showMax': {type: Boolean, default: false},
        'rows': {type: [String, Number], default: 5}
    },
}
</script>
<style lang="scss" scoped>
    input::placeholder,
    input::-webkit-input-placeholder {
        font-size: 15px;
    }
    .max-length {
        position: absolute;
        bottom: -24px;
        right: 8px;
    }
</style>