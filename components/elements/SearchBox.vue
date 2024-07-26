<template>
    <div class="search-box" :class="mode === 'top' && 'top-search'">
        <input type="text"
            class="form-control"
            :class="inputClass"
            :placeholder="placeholder"
            @keyup="handleSearch"
        />
        <fp-icon v-if="showIcon" name="search" class="text-white" />
    </div>
</template>
<script>
export default {
    name: 'SearchBox',
    props: {
        value: { type: String, default: '' },
        mode: { type: String, default: '' },
        placeholder: { type: String, default: 'Search here...'},
        inputClass: { type: String, default: '' },
        showIcon: { type: Boolean, default: true },
    },
    data: () => {
        return {
            timer: null,
        };
    },
    methods: {
        handleSearch(event) {
            const keyword = event.target.value;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$emit('input', keyword);
            }, 300);
        },
    }
}
</script>
<style lang="scss" scoped>
    .search-box {
        display: flex;
        align-items: center;
        &.top-search {
            input {
                background-color: #4F6AA3;
                border-color: #4F6AA3;
                color: #FFF;
                height: 40px;
                &::placeholder {
                    color: #FFF;
                }
            }
        }
        input {
            padding-right: 36px;
            font-size: 14.4px;
        }
        svg {
            margin-left: -26px;
            margin-top: 2px;
        }
    }
</style>