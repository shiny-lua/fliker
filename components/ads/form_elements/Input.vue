<template>
    <div class="form-group">
        <label>{{label}} <span v-if="required" class="text-danger">*</span></label>
        <input type="text" class="form-control" :value="value" @keyup="$emit('input', $event.target.value)" :maxlength="maxLength" :placeholder="placeholder" :required="required" />
        <div v-if="hasError" class="text-danger">
            <div class="error">{{validationMessage}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AutomotiveItemInput',
    props: {
        'value': {type: String, required: true},
        'label': {type: String, required: true},
        'placeholder': {type: String, default: ''},
        'hasError': {type: Boolean, required: false},
        'validationMessage': {type: String, default: 'This field is required'},
        'maxLength': {type: String, required: false},
        'required': {type: Boolean, default: false},
    },
}
</script>
<style lang="scss" scoped>
    input::placeholder,
    input::-webkit-input-placeholder {
        font-size: 15px;
    }
</style>