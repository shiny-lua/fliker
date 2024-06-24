<template>
    <div class="input-wrapper">
        <input type="text" :class="inputClass" @keyup="input" autofocus :placeholder="placeholder" />
        <fp-icon name="search" class="fp-fs-22" />
    </div>
</template>
<script>
export default {
    name: 'SearchInput',
    props: {
        inputClass: { type: String, default: 'form-control' },
        placeholder: { type: String, default: '' },
    },
    methods: {
        input(event) {
            if (event.keyCode === 13) {
                this.$emit('search', event.target.value);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .input-wrapper {
        display: flex;
        align-items: center;
        img {
            width: 18px;
            height: 18px;
            margin-left: -26px;
        }
        input {
            border-radius: 10px;
            padding-right: 30px;
        }
    }
</style>