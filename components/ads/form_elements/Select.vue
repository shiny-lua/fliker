<template>
    <div class="form-group">
        <label>{{label}} <span v-if="required" class="text-danger">*</span></label>
        <select class="form-control has-bg" @change="$emit('input', $event.target.value)" :required="required">
            <option value="" hidden>{{ defaultText }}</option>
            <option v-for="option in options" :key="option.value" :value="option.value" :selected="option.value == value">{{ option.text }}</option>
        </select>
        <div v-if="hasError" class="text-danger">
            <div class="error">{{validationMessage}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AutomotiveItemSelect',
    props: {
        'options': {type: Array, required: true},
        'value': {type: String, required: true},
        'label': {type: String, required: true},
        'defaultText': {type: String, default: 'Select'},
        'hasError': {type: Boolean, required: false},
        'validationMessage': {type: String, default: 'This field is required'},
        'required': {type: Boolean, default: false},
    },
}
</script>