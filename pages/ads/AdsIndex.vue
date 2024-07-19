<template>
  <div class="ads-index pt-md-3 pt-2">
    <div class="ads-index-left-panel">
      <div class="ads-index-left-card fp-card">
        <location class="mb-2" />
        <div>
          <router-link :to="{ name: 'ads.add' }" class="btn fp-btn-gradient btn-block mb-1">
            <fp-icon name="plus-square" class="fp-fs-20 mt-n-2px" /> &nbsp;Add a
            Post
          </router-link>
        </div>
        <category-selector @select="selectCategory" @select-automotive="selectAutomotiveHome" />
      </div>
    </div>
    <div class="ads-posts pl-0 pl-md-3">
      <div class="d-md-none mb-2">
        <search-box v-model="filter.keyword" input-class="has-bg mobile-has-no-bg border-0" :showIcon="false" />
      </div>
      <div class="sub-category-container sticky-header mb-0" :class="show_more_category && 'expanded'">
        <div v-if="filter.is_automotive" ref="subCatSelector" style="display: flex">
          <span :class="{
            'fp-filter-item mr-2 mb-2': true,
            active: filter.automotive_categories.length === 0,
          }" v-on:click="emptyAutoMotiveFilters()">All</span>
          <template v-if="automotive_categories?.length > 0">
            <VueSlickCarousel v-bind="sliderSettings">
              <div v-for="item in automotive_categories" :key="item.id" :class="{
                'fp-filter-item mr-2 mb-2': true,
                active: filter.automotive_categories.includes(item.id),
              }" @click="selectAutomotiveHome(item)">
                {{ item.name }}
              </div>
            </VueSlickCarousel>
          </template>
        </div>

        <!-- <div
          v-if="filter.is_automotive"
          ref="subCatSelector"
          class="sub-category-selector"
        >
          <span
            :class="{
              'fp-filter-item mr-2 mb-2': true,
              active: filter.automotive_categories.length === 0,
            }"
            >All</span
          >
          <span
            v-if="automotive_categories.length > 0"
            v-for="item in automotive_categories"
            :key="item.id"
            :class="{
              'fp-filter-item mr-2 mb-2': true,
              active: filter.automotive_categories.includes(item.id),
            }"
            @click="selectAutomotiveHome(item)"
            >{{ item.name }}</span
          >
          <a
            v-if="categoryOverflow && !show_more_category"
            href="javascript:;"
            class="btn-more d-none d-md-inline text-primary"
            @click.prevent="show_more_category = true"
            >More..</a
          >
        </div> -->
        <!-- <div
          v-else-if="selected_category"
          ref="subCatSelector"
          class="sub-category-selector"
        >
          <span
            :class="{
              'fp-filter-item mr-2 mb-2': true,
              active: filter.sub_categories.length === 0,
            }"
            >All</span
          >
          <span
            v-for="item in selected_category.sub_categories"
            :key="item.id"
            :class="{
              'fp-filter-item mr-2 mb-2': true,
              active: filter.sub_categories.includes(item.id),
            }"
            @click="selectSubCategory(item)"
          >
            {{ item.name }}
          </span>
          <a
            v-if="categoryOverflow && !show_more_category"
            href="javascript:;"
            class="btn-more text-primary"
            @click.prevent="show_more_category = true"
            >More..</a
          >
        </div> -->

        <div v-else-if="selected_category" style="display: flex">
          <span :class="{
            'fp-filter-item mr-2 mb-2': true,
            active: filter.sub_categories?.length === 0,
          }" v-on:click="emptyFilters()">All</span>
          <template v-if="selected_category?.sub_categories?.length > 0">
            <VueSlickCarousel v-bind="sliderSettings" ref="subCatSlick" :key="selected_category.id">
              <div v-for="item in selected_category.sub_categories" :key="item.id" :class="{
                'fp-filter-item mr-2 mb-2': true,
                active: filter.sub_categories.includes(item.id),
              }" @click="selectSubCategory(item)">
                {{ item.name }}
              </div>
            </VueSlickCarousel>
          </template>
        </div>

        <!-- filtered sub categories start-->
        <div v-if="this.filter.is_automotive == 1">
          <span class="information-item" v-for="(item, index) in filter.automotive_categories" :key="index">
            {{ automotive_categories.find((i) => i.id == item).name }}
            <!-- {{
              automotive_categories.find((i) => i.id == item).name
            }} -->
            <fa icon="times" class="btn-remove" @click="removeAutomotive(item)" />
          </span>
        </div>
        <div v-else>
          <span class="information-item" v-for="(item, index) in filter.sub_categories" :key="index">
            {{
              selected_category.sub_categories.find((i) => i.id == item).name
            }}
            <fa icon="times" class="btn-remove" @click="removeService(item)" />
          </span>
        </div>
        <!-- filtered sub categories end-->
      </div>

      <p v-if="location && location.city" class="location-near-by mt-2 mb-2 d-none d-md-block">
        {{ location.city }} and near by
      </p>
      <div class="auto-grid">
        <div class="card" v-for="(post, index) in posts" :key="index">
          <Post :post="post" :is_automotive="filter.is_automotive" />
        </div>
      </div>
      <infinite-loading :distance="0" :identifier="infiniteId" @infinite="searchPosts" class="mb-5">
        <div slot="no-more"></div>
        <div slot="no-results">
          <no-results />
        </div>
        <div slot="spinner" class="pt-3 pt-md-4">
          <img src="~assets/images/logo_loading.gif" width="50" alt="" />
        </div>
      </infinite-loading>
    </div>
    <portal to="top-search">
      <search-box v-model="filter.keyword" mode="top" />
    </portal>
    <portal to="fp-sidebar">
      <div class="sidebar-menu pt-1 px-3">
        <div class="fp-border-color-1 border-bottom pt-2 pb-3">
          <location :is_mobile="true" />
        </div>
        <category-selector @select="selectCategory" @select-automotive="selectAutomotiveHome"
                           v-on:select="handleReInItSlick" />
      </div>
    </portal>
    <portal to="mobile-page-title">
      <h6 class="mb-0 mobile-page-title">{{ pageTitle }}</h6>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SearchBox from "~/components/elements/SearchBox.vue";
import CategorySelector from "~/components/ads/CategorySelector.vue";
import Post from "~/components/ads/Post.vue";
import Location from "~/components/ui/Location.vue";
import NoResults from "~/components/elements/NoResults.vue";
import Cookies from "js-cookie";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import VueSlickCarousel from "vue-slick-carousel";

export default {
  name: "AdsIndex",
  components: {
    Post,
    Location,
    SearchBox,
    CategorySelector,
    NoResults,
    VueSlickCarousel,
  },
  data: () => ({
    title: process.env.appName,
    selected_category: null,
    selected_sub_categories: [],
    sub_categories: [],
    automotive_categories: [],
    posts: [],
    sliderSettings: {
      slidesToScroll: 1,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            arrows: true,
            slidesToScroll: 1,
            variableWidth: true,
          },
        },
        {
          breakpoint: 900,
          settings: {
            arrows: false,
            slidesToScroll: 1,
            variableWidth: true,
          },
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            slidesToScroll: 1,
            variableWidth: true,
          },
        },
      ],
      // centerPadding: "10px",
    },
    currentSlideIndex: 0,
    filter: {
      location: "",
      keyword: "",
      category_id: "",
      sub_categories: [],
      sub_categories_names: [],
      is_automotive: "",
      automotive_categories: [],
      status: "active",
      page: 1,
    },
    infiniteId: +new Date(),
    show_more_category: false,
    categoryOverflow: false,
  }),
  head() {
    return { title: "Ads" };
  },
  watch: {
    selected_category: function (newVal) {
      this.sub_categories = [];
      if (newVal) {
        this.filter.category_id = newVal.id;
        this.filter.sub_categories = [];
      } else {
        this.filter.category_id = "";
        this.selected_sub_categories = [];
      }
      this.triggerSearchPosts();
    },
    selected_sub_categories: function (newVal) {
      let sub_categories = newVal.map((i) => i.id);
      this.filter.sub_categories = sub_categories ? sub_categories : [];
      this.triggerSearchPosts();
    },
    location: async function (newLocation) {
      if (newLocation.country) {
        await this.$store.dispatch("ads/getCategories");
        this.triggerSearchPosts();
      }
    },
    "filter.keyword": function (newVal) {
      this.triggerSearchPosts();
    },
    categories: function (newVal) {
      if (newVal.length == 0) {
        this.$router.push({ name: "choose_country" });
      }
    },
  },
  computed: {
    pageTitle() {
      if (this.filter.is_automotive) {
        return "Automotives";
      } else if (this.selected_category) {
        return this.selected_category.name;
      } else {
        return "Local Ads";
      }
    },
    ...mapGetters({
      location: "ads/location",
      categories: "ads/categories",
      auth_user: "auth/user",
      authenticated: "auth/check",
    }),
  },
  mounted() {
    this.init();
    this.filter.location = this.location;

    this.$store.dispatch("setEnableChat", true);
    this.$store.dispatch("setHasSidebar", true);

    let last_visited_route = Cookies.get("last_visited_route");
    if (last_visited_route && last_visited_route !== this.$route.name) {
      this.$router.push({ name: last_visited_route });
    }
  },
  beforeDestroy() {
    this.$store.dispatch("setEnableChat", false);
    this.$store.dispatch("setHasSidebar", false);
  },
  methods: {
    async init() {
      if (this.$route.query.sub_category_id) {
        this.filter.sub_categories = [this.$route.query.sub_category_id];
      }
      const response = await this.axios.post(
        `${process.env.adsApiUrl}/automotive/get_categories`
      );
      this.automotive_categories = response.data.data;
    },

    checkCategoryOverflow() {
      const selector = this.$refs.subCatSelector;
      if (selector) {
        const height = selector.clientHeight;
        this.categoryOverflow = height > 40;
      }
    },
    triggerSearchPosts() {
      this.posts = [];
      this.filter.page = 1;
      this.infiniteId += 1;
    },
    async searchPosts($state) {
      this.filter.location = this.location;
      const response = await this.axios.post(
        `${process.env.adsApiUrl}/post/search`,
        this.filter
      );
      if (response.data.status == "Success") {
        let result = response.data.data;
        if (result.current_page == 1) this.posts = [];
        if (result.data.length) {
          this.posts.push(...result.data);
          await this.$nextTick();
          this.filter.page++;
          $state.loaded();
        } else {
          $state.complete();
        }
      }
    },
    async selectCategory(item) {
      this.show_more_category = false;
      this.filter.is_automotive = "";
      this.filter.sub_categories = [];
      this.selected_category = item;
      this.filter.category_id = item.id;
      await this.$nextTick();
      this.checkCategoryOverflow();
      this.$store.dispatch("toggleLeftMenu", false);
      this.triggerSearchPosts();
    },
    getSubCategories(category_id) {
      let params = {
        category_id: category_id,
        country_code: this.location ? this.location.country : "",
      };
      this.axios
        .post(`${process.env.adsApiUrl}/category/get_sub_categories`, params)
        .then((response) => {
          this.sub_categories = response.data.data;
        });
    },
    selectSubCategory(item) {
      this.filter.is_automotive = "";
      this.selected_category = this.categories.find(
        (i) => i.id == item.category_id
      );
      if (this.selected_sub_categories.includes(item)) {
        let index = this.selected_sub_categories.findIndex(
          (i) => i.id == item.id
        );
        this.selected_sub_categories.splice(index, 1);
      } else {
        this.selected_sub_categories.push(item);
      }
    },
    emptyFilters() {
      this.selected_sub_categories = [];
      this.filter.sub_categories = [];
      this.triggerSearchPosts();
    },
    emptyAutoMotiveFilters() {
      this.filter.automotive_categories = [];
      this.triggerSearchPosts();
    },
    removeService(item) {
      let index = this.filter.sub_categories.findIndex((i) => i === item);
      let selectedsubIndex = this.selected_sub_categories.findIndex(
        (i) => i.id === item
      );
      this.filter.sub_categories.splice(index, 1);
      this.selected_sub_categories.splice(selectedsubIndex, 1);
      this.triggerSearchPosts();
      console.log("data", this.filter.sub_categories);
    },
    removeAutomotive(item) {
      let index = this.filter.automotive_categories.findIndex(
        (i) => i === item
      );
      this.filter.automotive_categories.splice(index, 1);
      this.triggerSearchPosts();
    },

    async selectAutomotiveHome(category = null) {
      this.filter.is_automotive = 1;
      if (category) {
        let index = this.filter.automotive_categories.findIndex(
          (i) => i === category.id
        );
        if (index === -1) {
          this.filter.automotive_categories.push(category.id);
          console.log("data", this.filter.automotive_categories);
        } else {
          this.filter.automotive_categories.splice(index, 1);
        }
      } else {
        this.show_more_category = false;
        this.filter.automotive_categories = [];
        await this.$nextTick();
        this.checkCategoryOverflow();
      }
      this.$store.dispatch("toggleLeftMenu", false);
      this.filter.category_id = "automotive";
      this.filter.sub_categories = [];
      this.triggerSearchPosts();
    },
    login(redirect = "") {
      if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
      if (this.$route.name !== "login") this.$router.push({ name: "login" });
    },
    goToPage(routerName) {
      if (!this.authenticated && routerName.includes("automotive")) {
        this.login(this.$route.path);
      } else {
        this.$router.push({ name: routerName });
      }
    },
    handleReInItSlick() {
      console.log();
    },
    onReInitCarousel() {
      console.log("Carousel reinitialized");
    },
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 5px;
  position: absolute;
  /* content: ""; */
  left: 0;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ff22a1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #002e5b;
}

// sub categgories css

.information-item {
  display: inline-block;
  border: solid 1px #64748b;
  color: #64748b;
  padding: 4px 8px 2px;
  margin-top: 8px;
  margin-right: 8px;
  font-size: 14.4px;
  font-weight: 400;
  border-radius: 5px;
  white-space: nowrap;

  .btn-remove {
    margin-left: 5px;
    cursor: pointer;
  }
}

.auto-grid {
  /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  transition: all 0.35s ease 0s; */
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: .7em;
  width: 100%;

  .card {
    width: 24%;
    border: none;
    padding-inline: 0 !important;

    @media (max-width: 1037px) {
      width: 23.5%;
    }

    @media (max-width: 991px) {
      width: 31%;
    }

    @media (max-width: 767px) {
      width: 48%;
    }

    @media (max-width: 623px) {
      width: 47%;
    }

    @media (max-width: 601px) {
      width: 48%;
    }
  }

  @media (max-width: 380px) {
    gap: .5em;
  }

}

@media (max-width: 480px) {
  .auto-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

.ads-index {
  @media (min-width: 601px) {
    display: flex;
  }

  .ads-index-left-panel {
    width: 250px;
    min-width: 250px;
    position: fixed;
    overflow-y: auto;
    height: 90%;

    @media (max-width: 600px) {
      display: none;
    }

    .ads-index-left-card {
      &::v-deep {
        .btn-location {
          color: #64748b;
        }

        .address {
          color: #007bff;
        }
      }
    }
  }

  .ads-posts {
    flex-grow: 1;
    position: relative;
    left: 250px;
    max-width: calc(100% - 250px);

    @media (max-width: 767px) {
      margin-left: 0.5em;
      padding-right: 1em;
    }

    @media (max-width: 601px) {
      margin-left: 0;
      padding-right: 0;
      left: 0;
      max-width: 100%;
    }

    .sub-category-selector {
      @media (min-width: 601px) {
        position: relative;
        padding-right: 80px;
      }

      @media (max-width: 600px) {
        white-space: nowrap;
      }

      .btn-more {
        position: absolute;
        top: 4px;
        right: 0;
      }
    }
  }
}

.location-near-by {
  color: #7f7f7f;
}

.sub-category-container {
  @media (min-width: 601px) {
    max-height: auto;
    overflow: hidden;

    &.expanded {
      max-height: unset;

      .sub-category-selector {
        padding-right: 0;
      }
    }
  }

  @media (max-width: 600px) {
    overflow: auto;
  }
}

.sidebar-menu::v-deep {
  .address {
    &:not(.show-address) {
      margin-top: 8px;
      margin-bottom: 16px;
    }
  }
}

.fp-filter-item {
  border-radius: 40px;
}

.sub-category-container.sticky-header {
  position: sticky;
  top: 8%;
  width: auto;
  right: auto;
  z-index: 9;
  margin-bottom: 20px;
  background: #f0f3f9;
  padding: 3px;
}

[data-theme="dark"] .sub-category-container.sticky-header {
  background: #18243f;
}

.post-card {
  border-radius: 0 !important;
}

.fp-card {
  border-radius: 0 !important;
}

::v-deep .post-card .card-image-wrapper {
  border-radius: 0px 0px 0px 0px !important;
}
</style>

<style scoped>
::v-deep .slick-slider {
  display: grid !important;
}

::v-deep .slick-prev,
::v-deep .slick-next {
  font-size: 0;
  line-height: 0;

  position: absolute;
  top: 37%;

  display: block;

  width: 30px;
  height: 30px;
  border-radius: 30px;
  padding: 0;
  -webkit-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);

  cursor: pointer;

  color: transparent;
  border: none;
  outline: none;
  background: linear-gradient(93.93deg, #ff22a1 0%, #ffa3d8 100%) !important;
}

::v-deep .slick-list {
  margin: 0 40px !important;

  @media screen and (max-width: 900px) {
    margin: 0 0px !important;
  }
}

::v-deep .slick-track {
  display: flex !important;
  align-items: center;
  gap: 5px;
}

::v-deep .slick-prev {
  left: 0;
}

::v-deep .slick-next {
  right: 0;
}
</style>
