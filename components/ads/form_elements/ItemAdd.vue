<template>
    <div class="form-group">
        <label v-if="label">{{ label }}</label>
        <div>
            <form @submit.prevent="addItem()">
                <div class="input-group">
                    <input type="text" class="form-control" v-model="item" :maxlength="maxLength" :placeholder="placeholder" required />
                    <div class="input-group-prepend">
                        <button type="submit" class="btn fp-btn-gradient"><fa icon="plus" /> {{buttonText}}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AutomotiveItemAdd',
    props: {
        'value': {type: Array, required: true},
        'label': {type: String, default: ''},
        'buttonText': {type: String, default: ''},
        'placeholder': {type: String, default: ''},
        'maxLength': {type: [String, Number], default: 30},
        'maxItems': {type: [String, Number], default: 15},
        'limitMaxItems': {type: Boolean, default: true},
    },
    data() {
        return {
            item: '',
            result: this.value,
        }
    },
    methods: {
        addItem() {
            if (this.limitMaxItems) {
                if (this.result.length >= this.maxItems) {
                    this.$fpError(`Max list of ${this.label.toLowerCase()} is reached. Please add full list of ${this.label.toLowerCase()} in post details.`);
                    return false;
                }
            }
            if (!this.result.includes(this.item)) {
                this.result.push(this.item);
                this.$emit('input', this.result);
                this.item = '';
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    input::placeholder,
    input::-webkit-input-placeholder {
        font-size: 15px;
    }
    button {
        border-top-right-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
    }
</style>