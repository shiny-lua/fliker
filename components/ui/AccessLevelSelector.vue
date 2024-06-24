<template>
    <div class="access-level-selector dropdown">
        <a href="javascript:;" class="btn fp-border-color-1 fp-text-color-main dropdown-toggle no-caret" data-toggle="dropdown">
            <fp-icon :name="selected.icon" class="dropdown-icon" />
            {{ selected.label }}
            <span class="caret ml-auto pl-2">
                <fp-icon name="chevron-down" class="fp-fs-18" />
            </span>
        </a>
        <div class="dropdown-menu">
            <a v-for="item in levels" :key="item.key"
                    href="javascript:;"
                    class="dropdown-item fp-text-color"
                    @click="levelSelected(item)"
            >
                <fp-icon :name="item.icon" class="dropdown-icon" />
                {{item.label}}
            </a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AccessLevelSelector',
    props: {
        value: { type: String, required: true },
        levels: { type: Array, default: []},
    },
    computed: {
        selected() {
            const value = this.levels.find(i => i.key === this.value);
            if (!value) return { public: 'Public' };
            return value;
        },
    },
    methods: {
        levelSelected(item) {
            this.$emit('input', item.key);
            this.$emit('change', item.key);
        }
    }

}
</script>
<style lang="scss" scoped>
    .access-level-selector {
        display: inline-block;
    }
    .dropdown-toggle {
        display: inline-flex;
        align-items: center;
        min-width: 195px;
        text-align: left;
        .dropdown-icon {
            margin-right: 5px;
            font-size: 18px;
        }
    }
    .dropdown-menu {
        min-width: 100%;
        padding: 12px;
        border-radius: 8px;
        .dropdown-item {
            margin-bottom: 12px;
            padding: 0;
            transition: color 0.1s linear;
            .dropdown-icon {
                font-size: 18px;
            }
            &:last-child {
                margin-bottom: 0;
            }
            &:hover {
                color: #FF22A1 !important;
            }
        }
    }
</style>