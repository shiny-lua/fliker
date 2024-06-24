<template>
  <div class="automotive-profile-card custom-width fp-card p-0">
    <div class="d-lg-flex">
      <!-- <div class="automotive-profile-card-image">
        <img :src="profile.image.src_url" alt="" v-if="profile.image" />
        <h6 v-else>No Cover Image Available</h6>
        <div class="automotive-seller-type">
          <span
            v-for="item in profile.type"
            :key="item"
            class="profile-type fp-bg-color-1 fp-text-active fp-border-color-1"
            >{{ item }}</span
          >
        </div>
      </div> -->

      <div v-if="lightBoxImages.length" class="carousel">
        <div class="indicator">
          <img
            v-for="(image, index) in lightBoxImages"
            :src="image.src"
            :key="index"
            @click="changeCarousel(index)"
            :class="{ active: indexOfImage == index }"
            alt=""
          />
        </div>
        <div class="slider">
          <VueSlickCarousel
            ref="carousel"
            v-bind="slickSettings"
            @afterChange="afterChange"
          >
            <div
              class="text-center"
              v-for="(img, index) in lightBoxImages"
              :key="index"
              @click="openGallery(index)"
            >
              <img class="slider-img img-slide mx-auto" :src="img.src" alt="" />
            </div>
          </VueSlickCarousel>
        </div>
      </div>

      <div class="automotive-profile-card-content">
        <h5 class="automotive-profile-title">
          {{ profile.name }}
          <template v-if="!auth_user || auth_user.id !== profile.user_id">
            <span
              class="online-offline ml-2"
              :class="{ online: profile.is_online }"
            ></span>
            <span style="font-size: 13px">{{
              profile.is_online ? "Online" : "Offline"
            }}</span>
          </template>
        </h5>
        <div class="d-flex flex-wrap align-items-center mb-3">
          <span v-if="!isMyProfile" class="mr-3"
            >{{ profile.posts_count }} Items</span
          >
          <span class="mr-3"
            >{{ $nFormatter(profile.user.followers_count) }} Followers</span
          >
          <span class="profile-rating d-flex mt-2 mt-md-0 align-items-center">
            <star-rating
              :rating="profile.rating"
              :star-size="15"
              :show-rating="false"
              class="mt-n1"
              read-only
            />&nbsp;
            <a
              href="javascript:;"
              class="fp-text-color"
              @click.prevent="openReviewModal()"
              >{{ $nFormatter(profile.review_count) }}
              {{ profile.review_count > 1 ? "Reviews" : "Review" }}</a
            >
            <a
              v-if="!isMyProfile && auth_user"
              href="javascript:;"
              class="fp-text-color ml-1"
              @click.prevent="addNewReview()"
            >
              (Write review)
            </a>
          </span>
        </div>
        <div class="business-info fp-border-color-1">
          <div class="row mx-n1 mb-3">
            <label class="col-md-6 px-1">
              <fp-icon name="clock" class="fp-fs-20" />
              Business Hours
            </label>
            <div class="col-md-6 px-1">
              <p class="mb-0 automotive-profile-detail">
                {{ profile.business_hours }}
              </p>
            </div>
          </div>
          <div class="row mx-n1 mb-3">
            <label class="col-md-6 px-1">
              <fp-icon name="location" class="fp-fs-20" />
              Location
            </label>
            <!-- <div class="col-md-6 px-1">
                            <p class="cursor-pointer mb-0 automotive-profile-detail" @click="openGoogleMap()">{{ profile.location.full_address }}</p>
                        </div> -->
          </div>
        </div>
        <div class="mt-3 automotive-profile-actions fp-bg-color-1">
          <div
            v-if="isMyProfile"
            class="d-flex align-items-center justify-content-between flex-wrap"
          >
            <div class="dropup dropdown-automotive-profile mb-2">
              <a
                href="javascript:;"
                class="btn btn-automotive-profile fp-text-color fp-btn-outline dropdown-toggle"
                data-toggle="dropdown"
              >
                <fp-icon name="user" class="fp-fs-18" />
                <span class="d-none d-md-inline">Seller Profile</span>
                <span class="d-inline d-md-none">Profile</span>
              </a>
              <div class="dropdown-menu">
                <a
                  href="javascript:;"
                  class="dropdown-item"
                  @click.prevent="editProfile"
                  :class="{ disabled: profile.status === 'inactive' }"
                >
                  <fp-icon name="edit" class="fp-fs-18" />
                  Edit
                </a>
                <a
                  href="javascript:;"
                  class="dropdown-item"
                  @click.prevent="changeStatus('deleted')"
                  :class="{ disabled: profile.status === 'inactive' }"
                >
                  <fp-icon name="trash" class="fp-fs-18" />
                  Delete
                </a>
                <a
                  href="javascript:;"
                  class="dropdown-item"
                  @click.prevent="
                    changeStatus(
                      profile.status === 'active' ? 'inactive' : 'active'
                    )
                  "
                >
                  <fp-icon name="power" class="fp-fs-18" />
                  {{ profile.status === "active" ? "Deactivate" : "Activate" }}
                </a>
              </div>
            </div>
            <div
              v-if="profile.subscribed"
              class="dropup dropdown-automotive-profile mb-2"
            >
              <a
                href="javascript:;"
                class="btn btn-automotive-profile fp-text-color fp-btn-outline dropdown-toggle"
                data-toggle="dropdown"
              >
                <fp-icon name="star-circle" class="fp-fs-18" />
                Subscription
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <a
                  class="dropdown-item"
                  href="javascript:;"
                  @click.prevent="cancelSubscription()"
                >
                  <fp-icon name="close" class="fp-fs-16" />
                  Cancel Subscription
                </a>
                <router-link
                  :to="{ name: 'automotive.update_subscription' }"
                  class="dropdown-item"
                >
                  <fp-icon name="refresh" class="fp-fs-18" />
                  Update Plan
                </router-link>
              </div>
            </div>
            <router-link
              v-else
              :to="{ name: 'automotive.subscribe' }"
              class="btn btn-automotive-profile fp-text-color fp-btn-outline mb-2"
              ><fp-icon name="setting" class="fp-fs-18" /> Subscrib</router-link
            >
            <a
              href="javascript:;"
              class="btn btn-automotive-profile fp-text-color fp-btn-outline mb-2"
              :class="{ disabled: profile.status === 'inactive' }"
              @click.prevent="addInventory()"
            >
              <fp-icon name="plus" class="fp-fs-18" />
              <span class="d-none d-md-inline">Add Inventory</span>
              <span class="d-inline d-md-none">Add</span>
            </a>
          </div>
          <div v-else class="d-flex justify-content-between mt-3">
            <a
              class="btn btn-automotive-profile fp-text-color fp-btn-outline"
              @click.prevent="openContactInfoModal"
            >
              <fp-icon name="phone" class="fp-fs-20" />
              Contact
            </a>
            <a
              class="btn btn-automotive-profile fp-text-color fp-btn-outline ml-2"
              @click.prevent="openEnquiryModal"
            >
              <fp-icon name="share" class="fp-fs-20" />
              Enquiry Now
            </a>
            <a
              class="btn btn-automotive-profile fp-text-color fp-btn-outline ml-2"
              @click.prevent="openChat"
            >
              <fp-icon name="email" class="fp-fs-22" />
              Message
            </a>
          </div>
          <div
            v-if="isMyProfile"
            class="plan-info d-flex justify-content-around mt-1"
          >
            <p class="mb-0" v-if="profile.subscribed">
              <fp-icon name="plan" class="fp-fs-24" />&nbsp;
              {{ profile.subscription.plan.name }}({{
                profile.subscription.plan.max_items
              }})
            </p>
            <p class="mb-0">
              <fp-icon name="items" class="fp-fs-24" />&nbsp;
              {{ profile.posts_count }} Total Items
            </p>
            <p class="mb-0">
              <fp-icon name="active-items" class="fp-fs-24" />&nbsp;
              {{ profile.active_posts_count }} Active
            </p>
            <p
              v-if="profile.posts_count - profile.active_posts_count"
              class="mb-0"
            >
              <fp-icon name="active-items" class="fp-fs-24" />&nbsp;
              {{ profile.posts_count - profile.active_posts_count }} Inactive
            </p>
          </div>
        </div>
      </div>
    </div>
    <fp-modal
      ref="enquiryModal"
      name="enquiryModal"
      :title="`Contact ${profile.name}`"
    >
      <form action="" @submit.prevent="sendEnquiryMessage">
        <div class="form-group">
          <label>Full Name <span class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter your full name"
            required
            maxlength="50"
            v-model="enquiry_form.name"
          />
        </div>
        <div class="form-group">
          <label>Phone Number <span class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control"
            placeholder="Your phone number"
            required
            maxlength="20"
            v-model="enquiry_form.phone_number"
          />
        </div>
        <div class="form-group">
          <label>Email Address <span class="text-danger">*</span></label>
          <input
            type="email"
            class="form-control"
            placeholder="Your email address"
            required
            maxlength="80"
            v-model="enquiry_form.email"
          />
        </div>
        <div class="form-group">
          <label>Message <span class="text-danger">*</span></label>
          <textarea
            rows="4"
            class="form-control"
            v-model="enquiry_form.message"
            maxlength="500"
            required
            placeholder="Enter short message"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            class="btn fp-btn-gradient px-4"
            :class="{ 'btn-loading': enquiry_form.busy }"
            :disabled="enquiry_form.busy"
          >
            Send
          </button>
        </div>
      </form>
    </fp-modal>
    <review-modal
      ref="writeReviewModal"
      :url="reviewUrl"
      :profile-name="profile.name"
      :profile-image="profileImg"
      :params="reviewFormData"
      @submit="reviewSubmitted"
      @closed="initReviewParams"
    />
    <fp-modal ref="reviewModal" name="reviewModal">
      <template #header>
        <div class="review-modal-header">
          <img :src="profileImg" width="42" height="42" :alt="profile.name" />
          <div class="ml-2">
            <p class="mb-n1 profile-name px-0" style="font-size: 15px">
              {{ profile.name }}
            </p>
            <div class="d-flex">
              <star-rating
                :rating="profile.rating"
                :star-size="15"
                :show-rating="false"
                read-only
              />
              <span class="ml-1" style="margin-top: 2px"
                >({{ profile.review_count }}
                {{ profile.review_count > 1 ? "reviews" : "review" }})</span
              >
              <a
                v-if="auth_user && !isMyProfile"
                href="javascript:;"
                class="ml-3 fp-text-color-primary"
                style="margin-top: 2px"
                @click.prevent="addNewReview()"
                >Write a review</a
              >
            </div>
          </div>
        </div>
      </template>
      <template>
        <profile-reviews
          ref="profileReviews"
          :profile="profile"
          @edit-review="editReview"
        />
      </template>
    </fp-modal>
    <fp-modal
      ref="contactModal"
      name="contactModal"
      :title="`Contact ${profile.name}`"
    >
      <div v-if="recaptchaSuccess" class="contact-info-container">
        <label class="control-label mb-0">Email</label>
        <div class="contact-info-item fp-border-color-1">
          <fp-icon name="email" class="fp-fs-24" />
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
        </div>
        <label class="control-label mb-0">Phone</label>
        <div class="contact-info-item fp-border-color-1">
          <fp-icon name="mobile" class="fp-fs-24" />
          <a :href="`tel:${profile.phone_number}`">{{
            profile.phone_number
          }}</a>
        </div>
        <p class="mb-0 fp-text-color-danger">
          * DO NOT contact me with unsolicited messages, offers, and services
        </p>
      </div>
      <div v-else class="recaptcha-container" style="width: 302px">
        <h6 class="fp-bg-gradient">Please verify you are a real person</h6>
        <div>
          <recaptcha @success="recaptchaSuccess = true" />
        </div>
      </div>
    </fp-modal>
  </div>
</template>
<script>
import Form from "vform";
import Swal from "sweetalert2";
import FpModal from "../ui/Modal.vue";
import StarRating from "vue-star-rating";
import ProfileReviews from "./ProfileReviews.vue";
import ReviewModal from "~/components/ui/review/ReviewModal.vue";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import LightBox from "vue-it-bigger";
import("vue-it-bigger/dist/vue-it-bigger.min.css");

export default {
  name: "SellerProfileCard",
  props: ["profile"],
  components: {
    FpModal,
    StarRating,
    ProfileReviews,
    ReviewModal,
    VueSlickCarousel,
    LightBox,
  },
  data() {
    return {
      enquiry_form: new Form({
        automotive_seller_id: this.profile.id,
        name: "",
        phone_number: "",
        email: "",
        message: "",
      }),
      indexOfImage: 0,
      slickSettings: {
        arrows: false,
        edgeFriction: 0.35,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: true,
      },
      reviewFormData: {
        mode: "add",
        id: "",
        profile_id: this.profile.id,
      },
      imagesFOrLightBox: [
        "https://cisp.cachefly.net/assets/articles/images/resized/0001081147_resized_blueprintcarwireframe1022.jpg",
        "https://img.freepik.com/premium-photo/car-dark-background-futuristic-autonomous-vehicle-car-hud_607202-4625.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1699142400&semt=ais",
        "https://www.eetimes.eu/wp-content/uploads/2023/12/Software-defined-vehicle_SDV_TTTech-Auto.jpg?resize=640%2C360",
        "https://graphitehitech.com/wp-content/uploads/2021/01/automotive1.jpeg",
      ],
      recaptchaSuccess: false,
      recaptcha_site_key: process.env.recaptchaSiteKey,
    };
  },
  computed: {
    subscription_ends_at() {
      return this.profile.subscribed
        ? this.$moment(this.profile.subscription.ends_at).format("MM/DD/YY")
        : "";
    },
    isMyProfile() {
      return this.auth_user && this.auth_user.id === this.profile.user_id;
    },
    profileImg() {
      return this.profile.image
        ? this.profile.image.src_url
        : require("@/assets/images/logo.png");
    },
    auth_user() {
      return this.$store.getters["auth/user"];
    },
    reviewUrl() {
      return `${process.env.adsApiUrl}/automotive/review/submit`;
    },
    lightBoxImages() {
      // return this.profile.images.map((image) => {
      //   return {
      //     src: image.src_url,
      //     alt: this.profile.name,
      //   };
      // });
      return this.imagesFOrLightBox.map((image) => {
        return {
          src: image,
          alt: this.profile.name,
        };
      });
    },
  },
  mounted() {
    this.$store.dispatch("setEnableChat", true);
  },
  beforeDestroy() {
    this.$store.dispatch("setEnableChat", false);
  },
  methods: {
    changeCarousel(index) {
      this.$refs.carousel.goTo(index);
    },
    afterChange(index) {
      this.indexOfImage = index;
    },
    openGallery(index) {
      this.$refs.adsLightBox.showImage(index);
    },
    editProfile() {
      if (this.$parent.$options.name == "SellerProfileForm") {
        this.$parent.form_submitted = false;
      } else {
        this.$router.push({ name: "automotive.seller_profile_form" });
      }
    },
    openContactInfoModal() {
      this.$modal.show("contactModal");
    },
    openEnquiryModal() {
      this.$refs.enquiryModal.open();
    },
    sendEnquiryMessage() {
      this.enquiry_form
        .post(`${process.env.adsApiUrl}/automotive/send_enquiry_message`)
        .then((response) => {
          if (response.data.status == "Success") {
            this.$modal.hide("enquiryModal");
          }
        });
    },
    login(redirect = "") {
      if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
      if (this.$route.name !== "login") this.$router.push({ name: "login" });
    },
    openChat() {
      if (this.auth_user) {
        if (this.auth_user.id === this.profile.user_id) return false;
        let payload = {
          user_id: this.profile.user_id,
          chat_image_url: this.profile.image ? this.profile.image.src_url : "",
          chat_name: this.profile.name,
          is_online: this.profile.is_online,
        };
        this.$store.dispatch("message/openUserChatBox", payload);
      } else {
        this.login(this.$route.path);
      }
    },
    changeStatus(status) {
      let title = "";
      let text = "";
      if (status == "deleted") {
        title =
          "Are you sure, you want to delete your automotive seller profile?";
        text =
          "* Your automotive seller profile will be removed permanently. \n * All items in your inventory will be removed.";
      }
      if (status == "inactive") {
        title =
          "Are you sure, you want to deactivate your automotive seller profile?";
        text =
          "* Your automotive seller profile will be inactive. \n * All items in your inventory will go offline. \n * You can not add/remove items.";
      }
      if (status == "active") {
        if (!this.profile.subscribed) {
          this.$router.push({ name: "automotive.subscribe" });
        } else if (!this.auth_user.available_add_inventory) {
          this.$modal.show("availableInventoryModal");
          return false;
        }
        title =
          "Are you sure, you want to activate your automotive seller profile?";
        text =
          "* Your automotive seller profile will be active. \n * All items in your inventory will go online. \n * You can add/remove items.";
      }
      Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        customClass: {
          title: "automotive-swal-title",
          content: "automotive-swal-content",
        },
      }).then((willDelete) => {
        if (willDelete.isConfirmed) {
          let params = {
            id: this.profile.id,
            status: status,
          };
          this.axios
            .post(`${process.env.adsApiUrl}/automotive/change_status`, params)
            .then((response) => {
              if (response.data.status == "Success") {
                let successMessage = "Successfully done";
                if (status == "deleted") {
                  successMessage = "Deleted successfully";
                } else {
                  if (status == "active") {
                    successMessage = "Your automotive seller profile is live!";
                  } else if (status == "inactive") {
                    successMessage =
                      "Your automotive seller profile is offline!";
                  }
                }
                this.$store.dispatch("fetchNotifications");
                this.$toast.success(successMessage);
                this.$emit("update");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },
    cancelSubscription() {
      Swal.fire({
        title: "Are you sure, you want to cancel your membership?",
        text: `* Your automotive seller profile will be inactive after ${this.subscription_ends_at}. \n * All items in your inventory will go offline. \n * You can not add/remove items.`,
        icon: "warning",
        showCancelButton: true,
        customClass: {
          title: "automotive-swal-title",
          content: "automotive-swal-content",
        },
      }).then((willDelete) => {
        if (willDelete.isConfirmed) {
          let params = {
            automotive_seller_id: this.profile.id,
          };
          this.axios
            .post(`${process.env.adsApiUrl}/stripe/cancel_subscription`, params)
            .then((response) => {
              if (response.data.status == "Success") {
                console.log("Subscription cancelled");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },
    openGoogleMap() {
      if (
        this.profile.location.address != "" &&
        this.profile.location.city != "" &&
        this.profile.location.state != "" &&
        this.profile.location.zipcode != ""
      ) {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${this.profile.location.address}, ${this.profile.location.city}, ${this.profile.location.state}, ${this.profile.location.zipcode}`,
          "_blank"
        );
      } else if (
        this.profile.location.latitude != "" &&
        this.profile.location.longitude != ""
      ) {
        window.open(
          `https://maps.google.com/?ll=${this.profile.location.latitude},${this.profile.location.longitude}`,
          "_blank"
        );
      }
    },
    addInventory() {
      if (
        this.profile.subscribed &&
        this.profile.posts_count >= this.profile.subscription.plan.max_items
      ) {
        Swal.fire({
          text: "You have reached the maximum number of active items in your inventory. Please upgrade your plan.",
          showCancelButton: true,
          confirmButtonText: "Upgrade",
          reverseButtons: true,
          customClass: {
            title: "automotive-add-swal-title",
            popup: "automotive-add-swal-popup",
          },
        }).then((willDelete) => {
          if (willDelete.isConfirmed) {
            this.$refs.profileCard.updateSubscription();
          }
        });
      } else if (!this.profile.subscribed) {
        this.$router.push({ name: "automotive.subscribe" });
      } else {
        this.$router.push({ name: "automotive.post" });
      }
    },
    openReviewModal() {
      if (this.profile.review_count === 0) return false;
      this.$refs.reviewModal.open();
    },
    editReview(review) {
      this.reviewFormData.id = review.id;
      this.reviewFormData.mode = "edit";
      this.reviewFormData.rating = review.rating;
      this.reviewFormData.content = review.content;
      this.$refs.reviewModal.close();
      this.$refs.writeReviewModal.open();
    },
    addNewReview() {
      this.$refs.reviewModal.close();
      this.reviewFormData.id = "";
      this.reviewFormData.mode = "add";
      this.$refs.writeReviewModal.open();
    },
    reviewSubmitted(data) {
      this.profile.review_count = data.profile.review_count;
      this.profile.rating = data.profile.rating;
    },
    initReviewParams() {
      this.reviewFormData = {
        mode: "add",
        id: "",
        profile_id: this.profile.id,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.automotive-profile-card {
  border-radius: 12px;
  @media (max-width: 600px) {
    padding: 0;
    background-color: transparent;
  }
  &-image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px 0 0 12px;
    width: 58%;
    overflow: hidden;
    max-height: 350px;
    @media (max-width: 600px) {
      border-radius: 12px;
      width: 100%;
      margin-bottom: 16px;
      max-height: 200px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .automotive-seller-type {
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      .profile-type {
        border-style: solid;
        border-width: 1px;
        border-radius: 30px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 1px 8px;
        font-weight: 400;
        font-size: 13px;
        white-space: nowrap;
      }
    }
  }
  &-content {
    width: 45%;
    border-radius: 0 12px 12px 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    @media (max-width: 600px) {
      border-radius: 0;
      width: 100%;
      padding: 0;
      background-color: none;
    }
    .automotive-profile-title {
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 16px;
    }
    @media (min-width: 600px) {
      .required-input-container::before {
        display: none;
      }
    }
    .business-info {
      border-style: solid;
      border-width: 1px;
      padding: 12px 8px 0;
      border-radius: 10px;
    }
    .dropdown-automotive-profile {
      display: inline-block;
      .dropdown-toggle {
        &::after {
          display: none;
        }
      }
    }
    p.business_hours {
      white-space: pre-line;
      padding-left: 16px;
      svg {
        margin-left: -18px;
      }
    }
    .btn-automotive-profile {
      font-size: 13px;
    }
    .dropdown-menu {
      border-radius: 12px;
      padding: 4px 12px;
      .dropdown-item {
        font-size: 13.6px;
        padding: 8px 0;
        border-bottom: 1px solid #0000001a;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: unset;
        }
      }
    }
    .plan-info {
      font-size: 13.6px;
    }
    .automotive-profile-detail {
      white-space: pre-wrap;
      @media (max-width: 600px) {
        padding-left: 24px;
      }
    }
    .automotive-profile-actions {
      @media (max-width: 600px) {
        padding: 12px 8px;
        margin: 0 -8px;
      }
    }
  }
}
.review-modal-header {
  display: flex;
  align-items: center;
  margin: -6px 0 -8px;
  img {
    object-fit: cover;
    border-radius: 100%;
  }
  p {
    flex-grow: 1;
    max-width: calc(100% - 40px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
    text-align: left;
    padding: 0 10px;
  }
}
.contact-info-container {
  .contact-info-item {
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 16px;
    a {
      font-size: 14.4px;
    }
  }
}
[data-theme="dark"] {
  .automotive-profile-card-content {
    // background-color: #00162D;
  }
}
.carousel {
  display: flex;
  width: calc(100% - 420px);

  .indicator {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;

    @media (max-width: 600px) {
      display: none;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    img {
      width: 160px;
      height: 100px;
      object-fit: cover;
      display: block;
      //   min-height: 150px;
      cursor: pointer;
      margin-bottom: 10px;
      //   border-radius: 6px;
      border: solid 2px transparent;

      &.active {
        border: solid 2px #64748b;
      }
    }
  }

  .slider {
    width: calc(100% - 160px);
    padding-left: 10px;

    @media (max-width: 600px) {
      width: 100%;
      padding-left: 0;
    }

    .img-slide {
      min-width: 300px;
      height: 400px;
      max-width: 100%;
      object-fit: contain;
      //   border-radius: 8px;

      @media (max-width: 600px) {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }
    }
  }
}
.m-indicator {
  display: flex;
  overflow-x: auto;

  img {
    width: 70px;
    height: 70px;
    cursor: pointer;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    opacity: 0.75;

    &.active {
      opacity: 1;
    }
  }
}
</style>
