<template>
    <div class="row pt-3 pt-md-3 justify-content-center">
        <div class="col-md-6 col-lg-5 d-none d-md-block">
            <login-card />
        </div>
        <div class="col-md-6 col-lg-5">
            <div class="login-container fp-card">
                <div class="d-flex justify-content-center">
                    <div class="photo d-flex align-items-center justify-content-center">
                        <img v-if="imageData" :src="imageData" alt="" />
                        <h1 v-else class="mb-0">RG</h1>
                        <div class="buttons">
                            <label class="btn-profile-img">
                                <fp-icon name="camera" class="fp-fs-18" />
                                <input type="file" hidden accept="image/*" @change="handleImage" />
                            </label>
                        </div>
                    </div>
                </div>

                <form action="" @submit.prevent="handleSignup" class="my-3">
                    <div class="row mx-n1">
                        <div class="col-md-6 px-1 mb-2">
                            <div class="icon-prefix-input">
                                <fp-icon name="datepicker" />
                                <datepicker v-model="form.date_of_birth"
                                     :disabled-dates="disabledDates"
                                     :open-date="lastAvailableDate"
                                     :input-class="{
                                        'form-control': true,
                                        'is-invalid': showErrors && !this.form.date_of_birth
                                     }"
                                     placeholder="Date of birth"
                                ></datepicker>
                            </div>
                        </div>
                        <!-- Gender -->
                        <div class="col-md-6 px-1 mb-2">
                            <gender-input v-model="form.gender"
                                    direction="right"
                                    :is-invalid="form.errors.has('gender')"
                            />
                            <has-error :form="form" field="gender" />
                        </div>
                        <div v-if="form.gender === 'custom'" class="col-12 px-1 mb-2">
                            <div class="icon-prefix-input">
                                <fp-icon name="gender" />
                                <input v-model="form.custom_gender"
                                        :class="{ 'is-invalid': form.errors.has('custom_gender') || (showErrors && form.gender === 'custom' && form.custom_gender == '') }"
                                        type="text"
                                        name="custom_gender"
                                        class="form-control"
                                        placeholder="Enter custom gender"
                                        maxlength="128"
                                />
                            </div>
                            <div v-if="showErrors && form.custom_gender == ''"
                                class="invalid-feedback">
                                    <span v-if="form.custom_gender == ''">Please enter custom gender</span>
                                    <!-- <span v-else>Custom gender allowed only alphabets</span> -->
                            </div>
                        </div>
                    </div>
                    <!-- Username -->
                    <div class="form-group">
                        <div class="icon-prefix-input">
                            <fp-icon name="user" />
                            <input v-model="form.username"
                                 :class="{ 'is-invalid': form.errors.has('username') || (showErrors && !this._testUsername()) }"
                                 type="text"
                                 name="username"
                                 class="form-control"
                                 placeholder="Choose your username"
                                 required
                                 maxlength="128"
                            />
                        </div>
                        <p class="mb-0">Special symbol allowed "-, $, _, dot(.)"</p>
                        <has-error :form="form" field="username" />
                    </div>

                    <!-- Password -->
                    <div class="form-group">
                        <div class="icon-prefix-input">
                            <fp-icon name="lock" />
                            <input v-model="form.password"
                                 :class="{ 'is-invalid': form.errors.has('password') }"
                                 type="password"
                                 name="password"
                                 required
                                 class="form-control"
                                 placeholder="Set your password"
                                 maxlength="256"
                            />
                        </div>
                        <has-error :form="form" field="password" />
                    </div>
                    <div class="custom-control custom-checkbox mb-2">
                        <input type="checkbox" class="custom-control-input" :class="{ invalid: form.errors.has('is_accepted') || (showErrors && !form.is_accepted) }" id="is_accepted" name="accept" v-model="form.is_accepted" />
                        <label class="fp-text-color-main custom-control-label" for="is_accepted">
                            By clicking Register, you agree to our
                            <router-link :to="{ name: 'terms_of_use' }" class="font-weight-bold fp-text-active">Terms of use</router-link>
                            and
                            <router-link :to="{ name: 'privacy_policies' }" class="font-weight-bold fp-text-active">Privacy policy</router-link>
                        </label>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn fp-btn-gradient" :class="{ 'btn-loading': form.busy }" :disabled="form.busy">
                            Complete Signup
                        </button>
                    </div>
                    <div class="fp-text-color-main text-center mt-3 d-flex justify-content-center">
                        Already have an account?
                        <a href="javascript:;" class="ml-1" @click="handleLogin">Log In</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import LoginCard from "../../components/auth/LoginCard.vue";
    import Form from "vform";
    import Datepicker from "vuejs-datepicker";
    import GenderInput from "../../components/elements/GenderInput.vue"

    export default {
        name: "SocialSignup",
        components: {
            LoginCard,
            Datepicker,
            GenderInput,
        },
        data: () => ({
            appName: process.env.appName,
            form: new Form({
                username: "",
                email: "",
                gender: "",
                custom_gender: "",
                date_of_birth: "",
                password: "",
                image: '',
                is_accepted: false,
            }),
            imageData: '',
            showErrors: false,
        }),
        computed: {
            auth_user() {
                return this.$store.getters["auth/user"];
            },
            maxDate() {
                const currentDate = new Date();
                const maxDate = currentDate.toISOString().slice(0, 10);
                return maxDate;
            },
            lastAvailableDate() {
                const currentDate = new Date(); // Current date and time
                const yearThirteenYearsAgo = currentDate.getFullYear() - 13;
                const dateThirteenYearsAgo = new Date(yearThirteenYearsAgo, currentDate.getMonth(), currentDate.getDate());
                return dateThirteenYearsAgo;
            },
            disabledDates() {
                return {
                    from: this.lastAvailableDate,
                }
            },
        },
        mounted() {
            this.form.email = this.$route.query.email;
            const name = this.$route.query.name;
            this.imageData = `https://i2.wp.com/ui-avatars.com/api/${name}?ssl=1`;
        },
        methods: {
            async handleSignup() {
                if (!this._validate()) return;
                this.showErrors = false;
                // if (this.auth_user.email != this.form.email && !this.email_verified) {
                //     let result = await this.sendVerificationCode();
                //     if (result) this.$modal.show("email_verify_modal");
                //     return false;
                // }
                // const response = await this.form.post(`/settings/profile`);
                // let user = response.data.data;
                // this.$toast.success("Information saved successfully");
                // this.$store.dispatch("auth/updateUser", { user });
                // this.$router.push({ name: "index" });
                try {
                    const response = await this.form.post('/auth/complete_social_sign_up');
                    if (response.data.status === 'Success') {
                        // Login User
                        const { data } = await this.form.post(`/login`);
                        // Save the token.
                        await this.$store.dispatch("auth/saveToken", {token: data.data.token});
                        // Fetch the user.
                        await this.$store.dispatch("auth/fetchUser");
                        this.$router.push({ name: "index" });
                    }
                } catch (error) {
                    this.$toast.error('Something went wrong! Please try again.');
                    this.$router.push({name: 'login'});
                }
            },
            handleImage(event) {
                const file = event.target.files[0]
                if (file.size > 50000000) {
                    this.$toast.error(`File ${file.name} exceeds 50MB.`);
                    return false;
                } else {
                    this.form.image = file;
                    if (!file) return false
                    let reader = new FileReader();
                    reader.onload = e => {
                        this.imageData = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            },
            async sendVerificationCode(is_resent = false) {
                try {
                    await this.axios.post(`/profile/send_email_verification_code`, {
                        email: this.form.email,
                    });
                    if (is_resent) this.resent_code = true;
                    return true;
                } catch (e) {
                    this.$toast.error(e.response.data.message);
                    return false;
                }
            },
            async handleLogin() {
                this.$router.push({ name: "login" });
            },
            _validate() {
                if(this.form.username.trim() === '' || !this._testUsername()) return this._formError();
                if(this.form.gender == '') return this._formError();
                if (this.form.gender === 'custom') {
                    if (this.form.custom_gender === '' || /^[a-zA-Z0-9 ]+$/.test(this.form.custom_gender) == false) return this._formError()
                }
                if(!this.form.is_accepted) return this._formError();
                if(this.form.password == '') return this._formError();
                if(this.form.date_of_birth == '') return this._formError();
                return true;
            },
            _testUsername() {
                const regex = /^[a-zA-Z0-9\-\$\_\.]+$/;
                return regex.test(this.form.username);
            },
            _formError() {
                this.showErrors = true;
                return false;
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
    }

    .photo {
        width: 150px !important;
        height: 120px !important;
        position: relative;
        border-radius: 15px;
        background-color: #dadada;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .buttons {
            position: absolute;
            bottom: 7px;
            right: 10px;
            display: flex;
            align-items: center;

            .btn-profile-img {
                cursor: pointer;
                display: inline-block;
                margin-bottom: 0;
                img {
                    width: 18px;
                }
                &::v-deep label {
                    cursor: pointer;
                }
            }
        }
    }
</style>
