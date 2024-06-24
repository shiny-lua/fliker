<template>
    <div class="form-group">
        <label>{{label}}</label>
        <div :class="withCurrency && 'with-currency-unit with-currency'">
            <span v-if="withCurrency" class="symbol">$</span>
            <input
                type="number"
                class="form-control"
                :value="value"
                @keyup="$emit('input', $event.target.value)"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                :maxlength="maxLength"
                :placeholder="placeholder"
            />
        </div>
    </div>
</template>
<script>
export default {
    name: 'AutomotivePriceInput',
    props: {
        'value': {type: String, required: true},
        'label': {type: String, required: true},
        'placeholder': {type: String, required: true},
        'maxLength': {type: String, required: false},
        'withCurrency': { type: Boolean, default: true },
    },
}
</script>
<style lang="scss" scoped>
    input::placeholder,
    input::-webkit-input-placeholder {
        font-size: 15px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
    .symbol {
        left: 19px;
    }
</style>