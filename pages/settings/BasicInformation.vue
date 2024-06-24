<template>
    <div class="settings-card fp-card">
        <form v-if="auth_user" @submit.prevent="update" @keydown="form.onKeydown($event)">
            <div class="row mx-n2">
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Name</label>
                    <div class="disabled-input-container">
                        <div class="icon-prefix-input">
                            <fp-icon name="user" />
                            <input :value="auth_user.name" type="text" name="name" class="form-control" placeholder="Ex. Ramana Gude" disabled />
                        </div>
                        <span class="information fp-text-color-main mr-2"
                            v-tooltip="`Name can't be modified. Please contact support@flickerpage.com`"
                        ><fa :icon="['far', 'question-circle']" /></span>
                    </div>
                </div>
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Username</label>
                    <div class="disabled-input-container">
                        <div class="icon-prefix-input">
                            <fp-icon name="user" />
                            <input :value="form.username" type="text" name="username" class="form-control"  disabled placeholder="Ex. ramanagude" />
                        </div>
                        <has-error :form="form" field="username" />
                        <span class="information fp-text-color-main mr-2"
                            v-tooltip="`Username can't be modified. Please contact support@flickerpage.com`"
                        ><fa :icon="['far', 'question-circle']" /></span>
                    </div>
                </div>
            </div>
            <div class="row mx-n2">
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Email</label>
                    <div class="disabled-input-container">
                        <div class="icon-prefix-input">
                            <fp-icon name="email" />
                            <input v-model="form.email"
                                 :class="{ 'is-invalid': form.errors.has('email') }"
                                 type="email"
                                 name="email"
                                 class="form-control"
                                 placeholder="Email address"
                                 required
                                 maxlength="256"
                            />
                        </div>
                        <span class="information fp-text-color-main mr-2"
                            v-tooltip="`Email verification is required`"
                        ><fa :icon="['far', 'question-circle']" /></span>
                        <has-error :form="form" field="email" />
                        <div v-if="form.email" class="custom-control custom-checkbox mt-1">
                            <input v-model="form.hide_email"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="settings_hide_email"
                            />
                            <label class="custom-control-label" for="settings_hide_email">Hide email from others</label>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Phone Number</label>
                    <div class="disabled-input-container">
                        <phone-number-input v-model="phoneNumberObj" :required="false"/>
                        <span class="information fp-text-color-main mr-2"
                            v-tooltip="`Phone number verification is required.`"
                        ><fa :icon="['far', 'question-circle']" /></span>
                    </div>
                    <has-error :form="form" field="phone_number" />
                    <div v-if="phoneNumberObj.number" class="custom-control custom-checkbox mt-1">
                        <input v-model="form.hide_phone_number"
                                type="checkbox"
                                class="custom-control-input"
                                id="settings_hide_phone_number"
                        />
                        <label class="custom-control-label" for="settings_hide_phone_number">Hide phone from others</label>
                    </div>
                </div>
            </div>
            <div class="row mx-n2">
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Gender</label>
                    <div>
                        <gender-input v-model="form.gender"
                                :is-invalid="form.errors.has('gender')"
                        />
                        <transition>
                            <input v-show="form.gender === 'custom'" v-model="form.custom_gender" type="text" name="custom_gender" class="form-control mt-2" maxlength="128" placeholder="Enter custom gender" />
                        </transition>
                        <has-error :form="form" field="gender" />
                    </div>
                </div>
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Date Of Birth</label>
                    <div class="icon-prefix-input">
                        <fp-icon name="datepicker" />
                        <datepicker v-model="form.date_of_birth"
                            :disabled-dates="disabledDates"
                            :open-date="lastAvailableDate"
                            :input-class="{
                                'form-control': true,
                            }"
                            class="w-100"
                            placeholder="Date of birth"
                            :minimum-view="form.show_only_year ? 'year' : 'day'"
                            :maximum-view="form.show_only_year ? 'year' : 'month'"
                            :format="birthdayFormat"
                        ></datepicker>
                    </div>
                    <has-error :form="form" field="date_of_birth" />
                    <div class="d-flex mt-1">
                        <div class="custom-control custom-checkbox mt-1">
                            <input v-model="form.show_only_date_month"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="settings_show_only_date_month"
                                    @change="showOnlyDateMonth"
                            />
                            <label class="custom-control-label" for="settings_show_only_date_month">Show only Month &amp; Date</label>
                        </div>
                        <div class="custom-control custom-checkbox mt-1 ml-3">
                            <input v-model="form.show_only_year"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="settings_show_only_year"
                                    @change="showOnlyYear"
                            />
                            <label class="custom-control-label" for="settings_show_only_year">Show only Year</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <div class="custom-control custom-checkbox mt-1">
                    <input v-model="form.acknowledge"
                            type="checkbox"
                            class="custom-control-input"
                            id="settings_acknowledge"
                    />
                    <label class="custom-control-label fp-text-color-main" for="settings_acknowledge">
                        I acknowledge all the information provided by me here is accurate, true, and complete. Further, I hereby acknowledge that I have read and understood the 
                         <router-link :to="{ name: 'terms_of_use' }" class="fp-text-active" target="_blank">Terms of use</router-link>
                          and 
                        <router-link :to="{ name: 'privacy_policies' }" class="fp-text-active" target="_blank">Privacy policy</router-link>
                         of FlickerPage.com and its services.
                    </label>
                </div>
            </div>
            <div class="mt-3">
                <button type="submit" class="btn fp-btn-gradient px-4" :class="{'btn-loading': form.busy}">Save Changes</button>
            </div>
        </form>
        <fp-modal name="email_verify_modal"
            :show-header="false"
        >
            <p class="text-center" style="font-size: 16px;margin-top: 26px;">
                Please enter the 6 digit verification code sent to your email
                <br />
                {{ form.email }}
            </p>
            <input type="text" maxlength="6" class="form-control mx-auto w-50 mb-3" v-model="code" />
            <div class="text-center mt-2">
                <a href="javascript:;" class="btn btn-primary" @click="sendVerificationCode(true)">Resend</a>
                <a href="javascript:;" class="btn btn-danger ml-1" @click.prevent="$modal.hide('email_verify_modal')">Cancel</a>
                <a href="javascript:;" class="btn btn-success ml-1" @click="verify()">Verify</a>
            </div>
            <p v-if="resent_code" class="mb-0 mt-3 text-success text-center"><fa icon="check-circle" /> A new email verification code is resent successfully!</p>
        </fp-modal>
    </div>
</template>


<script>
import Form from 'vform'
import { mapGetters } from 'vuex'
import Datepicker from 'vuejs-datepicker';
import GenderInput from "~/components/elements/GenderInput.vue";
import PhoneNumberInput from "~/components/elements/PhoneNumberInput.vue"
import FpModal from "~/components/ui/Modal.vue"
export default {
    name: 'SettingsAccount',
    components: {
        Datepicker,
        GenderInput,
        PhoneNumberInput,
        FpModal,
    },
    data() {
        return {
            form: new Form({
                username: '',
                gender: '',
                custom_gender: '',
                email: '',
                hide_email: false,
                country_id: '',
                phone_number: '',
                hide_phone_number: false,
                date_of_birth: '',
                show_only_date_month: false,
                show_only_year: false,
                acknowledge: false,
            }),
            email_verified: false,
            resent_code: false,
            code: '',
            phoneNumberObj: {
                country_id: 231,
                code: '+1',
                number: '',
            }
        };
    },
    computed: {
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
        birthdayFormat() {
            if (this.form.show_only_year) return 'yyyy';
            if (this.form.show_only_date_month) return 'd MMM';
            return 'd MMM yyyy';
        },
        ...mapGetters({
            auth_user: 'auth/user',
            countries: 'ads/countries'
        })
    },
    async mounted() {
        this.form.username = this.auth_user.username;
        this.form.gender = this.auth_user.gender ?? 'male';
        this.form.custom_gender = this.auth_user.custom_gender;
        this.form.email = this.auth_user.email;
        this.form.hide_email = this.auth_user.hide_email;
        this.form.country_id = this.auth_user.country_id;
        this.form.phone_number = this.auth_user.phone_number;
        this.form.hide_phone_number = this.auth_user.hide_phone_number;
        this.form.date_of_birth = this.auth_user.date_of_birth;
        this.form.show_only_date_month = this.auth_user.show_only_date_month;
        this.form.acknowledge = this.auth_user.acknowledge;

        if (this.auth_user.phone_number) {
            const country = this.countries.find(i => i.id === this.auth_user.country_id);
            if (country) {
                const code = `+${country.phone_code}`
                this.phoneNumberObj = {
                    country_id: this.auth_user.country_id,
                    code: code,
                    number: this.auth_user.phone_number.replace(code, ''),
                }
            }
        }
    },
    methods: {
        async update () {
            if (this.auth_user.email != this.form.email && !this.email_verified) {
                let result  = await this.sendVerificationCode()
                if (result) this.$modal.show('email_verify_modal');
                return false;
            }
            this.form.country_id = this.phoneNumberObj.country_id;
            this.form.phone_number = `${this.phoneNumberObj.code}${this.phoneNumberObj.number}`
            const response = await this.form.post(`/settings/profile`)
            let user = response.data.data;
            this.$fpSuccess('Account information updated successfully!');
            this.$store.dispatch('auth/updateUser', { user });
        },
        async sendVerificationCode(is_resent = false) {
            try {
                await this.axios.post(`/profile/send_email_verification_code`, {email: this.form.email})
                if (is_resent) this.resent_code = true
                return true
            } catch (e) {
                this.$fpError('', e.response.data.message)
                return false
            }
        },
        async verify() {
            const response = await this.axios.post(`/profile/verify_email_verification_code`, {code: this.code})
            if (response.data.data.status === 'success') {
                this.$toast.sucess('Verified successfully')
                this.email_verified = true
                this.code = ' '
                this.$modal.hide('email_verify_modal')
            } else {
                this.$toast.error('Verification code does not match')
            }
        },
        showOnlyDateMonth(e) {
            if (e.target.checked && this.form.show_only_year) {
                this.form.show_only_year = false;
            }
        },
        showOnlyYear(e) {
            if (e.target.checked && this.form.show_only_date_month) {
                this.form.show_only_date_month = false;
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .acknowledge {
        font-weight: 400;
        font-size: 14px;
    }
</style>