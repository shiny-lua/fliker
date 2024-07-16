<template>
  <div>
    <a href="javascript:;" class="btn-post" @click.prevent="post()">
      <slot>
        <fp-icon name="plus-square" class="post-icon" />
        &nbsp;POST
      </slot>
    </a>
    <fp-modal
      ref="postTypeModal"
      :name="`post_type_modal_${mode}`"
      :width="600"
      title="Post on FlickerPage"
    >
      <div class="top-nav-post-modal">
        <div class="post-buttons">
          <div class="row mx-n2 ads-topics-buttons">
            <div class="col-6 col-lg-3 px-2 mb-3">
              <div
                class="post-type ads fp-border-color-1"
                @click.prevent="goToPage('ads.add')"
              >
                <fp-icon name="ads" />
                <p>Classified Ad</p>
              </div>
            </div>
            <div class="col-6 col-lg-3 px-2 mb-3">
              <div
                class="post-type automotive fp-border-color-1"
                @click.prevent="
                  goToPage(
                    auth_user && auth_user.has_seller_profile
                      ? 'automotive.post'
                      : 'automotive.create'
                  )
                "
              >
                <fp-icon name="automotive" />
                <p>Automotives</p>
              </div>
            </div>
            <div class="col-6 col-lg-3 px-2 mb-3">
              <div
                class="post-type seller-profile fp-border-color-1"
                @click.prevent="
                  goToPage(
                    auth_user && auth_user.has_seller_profile
                      ? 'automotive.seller_profile'
                      : 'automotive.seller_profile_form'
                  )
                "
              >
                <fp-icon name="automotive" />
                <p>Create Automotive Seller Profile</p>
              </div>
            </div>
            <div class="col-6 col-lg-3 px-2 mb-3">
              <div
                class="post-type merchant-profile fp-border-color-1"
                @click.prevent="
                  goToPage(
                    has_merchant_profile
                      ? 'merchant.profile'
                      : 'merchant.create'
                  )
                "
              >
                <fp-icon name="tag" />
                <p>Create a Merchant Profile/Store</p>
              </div>
            </div>
          </div>
          <div class="row mx-n2 fliconn-buttons">
            <div class="col-12 col-lg-3 px-2 mb-3 timeline-post-button">
              <div
                class="post-type timeline fp-border-color-1 d-none d-md-flex"
                @click.prevent="goToPage('fliconn.create.timeline')"
              >
                <fp-icon name="timeline" />
                <p>Post on Timeline</p>
              </div>
              <add-post-link
                class="d-md-none mb-0"
                @moved="$refs.postTypeModal.close()"
              />
            </div>
            <div class="col-4 col-lg-3 px-2 mb-md-3">
              <div
                class="post-type status fp-border-color-1"
                @click.prevent="goToPage('fliconn.create.status')"
              >
                <fp-icon name="status" />
                <p>Post Your Status</p>
              </div>
            </div>
            <div class="col-4 col-lg-3 px-2 mb-md-3">
              <div
                class="post-type clips fp-border-color-1"
                @click.prevent="goToPage('fliconn.create.clips')"
              >
                <fp-icon name="clips" />
                <p>Create Short Flick</p>
              </div>
            </div>
            <div class="col-4 col-lg-3 px-2 mb-md-3">
              <div
                class="post-type poll fp-border-color-1"
                @click.prevent="goToPage('fliconn.create.poll')"
              >
                <fp-icon name="poll" />
                <p>Create a Poll</p>
              </div>
            </div>
            <hr class="d-md-none w-100 mx-2" />
          </div>
          <div class="row mx-n2 channel-groups-buttons">
            <div class="col-6 col-lg-3 px-2 mb-3">
              <div
                class="post-type poll fp-border-color-1"
                @click.prevent="goToPage('fliconn.channel.create')"
              >
                <fp-icon name="channel" />
                <p>Create Channel</p>
              </div>
            </div>
            <div class="col-6 col-lg-3 px-2 mb-3">
              <add-group @selected="$refs.postTypeModal.close()">
                <div class="post-type poll fp-border-color-1">
                  <fp-icon name="group" />
                  <p>Create Group or Page</p>
                </div>
              </add-group>
            </div>
            <div class="col-6 col-lg-3 px-2 mb-3">
              <div
                class="post-type topics fp-border-color-1"
                @click.prevent="goToPage('topic.post')"
              >
                <fp-icon name="discussion" />
                <p>Discussions &amp; Question</p>
              </div>
            </div>
            <div class="col-6 col-lg-3 px-2 mb-3">
              <div
                class="post-type px-lg-1 coupon fp-border-color-1"
                @click.prevent="goToPage('merchant.create_offer')"
              >
                <fp-icon name="tag" />
                <p>Publish a Coupon Discount/Offer</p>
              </div>
            </div>
          </div>
        </div>
        <p class="mb-0 fp-text-color-main font-weight-400">
          By posting on <span class="fp-text-active">FlickerPage</span>, you are
          agree to
          <a href="/learn/terms_of_use" class="fp-text-active" target="_blank"
            >Terms of use</a
          >
          and
          <a
            href="/learn/privacy_policies"
            target="_blank"
            class="fp-text-active"
            >Privacy policy</a
          >
        </p>
      </div>
    </fp-modal>
  </div>
</template>
<script>
import FpModal from "~/components/ui/Modal.vue";
import AddPostLink from "~/components/fliconn/AddPostLink.vue";
import AddGroup from "~/components/fliconn/group/AddGroup.vue";
export default {
  name: "PostButton",
  props: {
    mode: { type: String, default: "" },
  },
  components: {
    FpModal,
    AddPostLink,
    AddGroup,
  },
  data() {
    return {
      has_merchant_profile: false,
    };
  },
  computed: {
    auth_user() {
      return this.$store.getters["auth/user"];
    },
  },
  methods: {
    post() {
      if (this.auth_user) {
        this.$refs.postTypeModal.open();
      } else {
        this.$emit("login", "/");
      }
    },
    goToPage(routerName, params = {}, query = {}) {
      console.log(this.auth_user)
      this.$refs.postTypeModal.close();
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
    async checkHasMerchantProfile() {
      try {
        const response = await this.axios.get(
          `${process.env.merchantApiUrl}/merchant/get_merchant_by_user/${this.auth_user.id}`
        );
        if (response.data.status === "Success") {
          this.has_merchant_profile = true;
        }
      } catch (error) {
        if (error.response.data.message === "not_exists") {
          this.has_merchant_profile = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-post {
  color: #fff;
  font-size: 14.4px;
  line-height: 20px;
  text-align: center;
  padding: 8px 12px !important;
  border-radius: 5px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(100.05deg, #ff22a1 2.3%, #ffa3d8 100%);
  &:hover {
    color: #fff;
    text-decoration: none;
  }
  .post-icon {
    font-size: 20px;
  }
}
.top-nav-post-modal {
  .post-buttons {
    display: flex;
    flex-direction: column;
    @media (max-width: 600px) {
      .fliconn-buttons {
        order: 1;
      }
      .ads-topics-buttons {
        order: 2;
      }
      .channel-groups-buttons {
        order: 3;
      }
    }
    .post-type {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      height: 120px;
      border-style: solid;
      border-width: 1px;
      cursor: pointer;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
      text-decoration: none;
      padding: 16px 8px;
      @media (max-width: 600px) {
        padding: 16px 16px;
        height: 110px;
      }
      &:hover {
        background: linear-gradient(135.78deg, #ff22a1 2.82%, #ffa3d8 94.61%);
        color: #fff;
        border: none;
        padding: 17px 9px;
        @media (max-width: 600px) {
          padding: 17px 17px;
        }
        .fp-svg-fill {
          fill: #fff;
        }
        .fp-svg-stroke {
          stroke: #fff;
        }
      }
      p {
        white-space: pre-line;
        text-align: center;
        margin-bottom: 0;
        line-height: 18px;
        margin-top: auto;
        font-size: 13.6px;
        @media (max-width: 600px) {
          font-weight: 400;
        }
      }

      svg {
        width: 36px;
        height: 36px;
        margin-top: 5px;
        display: block;
        @media (max-width: 600px) {
          width: 28px;
          height: 28px;
        }
      }
      &.timeline,
      &.topics,
      &.coupon {
        svg {
          height: 32px;
        }
      }
      &.clips {
        svg {
          height: 27px;
          width: unset;
          margin-top: 8px;
          @media (max-width: 600px) {
            height: 23px;
          }
        }
      }
      &.ads {
        svg {
          @media (max-width: 768px) {
            width: unset;
            height: 33px;
          }
        }
      }
      &.seller-profile {
        p {
          @media (min-width: 769px) {
            font-size: 12.4px;
          }
        }
      }
      &.merchant-profile {
        p {
          @media (min-width: 769px) {
            font-size: 12.6px;
          }
        }
      }
    }
  }
}
</style>
