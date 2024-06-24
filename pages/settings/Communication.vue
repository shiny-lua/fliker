<template>
    <div class="settings-communication">
        <div class="settings-card fp-card mb-4">
            <div class="d-md-flex align-items-center mb-3">
                <h6 class="mb-md-0 mr-md-3">Who can contact me?</h6>
                <access-level-selector v-model="profile.contact_me"
                    :levels="[
                        { key: 'anyone', label: 'Anyone', icon: 'globe' },
                        { key: 'followers', label: 'Followers', icon: 'user-check' },
                        { key: 'mutual_followers', label: 'Mutual Followers', icon: 'users-check' },
                        { key: 'nobody', label: 'Nobody', icon: 'eye-slash' },
                        { key: 'custom', label: 'Sepcific People', icon: 'privacy_policy' },
                    ]"
                    @change="accessLevelChanged"
                />
            </div>
            <p class="fp-text-color-main mb-3 font-weight-400">Choose people who can contact you over chat. This will disable messaging option for others. It is recommended to keep this option "Anyone" if you wish to grow your connections.</p>
            <search-user-modal v-if="loaded"
                 ref="specificContacts"
                 :users="profile.contactable_users"
                 modal-title="Who can contact me?"
                 description="Only selected list of people can contact you over chat."
                 @change="contactableUsersChanged"
                 :class="profile.contact_me !== 'custom' && 'd-none'"
            />
        </div>

        <form @change="updateProfile" class="settings-card fp-card">
            <h6 class="text-center">Notifications</h6>
            <p class="fp-text-color-main">Select the list of options you prefered to receive notifications. Apart from selected list, FlickerPage will send all mandatory notifications as required.</p>
            <hr class="my-3" />
            <h6 class="mb-3">Local Classifed Ads</h6>
            <div class="d-flex flex-wrap">
                <div class="custom-control custom-checkbox mr-3">
                    <input v-model="profile.notify_my_classified_ads"
                            type="checkbox"
                            class="custom-control-input"
                            id="my_classified_ads"
                    />
                    <label class="custom-control-label" for="my_classified_ads">My Classified Ads</label>
                </div>
                <div class="custom-control custom-checkbox">
                    <input v-model="profile.notify_local_classified_others"
                            type="checkbox"
                            class="custom-control-input"
                            id="local_classified_others"
                    />
                    <label class="custom-control-label" for="local_classified_others">Local Ads from Others</label>
                </div>
            </div>
            <hr class="my-3" />
            <h6 class="mb-3">FliConn</h6>
            <div class="d-flex flex-wrap mb-n2">
                <div class="custom-control custom-checkbox mb-2 mr-3">
                    <input v-model="profile.notify_timeline"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_timeline"
                    />
                    <label class="custom-control-label" for="notify_timeline">Timeline</label>
                </div>
                <div class="custom-control custom-checkbox mb-2 mr-3">
                    <input v-model="profile.notify_clips"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_clips"
                    />
                    <label class="custom-control-label" for="notify_clips">Short Flicks</label>
                </div>
                <div class="custom-control custom-checkbox mb-2 mr-3">
                    <input v-model="profile.notify_people"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_people"
                    />
                    <label class="custom-control-label" for="notify_people">My People</label>
                </div>
                <div class="custom-control custom-checkbox mb-2 mr-3">
                    <input v-model="profile.notify_groups"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_groups"
                    />
                    <label class="custom-control-label" for="notify_groups">Groups/Pages</label>
                </div>
                <div class="custom-control custom-checkbox mb-2 mr-3">
                    <input v-model="profile.notify_channels"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_channels"
                    />
                    <label class="custom-control-label" for="notify_channels">Channels</label>
                </div>
                <div class="custom-control custom-checkbox mb-2 mr-3">
                    <input v-model="profile.notify_offers"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_offers"
                    />
                    <label class="custom-control-label" for="notify_offers">Coupons/Offers</label>
                </div>
                <div class="custom-control custom-checkbox mb-2 mr-3">
                    <input v-model="profile.notify_discover"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_discover"
                    />
                    <label class="custom-control-label" for="notify_discover">Around Me</label>
                </div>
            </div>
            <hr class="my-3" />
            <h6 class="mb-3">Discussions/Questions</h6>
            <div class="d-flex flex-wrap mb-n2">
                <div class="custom-control custom-checkbox mr-3 mb-2">
                    <input v-model="profile.notify_my_topics"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_my_topics"
                    />
                    <label class="custom-control-label" for="notify_my_topics">My Discussions/Questions</label>
                </div>
                <div class="custom-control custom-checkbox mr-3 mb-2">
                    <input v-model="profile.notify_following_topics"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_following_topics"
                    />
                    <label class="custom-control-label" for="notify_following_topics">Topics I follow</label>
                </div>
                <div class="custom-control custom-checkbox mr-3 mb-2">
                    <input v-model="profile.notify_following_tags"
                            type="checkbox"
                            class="custom-control-input"
                            id="notify_following_tags"
                    />
                    <label class="custom-control-label" for="notify_following_tags">Tags I follow</label>
                </div>
            </div>
            <hr class="my-3" />
            <div class="d-flex mb-2">
                <h6 class="mb-2 mb-md-0">
                    FlickerPage System
                </h6>
                <div class="custom-control custom-checkbox ml-3">
                    <input v-model="profile.notify_admin"
                            type="checkbox"
                            class="custom-control-input"
                    />
                    <label class="custom-control-label"></label>
                </div>
            </div>
            <p class="fp-text-color-main">FP System notifications includes alerts related to your account, your content on FP, Communication, your activites.</p>
        </form>
    </div>
</template>
<script>
import AccessLevelSelector from '~/components/ui/AccessLevelSelector.vue';
import SearchUserModal from "~/components/ui/SearchUserModal.vue"
export default {
    name: 'SettingsCommunication',
    components: {
        AccessLevelSelector,
        SearchUserModal,
    },
    data() {
        return {
            profile: {
                contact_me: 'anyone',
                contactable_users: [],
                // notify_ads: true,
                notify_my_classified_ads: true,
                notify_local_classified_others: true,

                notify_timeline: true,
                notify_clips: true,
                notify_people: true,
                notify_groups: true,
                notify_channels: true,
                notify_offers: true,
                notify_discover: true,

                notify_admin: true,

                notify_my_topics: true,
                notify_following_topics: true,
                notify_following_tags: true,
            },
            loaded: false,
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.profile.contact_me = this.auth_user.profile ? this.auth_user.profile.contact_me : 'anyone';
        this.profile.contactable_users = this.auth_user.profile && this.auth_user.profile.contactable_users ? this.auth_user.profile.contactable_users : [];

        this.profile.notify_my_classified_ads = this.auth_user.profile ? this.auth_user.profile.notify_my_classified_ads : true;
        this.profile.notify_local_classified_others = this.auth_user.profile ? this.auth_user.profile.notify_local_classified_others : true;

        this.profile.notify_timeline = this.auth_user.profile ? this.auth_user.profile.notify_timeline : true;
        this.profile.notify_clips = this.auth_user.profile ? this.auth_user.profile.notify_clips : true;
        this.profile.notify_people = this.auth_user.profile ? this.auth_user.profile.notify_people : true;
        this.profile.notify_groups = this.auth_user.profile ? this.auth_user.profile.notify_groups : true;
        this.profile.notify_channels = this.auth_user.profile ? this.auth_user.profile.notify_channels : true;
        this.profile.notify_offers = this.auth_user.profile ? this.auth_user.profile.notify_offers : true;
        this.profile.notify_discover = this.auth_user.profile ? this.auth_user.profile.notify_discover : true;

        this.profile.notify_my_topics = this.auth_user.profile ? this.auth_user.profile.notify_my_topics : true;
        this.profile.notify_following_topics = this.auth_user.profile ? this.auth_user.profile.notify_following_topics : true;
        this.profile.notify_following_tags = this.auth_user.profile ? this.auth_user.profile.notify_following_tags : true;

        this.profile.notify_admin = this.auth_user.profile ? this.auth_user.profile.notify_admin : true;

        this.loaded = true;
    },
    methods: {
        async updateProfile() {
            const response = await this.axios.post('/settings/update_profile', this.profile);
            if (response.data.status === 'Success') {
                this.$fpSuccess('Updated successfully!');
            }
        },
        async accessLevelChanged(data) {
            if (data === 'custom') {
                await this.$nextTick();
                this.$refs.specificContacts.openModal();
            } else {
                this.updateProfile()
            }
        },
        contactableUsersChanged(data) {
            this.profile.contactable_users = data;
            this.updateProfile();
            this.$refs.specificContacts.closeModal();
        }
    }
}
</script>