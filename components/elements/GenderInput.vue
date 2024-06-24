<template>
    <div class="gender-input">
        <div class="dropdown">
            <a href="javascript:;" class="btn btn-block dropdown-toggle" :class="isInvalid && 'border-danger'" data-toggle="dropdown">
                <span class="gender-icon" style="margin-top: -2px;">
                    <fp-icon v-if="value === 'male'" name="gender-male" class="fp-fs-20" />
                    <fp-icon v-else-if="value === 'female'" name="gender-female" class="fp-fs-20" />
                    <fp-icon v-else-if="value === 'custom'" name="gender" class="fp-fs-20" />
                    <fp-icon v-else-if="value === 'not_to_say'" name="ban" class="fp-fs-18" />
                    <fp-icon v-else name="gender" class="fp-fs-20" />
                </span>
                <span v-if="value === 'male'" class="fp-text-color">Male</span>
                <span v-else-if="value === 'female'" class="fp-text-color">Female</span>
                <span v-else-if="value === 'custom'" class="fp-text-color">Custom</span>
                <span v-else-if="value === 'not_to_say'" class="fp-text-color">Prefer not to say</span>
                <span v-else>Gender</span>
            </a>
            <div class="dropdown-menu" :class="direction === 'right' && 'dropdown-menu-right'">
                <a href="javascript:;" tabindex="-1" class="dropdown-item fp-text-color" @click.prevent="changeGender('male')">
                    <fp-icon name="gender-male" class="fp-fs-20" />
                    Male : <span class="fp-text-color-main">Pronounce as He/Him</span>
                </a>
                <a href="javascript:;" tabindex="-1" class="dropdown-item fp-text-color" @click.prevent="changeGender('female')">
                    <fp-icon name="gender-female" class="fp-fs-20" />
                    Female : <span class="fp-text-color-main">Pronounce as She/Her</span>
                </a>
                <a href="javascript:;" tabindex="-1" class="dropdown-item fp-text-color" @click.prevent="changeGender('custom')">
                    <fp-icon name="gender" class="fp-fs-20" />
                    Custom : <span class="fp-text-color-main">Define your own</span>
                </a>
                <a href="javascript:;" tabindex="-1" class="dropdown-item fp-text-color" @click.prevent="changeGender('not_to_say')">
                    <fp-icon name="ban" class="fp-fs-18" />
                    Prefer not to say
                </a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'GenderInput',
    props: {
        value: { type: String, required: true },
        direction: { type: String, default: 'left' },
        isInvalid: { type: Boolean, default: false },
    },
    methods: {
        changeGender(gender) {
            this.$emit('input', gender);
        },
    }
}
</script>
<style lang="scss" scoped>
    .gender-input {
        .dropdown-toggle {
            position: relative;
            border: 1px solid #D3DDEB;
            text-align: left;
            padding-left: 8px;
            padding-right: 8px;
            &::after {
                position: absolute;
                top: 16px;
                right: 12px
            }
        }
        .dropdown-menu {
            padding: 12px;
            .dropdown-item {
                font-size: 14px;
            }
            @media (max-width: 600px) {
                width: 100%;
            }
        }
    }
    [data-theme=dark] {
        .gender-input {
            .dropdown-toggle {
                color: #64748B;
                border-color: rgba(255, 255, 255, 0.2);

            }
        }
    }
</style>