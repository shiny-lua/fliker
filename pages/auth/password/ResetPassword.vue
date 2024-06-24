<template>
    <div class="row pt-3 pt-md-3 justify-content-center">
        <div class="col-md-6 col-lg-5 d-none d-md-block">
            <login-card />
        </div>
        <div class="col-md-6 col-lg-5">
            <div class="login-container fp-card p-md-4">
                <h4 class="mb-4">Welcome to <span class="fp-text-active">FlickerPage</span></h4>
                <div class="card fp-card p-0 form-wrapper round-10 overflow-hidden">
                    <div class="card-header">
                        <h5 class="text-center mb-0">Reset Password</h5>
                    </div>
                    <div class="card-body">
                        <div v-if="form.successful">
                            <div class="d-flex align-items-center justify-content-center py-2">
                                <fa icon="check-circle" class="text-success" />
                                <p class="mb-0 ml-2" style="font-weight: 500">
                                    Your password has been reset successfully. Back to login!
                                </p>
                            </div>
                            <div class="text-center pb-2">
                                <router-link :to="{name: 'login'}" class="btn btn-success reset-btn">
                                    Back to LogIn
                                </router-link>
                            </div>
                        </div>
                        <div v-else-if="form.errors.has('email')">
                            <div class="alert alert-success text-center">
                                The reset link has expired. Please request a new one.
                            </div>
                            <a href="javascript:;" @click.prevent="sendResetLink()" class="btn btn-success btn-lg btn-block reset-btn">
                                Send Password Reset Link
                            </a>
                        </div>
                        <form v-else @submit.prevent="reset" @keydown="form.onKeydown($event)">
                            <!-- Email -->
                            <div v-if="mode === 'email'" class="form-group">
                                <label class="control-label text-muted">Email</label>
                                <div class="icon-prefix-input">
                                    <fp-icon name="email" />
                                    <input v-model="form.email"
                                         :class="{ 'is-invalid': form.errors.has('email') }"
                                         type="email"
                                         name="email"
                                         class="form-control"
                                         readonly
                                         placeholder="Email Address"
                                    />
                                </div>
                            </div>
                            <!-- Email -->
                            <div v-if="mode === 'phone_number'" class="form-group">
                                <label class="control-label text-muted">Phone Number</label>
                                <div class="icon-prefix-input">
                                    <fp-icon name="mobile" />
                                    <input v-model="form.phone_number"
                                         :class="{ 'is-invalid': form.errors.has('phone_number') }"
                                         type="text"
                                         name="phone_number"
                                         class="form-control"
                                         readonly
                                         placeholder="Phone number"
                                    />
                                </div>
                                <has-error :form="form" field="phone_number" />
                            </div>

                            <!-- Password -->
                            <div class="form-group">
                                <label class="control-label text-muted">Enter new password</label>
                                <div class="icon-prefix-input">
                                    <fp-icon name="lock" />
                                    <input v-model="form.password"
                                         :class="{ 'is-invalid': form.errors.has('password') }"
                                         type="password"
                                         name="password"
                                         class="form-control"
                                         placeholder="Password"
                                         maxlength="256"
                                    />
                                </div>
                                <has-error :form="form" field="password" />
                            </div>

                            <!-- Password Confirmation -->
                            <div class="form-group mb-4">
                                <label class="control-label text-muted">Confirm password</label>
                                <div class="icon-prefix-input">
                                    <fp-icon name="lock" />
                                    <input v-model="form.password_confirmation"
                                         :class="{'is-invalid': form.errors.has('password_confirmation')}"
                                         type="password"
                                         name="password_confirmation"
                                         class="form-control"
                                         placeholder="Confirm Password"
                                         maxlength="256"
                                    />
                                </div>
                                <has-error :form="form" field="password_confirmation" />
                            </div>

                            <!-- Submit Button -->
                            <div class="text-center">
                                <button type="submit" class="btn fp-btn-gradient px-4" :class="{ 'btn-loading': form.busy }" :disabled="form.busy">
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Form from "vform";
import LoginCard from "../../../components/auth/LoginCard.vue";

export default {
    name: 'ResetPassword',
    middleware: "guest",
    components: {
        LoginCard,
    },

    data: () => ({
        appName: process.env.appName,
        status: "",
        form: new Form({
            token: "",
            email: "",
            phone_number: "",
            password: "",
            password_confirmation: "",
        }),
        mode: 'email',
    }),

    head() {
        return { title: "Reset Password" };
    },

    created() {
        this.form.email = this.$route.query.email;
        if (this.$route.query.phone_number) {
            this.mode = 'phone_number';
            this.form.phone_number = this.$route.query.phone_number;
        }
        this.form.token = this.$route.params.token;
    },

    methods: {
        reset() {
            if (this.form.password !== this.form.password_confirmation) {
                this.$toast.error("Please insert the confirm password correctly!");
            } else {
                let url = this.mode === 'phone_number' ? '/password/reset_with_phone_number' : `/password/reset`;

                this.form.post(url).then(({ data }) => {
                    this.status = data.status;
                    this.form.reset();
                    this.$store.dispatch("fetchNotifications");
                });
            }
        },
        login(redirect = "") {
            if (redirect) this.$store.dispatch("auth/setRedirectRoute", redirect);
            if (this.$route.name !== "login") this.$router.push({ name: "login" });
        },
        sendResetLink() {
            this.login(this.$route.path);
        },
    },
};
</script>
<style lang="scss" scoped>

    .login-container {
        border-radius: 12px;
        height: 100%;
    }
</style>
