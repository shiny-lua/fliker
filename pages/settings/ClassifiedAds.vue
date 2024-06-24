<template>
    <div class="settings-classified-ads">
        <div class="settings-card location-card fp-card mb-4">
            <h6 class="mb-2 text-center">Default Post Location &amp; Contact Details</h6>
            <p class="text-center fp-text-color-main">Set a default location for your local classified ad posts. This setting applicable to all ad posts by default.</p>
            <div class="row mx-n2">
                <div class="col-lg-6 px-2 mb-4 mb-lg-0">
                    <div class="fp-border-color-1 border round-10 p-2">
                        <div class="row mx-n2 mb-3">
                            <div class="col-md-12 px-2">
                                <label class="mb-2">Street address</label>
                                <gmap-autocomplete
                                    :value="location.address"
                                    class="form-control"
                                    @place_changed="updateAddress"
                                    placeholder="Enter street address (optional)"
                                    style="max-width: unset;"
                                    @keypress.enter="$event.preventDefault()"
                                ></gmap-autocomplete>
                            </div>
                        </div>
                        <div class="row mx-n1 city-state-zipcode">
                            <div class="col-md-6 px-1 mb-3">
                                <label class="mb-2">Zip</label>
                                <input type="text" class="form-control" placeholder="Ex.92126" v-model="location.zipcode" />
                            </div>
                            <div class="col-md-6 px-1 mb-3">
                                <label class="mb-2">City</label>
                                <input type="text" class="form-control" placeholder="Ex.San Diego" v-model="location.city" />
                            </div>
                            <div class="col-md-6 px-1 mb-3">
                                <label class="mb-2">State</label>
                                <input type="text" class="form-control" placeholder="Ex.CA" v-model="location.state" />
                            </div>
                            <div class="col-md-6 px-1 mb-3">
                                <label class="mb-2">Country</label>
                                <input type="text" class="form-control" placeholder="Ex.US" v-model="location.country" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 px-2 mb-4 mb-lg-0">
                    <div class="fp-border-color-1 border round-10 h-100 p-2">
                        <form @change="updateProfile">
                            <div>
                                <div class="form-group">
                                    <label class="mb-2">Email</label>
                                    <input type="email" class="form-control" placeholder="Enter email address" v-model="profile.contact_email" />
                                </div>
                                <div class="form-group">
                                    <label class="mb-2">Phone</label>
                                    <input type="email" class="form-control" placeholder="Enter phone number" v-model="profile.contact_phone_number"  />
                                </div>
                            </div>
                            <div class="d-flex mt-3">
                                <label class="mb-0 mr-4">Enable chat?</label>

                                <div class="d-inline-flex custom-control custom-radio">
                                    <input v-model="profile.enable_chat"
                                            type="radio"
                                            class="custom-control-input"
                                            id="enable_chat_show"
                                            name="enable_chat"
                                            :value="true"
                                    />
                                    <label class="custom-control-label" for="enable_chat_show">Yes</label>
                                </div>

                                <div class="d-inline-flex custom-control custom-radio ml-5">
                                    <input v-model="profile.enable_chat"
                                            type="radio"
                                            class="custom-control-input"
                                            id="enable_chat_hide"
                                            name="enable_chat"
                                            :value="false"
                                    />
                                    <label class="custom-control-label" for="enable_chat_hide">No</label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SettingsClassifiedAds',
    data() {
        return {
            location: {
                country: '',
                city: '',
                state: '',
                zipcode: '',
                address: '',
                latitude: '',
                longitude: '',
            },
            profile: {
                contact_email: '',
                contact_phone_number: '',
                enable_chat: true,
            }
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.profile.contact_email = this.auth_user.profile ? this.auth_user.profile.contact_email : this.auth_user.email;
        this.profile.contact_phone_number = this.auth_user.profile ? this.auth_user.profile.contact_phone_number : this.auth_user.phone_number;
        this.profile.enable_chat = this.auth_user.profile ? this.auth_user.profile.enable_chat : true;
        Object.assign(this.location, this.auth_user.location);
    },
    methods: {
        updateAddress(place) {
            this.location.latitude = place.geometry['location'].lat();
            this.location.longitude = place.geometry['location'].lng();

            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] === "postal_code") {
                        this.location.zipcode = place.address_components[i].long_name;
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_1") {
                        this.location.state = place.address_components[i].short_name;
                    }
                    if (place.address_components[i].types[j] === "locality") {
                        this.location.city = place.address_components[i].long_name;
                    }
                    if (place.address_components[i].types[j] === "country") {
                        this.location.country = place.address_components[i].short_name;
                    }
                }
            }
            this.location.address = place.name;
            this.updateLocation();
        },
        async updateProfile() {
            const response = await this.axios.post('/settings/update_profile', this.profile);
            if (response.data.status === 'Success') {
                this.$toast.success('Updated Successfully!');
            }
        },
        async updateLocation() {
            const response = await this.axios.post('/settings/update_location', this.location);
            if (response.data.status === 'Success') {
                this.$toast.success('Updated Successfully!');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .location-card {
        label {
            white-space: nowrap;
            margin-right: 4px;
            margin-bottom: 0;
        }
    }
</style>