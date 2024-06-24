<template>
  <div class="row pt-3 pt-md-3 justify-content-center">
    <div class="col-md-6 col-lg-5 d-none d-md-block">
      <login-card />
    </div>
    <div class="col-md-6 col-lg-5">
      <div class="login-container fp-card p-md-4">
        <h4 class="mb-4">
          Welcome to <span class="fp-text-active">FlickerPage</span>
        </h4>
        <div class="d-flex align-items-center mb-3 mb-md-4">
          <h6 class="mb-0 mr-1">Quick Sign-in</h6>
          <login-with-social />
        </div>
        <form @submit.prevent="login" @keydown="form.onKeydown($event)">
          <!-- Username -->
          <div class="form-group mb-3">
            <div class="d-flex justify-content-between">
              <label>Username</label>
              <a
                href="javascript:;"
                class="font-weight-400"
                tabindex="-1"
                @click="handleForgotUser"
                >Forgot username?
              </a>
            </div>
            <div class="icon-prefix-input">
              <fp-icon name="user" />
              <input
                v-model="form.username"
                class="form-control"
                :class="form.errors.has('username') && 'is-invalid'"
                type="text"
                name="username"
                placeholder="Enter username"
                maxlength="128"
                required
              />
            </div>
            <div
              v-if="form.errors.has('username')"
              class="invalid-feedback d-block"
            >
              <fp-icon name="alert-circle" class="fp-fs-20 mt-n-2px" />
              {{ form.errors.get("username") }}
            </div>
          </div>
          <!-- Password -->
          <div class="form-group">
            <div class="d-flex justify-content-between">
              <label>Password</label>
              <a
                href="javascript:;"
                class="font-weight-400"
                tabindex="-1"
                @click="handleForgotPassword"
                >Forgot password?
              </a>
            </div>
            <div class="icon-prefix-input">
              <fp-icon name="lock" />
              <input
                v-model="form.password"
                class="form-control"
                type="password"
                name="password"
                placeholder="Enter password"
                maxlength="256"
                required
              />
            </div>
          </div>
          <div class="row mx-n2">
            <div class="col-md-6 px-2 mb-3">
              <button
                type="submit"
                class="btn btn-block fp-btn-gradient"
                :class="{ 'btn-loading': form.busy }"
                :disabled="form.busy"
              >
                <fp-icon name="sign-in" class="fp-fs-22" />
                &nbsp; Sign in
              </button>
            </div>
            <div class="col-md-6 px-2 mb-3">
              <a
                href="javascript:;"
                class="btn btn-block btn-signup"
                @click="signUp()"
              >
                <fp-icon name="user-plus" class="fp-fs-22" />
                &nbsp; Sign up
              </a>
            </div>
            <div class="col-6 px-2 mb-3">
              <router-link
                :to="{ name: 'ads' }"
                class="btn btn-block fp-btn-default btn-direct-open"
              >
                <fp-icon name="ads" class="fp-fs-22" />
                &nbsp; Local Classifieds
              </router-link>
            </div>
            <div class="col-6 px-2 mb-3">
              <router-link
                :to="{ name: 'topic' }"
                class="btn btn-block fp-btn-default btn-direct-open"
              >
                <fp-icon name="facts_questions" class="fp-fs-22" />
                &nbsp; Facts/ Questions?
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "vform";
import LoginWithSocial from "./LoginWithSocial.vue";
import { mapGetters } from "vuex";
import LoginCard from "./LoginCard.vue";
export default {
  data: () => ({
    appName: process.env.appName,
    form: new Form({
      username: "",
      password: "",
    }),
    remember: false,
  }),
  components: {
    LoginWithSocial,
    LoginCard,
  },
  computed: {
    ...mapGetters({
      redirect_route: "auth/redirect_route",
    }),
  },
  methods: {
    async login() {
      let data;

      try {
        const response = await this.form.post(`/login`);
        data = response.data;
      } catch (e) {
        let errors = e.response.data.errors;
        if (errors.must_verify_email) {
          const auth_user = errors.user_data[0];
          const payload = {
            user_id: auth_user.id,
            email: auth_user.email,
            phone_number: auth_user.phone_number,
          };
          this.resendActivationCode(payload);
        }
        return;
      }

      this.$toast.success("Logged in successfully!");

      // Save the token.
      this.$store.dispatch("auth/saveToken", {
        token: data.data.token,
        remember: this.remember,
      });

      // Fetch the user.
      await this.$store.dispatch("auth/fetchUser");

      this.$modal.hide("auth_modal");
      if (this.$route.name == "verification.verify") {
        this.$router.push("index");
      }
      if (this.redirect_route) {
        this.$router.push(this.redirect_route);
        this.$store.dispatch("auth/setRedirectRoute", "");
      } else {
        this.$router.push({ name: "index" });
      }
    },
    async signUp() {
      this.$router.push({ name: "register" });
    },
    setModalContent(modal_content) {
      this.$store.dispatch("auth/setModalContent", { modal_content });
    },
    async resendActivationCode(payload) {
      const response = await this.axios.post(
        `/auth/resend_verification_code`,
        payload
      );
      if (response.data.status === "Success") {
        this.$toast.success(
          "A new verification code has been sent successfully!"
        );
        this.$router.push({
          name: "register",
          query: { step: "verify", ...payload },
        });
      }
    },
    async handleClassified() {
      this.$router.push({ name: "index" });
    },
    async handleTopic() {
      this.$router.push({ name: "topic" });
    },
    async handleForgotPassword() {
      this.$router.push({ name: "password.request" });
    },
    async handleForgotUser() {
      this.$router.push({ name: "username.request" });
    },
  },
};
</script>
<style lang="scss" scoped>
h3 {
  @media (max-width: 600px) {
    font-size: 25px;
  }
}

.login-container {
  border-radius: 12px;
  height: 100%;
  @media (max-width: 600px) {
    padding: 0;
    background-color: inherit;
    border-radius: 0;
  }
}

.btn {
  font-size: 15px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  &.btn-direct-open {
    font-size: 14px;
  }
}

.btn-signup {
  border-color: #ff22a1;
  color: #ff22a1;
}
[data-theme="dark"] {
  .btn-direct-open {
    @media (max-width: 600px) {
      background-color: #00162d;
    }
  }
}
</style>
