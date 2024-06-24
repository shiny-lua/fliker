<template>
  <div class="container mt-3">
    <inventory-form
      v-if="post_id"
      mode="edit"
      :id="post_id"
      :has-seller-profile="!!auth_user.automotive_seller"
    ></inventory-form>
  </div>
</template>
<script>
import InventoryForm from "~/components/automotive/InventoryForm.vue";
import { mapGetters } from "vuex";
export default {
  middleware: "auth",
  components: {
    InventoryForm,
  },
  data() {
    return {
      post_id: null,
    };
  },
  computed: {
    auth_user() {
      return this.$store.getters["auth/user"];
    },
  },
  created() {
    this.post_id = this.$route.params.id;
  },
};
</script>
