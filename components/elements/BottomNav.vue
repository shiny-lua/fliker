<template>
  <div class="navbar d-md-none">
    <div class="nav-item">
      <a
        class="nav-link"
        :class="{ active: $route.name === 'index' }"
        href="javascript:;"
        @click.prevent="goToPage('index')"
      >
        <!-- <fp-icon name="home" /> -->
        <img
          src="../../assets/images/timelineIcon.png"
          alt="FliConn"
          style="width: 30px; height: 27px"
        />
        <span class="nav-title">Timeline</span>
      </a>
    </div>
    <div class="nav-item">
      <a
        class="nav-link"
        :class="{ active: $route.name === 'ads' }"
        href="javascript:;"
        @click.prevent="goToPage('ads')"
      >
        <fp-icon name="megaphone" />
        <span class="nav-title">Local Ads</span>
      </a>
    </div>
    <div class="nav-item">
      <span
        class="nav-link d-flex flex-column justify-content-between post-nav-link"
      >
        <post-button mode="bottom">
          <span class="icon-post fp-border-color">
            <fp-icon name="plus" class="fp-fs-26" />
          </span>
        </post-button>
        <span class="nav-title mt-1">Post</span>
      </span>
    </div>
    <div class="nav-item" @click.prevent="goToPage('topic')">
      <a
        href="javascript:;"
        class="nav-link"
        :class="{ active: $route.name === 'topic' }"
      >
        <fp-icon name="topics" />
        <span class="nav-title">Topics</span>
      </a>
    </div>
    <div class="nav-item">
      <a
        class="nav-link more"
        :class="{ active: $route.name === 'more' }"
        href="javascript:;"
        @click="goToPage('more')"
      >
        <fp-icon name="account" />
        <span class="nav-title">Account</span>
      </a>
    </div>
  </div>
</template>
<script>
import PostButton from "~/components/elements/PostButton.vue";
export default {
  name: "BottomNav",
  components: {
    PostButton,
  },
  computed: {
    auth_user() {
      return this.$store.getters["auth/user"];
    },
  },
  methods: {
    login(redirect = "") {
      if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
      if (this.$route.name !== "login") this.$router.push({ name: "login" });
    },
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push({ name: "index" });
    },
    post() {
      if (this.auth_user) {
        this.$modal.show("postTypeModal");
      } else {
        this.login();
      }
    },
    goToPage(routerName) {
      this.$modal.hide("mobile_menu_modal");
      if (
        !this.auth_user &&
        (routerName.includes("topic") || routerName.includes("fliconn"))
      ) {
        this.login(routerName);
      } else {
        if (this.$route.name !== routerName)
          this.$router.push({ name: routerName });
      }
    },
    openMore() {},
  },
};
</script>
<style lang="scss" scoped>
.navbar {
  position: fixed;
  bottom: 0;
  z-index: 999;
  background-color: #002e5b;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  margin-bottom: 0;
  padding: 0;
  display: flex;
  .nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 1;
    .nav-link {
      text-align: center;
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 4px;
      & > span,
      & > svg {
        color: #fff;
      }
      svg {
        display: block;
        margin: auto;
        font-size: 24px;
      }
      .icon-post {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background: linear-gradient(152.53deg, #ff22a1 12.66%, #ffa3d8 91.02%);
        display: flex;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-width: 4px;
      }
      .nav-title {
        font-size: 12px;
      }
      &.more {
        img {
          width: 32px;
          height: 30px;
        }
      }
      &.active {
        & > span,
        & > svg {
          color: #ff22a1;
        }
      }
    }
    .post-nav-link {
      padding-top: 0;
      &::v-deep {
        .btn-post {
          background: none;
          padding: 0 !important;
          display: block;
          width: 70px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -30px;
        }
      }
    }
  }
}
</style>
