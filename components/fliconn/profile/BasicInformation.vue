<template>
    <div class="profile-basic-information">
        <div v-if="isMyInfo" class="d-flex align-items-center mb-3">
            <p class="mb-0">Who can see my details?</p>
            <access-level-selector v-model="form.visible_detail"
                 :levels="[
                    { key: 'public', label: 'Public', icon: 'globe' },
                    { key: 'followers', label: 'Followers', icon: 'user-check' },
                    { key: 'mutual_followers', label: 'Mutual Followers', icon: 'users-check' },
                    { key: 'custom', label: `Restrict (${form.visible_users.length})`, icon: 'privacy_policy' },
                    { key: 'nobody', label: 'Nobody', icon: 'eye-slash' },
                 ]"
                 class="ml-2 ml-md-3"
                 @change="changeDetail"
            />
        </div>
        <div class="tabs-container fp-bg-color-2">
            <a href="javascript:;" class="btn btn-sm fp-text-color" :class="tab === 'Basic details' && 'active'" @click.prevent="tab = 'Basic details'">
                <fp-icon name="user" class="fp-fs-18" />
                Basic details
            </a>
            <a href="javascript:;" class="btn btn-sm fp-text-color" :class="tab === 'Work' && 'active'" @click.prevent="tab = 'Work'">
                <fp-icon name="briefcase" class="fp-fs-18" style="margin-top: -2px" />
                Work
            </a>
            <a href="javascript:;" class="btn btn-sm fp-text-color" :class="tab === 'Education' && 'active'" @click.prevent="tab = 'Education'">
                <fp-icon name="education-cap" class="fp-fs-18" style="margin-top: -2px" />
                Education
            </a>
        </div>
        <div class="form-wrapper">
            <form v-if="tab === 'Basic details'" @submit.prevent="saveBasicDetail()">
                <div class="fp-border-color-1 border p-3 round-10" :class="!isMyInfo && 'is-other-details'">
                    <div class="form-info-item mb-3">
                        <div :class="isMyInfo ? 'icon-prefix-input info-input-wrapper' : 'profile-value'">
                            <fp-icon name="email" class="fp-text-color" />
                            <input v-if="isMyInfo" type="email" class="form-control" v-model="form.email" maxlength="120" placeholder="Enter your email" required />
                            <div v-else class="mb-0 other-profile-value" :class="!form.email && 'fp-text-color-main'">
                                {{ form.email ? form.email : "Not provided" }}
                            </div>
                        </div>
                        <div v-if="isMyInfo" class="custom-control custom-checkbox mt-0 ml-2">
                            <input v-model="form.hide_email"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="hide_email"
                            />
                            <label class="custom-control-label" for="hide_email">Hide</label>
                        </div>
                    </div>
                    <div class="form-info-item mb-3">
                        <div :class="isMyInfo ? 'icon-prefix-input info-input-wrapper' : 'profile-value'">
                            <fp-icon name="mobile" class="fp-text-color" />
                            <input v-if="isMyInfo" type="text" class="form-control" v-model="form.phone_number" maxlength="15" placeholder="Enter your phone" />
                            <div v-else class="mb-0 other-profile-value" :class="!form.phone_number && 'fp-text-color-main'">
                                {{ form.phone_number ? form.phone_number : "Not provided" }}
                            </div>
                        </div>
                         <div v-if="isMyInfo" class="custom-control custom-checkbox mt-0 ml-2">
                            <input v-model="form.hide_phone_number"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="hide_phone_number"
                            />
                            <label class="custom-control-label" for="hide_phone_number">Hide</label>
                        </div>
                    </div>
                    <div class="form-info-item" :class="(!isMyInfo || form.gender !== 'custom') && 'mb-3'">
                        <div :class="isMyInfo ? 'icon-prefix-input info-input-wrapper' : 'profile-value'">
                            <fp-icon name="gender" class="fp-text-color" />
                            <select v-if="isMyInfo" v-model="form.gender" class="form-control has-bg mobile-has-no-bg">
                                <option value="" hidden>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="custom">Custom</option>
                            </select>
                                <!-- <input v-if="form.gender === 'custom'" type="text" class="form-control mt-2" maxlength="20" v-model="form.custom_gender" placeholder="Enter custom gender" /> -->
                            <div v-else>
                                <span v-if="form.gender" class="text-capitalize other-profile-value">{{ form.gender === "custom" && form.custom_gender ? form.custom_gender : form.gender }}</span>
                                <span v-else class="fp-text-color-main other-profile-value">Not provided</span>
                            </div>
                        </div>
                         <div v-if="isMyInfo" class="custom-control custom-checkbox mt-0 ml-2">
                            <input v-model="form.hide_gender"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="hide_gender"
                            />
                            <label class="custom-control-label" for="hide_gender">Hide</label>
                        </div>
                    </div>
                    <div v-if="isMyInfo && form.gender === 'custom'" class="form-info-item mt-2 mb-3">
                        <div class="icon-prefix-input info-input-wrapper">
                            <fp-icon name="gender" class="fp-text-color" />
                            <input type="text" class="form-control" maxlength="20" v-model="form.custom_gender" placeholder="Enter custom gender" />
                        </div>
                    </div>
                    <div class="form-info-item mb-3">
                        <div class="birthday" :class="isMyInfo ? 'icon-prefix-input info-input-wrapper' : 'profile-value'">
                            <fp-icon name="datepicker" class="fp-text-color" />
                            <datepicker v-if="isMyInfo"
                                    v-model="form.date_of_birth"
                                    :disabled-dates="disabledDates"
                                    input-class="form-control round-10"
                                    placeholder="Select Date of Birth"
                            ></datepicker>
                            <div v-else class="mb-0 other-profile-value" :class="!form.date_of_birth && 'fp-text-color-main'">
                                {{ form.date_of_birth ? dateOfBirth : "Not provided" }}
                            </div>
                        </div>
                         <div v-if="isMyInfo" class="custom-control custom-checkbox mt-0 ml-2">
                            <input v-model="form.show_only_date_month"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="show_only_date_month"
                            />
                            <label class="custom-control-label" for="show_only_date_month">Hide</label>
                        </div>
                    </div>
                    <div class="form-info-item mb-3">
                        <div :class="isMyInfo ? 'icon-prefix-input info-input-wrapper' : 'profile-value'">
                            <fp-icon name="hometown" class="fp-text-color" />
                            <gmap-autocomplete v-if="isMyInfo"
                                ref="homeLocationInput"
                                class="form-control location-input"
                                :value="form.hometown_place"
                                @place_changed="updateHometownPlace"
                                placeholder="Home Town or City"
                                @keypress.enter="$event.preventDefault()"
                            ></gmap-autocomplete>
                            <div v-else class="mb-0 other-profile-value" :class="!form.hometown_place && 'fp-text-color-main'">
                                <span v-if="form.hometown_place">From </span> {{ form.hometown_place ? form.hometown_place : "Not provided" }}
                            </div>
                        </div>
                        <span v-if="isMyInfo" class="ml-2" v-tooltip="homeTownTitle">
                            <fp-icon name="information" class="fp-fs-18 fp-text-color-main" />
                        </span>
                    </div>
                    <div class="form-info-item">
                        <div :class="isMyInfo ? 'icon-prefix-input info-input-wrapper' : 'profile-value'">
                            <fp-icon name="living-home" class="fp-text-color" />
                            <gmap-autocomplete v-if="isMyInfo"
                                ref="currentLocationInput"
                                class="form-control location-input"
                                :value="form.currently_living_in"
                                @place_changed="updateCurrentlyLivingIn"
                                placeholder="Current place"
                                @keypress.enter="$event.preventDefault()"
                            ></gmap-autocomplete>
                            <div v-else class="mb-0 other-profile-value" :class="!form.currently_living_in && 'fp-text-color-main'">
                                <span v-if="form.currently_living_in">Living in </span> {{ form.currently_living_in ? form.currently_living_in : "Not provided" }}
                            </div>
                        </div>
                        <span v-if="isMyInfo" class="ml-2" v-tooltip="livingInTitle">
                            <fp-icon name="information" class="fp-fs-18 fp-text-color-main" />
                        </span>
                    </div>
                </div>
                <div v-if="isMyInfo" class="mt-3">
                    <button type="submit"
                            class="btn fp-btn-gradient px-3"
                            :class="{ 'btn-loading': form.busy }"
                            :disabled="form.busy"
                    >Save Changes</button>
                </div>
            </form>
            <div v-if="tab === 'Work'">
                <div v-if="isMyInfo" class="d-md-flex mb-3 text-left">
                    <div class="custom-control custom-checkbox mt-0">
                        <input v-model="work_details_form.i_am_a_student"
                                type="checkbox"
                                class="custom-control-input"
                                id="i_am_a_student"
                        />
                        <label class="custom-control-label" for="i_am_a_student">I am a Student</label>
                    </div>
                    <div class="custom-control custom-checkbox mt-0 ml-md-4">
                        <input v-model="work_details_form.currently_not_working"
                                type="checkbox"
                                class="custom-control-input"
                                id="currently_not_working"
                                @change="updateCurrentlyNotWorking"
                        />
                        <label class="custom-control-label" for="currently_not_working">Currently not working</label>
                    </div>
                </div>
                <div v-if="isMyInfo" class="fp-border-color-1 border p-3 round-10">
                    <form @submit.prevent="addWorkDetail()">
                        <div v-if="!work_details_form.currently_not_working" class="custom-control custom-checkbox mb-3">
                            <input v-model="work_detail_item.is_current_job"
                                    type="checkbox"
                                    class="custom-control-input"
                                    id="is_current_job"
                            />
                            <label class="custom-control-label" for="is_current_job">This is current job</label>
                        </div>
                        <div class="form-group">
                            <label>Comapny Name</label>
                            <div class="icon-prefix-input info-input-wrapper">
                                <fp-icon name="living-home" />
                                <input type="text" class="form-control w-100" v-model="work_detail_item.company_name" required placeholder="Enter company name" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Position</label>
                            <div class="icon-prefix-input info-input-wrapper">
                                <fp-icon name="job-monitor" />
                                <input type="text" class="form-control w-100" v-model="work_detail_item.role" required placeholder="Enter role or job title" />
                            </div>
                        </div>
                        <div class="row mx-n1">
                            <div class="col-6 px-1 mb-3">
                                <label>Start Date</label>
                                <div class="icon-prefix-input">
                                    <fp-icon name="datepicker" />
                                    <datepicker v-model="work_detail_item.start_date"
                                            :disabled-dates="disabledDates"
                                            input-class="form-control round-10 w-100"
                                            placeholder="Start Date"
                                            minimum-view="month"
                                            maximum-view="month"
                                            format="MMM yyyy"
                                    ></datepicker>
                                </div>
                            </div>
                            <div class="col-6 px-1 mb-3">
                                <label>End Date</label>
                                <div class="icon-prefix-input">
                                    <fp-icon name="datepicker" />
                                    <datepicker v-model="work_detail_item.end_date"
                                            :disabled-dates="disabledDates"
                                            input-class="form-control round-10"
                                            placeholder="End Date"
                                            minimum-view="month"
                                            maximum-view="month"
                                            format="MMM yyyy"
                                            :disabled="work_detail_item.is_current_job"
                                    ></datepicker>
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <button type="submit"
                                    class="btn fp-btn-gradient px-3"
                                    :class="{ 'btn-loading': work_details_form.busy }"
                                    :disabled="work_details_form.busy"
                            >
                                <fp-icon name="plus-square" />
                                Add Work
                            </button>
                        </div>
                    </form>
                </div>
                <div class="work-details">
                    <div v-for="(item, index) in work_details_form.work_details" :key="index" class="work-detail-item">
                        <strong class="mb-2">
                            {{ item.start_date }} - {{ item.end_date }}&nbsp;
                            <fa v-if="isMyInfo" icon="times-circle" class="text-danger cursor-pointer" @click="removeWorkDetail(item, index)" />
                        </strong>
                        <div class="work-detail-content fp-border-color-1" :class="{'current': item.end_date === 'Current'}">
                            <fa icon="briefcase" class="fp-text-color-3" />
                            <div class="flex-grow-1 ml-2">
                                <h6 class="role">{{ item.role }}</h6>
                                <p class="mb-0">at <span class="fp-text-color-3">{{ item.company_name }}</span></p>
                            </div>
                        </div>
                    </div>
                    <p v-if="!isMyInfo && work_details_form.work_details.length === 0" class="text-center fp-text-color-main">No work details found!</p>
                </div>
            </div>
            <form v-if="tab === 'Education'" @submit.prevent="saveEducationDetails()">
                <div v-if="isMyInfo" class="d-md-flex mb-2">
                    <div class="custom-control custom-checkbox mb-3">
                        <input v-model="education_details_form.currently_not_attending_school"
                                type="checkbox"
                                class="custom-control-input"
                                id="currently_not_attending_school"
                        />
                        <label class="custom-control-label" for="currently_not_attending_school">Currently not attending</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-3 ml-md-4">
                        <input v-model="education_details_form.never_been_to_school"
                                type="checkbox"
                                class="custom-control-input"
                                id="never_been_to_school"
                                @change="updateCurrentlyNotWorking"
                        />
                        <label class="custom-control-label" for="never_been_to_school">Never been to school in the past</label>
                    </div>
                </div>
                <div v-if="isMyInfo" class="fp-border-color-1 border p-3 round-10">
                    <div v-if="!education_details_form.never_been_to_school" class="mb-3">
                        <div class="form-group">
                            <label>College Name</label>
                            <div class="icon-prefix-input info-input-wrapper">
                                <fp-icon name="education-cap" />
                                <input type="text" class="form-control" v-model="education_details_form.past_school_college" maxlength="50" placeholder="Past school/college/university" />
                            </div>
                        </div>
                        <div class="form-check-inline">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox"
                                        class="custom-control-input"
                                        id="past_school_graduated"
                                        @click="education_details_form.past_school_graduated = true"
                                        :checked="education_details_form.past_school_graduated === true"
                                />
                                <label class="custom-control-label" :class="!education_details_form.past_school_graduated && 'fp-text-color-main'" for="past_school_graduated">Graduated in</label>
                            </div>&nbsp;
                            <datepicker v-if="education_details_form.past_school_graduated"
                                    v-model="education_details_form.graduated_at"
                                    :disabled-dates="disabledDates"
                                    class="label-datepicker"
                                    input-class="label-datepicker-input text-success"
                                    minimum-view="month"
                                    maximum-view="month"
                                    format="MMM yyyy"
                            ></datepicker>
                        </div>
                        <div class="form-check-inline">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox"
                                        class="custom-control-input"
                                        id="past_school_not_graduated"
                                        @click="education_details_form.past_school_graduated = false"
                                        :checked="education_details_form.past_school_graduated === false"
                                />
                                <label class="custom-control-label" :class="education_details_form.past_school_graduated && 'fp-text-color-main'" for="past_school_not_graduated">Not graduated</label>
                            </div>
                        </div>
                    </div>
                    <div v-if="!education_details_form.currently_not_attending_school">
                        <div class="form-group">
                            <label>Current School</label>
                            <div class="icon-prefix-input info-input-wrapper">
                                <fp-icon name="school" />
                                <input type="text" class="form-control" v-model="education_details_form.current_school_college" maxlength="50" placeholder="Current school/college/university" />
                            </div>
                        </div>
                        <div class="form-check-inline">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox"
                                        class="custom-control-input"
                                        id="current_school_graduating"
                                        v-model="education_details_form.current_school_graduating"
                                />
                                <label class="custom-control-label" :class="!education_details_form.current_school_graduating && 'fp-text-color-main'" for="current_school_graduating">Graduating in</label>
                            </div>
                            &nbsp;
                            <datepicker v-if="education_details_form.current_school_graduating"
                                    v-model="education_details_form.graduating_in"
                                    :disabled-dates="{to: new Date()}"
                                    class="label-datepicker"
                                    input-class="label-datepicker-input text-success"
                                    minimum-view="month"
                                    maximum-view="month"
                                    format="MMM yyyy"
                            ></datepicker>
                        </div>
                    </div>
                </div>
                <div v-if="
                    education_details_form.past_school_college || education_details_form.current_school_college
                " class="mt-3">
                    <div v-if="education_details_form.past_school_college" class="education-detail-item mb-2">
                        <fp-icon name="education-cap" class="fp-fs-20 fp-text-color-main" />

                        Graduated from <span class="fp-text-active">{{ education_details_form.past_school_college }}</span>
                        <span v-if="education_details_form.past_school_graduated">at {{ $moment(education_details_form.graduated_at).format('MMMM YYYY') }}</span>
                        <fa v-if="isMyInfo" icon="times-circle" class="text-danger cursor-pointer ml-2" @click="education_details_form.past_school_college = ''" />
                    </div>
                    <div v-if="education_details_form.current_school_college" class="education-detail-item">
                         <fp-icon name="school" class="fp-fs-20 fp-text-color-main" />
                        Currently attending <span class="fp-text-active">{{ education_details_form.current_school_college }}</span>
                        <span v-if="education_details_form.current_school_graduating">(Graduating in {{ $moment(education_details_form.graduating_in).format('MMMM YYYY') }})</span>
                        <fa v-if="isMyInfo" icon="times-circle" class="text-danger cursor-pointer ml-2" @click="education_details_form.current_school_college = ''" />
                    </div>
                </div>
                <p v-else-if="!isMyInfo" class="text-center fp-text-color-main">No education details found!</p>
                <div v-if="isMyInfo" class="mt-3">
                    <button type="submit"
                            class="btn fp-btn-gradient px-3"
                            :class="{ 'btn-loading': education_details_form.busy }"
                            :disabled="education_details_form.busy"
                    >Save Changes</button>
                </div>
            </form>
        </div>
        <user-select-modal ref="userSelectModal"
            :users="users"
            v-model="form.visible_users"
            title="Who can see my detail?">
        </user-select-modal>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import Form from "vform";
    import Datepicker from "vuejs-datepicker";
    import UserSelectModal from "~/components/ui/UserSelectModal.vue";
    import AccessLevelSelector from '~/components/ui/AccessLevelSelector.vue';
    export default {
        name: 'BasicInformation',
        props: {
            user: { type: Object, required: true },
        },
        components: {
            UserSelectModal,
            Datepicker,
            AccessLevelSelector
        },
        data() {
            return {
                form: new Form({
                    user_id: this.user_id,
                    email: "",
                    phone_number: "",
                    date_of_birth: "",
                    gender: "",
                    custom_gender: "",
                    hide_email: false,
                    hide_phone_number: false,
                    hide_gender: false,
                    show_only_date_month: false,
                    hometown_place: "",
                    currently_living_in: "",
                    visible_detail: 'mutual_followers',
                    visible_users: [],
                }),
                tab: 'Basic details',
                disabledDates: {
                    from: new Date(),
                },
                fliconn_profile: null,
                users: [],
                work_detail_item: {
                    company_name: '',
                    role: '',
                    start_date: '',
                    end_date: '',
                    is_current_job: false,
                },
                work_details_form: new Form({
                    user_id: this.user.id,
                    i_am_a_student: false,
                    currently_not_working: false,
                    work_details: [],
                }),
                education_details_form: new Form({
                    user_id: this.user.id,
                    past_school_college: "",
                    current_school_college: "",
                    currently_not_attending_school: false,
                    never_been_to_school: false,
                    past_school_graduated: false,
                    current_school_graduating: false,
                    graduated_at: new Date(),
                    graduating_in: new Date(),
                }),
                userData: null,
                homeTownTitle: 'Your home town is the place where you are born or come from. You may adjust this anytime for accuracy.',
                livingInTitle: 'This is the location where you are currently living in. You may change this every time you change yoru living place to get more location information.'
            }
        },
        computed: {
            isMyInfo() {
                return this.auth_user && this.user.id === this.auth_user.id;
            },
            dateOfBirth() {
                if (!this.form.date_of_birth) return "";
                if (this.form.show_only_date_month) {
                    return this.$moment(this.form.date_of_birth).format("MMM Do");
                } else if (this.form.show_only_year) {
                    return this.$moment(this.form.date_of_birth).format("YYYY");
                }
                return this.$moment(this.form.date_of_birth).format("MMM Do, YYYY");
            },
            ...mapGetters({
                auth_user: "auth/user",
                profile_visible_users: "fliconn/profile_visible_users",
            }),
            fliconn_location_details() {
                if (!this.fliconn_profile) return [];
                let arr = [];
                if (this.fliconn_profile.hometown_place) arr.push(`From ${this.fliconn_profile.hometown_place}`);
                if (this.fliconn_profile.currently_living_in) arr.push(`Currently Living in ${this.fliconn_profile.currently_living_in}`);
                return arr;
            },
            fliconn_education_details() {
                if (!this.fliconn_profile) return [];
                let arr = [];
                if (this.fliconn_profile.past_school_college) arr.push(`Went to ${this.fliconn_profile.past_school_college}`);
                if (this.fliconn_profile.currently_not_attending_school) {
                    arr.push("Currently not attending school");
                } else if (this.fliconn_profile.current_school_college) {
                    arr.push(`Currently going to ${this.fliconn_profile.current_school_college}`);
                }
                return arr;
            },
            fliconn_work_details() {
                if (!this.fliconn_profile) return [];
                let arr = [];
                if (this.fliconn_profile.work_details && this.fliconn_profile.work_details.length) {
                    return this.fliconn_profile.work_details;
                } else {
                    if (this.fliconn_profile.i_am_a_student) arr.push("I am a student");
                    if (this.fliconn_profile.currently_not_working) arr.push("Currently not working");
                    return arr;
                }
            },
        },
        mounted() {
            this.init();
            this.getUsers();
            this.getDetail();
        },
        methods: {
            async init() {
                this.form.user_id = this.user.id;
                this.form.email = this.user.email;
                this.form.phone_number = this.user.phone_number;
                this.form.date_of_birth = this.user.date_of_birth;
                this.form.gender = this.user.gender;
                this.form.custom_gender = this.user.custom_gender;
                this.form.hide_email = this.user.hide_email;
                this.form.show_only_date_month = this.user.show_only_date_month;
                this.form.hide_phone_number = this.user.hide_phone_number;
                this.form.visible_detail = this.user.profile ? this.user.profile.visible_detail : "mutual_followers";
                if (this.auth_user && this.user.profile.visible_profile != "public") {
                    const response = await this.axios.post("/user/get_detail_visible_users", {
                        user_id: this.user.id,
                    });
                    this.form.visible_users = response.data.data.filter((i) => this.profile_visible_users.includes(i.id)).map((i) => i.id);
                }
            },
            async getUsers() {
                const response = await this.axios.post("/user/get_all_users", {
                    profile_visible_users: this.profile_visible_users,
                });
                this.users = response.data.data;
            },
            async getDetail() {
                const response = await this.axios.post(`/user/get_detail`, {
                    id: this.user.id,
                });
                this.userData = response.data.data;
                if (!this.userData.location && this.auth_user.id == this.userData.id) {
                    this.getCurrentLocation();
                }
                const profile_res = await this.axios.post(`${process.env.timelineApiUrl}/profile/get`, { user_id: this.userData.id });
                this.fliconn_profile = profile_res.data.data;

                this.form.hometown_place = this.fliconn_profile.hometown_place;
                this.form.currently_living_in = this.fliconn_profile.currently_living_in;

                this.work_details_form.i_am_a_student = this.fliconn_profile.i_am_a_student;
                this.work_details_form.currently_not_working = this.fliconn_profile.currently_not_working;

                if (this.fliconn_profile.work_details) {
                    this.work_details_form.work_details = this.fliconn_profile.work_details;
                }
                this.education_details_form.past_school_college = this.fliconn_profile.past_school_college;
                this.education_details_form.current_school_college = this.fliconn_profile.current_school_college;
                this.education_details_form.currently_not_attending_school = this.fliconn_profile.currently_not_attending_school;
                this.education_details_form.never_been_to_school = this.fliconn_profile.never_been_to_school;
                this.education_details_form.past_school_graduated = this.fliconn_profile.past_school_graduated;
                this.education_details_form.current_school_graduating = this.fliconn_profile.current_school_graduating;
                this.education_details_form.graduated_at = this.fliconn_profile.graduated_at ? new Date(this.fliconn_profile.graduated_at) : new Date();
                this.education_details_form.graduating_in = this.fliconn_profile.graduating_in ? new Date(this.fliconn_profile.graduating_in) : new Date();
            },
            changeDetail(value) {
                if (value === "custom") {
                    this.$refs.userSelectModal.open();
                } else {
                    this.saveBasicDetail();
                }
            },
            getCurrentLocation() {
                if (this.auth_user.id != this.user.id) return false;
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.getPosition);
                } else {
                    alert("Geolocation is not supported by this browser. \n Please enable it.");
                }
            },
            getPosition(position) {
                var currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                let payload = {
                    type: "latlng",
                    params: `${currentLocation.latitude},${currentLocation.longitude}`,
                };
                this.axios.post(`/get_google_map_address`, payload).then((response) => {
                    if (response.data.status == "Success") {
                        let location = response.data.data;
                        currentLocation.country = location.country;
                        currentLocation.city = location.city;
                        currentLocation.state = location.state;
                        currentLocation.county = location.county;
                        currentLocation.zipcode = location.zipcode;
                        currentLocation.address = location.address;
                        currentLocation.full_address = location.full_address;
                        this.axios.post(`/settings/update_location`, currentLocation).then((response) => {
                            this.userData.location = response.data.data;
                        });
                        this.showAddress = true;
                    }
                });
            },
            updateCurrentlyLivingIn(place) {
                let currently_living_in_city = "";
                let currently_living_in_state = "";
                let currently_living_in_coutry = "";
                for (var i = 0; i < place.address_components.length; i++) {
                    for (var j = 0; j < place.address_components[i].types.length; j++) {
                        if (place.address_components[i].types[j] === "locality") {
                            currently_living_in_city = place.address_components[i].long_name;
                        }
                        if (place.address_components[i].types[j] === "administrative_area_level_1") {
                            currently_living_in_state = place.address_components[i].long_name;
                        }
                        if (place.address_components[i].types[j] === "country") {
                            currently_living_in_coutry = place.address_components[i].long_name;
                        }
                    }
                }
                if (currently_living_in_city) {
                    this.form.currently_living_in = currently_living_in_city;
                } else if (currently_living_in_state) {
                    this.form.currently_living_in = currently_living_in_state;
                } else if (currently_living_in_coutry) {
                    this.form.currently_living_in = currently_living_in_coutry;
                }
            },
            updateHometownPlace(place) {
                let hometown_place_city = "";
                let hometown_place_state = "";
                let hometown_place_country = "";
                for (var i = 0; i < place.address_components.length; i++) {
                    for (var j = 0; j < place.address_components[i].types.length; j++) {
                        if (place.address_components[i].types[j] === "locality") {
                            hometown_place_city = place.address_components[i].long_name;
                        }
                        if (place.address_components[i].types[j] === "administrative_area_level_1") {
                            hometown_place_state = place.address_components[i].long_name;
                        }
                        if (place.address_components[i].types[j] === "country") {
                            hometown_place_country = place.address_components[i].long_name;
                        }
                    }
                }
                if (hometown_place_city) {
                    this.form.hometown_place = hometown_place_city;
                } else if (hometown_place_state) {
                    this.form.hometown_place = hometown_place_state;
                } else if (hometown_place_country) {
                    this.form.hometown_place = hometown_place_country;
                }
            },
            updateCurrentlyNotWorking(event) {
                if (event.target.checked) {
                    this.work_details_form.is_current_job = false;
                }
            },
            async addWorkDetail() {
                if (this.work_detail_item.is_current_job) {
                    this.work_details_form.work_details.unshift({
                        company_name: this.work_detail_item.company_name,
                        role: this.work_detail_item.role,
                        start_date: this.$moment(this.work_detail_item.start_date).format('MMMM YYYY') ,
                        end_date: 'Current',
                    });
                } else {
                    this.work_details_form.work_details.push({
                        company_name: this.work_detail_item.company_name,
                        role: this.work_detail_item.role,
                        start_date: this.$moment(this.work_detail_item.start_date).format('MMMM YYYY'),
                        end_date: this.$moment(this.work_detail_item.end_date).format('MMMM YYYY'),
                    });
                }
                await this.saveWorkDetails();
                this.work_detail_item = {
                    company_name: '',
                    role: '',
                    start_date: '',
                    end_date: '',
                    is_current_job: false,
                }
            },
            async saveWorkDetails() {
                await this.work_details_form.post(`${process.env.timelineApiUrl}/profile/save_work_details`);
            },
            async removeWorkDetail(item, index) {
                this.work_details_form.work_details.splice(index, 1);
                await this.saveWorkDetails();
            },
            async saveBasicDetail() {
                if (this.form.visible_detail === "custom" && this.form.visible_users.length === 0) {
                    this.$toast.error("You must select at least 1 user.");
                    this.$refs.userSelectModal.open();
                    return false;
                }
                const response = await this.form.post(`/user/save_basic_information`);
                await this.saveLocationDetails();
                await this.$store.dispatch("auth/fetchUser");
                this.$emit("updated");
            },
            async saveEducationDetails() {
                const response = await this.education_details_form.post(`${process.env.timelineApiUrl}/profile/save_education_details`);
                this.fliconn_profile = response.data.data;
                this.$emit('updated');
            },
            async saveLocationDetails() {
                let params = {
                    user_id: this.user.id,
                    currently_living_in: this.form.currently_living_in,
                    hometown_place: this.form.hometown_place,
                };
                const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/save_location_details`, params);
                this.fliconn_profile = response.data.data;
            },
        }
    }
</script>
<style lang="scss" scoped>
    .profile-basic-information {
        .tabs-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px;
            border-radius: 8px;
            margin-bottom: 16px;
            a {
                &.active {
                    color: #FFF;
                    background: #FF22A1;
                    .fp-svg-stroke {
                        stroke: #FFF;
                    }
                }
                &:focus {
                    box-shadow: none;
                }
            }
            @media (max-width: 600px) {
                background: none !important;
                padding-left: 0;
                padding-right: 0;
                border-radius: 0;
                border-bottom: solid 3px #334557;
                a {
                    border-radius: 0;
                    background: none;
                    border: none;
                    border-bottom-style: solid;
                    border-bottom-width: 3px;
                    border-bottom-color: transparent;
                    padding-left: 12px;
                    padding-right: 12px;
                    padding-bottom: 7px;
                    margin-bottom: -9px;
                    transition: border 0s;
                    &.active {
                        color: #FF22A1;
                        background: none;
                        border-bottom-color: #FF22A1;
                        padding-top: 5px;
                        .fp-svg-stroke {
                            stroke: #FF22A1;
                        }
                    }
                }
            }
        }
        .form-info-item {
            display: flex;
            align-items: center;
            img {
                opacity: 0.6;
            }
            .info-input-wrapper {
                display: flex;
                align-items: center;
                width: calc(100% - 95px);
                &.birthday::v-deep {
                    .vdp-datepicker {
                        width: 100%;
                    }
                }
            }
            .location-label {
                width: 75px;
                margin-bottom: 0;
            }
            .location-input {
                border-radius: 10px;
                max-width: unset;
            }
            .profile-value {
                display: flex;
                align-items: center;
                width: 100%;
                svg {
                    font-size: 20px;
                }
            }
        }

        @media (max-width: 600px) {
            .form-wrapper {
                .card {
                    border: none;
                    padding: 0;
                }
            }
        }
        .work-detail-item {
            margin-top: 15px;
            .work-detail-content {
                display: flex;
                border-style: solid;
                border-width: 1px;
                border-radius: 10px;
                padding: 10px 14px 8px;
                margin-top: 2px;
                svg {
                    margin-top: 2px;
                }
                &.current {
                    border-color: green;
                }
                .role {
                    font-size: 16px;
                    text-transform: capitalize;
                    margin-bottom: 4px;
                }
            }
        }
    }
    .is-other-details {
        flex-wrap: wrap;
        flex-direction: row;
        align-items: flex-start;
        .form-info-item {
            &:nth-child(odd) {
                width: 55%;
            }
            &:nth-child(even) {
                width: 45%;
            }
        }
    }
    .other-profile-value {
        margin-left: 4px;
        max-width: calc(100% - 25px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>