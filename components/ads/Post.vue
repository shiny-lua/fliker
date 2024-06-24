<template>
  <div class="post-card fp-card p-0">
    <div class="card-image-wrapper" @click="viewDetails">
      <div v-if="post.category" class="post-ribbons">
        <div v-if="postTitle" class="post-ribbon category">{{ postTitle }}</div>
      </div>
      <div v-else-if="post.automotive_item_name" class="post-ribbons">
        <div class="post-ribbon category">{{ post.automotive_item_name }}</div>
      </div>
      <img
        v-if="post.images.length"
        :src="post.images[0].src_url"
        class="post-image"
        width="100%"
        height="100%"
        :alt="post.title"
      />
      <img v-else src="@/assets/images/fp-default-bg.webp" alt="" />
      <div
        v-if="postPrice || post.automotive_item_name"
        class="post-bottom-ribbons"
      >
        <div v-if="postPrice" class="post-ribbon price">{{ postPrice }}</div>
        <div v-if="post.automotive_item_name" class="post-ribbon price ml-2">
          {{
            post.cost && !isNaN(post.cost)
              ? _currency(post.cost)
              : "Contact for price"
          }}
        </div>
      </div>
    </div>
    <div class="post-information fp-card round-0">
      <div
        class="post-title"
        :class="{ visited: post.is_visited }"
        :title="post.title"
      >
        <a href="javascript:;" @click.prevent="viewDetails">{{
          post.title.length > 77
            ? post.title.substring(0, 77) + "..."
            : post.title
        }}</a>
      </div>
      <div class="location-time fp-text-color-main">
        <div class="location">
          <fp-icon name="location" class="fp-fs-18" />
          &nbsp;{{ post.location.city }}
        </div>
        <div class="time">
          <fp-icon name="calendar-1" class="fp-fs-18" />
          &nbsp;{{ $moment(post.created_at).format("MMM DD") }}
        </div>
      </div>
    </div>
    <div
      v-if="is_automotive || is_admin"
      class="automotive-section mt-n1 fp-border-color-1"
    >
      <div
        class="d-flex justify-content-between align-items-center"
        v-if="is_admin"
      >
        <span
          class="text-uppercase"
          :class="{
            'text-success': post.status == 'active',
            'text-danger': post.status == 'inactive',
            'text-warning': post.status == 'pending',
          }"
        >
          <fa icon="circle" />
          <span class="d-none d-md-inline">
            <span v-if="post.status === 'active'">Live</span>
            <span v-if="post.status === 'inactive'">Offline</span>
            <span v-if="post.status === 'pending'">Inactive</span>
          </span>
        </span>
        <div class="fp-text-color-main">
          <a
            href="javascript:;"
            class=""
            :title="post.status == 'active' ? 'Live' : 'Hidden'"
            @click="
              changeStatus(post.status == 'active' ? 'inactive' : 'active')
            "
          >
            <fp-icon name="eye" class="fp-fs-20" />
          </a>
          <a href="javascript:;" class="" title="Edit" @click="edit()">
            <fp-icon name="edit" class="fp-fs-18" />
          </a>
          <a
            href="javascript:;"
            class=""
            title="Delete"
            @click="changeStatus('deleted')"
          >
            <fp-icon name="trash" class="fp-fs-18" />
          </a>
        </div>
      </div>
      <div class="profile-page-link" v-else>
        <router-link
          v-if="post.automotive_seller"
          :to="{
            name: 'automotive.seller_profile',
            params: { slug: post.automotive_seller.slug },
          }"
          >{{ post.automotive_seller.name }}</router-link
        >
        <a href="javascript:;" v-else class="text-muted">{{
          post.user.name
        }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import { mapGetters } from "vuex";
export default {
  props: ["post", "is_admin", "is_automotive"],
  computed: {
    postTitle() {
      if (!this.post.category) return null;
      if (this.post.category.name === "Jobs")
        return this.post.job_title ? this.post.job_title : "Local Jobs";
      if (this.post.category.name === "Services")
        return this.post.service_provider
          ? this.post.service_provider
          : "Local Services";
      if (this.post.category.name === "For Sale")
        return this.post.job_title ? this.post.job_title : "For Sale";
      if (this.post.category.name === "Accommodation")
        return this.post.house_type
          ? this.post.house_type.substring(0, 30)
          : "Accommodation";
      if (this.post.category.name === "Real Estate")
        return this.post.house_type ? this.post.house_type : "Real Estate ";
      if (this.post.category.name === "Legal/Lawyers")
        return this.post.service_provider
          ? this.post.service_provider
          : "Legal/Lawyers";
      if (this.post.category.name === "Repairs")
        return this.post.service_provider
          ? this.post.service_provider
          : "Repairs";
      if (this.post.category.name === "Skilled Trades")
        return this.post.service_provider
          ? this.post.service_provider
          : "Skilled Trades";
      if (this.post.category.name === "Training/Lessons")
        return this.post.trainer_institute
          ? this.post.trainer_institute
          : "Training/Lessons";
      if (this.post.category.name === "Rent/Lease")
        return this.post.rent_lease_item
          ? this.post.rent_lease_item
          : "For Rent/Lease";
      if (this.post.category.name === "Community")
        return this.post.sub_category
          ? this.post.sub_category.name
          : "Community";
      // if (this.post.category.name === 'Pets' && this.post.sub_category.name === 'Pet Care') return this.post.service_provider ? this.post.service_provider : 'Pet Care';
      //   if (
      //     this.post.category.name === "Pets" &&
      //     this.post.sub_category.name === "Pet Adoption"
      //   )
      //     return this.post.breed_species_type
      //       ? this.post.breed_species_type
      //       : "Pet Adoption";
      //   if (
      //     this.post.category.name === "Pets" &&
      //     this.post.sub_category.name === "Pet Accessories"
      //   )
      //     return this.post.job_title ? this.post.job_title : "Pet Accessories";
      //   return this.post.sub_category
      //     ? this.post.sub_category.name
      //     : this.post.category.name;
    },
    postPrice() {
      if (!this.post.category) return null;
      if (this.post.category.name === "For Sale" && this.post.cost)
        return this._currency(this.post.cost);
      if (this.post.category.name === "Jobs" && this.post.compensation)
        return (
          this._currency(this.post.compensation) +
          `/${this.post.compensation_unit}`
        );
      if (
        this.post.category.name === "Accommodation" &&
        this.post.rent_other_utilities
      )
        return (
          this._currency(this.post.rent_other_utilities) +
          `/${this.post.rent_other_utilities_unit}`
        );
      if (this.post.category.name === "Real Estate" && this.post.cost)
        return this._currency(this.post.cost);
      if (this.post.category.name === "Rent/Lease" && this.post.rent_lease_cost)
        return (
          this._currency(this.post.rent_lease_cost) + `/${this.post.cost_unit}`
        );
      return null;
    },
    ...mapGetters({
      auth_user: "auth/user",
    }),
  },
  methods: {
    viewDetails() {
      this.$router.push({
        name: "ads.detail",
        params: { slug: this.post.slug },
      });
    },
    edit() {
      if (this.post.automotive_seller_id) {
        this.$router.push({
          name: "automotive.edit",
          params: { id: this.post.id },
        });
      } else {
        this.$router.push({ name: "ads.edit", params: { id: this.post.id } });
      }
    },
    async changeStatus(status) {
      if (this.post.status == "pending" && !this.post.automotive_seller_id) {
        this.$router.push({
          name: "ads.activate",
          query: { id: this.post.id, email: this.post.contact_email },
        });
        return false;
      }
      let title = "Are you sure?";
      if (status == "deleted") {
        title = "Are you sure, you want to delete this item from inventory?";
      } else if (status == "active") {
        if (this.post.automotive_seller_id) {
          if (!this.auth_user.available_add_inventory) {
            this.$modal.show("availableInventoryModal");
            return false;
          } else if (this.auth_user.seller_profile_status != "active") {
            await Swal.fire({
              title:
                "Your automotive seller profile is inactive.Please activate it to set inventory online",
              icon: "warning",
              showCancelButton: true,
            });
            return false;
          } else {
            title = "Set your post to live?";
          }
        } else {
          title = "Set your post to live?";
        }
      } else if (status == "inactive") {
        title = "Set your post offline?";
      }
      Swal.fire({
        title: title,
        icon: "warning",
        showCancelButton: true,
      }).then((willDelete) => {
        if (willDelete.isConfirmed) {
          let params = {
            id: this.post.id,
            status: status,
          };
          this.axios
            .post(`${process.env.adsApiUrl}/post/change_status`, params)
            .then((response) => {
              if (response.data.status == "Success") {
                this.post.status = response.data.data.status;
                let successMessage = "Successfully done!";
                if (status == "active") {
                  successMessage = "Your post is live!";
                } else if (status == "inactive") {
                  successMessage = "Your post is offline!";
                } else if (status == "deleted") {
                  successMessage = "Deleted successfully!";
                }
                this.$toast.success(successMessage);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },
    _currency(amount) {
      return Number(amount).toLocaleString("en", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.post-card {
  border-radius: 12px;
  .card-image-wrapper {
    position: relative;
    height: 170px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    @media (max-width: 1200px) {
      height: 160px;
    }
    @media (max-width: 600px) {
      height: 140px;
    }

    .post-image {
      max-width: 100%;
      height: auto;
      width: 100%;
    }
    .no-image {
      color: #64748b;
      text-align: center;
      margin-top: 14px;
    }
  }
  .post-information {
    padding: 12px;
    border-radius: 0 0 9px 9px;
  }
  .post-title {
    height: 36px;
    margin-bottom: 0;
    cursor: pointer;
    &.visited {
      a {
        color: #ff22a1;
      }
    }
    a {
      line-height: 19px;
      font-size: 14px;
      display: inline-block;
      max-height: 40px;
      overflow: hidden;
      color: inherit;
      max-width: 100%;
      &:hover {
        color: #ff22a1;
        text-decoration: none;
      }
    }
  }
  .location-time {
    height: 20px;
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin-top: 5px;
  }
  .location,
  .time {
    font-family: "Inter", sans-serif;
    font-size: 12.6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    line-height: 15px;
  }
  .profile-page-link {
    text-align: center;
    margin-bottom: -12px;
    a {
      font-size: 13.2px;
      font-weight: 500;
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.post-ribbons {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  max-width: calc(100% - 10px);
}
.post-bottom-ribbons {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  padding: 5px;
}
.post-ribbon {
  color: #ffffff;
  font-weight: 400;
  font-size: 12px;
  padding: 3px 8px;
  z-index: 1;
  cursor: pointer;
  border-radius: 4px;
  &.category {
    color: #fff;
    background: rgba(0, 0, 0, 0.502);
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      white-space: normal;
    }
  }
  &.price {
    background: #007bff;
  }
  &.negotiable {
    background: #f7f9fb;
    color: #212529;
    padding: 2px 4px;
    border-radius: 0;
    margin-bottom: 2px;
  }
}
.automotive-section {
  padding: 10px 12px;
  border-top-style: solid;
  border-top-width: 1px;
}
</style>
