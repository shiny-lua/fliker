<template>
    <div class="form-post">
        <div class="step-title d-none d-md-block text-center mb-md-3">
            <h4>{{ mode === 'edit' ? 'Update' : 'Create'}} a Channel</h4>
        </div>
        <div v-if="mode === 'add'" class="step-header d-none d-md-block" :data-step="`step_${step}`">
            <ul class="step-pills">
                <li class="step-item" :class="step === 1 && 'active'">
                    <a href="#" class="step-link">
                        <span class="tabStatus">1 </span>
                        <span class="tabLabel text-capitalize">Channel Details</span>
                    </a>
                </li>
                <li v-if="mode === 'add'" class="step-item" :class="step === 2 && 'active'">
                    <a href="#" class="step-link">
                        <span class="tabStatus">2 </span>
                        <span class="tabLabel">Invite People</span>
                    </a>
                </li>
                <li class="step-item" :class="step === 4 && 'active'">
                    <a href="#" class="step-link">
                        <span class="tabStatus">3 </span>
                        <span class="tabLabel">Complete</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="step-title d-md-none mb-3">
            <h6 v-if="step === 1" class="text-capitalize">About Channel</h6>
            <h6 v-else-if="step === 2 && mode === 'add'">Invite People</h6>
        </div>
        <form v-if="step === 1" class="step-1" @submit.prevent="step = 2">
            <div class="fp-card fp-sm-no-card">
                <div class="row mx-n2 mb-3 mb-lg-0">
                    <div class="col-lg-6 px-2">
                        <div class="form-group">
                            <label class="mb-2 text-capitalize">Channel Title</label>
                            <input type="text"
                                v-model="form.title"
                                class="form-control"
                                maxlength="60"
                                required
                                placeholder="Enter channel name"
                            />
                        </div>
                        <div class="form-group">
                            <label class="mb-2">About Channel</label>
                            <textarea rows="6"
                                v-model="form.description"
                                class="form-control"
                                required
                                placeholder="Describe this channel..."
                            ></textarea>
                            <div class="d-flex font-weight-400 mt-1">
                                <span class="fp-text-color-main">Entered: {{form.description.length}} chars</span>
                                <span class="fp-text-color-main ml-auto">Between 20-150 chars</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 px-2 d-flex align-items-center justify-content-center">
                        <label class="fp-card-outline p-0 dashed wallpaper-wrapper text-center cursor-pointer">
                            <span v-if="!form.image && !imageData">
                                <fp-icon name="upload" class="fp-fs-26 fp-text-active" />
                                <br />
                                Choose cover picture
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
                                    :placeholder="`Choose location`"
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
                <button v-if="mode === 'add'" type="submit" class="btn fp-btn-gradient px-4">Invite People</button>
                <button v-else type="button"
                    class="btn fp-btn-gradient px-4 ml-2"
                    @click="submit()"
                    :class="form.busy && 'btn-loading'"
                    :disabled="form.busy"
                >Update Page</button>
            </div>
        </form>
        <div v-if="step === 2 && mode === 'add'">
            <div class="fp-card">
                <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-3 mb-md-0">
                        <div class="invite-type fp-card-outline fp-text-color-main"
                             :class="form.invite === 'followers' && 'selected'"
                             @click="form.invite = 'followers'"
                        >
                            <fp-icon name="users-fill" class="fp-fs-30" />
                            <p class="invite-type-title mb-1 mt-3">Invite Your Followers</p>
                            <p class="invite-type-description">An invitation request will be sent to all of your followers.</p>
                        </div>
                    </div>
                    <div class="col-md-6 px-2">
                        <div class="invite-type fp-card-outline fp-text-color-main"
                             :class="form.invite === 'specific' && 'selected'"
                             @click="form.invite = 'specific'"
                        >
                            <fp-icon name="lock-fill" class="fp-fs-30" />
                            <p class="invite-type-title mb-1 mt-3">Invite Specific People</p>
                            <p class="invite-type-description">An invitation request will be sent to only specified people.</p>
                        </div>
                    </div>
                </div>

                <div v-if="form.invite === 'specific'" class="mt-3">
                    <search-users v-model="form.invited_users" url="/user/search" placeholder="Invite people..." />
                </div>
            </div>
            <div class="text-center mt-3">
                <a href="javascript:;" class="btn fp-btn-outline px-4" @click="step = 1">Cancel</a>
                <button type="button"
                    class="btn fp-btn-gradient px-4 ml-2 text-capitalize"
                    @click="submit()"
                    :class="form.busy && 'btn-loading'"
                    :disabled="form.busy"
                >Create Channel</button>
            </div>
        </div>
        <div v-if="step === 3">
            <div class=" mt-4 text-center">
                <fp-icon name="check-success" style="font-size: 60px;" />
                <h4 class="success-message mt-4 fp-text-active">Channel "<router-link :to="{name: 'channel.detail', params: {slug: this.form.slug}}">{{ form.title }}</router-link>" {{ mode === 'edit' ? 'Updated' : 'Created'}} successfully.</h4>
            </div>
        </div>
        <fp-image-editor ref="imageEditor"
             :src="imageData"
             @save="setImage"
        />
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">{{ mode === 'edit' ? 'Edit ' : 'Create' }} a Channel</h6>
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
    name: 'ChannelForm',
    props: {
        mode: { type: String, default: 'add' },
        channel: { type: Object, default: null },
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
            this.loadChannel();
        } else {
            this.form.email = this.auth_user.email;
            this.getFollowers();
        }
        this.getUsers();
    },
    methods: {
        loadChannel() {
            this.form.id = this.channel.id;
            this.form.title = this.channel.title;
            this.form.slug = this.channel.slug;
            this.form.description = this.channel.description;
            this.imageData = this.channel.image_url;
            this.form.email = this.channel.email;
            this.form.phone_number = this.channel.phone_number;
            this.form.facebook = this.channel.facebook;
            this.form.twitter = this.channel.twitter;
            this.form.linkedin = this.channel.linkedin;
            this.form.weblink = this.channel.weblink;
            this.form.city = this.channel.location?.city;
            this.form.state = this.channel.location?.state;
            this.form.country = this.channel.location?.country;
            this.form.zipcode = this.channel.location?.zipcode;
            this.form.latitude = this.channel.location?.latitude;
            this.form.longitude = this.channel.location?.longitude;
        },
        async submit() {
            this.formError = false;
            if (this.form.invite === 'specific' && this.form.invited_users.length === 0) {
                this.formError = true;
                return false;
            }
            try {
                const response = await this.form.post(`${process.env.timelineApiUrl}/channel/save`);
                if (response.data.status === 'Success') {
                    this.step = 3;
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
                                    type: 'invite_channel',
                                });
                            })
                        }
                    }
                    setTimeout(() => {
                        this.$router.back();
                    }, 2500);
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
        margin: auto;
        border-radius: 100%;
        width: 200px;
        height: 200px;
        a {
            text-decoration: none;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 100%;
        }
        .btn-remove-image {
            position: absolute;
            top: 0;
            right: 0;
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