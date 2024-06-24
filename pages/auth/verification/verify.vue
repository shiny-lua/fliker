<template>
  <div class="row mt-3 mt-md-5">
    <div class="col-md-8 col-lg-6 m-auto">
      <div class="card">
        <div class="card-header text-center">
          {{ success ? "Thank you!" : "Email Account Verification" }}
        </div>
        <div class="card-body">
          <template v-if="success">
            <div class="alert alert-success" role="alert">
              {{ status }}
            </div>
            <button type="button" class="btn fp-btn-gradient" @click="login()">
              Log In
            </button>
          </template>
          <template v-else>
            <div class="alert alert-danger text-center" role="alert">
              {{ status || "Failed to verify email." }}
            </div>
            <a
              v-if="message == 'already_verified'"
              @click.prevent="login()"
              class="btn fp-btn-gradient mx-auto mt-2"
              >Log In</a
            >
            <router-link
              v-else
              :to="{ name: 'verification.resend' }"
              class="small float-right"
            >
              Resend verification link?
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const qs = (params) =>
  Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

export default {
  middleware: "guest",

  metaInfo() {
    return { title: "Verify Email" };
  },

  async asyncData({ params, query }) {
    try {
      const { data } = await axios.post(
        `/email/verify/${params.id}?${qs(query)}`
      );
      return { success: true, status: data.status, message: data.message };
    } catch (e) {
      return {
        success: false,
        status: e.response.data.status,
        message: e.response.data.message,
      };
    }
  },

  methods: {
    login() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>
