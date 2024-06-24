<template>
    <div class="settings-profile-visibility">
        <div class="settings-card fp-card mb-3">
            <div class="d-md-flex align-items-center mb-md-3">
                <h6 class="mb-md-0">Who can see my profile?</h6>
                <div class="profile-status ml-md-4">
                    <profile-status v-if="user"
                        :user="user"
                        page="settings"
                        @updated="statusUpdated()"
                    ></profile-status>
                </div>
            </div>
            <p class="mb-4 fp-text-color-main font-weight-400">Choose the option of who can see your FlickerPage social profile. This will restrict your profile visibility to others. Your selected people can see all the information opted in the "Restrict content visibility" section.</p>
            <div class="restrict-visibility">
                <h6 class="mb-3">Restrict content visibility</h6>
                <form @change="updateProfile" class="d-flex flex-wrap fp-text-color-main">
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_timeline"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_timeline"
                        />
                        <label class="custom-control-label" for="visible_timeline">Timeline</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_status"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_status"
                        />
                        <label class="custom-control-label" for="visible_status">Status</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_clips"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_clips"
                        />
                        <label class="custom-control-label" for="visible_clips">Short Flicks</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_people"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_people"
                        />
                        <label class="custom-control-label" for="visible_people">My People</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_gallery"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_gallery"
                        />
                        <label class="custom-control-label" for="visible_gallery">Gallery</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_pages"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_pages"
                        />
                        <label class="custom-control-label" for="visible_pages">Pages</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_groups"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_groups"
                        />
                        <label class="custom-control-label" for="visible_groups">Groups</label>
                    </div>
                    <div class="custom-control custom-checkbox mb-2 mr-3">
                        <input v-model="profile.visible_channels"
                                type="checkbox"
                                class="custom-control-input"
                                id="visible_channels"
                        />
                        <label class="custom-control-label" for="visible_channels">Channels</label>
                    </div>
                </form>
            </div>
        </div>
        <div class="settings-card fp-card mb-3">
            <h6>Who can like, comment and react to my posts?</h6>
            <p class="mb-3 fp-text-color-main font-weight-400">Choose the people who can like, comment, and react to your FlickerPage social posts. This option includes Timeline Posts, Status Stories, Short Flicks, Channels, Groups and Pages.</p>
            <access-level-selector v-model="profile.like_to_fliconn"
                 :levels="[
                    { key: 'anyone', label: 'Anyone', icon: 'globe' },
                    { key: 'followers', label: 'Followers', icon: 'user-check' },
                    { key: 'mutual_followers', label: 'Mutual Followers', icon: 'users-check' },
                    { key: 'nobody', label: 'Nobody', icon: 'eye-slash' },
                    { key: 'custom', label: 'Sepcific People', icon: 'privacy_policy' },
                 ]"
                 @change="likableChanged"
            />
            <search-user-modal v-if="loaded"
                 ref="specificLikables"
                 :users="profile.likable_users"
                 modal-title="Who can like, comment and react to my posts?"
                 description="Only selected list of people can like, comment and react to your posts."
                 @change="likableUsersChanged"
                 class="mt-3"
                 :class="profile.like_to_fliconn !== 'custom' && 'd-none'"
            />
        </div>
        <div class="settings-card fp-card mb-3">
            <h6>Who can tag me?</h6>
            <p class="mb-3 fp-text-color-main font-weight-400">Choose the people who can tag you on their FlickerPage social posts. This option includes Timeline Posts, Status Stories, and Short Clips.</p>
            <access-level-selector v-model="profile.tag_me"
                 :levels="[
                    { key: 'followers', label: 'Followers', icon: 'user-check' },
                    { key: 'mutual_followers', label: 'Mutual Followers', icon: 'users-check' },
                    { key: 'nobody', label: 'Nobody', icon: 'eye-slash' },
                    { key: 'custom', label: 'Sepcific People', icon: 'privacy_policy' },
                 ]"
                 @change="tagableChanged"
            />
            <search-user-modal v-if="loaded"
                 ref="specificTagables"
                 :users="profile.tagable_users"
                 modal-title="Who can tag me?"
                 description="Only selected list of people can tag you."
                 @change="tagableUsersChanged"
                 class="mt-3"
                 :class="profile.tag_me !== 'custom' && 'd-none'"
            />
        </div>
    </div>
</template>
<script>
import ProfileStatus from "~/components/fliconn/ProfileStatus.vue"
import AccessLevelSelector from '~/components/ui/AccessLevelSelector.vue';
import SearchUserModal from "~/components/ui/SearchUserModal.vue"
export default {
    name: 'SettingsProfileVisibility',
    components: {
        ProfileStatus,
        AccessLevelSelector,
        SearchUserModal
    },
    data() {
        return {
            profile: {
                visible_profile: 'public',
                visible_timeline: true,
                visible_gallery: true,
                visible_clips: true,
                visible_status: true,
                visible_people: true,
                visible_groups: true,
                visible_pages: true,
                visible_channels: true,
                like_to_fliconn: 'anyone',
                tag_me: 'followers',
                likable_users: [],
                tagable_users: [],
            },
            user: null,
            loaded: false,
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.user = Object.assign({}, this.auth_user);
        this.profile.visible_profile = this.auth_user.profile ? this.auth_user.profile.visible_profile : 'public';
        this.profile.visible_timeline = this.auth_user.profile ? this.auth_user.profile.visible_timeline : true;
        this.profile.visible_gallery = this.auth_user.profile ? this.auth_user.profile.visible_gallery : true;
        this.profile.visible_clips = this.auth_user.profile ? this.auth_user.profile.visible_clips : true;
        this.profile.visible_status = this.auth_user.profile ? this.auth_user.profile.visible_status : true;
        this.profile.visible_people = this.auth_user.profile ? this.auth_user.profile.visible_people : true;
        this.profile.visible_groups = this.auth_user.profile ? this.auth_user.profile.visible_groups : true;
        this.profile.visible_pages = this.auth_user.profile ? this.auth_user.profile.visible_pages : true;
        this.profile.visible_channels = this.auth_user.profile ? this.auth_user.profile.visible_channels : true;

        this.profile.like_to_fliconn = this.auth_user.profile ? this.auth_user.profile.like_to_fliconn : 'anyone';
        this.profile.tag_me = this.auth_user.profile ? this.auth_user.profile.tag_me : 'followers';

        this.profile.likable_users = this.auth_user.profile && this.auth_user.profile.likable_users ? this.auth_user.profile.likable_users : [];
        this.profile.tagable_users = this.auth_user.profile && this.auth_user.profile.tagable_users ? this.auth_user.profile.tagable_users : [];
        this.$nextTick(() => this.loaded = true);
    },
    methods: {
        async updateProfile() {
            const response = await this.axios.post('/settings/update_profile', this.profile);
            if (response.data.status === 'Success') {
                this.$fpSuccess('Updated successfully!');
            }
        },
        async statusUpdated() {
            await this.$store.dispatch("auth/fetchUser");
            this.user = Object.assign({}, this.auth_user);
        },
        likableChanged(data) {
            if (data === 'custom') {
                this.$refs.specificLikables.openModal();
            } else {
                this.updateProfile()
            }
        },
        likableUsersChanged(data) {
            this.profile.likable_users = data;
            this.updateProfile();
            this.$refs.specificLikables.closeModal();
        },
        tagableChanged(data) {
            if (data === 'custom') {
                this.$refs.specificTagables.openModal();
            } else {
                this.updateProfile()
            }
        },
        tagableUsersChanged(data) {
            this.profile.tagable_users = data;
            this.updateProfile();
            this.$refs.specificTagables.closeModal();
        }
    }
}
</script>
<style lang="scss" scoped>
    .profile-status::v-deep {
        .profile-selector {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            vertical-align: middle;
            user-select: none;
            background-color: transparent;
            border-style: solid;
            border-width: 1px;
            border-color: #ECF1F6;
            padding: 0.375rem 1rem;
            font-size: 15px;
            line-height: 1.5;
            border-radius: 6px;
            height: 38px;
        }
    }
    [data-theme=dark] {
        .profile-status::v-deep {
            .profile-selector {
                border-color: #334557;
            }
        }
    }
</style>