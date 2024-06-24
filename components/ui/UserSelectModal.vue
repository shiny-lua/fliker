<template>
    <div class="user-select-modal" style="z-index: 9999;">
        <fp-modal
            :name="modal_name"
            @before-open="loadSelected"
            :title="title"
        >
            <div v-if="showOnlyMe" class="d-flex align-items-center justify-content-center">
                <fp-icon name="privacy_policy" class="fp-fs-24 text-danger" />
                &nbsp;<span @click="hideSelect = !hideSelect">Only me</span>
            </div>
            <div v-if="!hideSelect" class="selector-wrapper w-50 mx-auto">
                <multiselect
                    :options="options"
                    :preserve-search="true"
                    placeholder="Search names..."
                    track-by="id"
                    label="name"
                    :show-labels="false"
                    @select="select"
                    :class="{'has-error': selected_users.length === 0 && showError}"
                >
                    <template slot="option" slot-scope="props"><img class="option__image" :src="props.option.photo_url" alt="">
                        <div class="option__desc"><span class="option__title">{{ props.option.name }}</span></div>
                    </template>
                </multiselect>
            </div>
            <div class="selected-user-wrapper mb-3">
                <div v-for="(item, index) in selected_users"
                    :key="index"
                    class="selected-user fp-border-color-1"
                >
                    <img :src="item.photo_url" width="30" height="30" />
                    {{item.name}}
                    <fa icon="times" class="remove-user" @click="remove(index)" />
                </div>
                <p v-if="showError && selected.length === 0" class="invalid-feedback text-center">
                    Please select at least 1 person or change the access level.
                </p>
            </div>
            <div v-if="showOkButton">
                <button type="button" class="btn fp-btn-gradient px-5" @click="save()">Save</button>
            </div>
        </fp-modal>
    </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import "vue-multiselect/dist/vue-multiselect.min.css"
import FpModal from "./Modal.vue";
export default {
    name: 'UserSelectModal',
    props: {
        users: { type: Array, required: true },
        value: { type: Array, default: [] },
        showOkButton: { type: Boolean, default: true },
        title: { type: String, default: '' },
        showOnlyMe: { type: Boolean, default: false },
    },
    components: {
        Multiselect,
        FpModal,
    },
    data() {
        return {
            modal_name: `user_select_modal_${Math.floor(Math.random() * 100)}`,
            selected_users: [],
            showError: false,
            hideSelect: false,
        }
    },
    computed: {
        options() {
            return this.users.filter(i => !this.selected_users.includes(i));
        },
        selected() {
            return this.selected_users.map(i => i.id);
        }
    },
    watch: {
        hideSelect(val) {
            if (val) {
                this.selected_users = [];
            }
        },
    },
    methods: {
        loadSelected() {
            this.selected_users = [];
            this.value.map(id => {
                this.selected_users.push(this.users.find(i => i.id === id))
            });
        },
        select(option) {
            if (this.selected_users.includes(option)) return false
            this.selected_users.unshift(option);
            if (!this.showOkButton) this.$emit('input', this.selected);
        },
        remove(index) {
            this.selected_users.splice(index, 1);
            if (!this.showOkButton) this.$emit('input', this.selected);
        },
        open() {
            this.$modal.show(this.modal_name);
        },
        close() {
            this.$modal.hide(this.modal_name);
        },
        save() {
            if (this.selected.length === 0 && !this.hideSelect) {
                this.showError = true;
                return;
            }
            this.$emit('input', this.selected);
            this.close();
            this.$emit('save');
        }
    }
}
</script>
<style lang="scss" scoped>
    .user-select-modal {
        &::v-deep {
            .vm--modal {
                overflow: unset;
            }
        }
    }
    .selected-user-wrapper {
        display: flex;
        flex-wrap: wrap;
        min-height: 100px;
        margin-top: 12px;
        .selected-user {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            height: 42px;
            margin-bottom: 5px;
            font-size: 14.4px;
            border-style: solid;
            border-width: 1px;
            border-radius: 8px;
            margin-right: 8px;
            img {
                width: 30px;
                height: 30px;
                border-radius: 100%;
                object-fit: cover;
                margin-right: 6px;
            }
            .remove-user {
                margin-left: 10px;
                cursor: pointer;
                color: #dc3545;
            }
        }
    }
    .btn-close-modal {
        position: absolute;
        top: 6px;
        right: 7px;
        cursor: pointer;
        font-size: 16px;
    }
    .selector-wrapper {
        margin-top: 10px;
        &::v-deep {
            .multiselect__tags {
                border-radius: 10px !important;
            }
            .multiselect__placeholder {
                font-weight: 400;
                font-size: 16px;
                line-height: 16px;
                padding-top: 4px;
            }
            .multiselect__option {
                display: flex;
                align-items: center;
                padding: 6px 8px;
                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 100%;
                    object-fit: cover;
                    margin-right: 6px;
                }
            }
        }
    }
</style>