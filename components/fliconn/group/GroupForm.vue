<template>
    <div class="form-post">
        <div class="step-title d-none d-md-block text-center mb-md-3">
            <h4 v-if="step === 1" class="text-capitalize">{{type}} Information</h4>
            <h4 v-else-if="step === 2">Access</h4>
            <h4 v-else-if="step === 3 && mode === 'add'">Invite People</h4>
            <h4 v-else>Complete</h4>
        </div>
        <div class="step-header d-none d-md-block" :data-step="`step_${step}`">
            <ul class="step-pills">
                <li class="step-item" :class="step === 1 && 'active'">
                    <a href="#" class="step-link">
                        <span class="tabStatus">1 </span>
                        <span class="tabLabel text-capitalize">{{type}} Details</span>
                    </a>
                </li>
                <li v-show="form.type === 'group'" class="step-item" :class="step === 2 && 'active'">
                    <a href="#" class="step-link"><span class="tabStatus">2 </span><span class="tabLabel">Access</span></a>
                </li>
                <li class="step-item" :class="step === 3 && 'active'">
                    <a href="#" class="step-link"><span class="tabStatus">3 </span><span class="tabLabel">Invite People</span></a>
                </li>
                <li class="step-item" :class="step === 4 && 'active'">
                    <a href="#" class="step-link"><span class="tabStatus">4 </span><span class="tabLabel">Complete</span></a>
                </li>
            </ul>
        </div>
        <div class="step-title d-md-none mb-3">
            <h6 v-if="step === 1" class="text-capitalize">{{type}} Detail</h6>
            <h6 v-else-if="step === 2">Access</h6>
            <h6 v-else-if="step === 3 && mode === 'add'">Invite People</h6>
        </div>
        <form v-if="step === 1" class="step-1" @submit.prevent="step = form.type === 'page' ? 3 : 2">
            <div class="fp-card fp-sm-no-card">
                <div class="row mx-n2 mb-3 mb-lg-0">
                    <div class="col-lg-6 px-2">
                        <div class="form-group">
                            <label class="mb-2 text-capitalize">{{form.type}} title</label>
                            <input type="text"
                                v-model="form.title"
                                class="form-control"
                                maxlength="60"
                                required
                                :placeholder="`Enter ${form.type} title`"
                            />
                        </div>
                        <div class="form-group">
                            <label class="mb-2">About {{ form.type }}</label>
                            <textarea rows="6"
                                v-model="form.description"
                                class="form-control"
                                required
                                :placeholder="`About this ${form.type}...`"
                            ></textarea>
                            <div class="d-flex font-weight-400">
                                <span class="fp-text-color-main">Entered: {{form.description.length}} chars</span>
                                <span class="fp-text-color-main ml-auto">Between 20-150 chars</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 px-2">
                        <label class="mb-2 d-none d-lg-block">&nbsp;</label>
                        <label class="fp-card-outline p-0 dashed wallpaper-wrapper text-center">
                            <span v-if="!form.image && !imageData">
                                <fp-icon name="upload" class="fp-fs-26 fp-text-active" />
                                <br />
                                Upload {{form.type}} wallpaper
                            </span>
                            <img v-if="imageData" :src="imageData" alt="" />
                            <a v-if="imageData" href="javascript:;" class="btn-remove-image" @click.stop="removeImage()">
                                <fp-icon name="trash" />
                            </a>
                            <input type="file" hidden accept="image/*" @change="handleFile" />
                        </label>
                    </div>
                </div>
                <div class="row mx-n2">
                    <div class="col-lg-6 px-2">
                        <h6>Contact Information</h6>
                        <div class="fp-card-outline card-contact mb-3 round-10">
                            <div class="icon-prefix-input mb-3">
                                <span class="required">*</span>
                                <fp-icon name="email" />
                                <input type="email" class="form-control" v-model="form.email" required placeholder="Enter email address" />
                            </div>
                            <div class="icon-prefix-input mb-3">
                                <fp-icon name="phone" />
                                <input type="tel" class="form-control" v-model="form.phone_number" placeholder="Enter phone number" />
                            </div>
                            <div class="icon-prefix-input">
                                <fp-icon name="location" />
                                <gmap-autocomplete
                                    :value="full_address"
                                    class="form-control"
                                    @place_changed="updateAddress"
                                    style="max-width: unset;"
                                    @keypress.enter="$event.preventDefault()"
                                    :placeholder="`Enter ${form.type} location`"
                                ></gmap-autocomplete>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 px-2">
                        <h6>Social Links</h6>
                        <div class="fp-card-outline card-contact mb-2 round-10">
                            <div class="icon-prefix-input mb-3">
                                <fp-icon name="facebook" />
                                <input type="text" class="form-control" v-model="form.facebook" placeholder="Link to facebook page" />
                            </div>
                            <div class="icon-prefix-input mb-3">
                                <fp-icon name="twitter" />
                                <input type="text" class="form-control" v-model="form.twitter" placeholder="Link to twitter page" />
                            </div>
                            <div class="icon-prefix-input mb-3">
                                <fp-icon name="linkedin" />
                                <input type="text" class="form-control" v-model="form.linkedin" placeholder="Link to Linkedin Page" />
                            </div>
                            <div class="icon-prefix-input">
                                <fp-icon name="globe" />
                                <input type="text" class="form-control" v-model="form.weblink" placeholder="Any other link" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-3">
                <a href="javascript:;" class="btn fp-btn-outline px-4 mr-2" @click.prevent="$router.back()">Cancel</a>
                <button v-if="form.type === 'group'" type="submit" class="btn fp-btn-gradient px-4">Group Access</button>
                <button v-else-if="form.type === 'page' && mode === 'add'" type="submit" class="btn fp-btn-gradient px-4">Invite People</button>
                <button v-else-if="form.type === 'page' && mode === 'edit'" type="button"
                    class="btn fp-btn-gradient px-4 ml-2"
                    @click="submit()"
                    :class="form.busy && 'btn-loading'"
                    :disabled="form.busy"
                >Update Page</button>
            </div>
        </form>
        <div v-if="step === 2">
            <div class="fp-card d-md-flex">
                <div class="row">
                    <div class="col-md-6 group-access-type">
                        <p class="access-title">Who can join this Group?</p>
                        <div class="access-join">
                            <div class="d-flex justify-content-center mb-3">
                                <a href="javascript:;"
                                    class="btn-is-private"
                                    :class="!form.is_private && 'active'"
                                    @click="form.is_private = false"
                                >
                                    <span class="btn-icon">
                                        <fa icon="users" />
                                    </span>
                                    Public
                                </a>
                                <a href="javascript:;"
                                    class="btn-is-private ml-4"
                                    :class="form.is_private && 'active'"
                                    @click="form.is_private = true"
                                >
                                    <span class="btn-icon">
                                        <fa icon="lock" />
                                    </span>
                                    Private
                                </a>
                            </div>
                            <div class="text-center round-10 p-2 access-description fp-text-color-main">
                                <p class="mb-0" v-if="form.is_private">Only admin approved members can join this group.</p>
                                <p class="mb-0" v-else>Anyone can join this group without an admin approval request.</p>
                            </div>
                        </div>
                        <hr class="d-md-none" />
                    </div>
                    <div class="col-md-6 group-access-type fp-border-color-1">
                        <p class="access-title">Who can post in this Group?</p>
                        <div class="access-post">
                            <div class="d-flex justify-content-center mb-3">
                                <a href="javascript:;"
                                    class="btn-is-private postable"
                                    :class="form.is_postable && 'active'"
                                    @click="form.is_postable = true"
                                >
                                    <span class="btn-icon">
                                        <fa icon="users" />
                                    </span>
                                    All Group Members
                                </a>
                                <a href="javascript:;"
                                    class="btn-is-private postable ml-4"
                                    :class="!form.is_postable && 'active'"
                                    @click="form.is_postable = false"
                                >
                                    <span class="btn-icon">
                                        <fa icon="user" />
                                    </span>
                                    Admin
                                </a>
                            </div>
                            <div class="text-center round-10 p-2 access-description fp-text-color-main">
                                <p class="mb-0" v-if="form.is_postable">Only the group admin can post and manage content in this group. All members of can view and reply.</p>
                                <p class="mb-0" v-else>All members of the group can post in the group. Group admin can manage all content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-3">
                <a href="javascript:;" class="btn fp-btn-outline px-4 mr-2" @click="step = 1">Cancel</a>
                <a v-if="mode === 'add'" href="javascript:;" class="btn fp-btn-gradient px-4" @click="step = 3">Invite People</a>
                <button v-else type="button"
                    class="btn fp-btn-gradient px-4 ml-2"
                    @click="submit()"
                    :class="form.busy && 'btn-loading'"
                    :disabled="form.busy"
                >Update {{form.type}}</button>
            </div>
        </div>
        <div v-if="step === 3 && mode === 'add'">
            <div class="fp-card">
                <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-3 mb-md-0">
                        <div class="invite-type fp-card-outline fp-text-color-main"
                             :class="form.invite === 'followers' && 'selected'"
                             @click="form.invite = 'followers'"
                        >
                            <fa icon="users" />
                            <p class="invite-type-title mb-1">Invite Your Followers</p>
                            <p class="invite-type-description">An invitation request will be sent to all of your followers.</p>
                        </div>
                    </div>
                    <div class="col-md-6 px-2">
                        <div class="invite-type fp-card-outline fp-text-color-main"
                             :class="form.invite === 'specific' && 'selected'"
                             @click="form.invite = 'specific'"
                        >
                            <fa icon="lock" />
                            <p class="invite-type-title mb-1">Invite Specific People</p>
                            <p class="invite-type-description">An invitation request will be sent to only specified people.</p>
                        </div>
                    </div>
                </div>

                <div v-if="form.invite === 'specific'" class="mt-3">
                    <search-users v-model="form.invited_users" url="/user/search" placeholder="Invite people..." />
                </div>
            </div>
            <div class="text-center mt-3">
                <a href="javascript:;" class="btn fp-btn-outline px-4" @click="step = form.type === 'page' ? 1 : 2">Cancel</a>
                <button type="button"
                    class="btn fp-btn-gradient px-4 ml-2 text-capitalize"
                    @click="submit()"
                    :class="form.busy && 'btn-loading'"
                    :disabled="form.busy"
                >Create {{form.type}}</button>
            </div>
        </div>
        <div v-if="step === 4">
            <div class=" mt-4 text-center">
                <fp-icon name="check-success" style="font-size: 60px;" />
                <h4 class="success-message mt-4 fp-text-active">{{ form.type }} "<router-link :to="{name: 'group.detail', params: {slug: this.form.slug}}">{{ form.title }}</router-link>" Successfully {{ mode === 'edit' ? 'Updated' : 'Created'}}.</h4>
            </div>
        </div>
        <fp-image-editor ref="imageEditor"
             :src="imageData"
             @save="setImage"
        />
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">{{ mode === 'edit' ? 'Edit ' : 'Create' }} <span class="text-capitalize">{{ form.type }}</span></h6>
        </portal>
    </div>
</template>
<script>
import FpImageEditor from "~/components/ui/FpImageEditor.vue"
import SearchUsers from "../../ui/SearchUsers.vue";
import StepHeader from "../../ui/StepHeader.vue";
import Form from "vform"
import 'vue-step-wizard/dist/vue-step-wizard.css'
export default {
    name: 'GroupForm',
    props: {
        type: { type: String, default: 'group' },
        mode: { type: String, default: 'add' },
        group: { type: Object, default: null },
    },
    components: {
        FpImageEditor,
        SearchUsers,
        StepHeader,
    },
    data() {
        return {
            step: 1,
            form: new Form({
                id: '',
                type: this.type,
                title: '',
                slug: '',
                description: '',
                image: null,
                email: '',
                phone_number: '',
                city: '',
                facebook: '',
                twitter: '',
                linkedin: '',
                weblink: '',
                is_private: false,
                is_postable: true,
                invite: '',
                followers: [],
                invited_users: [],
                city: '',
                state: '',
                country: '',
                zipcode: '',
                latitude: '',
                longitude: '',
            }),
            invited_users: [],
            imageData: null,
            users: [],
            full_address: '',
            formError: false,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
    },
    async mounted() {
        if (this.mode === 'edit') {
            this.loadGroup();
        } else {
            this.form.email = this.auth_user.email;
            this.getFollowers();
        }
        this.getUsers();
    },
    methods: {
        loadGroup() {
            this.form.id = this.group.id;
            this.form.type = this.group.type;
            this.form.title = this.group.title;
            this.form.slug = this.group.slug;
            this.form.description = this.group.description;
            this.imageData = this.group.wallpaper
            this.form.email = this.group.email;
            this.form.phone_number = this.group.phone_number;
            this.form.facebook = this.group.facebook;
            this.form.twitter = this.group.twitter;
            this.form.linkedin = this.group.linkedin;
            this.form.weblink = this.group.weblink;
            this.form.is_private = this.group.is_private;
            this.form.is_postable = this.group.is_postable;
            this.form.city = this.group.location?.city;
            this.form.state = this.group.location?.state;
            this.form.country = this.group.location?.country;
            this.form.zipcode = this.group.location?.zipcode;
            this.form.latitude = this.group.location?.latitude;
            this.form.longitude = this.group.location?.longitude;
        },
        async submit() {
            this.formError = false;
            if (this.form.invite === 'specific' && this.form.invited_users.length === 0) {
                this.formError = true;
                return false;
            }
            try {
                const response = await this.form.post(`${process.env.timelineApiUrl}/group/save`);
                if (response.data.status === 'Success') {
                    this.step = 4;
                    if (this.mode === 'add') {
                        let result = response.data.data;
                        this.form.id = result.id;
                        this.form.slug = result.slug;
                        this.$store.dispatch('fetchNotifications');
                        if (this.form.invited_users.length) {
                            this.form.invited_users.forEach(i => {
                                let notiFb = this.$fire.database.ref('notifications/' + i).push();
                                notiFb.set({
                                    notifier_id: this.auth_user.id,
                                    type: 'join_group',
                                });
                            })
                        }
                    }
                }
            } catch (error) {

            }
        },
        updateAddress(place) {
            this.form.latitude = place.geometry['location'].lat();
            this.form.longitude = place.geometry['location'].lng();

            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] === "postal_code") {
                        this.form.zipcode = place.address_components[i].long_name;
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_1") {
                        this.form.state = place.address_components[i].short_name;
                    }
                    if (place.address_components[i].types[j] === "locality") {
                        this.form.city = place.address_components[i].long_name;
                    }
                    if (place.address_components[i].types[j] === "country") {
                        this.form.country = place.address_components[i].short_name;
                    }
                }
            }
            this.full_address = `${this.form.city}, ${this.form.state}, ${this.form.country}`;
        },
        handleFile(event) {
            const file = event.target.files[0];
            if (!file) return false
            let reader = new FileReader();
            reader.onload = e => {
                this.imageData = e.target.result;
                this.$refs.imageEditor.open();
            };
            reader.readAsDataURL(file);
        },
        setImage(data) {
            this.form.image = data;
            this.imageData = data;
        },
        removeImage() {
            this.form.image = null
            this.imageData = null
        },
        async getFollowers() {
            const res = await this.axios.post('/user/get_follower_user_ids', {user_id: this.auth_user.id});
            this.form.followers = res.data.data
        },
        async getUsers() {
            const response = await this.axios.post('/user/get_all_users')
            this.users = response.data.data
        },
        nextStep() {
            this.step++
        },
        previousStep() {
            this.step--
        },
    }
}
</script>

<style lang="scss" scoped>
    .form-post {
        .step-header {
            .step-pills {
                box-shadow: none !important;
                border: none !important;
            }
        }
    }
    .wallpaper-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background-color: #FF22A10D;
        @media (min-width:601px) {
            height: calc(100% - 66px);
        }
        min-height: 170px;
        a {
            text-decoration: none;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
        }
        .btn-remove-image {
            top: 6px;
            right: 6px;
        }
    }
    .access-description {
        font-weight: 400;
    }
    .group-access-type {
        .access-title {
            font-size: 16px;
            text-align: center;
        }
        @media (min-width: 901px) {
            padding-left: 30px;
            padding-right: 30px;
            &:last-child {
                border-left-style: solid;
                border-left-width: 1px;
            }
        }
    }
    .btn-is-private {
        width: 125px;
        font-size: 14px;
        text-decoration: none;
        text-align: center;
        color: #64748B;
        .btn-icon {
            width: 80px;
            height: 80px;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin-bottom: 10px;
            background-color: #F0F3F9;
            svg {
                font-size: 30px;
            }
        }
        &.active {
            color: #FF22A1;
            .btn-icon {
                border: solid 1px #FF22A1;
                background-color: #FF22A114 !important;
            }
        }
    }
    [data-theme=dark] {
        .btn-is-private {
            .btn-icon {
                background-color: #18243E;
            }
        }
    }
    .invite-type {
        cursor: pointer;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
        svg {
            font-size: 30px;
        }
        .invite-type-title {
            font-size: 18px;
        }
        .invite-type-description {
            max-width: 300px;
            margin: 0 auto;
            font-size: 14px;
        }
        &.selected {
            border-color: #FF22A1;
            background-color: #FF22A11A;
            color: #091E42;
            svg {
                color: #FF22A1;
            }
        }
    }
    .card-contact {
        .icon-prefix-input {
            svg {
                color: #8598B2;
            }
        }
        @media (max-width: 600px) {
            border: none;
            padding: 0;
            border-radius: 0;
        }
    }
    .success-message {
        text-transform: capitalize;
        font-size: 26px;
        @media (max-width: 600px) {
            font-size: 18px;
        }
    }
    [data-theme=dark] {
        .invite-type {
            &.selected {
                color: #FFF;
            }
        }
    }
</style>