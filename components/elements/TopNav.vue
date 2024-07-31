<template>
  <header id="header">
    <nav class="navbar navbar-expand navbar-default fixed-top px-2">
      <div
        class="container-xl navbar-content "
        :class="{ 'd-flex': !auth_user }"
      >
        <div class="navbar-brand d-inline-flex mr-2">
          <portal-target name="logo-m" class="logo-content d-md-none">
            <a
              v-if="has_sidebar"
              href="javascript:;"
              class="d-md-none"
              @click="toggleLeftMenu()"
            >
              <div>
                <fp-icon name="hamburger" class="fp-fs-30 text-white" />
              </div>
            </a>
            <div class="logo">
              <a href="/">
                <img
                  src="~assets/images/logo.png"
                  width="36"
                  height="36"
                  alt="FlickerPage"
                />
              </a>
            </div>
          </portal-target>
          <div class="logo d-none d-md-block">
            <a href="/">
              <img
                src="~assets/images/logo.png"
                width="52"
                height="52"
                alt="FlickerPage"
              />
            </a>
          </div>
        </div>
        <div class="d-flex align-items-center flex-grow-1">
          <ul class="navbar-nav align-items-center flex-grow-1 flex-row">
            <li class="nav-item mr-auto">
              <div class="d-none d-md-block ml-3">
                <portal-target name="top-search"></portal-target>
              </div>
            </li>
            <li class="nav-item d-md-none flex-grow-1">
              <portal-target name="mobile-page-title"></portal-target>
            </li>
            <li class="nav-item m-hide top-module-nav py-1">
              <div class="d-flex align-items-center">
                <a
                  href="javascript:;"
                  @click="goToPage('index')"
                  :class="{ active: $route.name === 'index' }"
                  class="nav-link nav-fliconn"
                  v-tooltip="`FliConn`"
                >
                  <img
                    src="../../assets/images/timelineIcon.png"
                    alt="FliConn"
                    style="width: 40px; height: 40px"
                  />
                  <!-- <fp-icon name="home" /> -->
                </a>

                <a
                  href="javascript:;"
                  @click="goToPage('ads')"
                  :class="{ active: $route.name == 'ads' }"
                  class="nav-link nav-ads"
                  v-tooltip="`Classified Ads`"
                >
                  <fp-icon name="megaphone" />
                </a>

                <a
                  href="javascript:;"
                  @click="goToPage('topic')"
                  :class="{ active: $route.name == 'topic' }"
                  class="nav-link nav-topics"
                  v-tooltip="`Facts/Questions?`"
                >
                  <fp-icon name="topics" />
                </a>
              </div>
            </li>
            <li v-if="auth_user" class="nav-item top-notification ml-3">
              <top-notification />
            </li>
            <li v-if="auth_user" class="nav-item d-md-none ml-1">
              <top-chat />
            </li>
            <li class="nav-item m-hide nav-item-dropdown ml-1">
              <dropdown-learn-more :direction="'right'" />
            </li>
            <li v-if="auth_user" class="nav-item m-hide ml-3">
              <post-button />
            </li>
            <li v-if="!auth_user" class="nav-item m-hide ml-3">
              <a href="javascript:;" @click.prevent="login('ads')">
                <img
                  src="~/assets/images/avatar.png"
                  alt=""
                  class="auth-photo"
                  height="44"
                />
              </a>
            </li>
            <li class="nav-item m-hide ml-3" v-show="auth_user">
              <div class="dropdown dropdown-account">
                <a
                  href="javascript:;"
                  class="dropdown-toggle desktop"
                  data-toggle="dropdown"
                >
                  <img
                    :src="auth_user && auth_user.photo_url"
                    alt=""
                    class="auth-photo"
                  />
                  <div v-if="auth_user">
                    <p class="name">{{ auth_user.name }}</p>
                    <p class="username">@{{ auth_user.username }}</p>
                  </div>
                </a>
                <div class="dropdown-menu dropdown-menu-right mt-3">
                  <router-link
                    v-if="auth_user"
                    :to="{
                      name: 'fliconn.profile',
                      params: {
                        username: `${auth_user.username}`,
                      },
                    }"
                    class="dropdown-item d-flex"
                  >
                    <fp-icon name="user" />
                    <div>
                      <p class="mb-0">Profile</p>
                      <p
                        class="fp-text-active mt-n1 mb-0"
                        style="font-size: 13px"
                      >
                        (@{{ auth_user.username }})
                      </p>
                    </div>
                  </router-link>
                  <router-link
                    :to="{ name: 'account.ads' }"
                    class="dropdown-item"
                  >
                    <fp-icon name="calendar" />
                    My Classified Ads
                  </router-link>
                  <router-link
                    :to="{ name: 'account.topics' }"
                    class="dropdown-item"
                  >
                    <fp-icon name="comments" />
                    My Tags/Questions
                  </router-link>
                  <router-link
                    v-if="auth_user"
                    :to="{ name: 'automotive.seller_profile' }"
                    class="dropdown-item"
                  >
                    <fp-icon name="automotive" />
                    Manage Automotives
                  </router-link>
                  <router-link
                    v-if="auth_user"
                    :to="{ name: 'merchant.profile' }"
                    class="dropdown-item"
                  >
                    <fp-icon name="tag" />
                    Manage Offers/Coupons
                  </router-link>
                  <!-- <router-link
                    :to="{ name: 'account.messages' }"
                    class="dropdown-item"
                  >
                    <fp-icon name="comment-dots" />
                    Messages
                  </router-link> -->
                  <router-link
                    :to="{ name: 'settings.basic_information' }"
                    class="dropdown-item"
                  >
                    <fp-icon name="setting" />
                    Settings
                  </router-link>
                  <router-link
                    :to="{ name: 'account.activity_privacy.login_activity' }"
                    class="dropdown-item"
                  >
                    <fp-icon name="activity_privacy" />
                    Activity &amp; Privacy
                  </router-link>
                  <div class="mt-3">
                    <a
                      href="javascript:;"
                      class="btn fp-btn-outline"
                      @click.prevent="logout"
                    >
                      <fp-icon name="sign-out" />
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item ml-2 ml-md-3">
              <toggle-theme />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import Location from "../ui/Location.vue";
import DropdownLearnMore from "./DropdownLearnMore.vue";
import TopNotification from "./TopNotification.vue";
import TopChat from "./TopChat.vue";
import PostButton from "./PostButton.vue";
import ToggleTheme from "./ToggleTheme.vue";

export default {
  components: {
    Location,
    DropdownLearnMore,
    TopNotification,
    PostButton,
    ToggleTheme,
    TopChat,
  },

  data: () => ({
    appName: process.env.appName,
  }),

  computed: {
    fliconnPage() {
      return (
        this.$route.name.startsWith("fliconn") ||
        this.$route.name.startsWith("clips")
      );
    },
    ...mapGetters({
      auth_user: "auth/user",
      notifications: "notifications",
      unread_notifications: "unread_notifications",
      has_sidebar: "has_sidebar",
    }),
  },
  watch: {
    auth_user: function (newUser) {
      if (newUser) {
        this.$store.dispatch("fetchNotifications");
      }
    },
  },

  methods: {
    login(redirect = "") {
      if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
      if (this.$route.name !== "login") this.$router.push({ name: "login" });
    },
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push({ name: "login" });
    },
    goToPage(routerName, params = {}, query = {}) {
      this.$modal.hide("postTypeModal");
      this.$modal.hide("mobile_menu_modal");
      if (
        !this.auth_user &&
        (routerName.includes("fliconn") || routerName.includes("automotive"))
      ) {
        this.login(routerName);
      } else if (
        routerName === "automotive.post" &&
        this.auth_user &&
        !this.auth_user.available_add_inventory
      ) {
        this.$router.push({ name: "automotive.seller_profile" });
      } else {
        if (this.$route.name !== routerName)
          this.$router.push({ name: routerName, params: params, query: query });
      }
    },
    closeModal(modalId) {
      this.$modal.hide(modalId);
    },
    toggleLeftMenu() {
      this.$store.dispatch("toggleLeftMenu");
    },
  },
};
</script>

<style scoped lang="scss">
#header {
  .navbar {
    height: 75px;
    z-index: 11;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    @media (max-width: 600px) {
      height: 65px;
    }
    &>:first-child {
      @media (max-width: 991px) {
        padding-inline: 1.2em;
      }
      @media (max-width: 600px) {
        padding-inline: .1em;
      }
    }
    .logo-content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1em;
    }
  }
}
.navbar {
  background-color: #002e5b;
  .logo {
    margin-top: 11px;
    @media (max-width: 600px) {
      img {
        width: 36px;
        height: 36px;
      }
    }
  }
}

.nav-ads,
.nav-fliconn,
.nav-topics {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;

  .fp-svg-fill {
    fill: #fff;
  }
  .fp-svg-stroke {
    stroke: #fff;
  }

  &:hover,
  &.active {
    .fp-svg-fill {
      fill: #ff22a1;
    }
    .fp-svg-stroke {
      stroke: #ff22a1;
    }
  }
}

.m-hide {
  @media (max-width: 767px) {
    display: none;
  }
}

.top-module-nav {
  border-right: 1px solid #ffffff33;
  padding-right: 10px;
  svg {
    color: #fff;
    font-size: 30px;
    &:hover {
      color: #ff22a1;
    }
  }
}

.nav-item-dropdown {
  border-right: 1px solid #ffffff33;
  padding-right: 10px;
}

.btn-logout {
  margin-top: 6px;
  border: solid 2px #bebebe;
  border-radius: 10px;
  background: #f3f3f3;
  &:hover {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
  }
}

.dropdown-account {
  .dropdown-toggle {
    text-decoration: none;
    &.desktop::after {
      display: none;
    }
    display: flex;
    align-items: center;
    img {
      margin-right: 8px;
    }
    p {
      margin-bottom: 0;
      line-height: 1.1;
      color: #fff;
      font-size: 13px;
      font-weight: 400;
    }
  }
  .dropdown-item {
    font-size: 14.4px;
    color: #091e42;
    svg {
      font-size: 20px;
      margin-right: 8px;
    }
  }
}
[data-theme="dark"] {
  .dropdown-account {
    .dropdown-item {
      color: #fff;
    }
  }
}
</style>
