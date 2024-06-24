<template>
  <div class="clips-wrapper">
    <div v-if="user" class="d-flex align-items-center mb-3">
      <h6 class="mb-0">
        {{
          user.id === auth_user.id
            ? "Your Short Flicks"
            : `${user.first_name}'s Short Flicks`
        }}
      </h6>
    </div>
    <div class="clips-filter mt-2 mb-2">
      <add-clips-button redirect-url="/fliconn/create/short_flick" />
      <span class="filter-item" :class="filter === 'most_recent' && 'active'" @click="filter = 'most_recent'">For You</span>
      <span class="filter-item" :class="filter === 'popular' && 'active'" @click="filter = 'popular'">Popular</span>
      <span class="filter-item" :class="filter === 'following' && 'active'" @click="filter = 'following'">Following</span>
      <span class="filter-item" :class="filter === 'tagged_me' && 'active'" @click="filter = 'tagged_me'">@Tagged me</span>
    </div>
    <div class="row mx-n1">
      <div
        v-for="(item, index) in clips"
        :key="index"
        class="col-6 col-lg-4 px-1 mb-2"
      >
        <clips-item :clips="item"
            :removable="auth_user && auth_user.id === item.user_id"
            @deleted="clips.splice(index, 1)"
            @open="openClipsOverview(index)"
        ></clips-item>
        <!-- <top-rated-clips v-if="index === 12"></top-rated-clips> -->
      </div>
    </div>
    <infinite-loading
      :distance="300"
      :identifier="infiniteId"
      @infinite="searchClips"
      force-use-infinite-wrapper=".clips-wrapper"
    >
      <div slot="no-more"></div>
      <div slot="no-results" class="text-muted">No results found!</div>
    </infinite-loading>
    <clips-overview
      v-if="openOverview"
      ref="overview"
      :clips="overviewClips"
      @close="openOverview = false"
      @select="selectClips"
    ></clips-overview>
  </div>
</template>
<script>
import Form from "vform";
import ClipsOverview from "./ClipsOverview.vue";
import ClipsItem from "./ClipsItem.vue";
import AddClipsButton from "./AddClipsButton.vue";
export default {
  name: "ClipsIndex",
  props: ["user"],
  components: {
    ClipsOverview,
    ClipsItem,
    AddClipsButton,
  },
  data() {
    return {
      clips: [],
      comment_form: new Form({
        clip_id: null,
        detail: "",
      }),
      is_playing: false,
      openOverview: false,
      overviewClips: [],
      page: 1,
      infiniteId: +new Date(),
      filter: "most_recent",
    };
  },
  computed: {
    auth_user() {
      return this.$store.getters["auth/user"];
    },
  },
  watch: {
    filter() {
      this.page = 1;
      this.clips = [];
      this.infiniteId += 1;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.infiniteId += 1;
    });
  },
  methods: {
    search() {
      this.page = 1;
      this.infiniteId++;
    },
    async searchClips($state) {
      let params = {
        user_id: this.user?.id,
        filter: this.filter,
        page: this.page,
      };
      const response = await this.axios.post(
        `${process.env.clipsApiUrl}/clips/search`,
        params
      );
      if (response.data.status == "Success") {
        let result = response.data.data;
        if (result.current_page == 1) this.clips = [];
        if (result.data.length) {
          this.page++;
          this.clips.push(...result.data);
          $state.loaded();
        } else {
          $state.complete();
        }
      }
    },
    async openClipsOverview(index) {
      this.loadOverviewClips(index);
      await this.$nextTick();
      this.openOverview = true;
    },
    async selectClips(payload) {
      if (!payload.mode) {
        const index = this.clips.findIndex((i) => i.id === payload.id);
        this.loadOverviewClips(index);
      } else if (payload.mode === "next") {
        const currentIndex = this.clips.findIndex((i) => i.id === payload.id);
        const index =
          currentIndex === this.clips.length - 1 ? currentIndex + 1 : 0;
        this.loadOverviewClips(index);
      } else if (payload.mode === "prev") {
        const currentIndex = this.clips.findIndex((i) => i.id === payload.id);
        const index =
          currentIndex === 0 ? this.clips.length - 1 : currentIndex - 1;
        this.loadOverviewClips(index);
      }
    },
    loadOverviewClips(index) {
      let overviewClips = [];
      let i = 0;
      while (i < 5 && !overviewClips.includes(this.clips[index])) {
        overviewClips.push(this.clips[index]);
        index = index == this.clips.length - 1 ? 0 : index + 1;
        i++;
      }
      this.overviewClips = overviewClips;
    },
  },
};
</script>
<style lang="scss" scoped>
  .clips-wrapper {
    overflow: visible;
  }
  .top-rated-clips-container {
    max-width: 100%;
    @media (min-width: 600px) {
      display: none;
    }
  }
  .select-order-by {
    margin-left: auto;
    border: 0 !important;
    &:focus {
      border: 0;
      outline: 0;
    }
  }
  .search-form {
    width: 160px;
    input {
      border-radius: 10px;
    }
  }
  .zoom:hover {
    z-index: 2;
    position: inherit;
  }
  .clips-filter {
    display: flex;
    align-items: center;
    height: 40px;
    max-width: 100%;
    @media (max-width: 600px) {
      overflow-x: auto;
    }
    padding-left: 6px;
    .filter-item {
      border: solid 2px #212529;
      padding: 2px 6px;
      border-radius: 8px;
      margin-right: 8px;
      font-size: 13px;
      cursor: pointer;
      white-space: nowrap;
      &.active {
        border-color: #007BFF;
        background-color: #007BFF;
        color: #FFF;
      }
    }
  }
</style>
