<template>
  <div class="post-detail fp-card">
    <div class="d-lg-flex">
      <div class="post-images-descriptions">
        <div v-if="lightBoxImages.length" class="carousel">
          <div class="indicator">
            <img v-for="(image, index) in lightBoxImages" :src="image.src" :key="index" @click="changeCarousel(index)"
                 :class="{ active: indexOfImage == index }" alt="" />
          </div>
          <div class="slider">
            <VueSlickCarousel ref="carousel" v-bind="slickSettings" @afterChange="afterChange">
              <div class="text-center" v-for="(img, index) in lightBoxImages" :key="index" @click="openGallery(index)">
                <img class="slider-img img-slide mx-auto" :src="img.src" alt="" />
              </div>
            </VueSlickCarousel>
          </div>
        </div>
        <div class="md-slide">
          <div v-if="lightBoxImages.length" class="m-indicator mt-2">
            <img v-for="(image, index) in lightBoxImages" :src="image.src" :key="index" @click="changeCarousel(index)"
                 :class="{ active: indexOfImage == index }" alt="" />
          </div>
          <div class="fp-card user-detail-container fp-border-color-1 p-2 mt-3">
            <post-user-detail :post="post" />
          </div>
        </div>
        <hr class="d-none d-md-block" />
        <div v-if="post.description" class="fp-text-color-main mt-3">
          <p class="post-description">
            {{
              descriptionExpand
              ? post.description
              : post.description.substring(0, 700)
            }}
          </p>
          <div class="mb-3" v-if="post.description.length > 700">
            <a href="javascript:;" class="fp-text-active" @click="descriptionExpand = !descriptionExpand">({{
              descriptionExpand ? "Less..." : "More..." }})</a>
          </div>
        </div>
        <div class="quick-info">
          <div v-if="post.category && post.category.name == 'Jobs'">
            <p class="mb-0" v-if="post.job_options && post.job_options.includes('EOE')">
              <fa icon="check-square" /> We are e-verified and Equal Opportunity
              Employer(EOE)
            </p>
            <p class="mb-0" v-if="post.job_options && post.job_options.includes('Invite')">
              <fa icon="check-square" /> Invite people with disabilities for
              this position
            </p>
            <p class="mb-0" v-if="post.job_options && post.job_options.includes('VISA')">
              <fa icon="check-square" /> Work visa sponsership available for
              this position
            </p>
            <p class="mb-0" v-if="post.job_options && post.job_options.includes('Direct')">
              <fa icon="check-square" /> Direct applicants only. No third party
              recruiters allowed apply.
            </p>
          </div>
        </div>
      </div>
      <div class="post-information fp-border-color-1 ml-lg-3">
        <post-user-detail :post="post" class="mb-3 d-none d-md-block" />
        <hr />
        <quick-information :post="post"></quick-information>

        <div v-if="map_center" class="map-container mt-3 mr-lg-3" style="height: 300px">
          <gmap-map ref="mapRef" :options="{ streetViewControl: false }" :center="map_center" :zoom="11"
                    map-type-id="roadmap" style="width: 100%; height: 100%">
            <gmap-circle :center="map_center" :radius="6000" :visible="true" :editable="true" :options="{
              fillColor: 'green',
              fillOpacity: 0.3,
              strokeColor: 'green',
              strokeOpacity: 0.5,
              strokeWeight: 2,
            }" />
          </gmap-map>
        </div>
        <p class="mt-1 mb-0 fp-text-color-main" style="font-weight: 400">
          The location data here is only for information purposes. May not be
          accurate.
        </p>
      </div>
    </div>
    <div class="mt-auto detail_footer">
      <div v-if="post.id" class="mt-4">
        <span class="text-secondary">Post ID: {{ post.id }}</span>
        <a href="javascript:;" class="ml-3" @click="$modal.show('ads_post_report_modal')">
          <fp-icon name="alert-rectangle" class="fp-fs-20 fp-text-color-main" />
          Report post
        </a>
        <a href="javascript:;" class="ml-3" @click="share()">
          <fp-icon name="share" class="fp-fs-20 fp-text-color-main" />
          Share
        </a>
      </div>
      <div v-if="disclaimer_text" class="mt-1 mb-0 fp-text-active" style="font-weight: 400" v-html="disclaimer_text">
      </div>
    </div>

    <light-box ref="adsLightBox" :media="lightBoxImages" :show-light-box="false"></light-box>

    <fp-modal name="ads_post_report_modal" title="Report Us">
      <post-report-form :post_id="post.id" @sent="$modal.hide('ads_post_report_modal')" />
    </fp-modal>
  </div>
</template>
<script>
import QuickInformation from "./QuickInformation.vue";
import PostUserDetail from "./PostUserDetail.vue";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import LightBox from "vue-it-bigger";
import("vue-it-bigger/dist/vue-it-bigger.min.css");
import PostReportForm from "./PostReportForm.vue";
import FpModal from "~/components/ui/Modal.vue";
// console.log("images", this.post.images);
export default {
  props: ["post"],
  name: "AdsPostDetail",
  components: {
    QuickInformation,
    PostUserDetail,
    VueSlickCarousel,
    LightBox,
    PostReportForm,
    FpModal,
  },
  data() {
    return {
      indexOfImage: 0,
      map_center: null,
      descriptionExpand: false,
      slickSettings: {
        arrows: false,
        slidesToScroll: 1,
        pauseOnHover: true,
      },
      disclaimer_text: "",
    };
  },
  computed: {
    auth_user() {
      return this.$store.getters["auth/user"];
    },
    previewImages() {
      return this.$store.getters["ads/previewImages"];
    },
    // lightBoxImages() {
    //     return this.post.images.map((image) => {
    //         return {
    //             src: image.src_url,
    //             thumb: image.thumbnail ? image.thumbnail_url : image.src_url,
    //             type: "image",
    //         };
    //     });
    // },
    lightBoxImages() {
      if (this.previewImages.length > 0) {
        return this.previewImages.map((image) => {
          console.log("images in store are", image);
          return {
            src: image.src_url,
            type: "image",
          };
        });
      } else {
        console.log("images in post are", this.post.images);
        return this.post.images.map((image) => {
          return {
            src: image.src_url,
            thumb: image.thumbnail ? image.thumbnail_url : image.src_url,
            type: "image",
          };
        });
      }
    },
    detailUrl() {
      return `${process.env.serverUrl}${this.$route.path}`;
    },
  },
  mounted() {
    if (this.post.business_location && this.post.business_location.latitude) {
      this.map_center = {
        lat: Number(this.post.business_location.latitude),
        lng: Number(this.post.business_location.longitude),
      };
    } else if (this.post.location && this.post.location.latitude) {
      this.map_center = {
        lat: Number(this.post.location.latitude),
        lng: Number(this.post.location.longitude),
      };
    }
    this.getDisclaimerText();
  },

  methods: {
    changeCarousel(index) {
      this.$refs.carousel.goTo(index);
    },
    afterChange(index) {
      this.indexOfImage = index;
    },
    share() {
      const payload = {
        model: "ads",
        id: this.post.id,
        url: this.detailUrl,
      };
      this.$share(payload);
    },
    openGallery(index) {
      this.$refs.adsLightBox.showImage(index);
    },
    getDisclaimerText() {
      this.axios
        .post(`/setting/get`, { key: "disclaimer_texts" })
        .then((response) => {
          if (response.data.status == "Success" && response.data.data) {
            const disclaimer_texts = JSON.parse(response.data.data);
            this.disclaimer_text = disclaimer_texts[this.post.category_id];
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.post-detail {
  @media (max-width: 600px) {
    padding: 0;
    background-color: transparent;
    box-shadow: unset !important;
  }
}

.carousel {
  display: flex;
  height: 300px;
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
      height: 300px;
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

.md-slide {
  display: none;
  @media (max-width: 600px) {
    display: block;
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

.post-description {
  white-space: pre-line;
  font-size: 14px;
  max-width: 100%;
  overflow: hidden;
}

.detail_footer {
  a {
    font-weight: 400;

    &:hover {
      color: #64748b;
    }
  }
}

.quick-info {
  margin-top: 20px;
  font-weight: 500;
}

.modal-phone-number {
  .icon-phone {
    display: inline-block;
    font-size: 20px;
    padding: 1px 6px;
    border: solid 2px;
    border-radius: 100px;
  }

  .number {
    font-size: 16px;
  }

  .warning {
    line-height: 1;
    font-size: 13.6px;
    margin-bottom: 8px;
  }
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
}

@media (min-width: 991px) {
  .post-information {
    width: 340px;
    border-left-style: solid;
    border-left-width: 1px;
    padding-left: 16px;
  }

  .post-images-descriptions {
    width: calc(100% - 340px);
  }
}

.user-detail-container {
  @media (max-width: 600px) {
    padding-left: 0;
    padding-right: 0;
    background: none;
    border-radius: 0;
    border-top-style: solid;
    border-top-width: 1px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  }
}

[data-theme="light"] {
  .post-description {
    color: #222;
  }
}
</style>
