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
            <div class="search-result" :class="showResult && 'show'" v-click-outside="hideResult">
                <p v-if="searched_users.length === 0" class="mb-0 text-muted text-center">No result</p>
                <div v-for="(item, index) in searched_users"
                     :key="index"
                     class="user-item d-flex mb-2"
                      @click.prevent="select(item)"
                >
                    <img :src="item.photo_url" width="40" height="40" alt="" class="user-photo rounded-lg" />
                    <div class="user-details flex-grow-1 d-flex align-items-center ml-2">
                        <div>
                            <p class="mb-0 font-weight-bold">{{ item.name }}</p>
                            <p class="mb-0 fp-text-active username">@{{ item.username }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SearchUsers',
    props: {
        url: { type: String, required: true },
        placeholder: { type: String, default: 'Search name or @username...' },
        params: { type: Object, default: () => {return new Object()} },
    },
    data() {
        return {
            keyword: '',
            showResult: false,
            searched_users: [],
            timer: null,
            loading: false,
        }
    },
    computed: {
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
                } else {
                    this.searchUsers(keyword);
                }
            }, 300);
        },
        async searchUsers(keyword) {
            this.loading = true;
            try {
                const response = await this.axios.post(this.url, {keyword: keyword, ...this.params});
                this.searched_users = response.data.data.current_page ? response.data.data.data : response.data.data;
                this.showResult = true;
                this.loading = false;
            } catch (error) {
                this.loading = false;
            }
        },
        hideResult() {
            this.showResult = false;
        },
        select(item) {
            this.$emit('input', item);
            this.keyword = '';
            this.showResult = false;
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
    .icon-prefix-input {
        input {
            width: 243px;
            &::placeholder {
                font-size: 15px;
            }
        }
    }
    .search-users {
        .search-result {
            position: absolute;
            top: 39px;
            left: 0;
            width: 100%;
            max-height: 180px;
            display: none;
            background-color: #FFF;
            border-radius: 8px;
            z-index: 9999;
            padding: 8px;
            border: solid 1px #ced4da;
            &.show {
                display: block;
                overflow-y: auto;
            }
            .user-item {
                cursor: pointer;
                &:last-child {
                    margin-bottom: 0 !important;
                }
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