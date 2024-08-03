<template>
  <div class="py-3 py-md-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="text-center mb-3">
          <h5 class="fp-text-color mt-2">
            {{
              is_update
              ? "Update Your Automotive Seller Profile"
              : "Create Your Automotive Seller Profile"
            }}
          </h5>
        </div>
        <div v-if="!is_update" class="mb-4">
          <step-header :steps="[
            'Create Profile',
            'Select Plan',
            'Pay & Activate',
            'Add Inventory',
          ]" :selected="0"></step-header>
        </div>
        <div class="seller-profile-form-card fp-card p-3 p-md-4 mb-md-4">
          <form action="" class="post" @submit.prevent="submit">
            <div class="row mx-n2">
              <div class="col-lg-6 px-2 mb-3">
                <label for="" class="mb-1">
                  Business/Seller Name <span class="text-danger">*</span>
                  <span v-if="is_update" class="ml-1" v-tooltip="update_info_text">
                    <fa :icon="['far', 'question-circle']" />
                  </span>
                </label>
                <div class="d-flex align-items-center">
                  <input type="text" class="form-control" placeholder="Ex. RGroup" v-model="form.name" maxlength="40"
                         :disabled="is_update" required />
                </div>
              </div>

              <div class="col-lg-6 px-2 mb-3 automotive-seller-type">
                <label class="mb-1">Seller Type</label>
                <multiselect v-model="form.type" :options="sellerTypes" :preserve-search="true" :multiple="true"
                             placeholder="Select" :show-labels="false"></multiselect>
              </div>
            </div>
            <div class="row mx-n2">
              <div class="col-lg-6 px-2">
                <div class="form-group">
                  <label for="" class="mb-1">About Seller <span class="text-danger">*</span></label>
                  <div>
                    <textarea name="detail" rows="5" class="form-control" v-model="form.detail" maxlength="10000"
                              placeholder="Describe your business briefly.." required></textarea>
                    <p class="d-flex justify-content-between text-muted mb-0 mt-2">
                      <span>Entered: {{ detail_words }} Characters</span>
                      <span>Between 250 - 10000 Characters</span>
                    </p>
                  </div>
                </div>

                <div class="form-group">
                  <label for="" class="mb-1">Contact Information</label>
                  <div class="fp-card w-100 fp-border-color-1" style="border: solid 1px">
                    <div class="form-group mb-2">
                      <label for="" class="mb-1">Email</label>
                      <div class="required-input-container">
                        <input type="email" class="form-control" v-model="form.email" placeholder="Enter email address"
                               maxlength="80" required />
                      </div>
                    </div>
                    <div class="form-group mb-2">
                      <label for="" class="mb-1">Phone</label>
                      <div class="required-input-container">
                        <input type="text" class="form-control" v-model="form.phone_number"
                               placeholder="Enter phone number" maxlength="20" required />
                      </div>
                    </div>
                    <div class="form-group mb-2">
                      <label for="" class="mb-1">Web Link</label>
                      <input type="text" class="form-control" v-model="form.weblink"
                             placeholder="Any web links (Optional)" maxlength="150" />
                      <span class="invalid-feedback">* DO NOT input long URL
                        <fa :icon="['far', 'question-circle']" v-tooltip="`Input links to your site homepage, about, contact forms, and others. Avoid long URLs.`
                          " />
                      </span>
                    </div>
                    <div class="">
                      <div class="form-check">
                        <label class="form-check-label font-weight-500">
                          <input type="checkbox" class="form-check-input" v-model="form.enable_chat" required />
                          Enable Online Chat
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 px-2">
                <div class="form-group">
                  <label class="mb-1">What do you want to sell?
                    <span class="text-danger">*</span></label>
                  <multiselect v-model="selected_categories" :options="categories" :preserve-search="true"
                               placeholder="Search categories" track-by="id" label="name" :multiple="true"
                               :show-labels="false" :class="{
                                 multiple: true,
                                 'has-error':
                                   form.categories.length === 0 &&
                                   form.errors.has('categories'),
                               }"></multiselect>
                  <has-error :form="form" field="categories" />
                </div>
                <div class="form-group">
                  <label for="" class="mb-1">Business/Seller Location
                    <span class="text-danger">*</span></label>
                  <div class="d-flex align-items-center">
                    <div class="fp-card w-100 fp-border-color-1" style="border: solid 1px">
                      <div class="row mx-n1">
                        <div class="col-12 mb-2 mb-md-3 px-1">
                          <label class="mb-1">
                            Street Address
                            <span v-if="is_update" class="ml-1" v-tooltip="update_info_text">
                              <fa :icon="['far', 'question-circle']" />
                            </span>
                          </label>
                          <gmap-autocomplete class="form-control w-100" :value="form.location.address"
                                             @place_changed="updateAddress" placeholder="Enter street address"
                                             style="max-width: 100%" :disabled="is_update"
                                             @keypress.enter="$event.preventDefault()"></gmap-autocomplete>
                          <!-- @keypress.enter="$event.preventDefault()" -->
                          <p v-if="form.location.address == '' && showLocationError
                            " class="text-danger mb-0">
                            Street address is required
                          </p>
                        </div>
                        <div class="col-md-4 mb-2 mb-md-3 px-1">
                          <label class="mb-1">Zip Code</label>
                          <input type="text" class="form-control" v-model="form.location.zipcode" placeholder="Zipcode"
                                 :disabled="is_update" required />
                          <p v-if="form.location.zipcode == '' && showLocationError
                            " class="text-danger mb-0">
                            Zipcode is required
                          </p>
                        </div>
                        <div class="col-md-4 mb-2 mb-md-3 px-1">
                          <label class="mb-1">City</label>
                          <input type="text" class="form-control" v-model="form.location.city" placeholder="City"
                                 :disabled="is_update" required />
                          <p v-if="form.location.city == '' && showLocationError" class="text-danger mb-0">
                            City is required
                          </p>
                        </div>
                        <div class="col-md-4 mb-2 mb-md-3 px-1">
                          <label class="mb-1">State</label>
                          <input type="text" class="form-control" v-model="form.location.state" placeholder="State"
                                 :disabled="is_update" required />
                          <p v-if="form.location.state == '' && showLocationError
                            " class="text-danger mb-0">
                            State is required
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-2">
                  <label for="" class="mb-1">Business Hours <span class="text-danger">*</span></label>
                  <textarea name="business_hours" rows="5" class="form-control" maxlength="80"
                            v-model="form.business_hours" placeholder="Enter business open hours" required></textarea>
                </div>
              </div>
            </div>
            <div class="form-group">
              <automotives-uploader v-model="form.image"></automotives-uploader>
            </div>
            <!-- <div class="form-group">
              <label for="" class="mb-1">Add Cover Image</label>
              <div>
                <label class="cover-image fp-border-color-1">
                  <a
                    href="javascript:;"
                    class="btn-delete ml-2"
                    title="Delete"
                    @click.prevent="removeImage"
                    v-if="imageData"
                    ><fa :icon="['far', 'trash-alt']"
                  /></a>
                  <img :src="imageData" alt="" v-if="imageData" />
                  <p class="text-center" v-else>
                    <fp-icon name="upload" class="fp-fs-38 fp-text-active" />
                    <br />
                    Click here to upload image
                  </p>
                  <input
                    type="file"
                    name="image"
                    multiple="true"
                    @change="handleFile"
                    hidden
                    accept="image/*"
                  />
                </label>
                
              </div>
            </div> -->
            <div class="text-center mt-3" v-if="progress && form.image">
              <div class="progress mx-auto" style="height: 8px">
                <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: `${progress}%` }">
                </div>
              </div>
              <p class="mt-1">
                {{ progress }}% uploaded... please wait
              </p>
            </div>
            <div class="btn-group">
              <button type="submit" class="btn fp-btn-gradient" :class="{ 'btn-loading': form.busy }"
                      :disabled="form.busy">
                {{ is_update ? "Update Profile" : "Create & Subscribe" }}
              </button>
              <router-link :to="{ name: 'automotive.seller_profile' }"
                           class="btn fp-btn-outline ml-2">Cancel</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Form from "vform";
import Swal from "sweetalert2";
import ProfileCard from "~/components/automotive/ProfileCard.vue";
import StepHeader from "~/components/ui/StepHeader.vue";
import Multiselect from "vue-multiselect";
import AutomotivesUploader from "~/components/ads/form_elements/AutomotivesSellerUploader.vue";
import "vue-multiselect/dist/vue-multiselect.min.css";
export default {
  name: "SellerProfileForm",
  middleware: "auth",
  components: {
    ProfileCard,
    StepHeader,
    Multiselect,
    AutomotivesUploader,
  },
  data() {
    return {
      categories: [],
      selected_categories: [],
      form: new Form({
        name: "",
        type: [],
        detail: "",
        email: "",
        phone_number: "",
        weblink: "",
        enable_chat: true,
        business_hours: "",
        location_id: "",
        location: {
          id: "",
          country: "",
          city: "",
          state: "",
          zipcode: "",
          county: "",
          address: "USA",
          full_address: "",
          latitude: "",
          longitude: "",
        },
        image: [],
        categories: [],
      }),
      progress: 0,
      imageData: [],
      profile: null,
      form_submitted: false,
      is_update: false,
      update_info_text: `Field can not be modified. Please contact "seller-support@flickerpage.com" for changes.`,
      showLocationError: false,
    };
  },
  computed: {
    detail_words() {
      return this.form.detail ? this.form.detail.length : 0;
    },
    sellerTypes() {
      return [
        "Auto Auction",
        "New/Used Automotive Dealer",
        "Individual/Private Seller",
        "Local Store",
        "Third Party",
      ];
    },
    auth_user() {
      return this.$store.getters["auth/user"];
    },
    coverImages() {
      return this.$store.getters["ads/automotiveSellerImages"];
    },
  },
  watch: {
    selected_categories(value) {
      this.form.categories = value.map((i) => i.id);
    },
    "form.detail": function (val) {
      if (!this.form.detail) return 0;
      // this.detail_words = this.form.detail.length;
    },
  },
  mounted() {
    this.getCategories();
    if (this.auth_user) this.loadProfile();
  },
  methods: {
    async getCategories() {
      const response = await this.axios.post(
        `${process.env.adsApiUrl}/automotive/get_categories`
      );
      this.categories = response.data.data;
    },
    // handleEnterPress() {
    //   console.log('Enter key pressed');
    // },
    loadProfile() {
      this.axios
        .post(`${process.env.adsApiUrl}/automotive/get_seller_profile`, {
          user_id: this.auth_user.id,
        })
        .then((response) => {
          if (response.data.status == "Success") {
            let result = response.data.data;
            if (result) {
              this.loadForm(result);
              this.profile = result;
              this.is_update = true;
              this.selected_categories = result.categories;
            }
          }
        });
    },
    loadForm(result) {
      this.form.name = result.name;
      this.form.type = result.type;
      this.form.detail = result.detail;
      this.form.email = result.email;
      this.form.phone_number = result.phone_number;
      this.form.weblink = result.weblink;
      this.form.enable_chat = result.enable_chat;
      this.form.business_hours = result.business_hours;
      this.form.location_id = result.location_id;

      if (result.location) {
        this.form.location = result.location;
      }

      if (result.image) {
        this.imageData = result.image.src_url;
        this.form.image = result.image;
        this.$store.dispatch("ads/setAutomotiveSellerImages", result.image);
      }
    },
    updateAddress(place) {
      if (place && place.geometry && place.geometry.location) {
        this.form.location.latitude = place.geometry["location"].lat();
        this.form.location.longitude = place.geometry["location"].lng();
        for (var i = 0; i < place.address_components.length; i++) {
          for (var j = 0; j < place.address_components[i].types.length; j++) {
            if (place.address_components[i].types[j] === "postal_code") {
              this.form.location.zipcode = place.address_components[i].long_name;
            }
            if (
              place.address_components[i].types[j] ===
              "administrative_area_level_1"
            ) {
              this.form.location.state = place.address_components[i].short_name;
            }
            if (
              place.address_components[i].types[j] ===
              "administrative_area_level_2"
            ) {
              let county = place.address_components[i].short_name;
              county = county.replace(" County", "");
              this.form.location.county = county;
            }
            if (place.address_components[i].types[j] === "locality") {
              this.form.location.city = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[j] === "country") {
              this.form.location.country = place.address_components[i].short_name;
            }
          }
        }
        this.form.location.address = place.name;
        this.form.location.full_address = place.formatted_address;
      }
    },
    handleFile(event) {
      const file = event.target.files[0];
      this.form.image = file;
      if (!file) return false;
      let reader = new FileReader();
      reader.onload = (e) => {
        const newImages = {
          src_url: e.target.result,
        };
        this.imageData = [...this.imageData, newImages.src_url];
      };
      reader.readAsDataURL(file);
      console.log(this.imageData);
    },
    removeImage() {
      if (this.imageData.includes("http")) {
        Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
        }).then((willDelete) => {
          if (willDelete.isConfirmed) {
            this.axios
              .delete(
                `${process.env.adsApiUrl}/post/image/delete/${this.form.image.id}`
              )
              .then((response) => {
                if (response.data.status == "Success") {
                  this.$toast.success("Deleted successfully");
                  this.imageData = null;
                  this.form.image = null;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
      } else {
        console.log("this.imageData", this.imageData)
        console.log("this.form.image", this.form.image)
        this.imageData = null;
        this.form.image = null;
        console.log("this.imageData", this.imageData)
        console.log("this.form.image", this.form.image)
      }
    },
    async submit() {
      if (
        this.form.location.address == "" ||
        this.form.location.zipcode == "" ||
        this.form.location.city == "" ||
        this.form.location.state == ""
      ) {
        this.showLocationError = true;
        return false;
      }
      if (this.detail_words < 250) {
        this.$toast.error("Description should be at least 250 Characters");
        return false;
      }
      try {
        this.loading = true;
        console.log("this.coverImages", this.coverImages)
        const uploadedImages = [];
        const totalImages = this.coverImages.length;
        let count = 0;
        for (const image of this.coverImages) {
          if ("created_at" in image) {
            uploadedImages.push(image);
          } else {
            const uploadedImage = await this.uploadImage(image);
            uploadedImages.push(uploadedImage);
          }
          count++;
          this.progress = Math.floor((count / totalImages) * 100);
          

          console.log(this.progress)
          // this.$refs.progresStatus.style.width = this.progress + "%";
        }
        this.form.image = uploadedImages;
        this.loading = false;
        const response = await this.form.post(
          `${process.env.adsApiUrl}/automotive/save_seller_profile`
        );
        // console.log(response)
        if (response.data.status === "Success") {
          this.loadForm(response.data.data);
          this.profile = response.data.data;
          this.form_submitted = true;
          const message = this.is_update
            ? "Your automotive seller profile updated successfully!"
            : "Your automotive seller profile created successfully!";
          this.$fpSuccess(message);
          this.$store.dispatch("fetchNotifications");
          setTimeout(() => {
            if (this.profile.subscribed) {
              this.$router.push({ name: "automotive.seller_profile" });
            } else {
              let is_posting = this.$route.params.is_posting;
              this.$router.push({
                name: "automotive.subscribe",
                params: { is_posting: !!is_posting },
              });
            }
          }, 1000);
        }
      } catch (error) {
        console.log("seller_profile_form_error", error);
      }
    },
    async uploadImage(image) {
      if(!image.file) return
      try {
        const formData = new FormData();
        formData.append("image", image.file);
        const response = await this.axios.post(
          `${process.env.adsApiUrl}/post/upload_image`,
          formData
        );

        if (response.data.status === "Success") {
          console.log("resp", response.data.data)
          return response.data.data;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        throw error;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.col-form-label {
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.cover-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 175px;
  max-height: 250px;
  position: relative;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .btn-delete {
    position: absolute;
    top: 3px;
    right: 3px;
    font-size: 14px;
    background-color: #004080;
    padding: 2px 5px 0;
    color: #fff;
    border-radius: 4px;
  }
}

.required-input-container {
  &::before {
    left: -10px;
  }
}

.automotive-seller-type::v-deep {
  .multiselect {
    height: unset !important;
  }

  .multiselect__tags {
    padding-top: 6px !important;
    min-height: 38px;
    height: unset !important;
  }

  .multiselect__tag {
    margin-bottom: 2px;
  }

  .multiselect__placeholder {
    margin-bottom: 5px !important;
  }
}

.seller-profile-form-card {
  @media (max-width: 767px) {
    margin-bottom: 6em;
  }

  @media (max-width: 600px) {
    margin-bottom: 0em;
  }
}
</style>
