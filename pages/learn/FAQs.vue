<template>
    <div id="faqs_page">
        <div class="row align-items-stretch">
            <div class="col-md-12">
                <div class="d-flex align-items-center mb-3">
                    <h4>Frequently Asked Questions(FAQ)</h4>
                    <div class="ml-auto position-relative">
                        <input type="text" class="form-control pr-4" placeholder="Search.." @input="handleSearch" />
                        <fp-icon name="search" class="fp-fs-18 fp-text-color-main position-absolute" style="top: 10px;right: 6px;" />
                    </div>
                </div>
                <div class="faqs">
                    <div v-for="(category, index) in categories"
                         :key="index"
                         class="faq-category"
                         :class="faqs.filter(i => i.faq_category_id === category.id).length === 0 && 'd-none'"
                    >
                        <h6>{{ category.title }}</h6>
                        <div v-for="(item, index) in faqs.filter(i => i.faq_category_id === category.id)"
                             :key="index"
                             class="faq-item fp-border-color-1"
                        >
                            <div class="d-flex align-items-center mb-2">
                                <p class="question mb-0">{{ item.question }}</p>
                                <a href="javascript::" class="ml-auto btn-collapse collapsed" data-toggle="collapse" :data-target="`#faq_answer_${item.id}`">
                                    <fp-icon name="plus" class="icon-plus" />
                                    <fp-icon name="minus" class="icon-minus" />
                                </a>
                            </div>
                            <div class="answer collapse" :id="`faq_answer_${item.id}`" v-html="item.answer"></div>
                        </div>
                    </div>
                    <div v-if="faqs.length === 0 && loading" class="text-center mt-3 mt-md-5">
                        <img src="~assets/images/logo_loading.gif" width="50" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            settings: {
                faqs: '',
            },
            categories: [],
            faqs: [],
            keyword: '',
            timer: null,
            loading: false,
        };
    },
    mounted() {
        this.init();
        this.search();
    },
    methods: {
        init() {
            this.axios.get('/faq/get_categories').then(response => {
                this.categories = response.data.data;
            });
        },
        search() {
            this.faqs = [];
            this.loading = true;
            this.axios.get('/faq/search', { params: { keyword: this.keyword } }).then(response => {
                this.faqs = response.data.data;
                this.loadiing = false;
            });
        },
        handleSearch(event) {
            this.keyword = event.target.value;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.search();
            }, 300);
        },
    }
}
</script>
<style lang="scss" scoped>
    .faq-item {
        border-radius: 10px;
        border-width: 1px;
        border-style: solid;
        margin-bottom: 16px;
        padding: 16px 12px 8px 12px;
        .question {
            width: calc(100% - 40px);
        }
        .answer {
            font-size: 13px;
            font-weight: 400;
        }
        .btn-collapse {
            padding: 2px 4px;
            border-radius: 5px;
            background-color: #FF22A1;
            svg {
                font-size: 17px;
            }
            .icon-minus {
                display: inline;
                color: #FFF;
            }
            .icon-plus {
                display: none;
            }
            &.collapsed {
                background-color: #F0F3F9;
                .icon-plus {
                    display: inline;
                }
                .icon-minus {
                    display: none;
                }
            }
        }
    }
    [data-theme=dark] {
        .faq-item {
            .btn-collapse.collapsed {
                background-color: #18243E;
            }
        }
    }
</style>