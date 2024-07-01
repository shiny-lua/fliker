<template>
  <div class="ads-category-selector">
    <div class="category-item fp-border-color-1 all-categories">
      <a
        href="javascript:;"
        :class="{
          'category-link fp-text-default': true,
          active: selected === '',
        }"
        @click.prevent="select('')"
      >
        <fp-icon name="all_categories" class="category-icon" />
        All Categories
      </a>
    </div>
    <div class="category-item fp-border-color-1 automotives">
      <a
        href="javascript:;"
        :class="{
          'category-link special fp-text-default': true,
          active: selected === 'automotive',
        }"
        @click.prevent="selectAutomotive()"
      >
        <fp-icon name="automotive" class="category-icon" />
        Automotives <fa icon="star" class="blink ml-1" />
      </a>
    </div>
    <div
      v-for="category in categories"
      :key="category.id"
      class="category-item fp-border-color-1"
    >
      <a
        href="javascript:;"
        :class="{
          'category-link fp-text-default': true,
          active: selected === category.id,
        }"
        @click.prevent="select(category)"
      >
        <fp-icon :name="`ads-${category.slug}`" class="category-icon" />
        {{ category.name }}
      </a>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "CategorySelector",
  data() {
    return {
      selected: "",
    };
  },
  computed: {
    selectedCategoryName() {
      if (!this.categories) return "";
      const selectedCateogry = this.categories.find(
        (i) => i.id === this.selected
      );
      if (selectedCateogry) return selectedCateogry.name;
    },
    theme() {
      return this.$store.getters["theme"];
    },
    ...mapGetters({
      categories: "ads/categories",
      auth_user: "auth/user",
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$store.dispatch("ads/getCategories");
      if (this.$route.query.category_id) {
        if (this.$route.query.category_id === "automotive_home") {
          this.selectAutomotive();
        } else {
          const category_id = this.$route.query.category_id;
          let category = this.categories.find((i) => i.id === category_id);
          console.log("category", category)
          this.select(category);
        }
      }
    },
    select(item) {
      this.selected = item ? item.id : "";
      this.$emit("select", item);
    },
    selectAutomotive() {
      this.selected = "automotive";
      this.$emit("select-automotive");
    },
  },
};
</script>
<style lang="scss" scoped>
.category-item {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  .category-link {
    display: flex;
    align-items: center;
    padding: 8px 0;
    font-size: 16px;
    text-decoration: none;
    &.active {
      color: #ff22a1 !important;
    }
    &.special {
      .blink {
        font-size: 13px;
        margin-top: -3px;
      }
      .category-icon {
        margin-right: 10px;
      }
    }
    .category-icon {
      display: inline-block;
      font-size: 22px;
      width: 22px;
      margin-right: 6px;
    }
  }
}
</style>
