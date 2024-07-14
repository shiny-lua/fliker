<template>
  <div class="row justify-content-center pt-3 pt-md-4">
    <div class="col-lg-12">
      <div v-if="automotive_seller == null"></div>
      <div v-else-if="automotive_seller.status === 'deleted'" class="center-align">
        <img src="~assets/images/deleted.png" width="500" />
        <h6 class="mt-3">Automotive seller profile has been deleted.</h6>
      </div>
      <div v-else>
        <profile-card :profile="automotive_seller" />
      </div>
      <div v-if="automotive_seller" class="related-posts mt-3">
        <div v-if="automotive_seller.categories.length" class="profile-categories mb-2">
          <div>
            <span :class="{
              'fp-filter-item': true,
              active: !filter.automotive_category_id,
            }" @click="displayAll()">All</span>
          </div>
          <div v-for="(item, index) in automotive_seller.categories" :key="index" style="display: flex; align-items: center;">
            <div class="fp-filter-item" @click="selectCategory(item)" :class="{
              'fp-filter-item': true,
              active: filter.automotive_category_id === item.id,
            }">
              {{ item.name }}
            </div>
          </div>
          <!-- <div
            class="category-item fp-borer-color-1 fp-text-color-main mb-2 mb-md-0"
            :class="
              { active: !filter.automotive_category_id } &&
              !filter.automotive_sub_category_id
            "
            @click="selectCategory()"
          >
            All Categories
          </div> -->

          <!--  New category slider design start -->
          <!-- 
          <VueSlickCarousel v-bind="sliderSettings">
            <div>
              <span :class="{
                'fp-filter-item mr-2 mb-2': true,
                active: !filter.automotive_category_id,
              }" @click="displayAll()">All</span>
            </div>
            <div v-for="(item, index) in automotive_seller.categories" :key="index" class="carousel-item">
              <div class="fp-filter-item" :class="{ active: filter.automotive_category_id === item.id }"
                @click="selectCategory(item)">
                {{ item.name }}
              </div>
            </div>
          </VueSlickCarousel> -->
        </div>
        <!-- Sub category chips start -->
        <div class="" v-if="selectedCategory">
          <div>
            <span class="information-item" v-for="(item, index) in selectedCategory.sub_categories" :key="index" :class="{
              'fp-filter-item mr-2 mb-2': true,
              active: filter.automotive_sub_category_id.includes(item.id),
            }" @click="selectSubCategory(item)">
              {{ item.name }}
            </span>
          </div>
        </div>
        <!-- sub category chips end -->
        <div class="posts mb-5" :class="automotive_seller.categories.length && 'has-categories'">
          <div class="row mx-n1 mx-md-n2">
            <div v-for="(item, index) in posts" :key="index" class="col-md-3" :class="{
              'col-6 mb-2 mb-md-3 px-1 px-md-2': true,
              // 'col-lg-4': automotive_seller.categories.length,
              // 'col-lg-3': automotive_seller.categories.length == 0,
            }">
              <Post :post="item" :is_admin="auth_user && item.user_id === auth_user.id" />
            </div>
          </div>
          <infinite-loading :distance="1" :identifier="infiniteId" @infinite="searchPosts">
            <div slot="no-more"></div>
            <div slot="no-results">No inventory found!</div>
          </infinite-loading>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProfileCard from "~/components/automotive/ProfileCard.vue";
import Post from "~/components/ads/Post.vue";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import VueSlickCarousel from "vue-slick-carousel";

export default {
  name: "SellerProfile",
  components: {
    ProfileCard,
    Post,
    VueSlickCarousel,
  },
  data() {
    return {
      automotive_seller: null,
      posts: [],
      filter: {
        is_automotive: true,
        automotive_seller_id: this.$route.params.id,
        automotive_category_id: "",
        automotive_sub_category_id: [],
        status: "",
        page: 1,
      },
      selectedCategory: null,
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
              arrows: true,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
          {
            breakpoint: 480,
            settings: {
              arrows: true,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
        ],
        // centerPadding: "10px",
      },
      infiniteId: +new Date(),
      categories: [],
    };
  },
  computed: {
    auth_user() {
      return this.$store.getters["auth/user"];
    },
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      const slug = this.$route.params.slug;
      let params = slug
        ? {
          slug: slug,
        }
        : {
          user_id: this.auth_user ? this.auth_user.id : null,
        };
      try {
        const response = await this.axios.post(
          `${process.env.adsApiUrl}/automotive/get_seller_profile`,
          params
        );
        if (response.data.status === "Success") {
          if (!response.data.data) {
            return this.$router.push({ name: "automotive.create" });
          }
          this.automotive_seller = response.data.data;
          await this.$nextTick();
          const res_online = await this.axios.post(`/user/check_online`, {
            user_id: this.automotive_seller.user_id,
          });
          this.automotive_seller.is_online = res_online.data.data;
        }
      } catch (error) {
        this.$router.push("/login");
      }
    },
    searchPosts($state) {
      if (!this.$route.params.id && this.auth_user) {
        this.filter.user_id = this.auth_user.id;
      }
      this.axios
        .post(`${process.env.adsApiUrl}/post/search`, this.filter)
        .then((response) => {
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
        });
    },
    searchAutomotive() {
      this.$router.push({
        name: "ads",
        params: { category_id: "automotive_home" },
      });
    },
    selectCategory(item) {
      this.selectedCategory = item;
      this.filter.automotive_category_id = item ? item.id : "";
      this.filter.automotive_sub_category_id = "";
      this.posts = [];
      this.filter.page = 1;
      this.infiniteId++;
    },
    selectSubCategory(item) {
      console.log("item", item)
      this.filter.automotive_category_id = "";
      // this.filter.automotive_sub_category_id = item ? item.id : "";
      if (!this.filter.automotive_sub_category_id) {
        this.filter.automotive_sub_category_id = [];
      }
      const index = this.filter.automotive_sub_category_id.indexOf(item.id);
      if (index == -1) {
        this.filter.automotive_sub_category_id.push(item.id);
      } else {
        this.filter.automotive_sub_category_id.splice(index, 1);
      }
      console.log(this.filter.automotive_sub_category_id);
      this.posts = [];
      this.filter.page = 1;
      this.infiniteId++;
    },
    displayAll() {
      this.selectedCategory = null;
      this.filter.automotive_category_id = "";
      this.filter.automotive_sub_category_id = [];
      this.posts = [];
      this.filter.page = 1;
      this.infiniteId++;
    },
  },
};
</script>
<style lang="scss" scoped>
.row {
  margin-inline: 0px;
}

.related-posts {
  .profile-categories {
    display: flex;
    gap: .5em;
    padding: .7em;
  }
}

.category-item {
  a.active {
    text-decoration: underline;
  }

  .sub-cat-item {
    display: block;
    font-size: 13.6px;

    &.active {
      text-decoration: underline;
    }
  }
}

.carousel {
  display: flex;
  gap: 2em;
}

.center-align {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* Make sure the parent container has a defined height */
  text-align: center;
  margin: 0 auto;
  /* Center the div horizontally */
}

.center-align img {
  max-width: 100%;
  /* Ensure the image is responsive */
}

.center-align h6 {
  margin-top: 1rem;
  /* Adjust the margin as needed */
}

.fp-filter-item {
  border-radius: 36px;
}

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
  cursor: pointer;

  .btn-remove {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
