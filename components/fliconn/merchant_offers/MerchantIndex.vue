<template>
    <div class="merchant-offer-index">
        <div class="offer-categories">
            <a href="javascript:;"
                 class="category-item fp-border-color-1"
                 :class="filter.category_id === '' && 'active'"
                 @click.prevent="selectCategory('')"
            >All</a>
            <a v-for="category in merchant_categories"
                 :key="category.id"
                 href="javascript:;"
                 class="category-item fp-border-color-1"
                 :class="filter.category_id === category.id && 'active'"
                 @click.prevent="selectCategory(category)"
            >
                {{ category.name }}
            </a>
        </div>
        <div class="row mx-n1 mx-md-n2">
            <div class="d-none d-md-block"></div>
            <template v-for="(item, index) in posts"
            >
                <div :key="index" class="col-6 px-1 px-md-2 mb-2 mb-md-3">
                    <offer-item :offer="item" />
                </div>
                <div v-if="index === 3" :key="'extra_' + index" class="col-12 px-1 px-md-2 mb-2 mb-md-3">
                    <top-businesses></top-businesses>
                </div>
            </template>
        </div>
        <infinite-loading :distance="300"
            :identifier="infiniteId"
            @infinite="search"
        >
            <div slot="no-more"></div>
            <div class="text-center mt-3 fp-text-color-main" slot="no-results">No offers found</div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>
    </div>
</template>
<script>
import OfferItem from "./OfferItem.vue";
import TopBusinesses from "./TopBusinesses.vue";
export default {
    name: 'MerchantIndex',
    components: {
        OfferItem,
        TopBusinesses,
    },
    data() {
        return {
            posts: [],
            merchant_categories: [],
            filter: {
                category_id: '',
                keyword: '',
                page: 1,
            },
            infiniteId: +new Date(),
            loading: false,
        }
    },
    mounted() {
        this.getCategories();
        setTimeout(() => {
            if (!this.loading) {
                this.searchPosts();
            }
        }, 100);
    },
    methods: {
        searchPosts(keyword = '') {
            this.posts = [];
            this.filter.keyword = keyword;
            this.filter.page = 1;
            this.infiniteId += 1;
        },
        async search($state) {
            this.loading = true;
            try {
                const response = await this.axios.post(`${process.env.merchantApiUrl}/merchant/search_offer`, this.filter);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.posts = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.posts.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
                this.loading = false;
            } catch (error) {
                console.log(error);
            }
        },
        async getCategories() {
            const response = await this.axios.get(`${process.env.merchantApiUrl}/merchant/get_categories`);
            this.merchant_categories = response.data.data;
        },
        selectCategory(category) {
            if (category) {
                this.filter.category_id = this.filter.category_id === category.id ? '' : category.id;
            } else {
                this.filter.category_id = '';
            }
            this.searchPosts();
        }
    }
}
</script>
<style lang="scss" scoped>
    .offer-categories {
        display: flex;
        flex-wrap: wrap;
        @media (max-width: 600px) {
            flex-wrap: nowrap;
            overflow: auto;
        }
        .category-item {
            font-size: 13px;
            padding: 6px 12px;
            color: #64748B;
            border: solid 1px #D6DFE8;
            border-radius: 6px;
            background-color: transparent;
            text-align: center;
            text-decoration: none;
            font-weight: 500;
            white-space: nowrap;
            margin-bottom: 8px;
            margin-right: 8px;
            &:last-child {
                margin-right: 0;
            }
            &.active {
                border: none;
                background: linear-gradient(92.21deg, #FF22A1 -3.4%, #FFA3D8 100%);
                color: #fff;
            }
        }
    }

    [data-theme=dark] {
        .category-item {
            border: 1px solid rgba(255, 255, 255, 0.2)
        }
    }
</style>