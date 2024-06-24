<template>
    <div class="search-users">
        <div class="position-relative">
            <div class="icon-prefix-input" ref="input">
                <slot name="image">
                    <fp-icon name="add-group" />
                </slot>
                <input type="text" name="keyword" class="form-control" v-model="keyword" :placeholder="placeholder" />
                <div v-if="loading" class="spinner-border text-muted"></div>
            </div>
            <div class="search-result fp-border-color-1 fp-bg-color-1 nice-scrollbar" :class="showResult && 'show'" v-click-outside="hideResult">
                <p v-if="options.length === 0" class="mb-0 text-muted text-center">No result</p>
                <div v-for="(item, index) in options" :key="index" class="user-item d-flex mb-2">
                    <img :src="item.photo_url" width="40" height="40" alt="" class="user-photo rounded-lg" />
                    <div class="user-details flex-grow-1 d-flex align-items-center ml-2">
                        <div>
                            <p class="mb-0 font-weight-bold">{{ item.name }}</p>
                            <p class="mb-0 fp-text-color-main username">@{{ item.username }}</p>
                        </div>
                        <div class="actions ml-auto">
                            <a href="javascript:;" class="btn btn-sm fp-btn-gradient py-1 px-3" @click.prevent="select(item)">Add</a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showSelected && selected_users.length" class="selected-users mt-2">
                <div v-for="(item, index) in selected_users.slice(0, visible_length)" :key="index" class="user-item">
                    <img :src="item.photo_url" width="50" height="50" alt="" class="user-photo rounded-lg" />
                    <p class="user-name text-center mb-0">{{ item.name }}</p>
                    <fa :icon="['far', 'times-circle']" class="btn-remove" @click="remove(index)" />
                </div>
                <div v-if="selected_users.length > visible_length"
                     class="more-users cursor-pointer"
                     @click="$refs.allUsersModal.open()"
                >
                    {{ selected_users.length - visible_length }}+
                </div>
            </div>
        </div>
        <fp-modal ref="allUsersModal"
             :title="allUserModalTitle"
             name="allUsersModal"
        >
            <div class="selected-users flex-wrap mb-n1">
                 <div v-for="(item, index) in selected_users" :key="index" class="user-item mb-1">
                    <img :src="item.photo_url" width="50" height="50" alt="" class="user-photo rounded-lg" />
                    <p class="user-name text-center mb-0">{{ item.name }}</p>
                    <fa :icon="['far', 'times-circle']" class="btn-remove" @click="remove(index)" />
                </div>
            </div>
        </fp-modal>
    </div>
</template>
<script>
import FpModal from "~/components/ui/Modal.vue";
export default {
    name: 'SearchUsers',
    props: {
        value: { type: [Array, Object], default: () => {return new Array()} },
        url: { type: String, required: true },
        placeholder: { type: String, default: 'Search people...' },
        params: { type: Object, default: () => {return new Object()} },
        showSelected: { type: Boolean, default: true },
        allUserModalTitle: { type: String, default: 'All Users' },
    },
    components: {
        FpModal
    },
    data() {
        return {
            keyword: '',
            showResult: false,
            selected_users: [],
            searched_users: [],
            timer: null,
            loading: false,
        }
    },
    computed: {
        selected() {
            return this.selected_users.map(i => i.id);
        },
        selectedNames() {
            return this.selected_users.map(i => i.name);
        },
        options() {
            return this.searched_users.filter(i => !this.selected.includes(i.id));
        },
        visible_length() {
            const inputWidth = this.$refs.input.clientWidth;
            return Math.floor(inputWidth / 60);
        },
    },
    watch: {
        keyword() {
            this.handleSearch(this.keyword);
        }
    },
    methods: {
        handleSearch(keyword) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (keyword == '') {
                    this.searched_users = [];
                } else if (keyword.length > 2) {
                    this.searchUsers(keyword);
                }
            }, 300);
        },
        async searchUsers(keyword) {
            this.loading = true;
            try {
                const response = await this.axios.get(this.url, {params: {keyword: keyword, ...this.params}});
                this.searched_users = response.data.data.current_page ? response.data.data.data : response.data.data;
                this.showResult = true;
            } catch (error) {

            }
            this.loading = false;
        },
        hideResult() {
            this.showResult = false;
        },
        select(item) {
            if (this.selected.includes(item.id)) return false
            this.selected_users.unshift(item);
            this.$emit('input', this.selected);
            this.$emit('selected', this.selectedNames);
        },
        remove(index) {
            this.selected_users.splice(index, 1);
            this.$emit('input', this.selected);
            this.$emit('selected', this.selectedNames);
        },
    },
    directives: {
        'click-outside': {
            bind: function (el, binding, vnode) {
                el.clickOutsideEvent = function (event) {
                    if (!(el == event.target || el.contains(event.target))) {
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener('click', el.clickOutsideEvent)
            },
            unbind: function (el) {
                document.body.removeEventListener('click', el.clickOutsideEvent)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .search-users {
        .search-result {
            position: absolute;
            top: 39px;
            left: 0;
            width: 100%;
            max-height: 180px;
            display: none;
            border-radius: 8px;
            z-index: 9999;
            padding: 8px;
            border-style: solid;
            border-width: 1px;
            &.show {
                display: block;
                overflow-y: auto;
            }
        }
        .search-result {
            .user-item {
                &:last-child {
                    margin-bottom: 0 !important;
                }
            }
        }
        .selected-users {
            display: flex;
            align-items: center;
            .user-item {
                width: 50px;
                text-align: center;
                margin-right: 8px;
                position: relative;
                .user-photo {
                    object-fit: cover;
                    margin: auto;
                }
                .user-name {
                    width: 100%;
                    margin-top: 3px;
                    font-size: 12px;
                    line-height: 14px;
                    font-weight: 600;
                    height: 28px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .btn-remove {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    cursor: pointer;
                    color: #DC3545;
                    font-size: 13px;
                }
            }
            .more-users {
                font-size: 24px;
                color: #007BFF;
                margin-top: -27px;
            }
        }
        .spinner-border {
            width: 1rem;
            height: 1rem;
            border-width: 0.18rem;
            position: absolute;
            right: 8px;
        }
    }
</style>