<template>
    <fp-modal ref="aboutMeModal"
         name="about_me_modal"
         title="About Me"
         @before-open="loadProfile()"
    >
        <form @submit.prevent="save()" class="detail-form">
            <div class="d-flex align-items-center mb-3">
                Who can see "About me"?
                <access-level-selector v-model="form.visible_about_me"
                    :levels="[
                        { key: 'public', label: 'Public', icon: 'globe' },
                        { key: 'followers', label: 'Followers', icon: 'user-check' },
                        { key: 'mutual_followers', label: 'Mutual Followers', icon: 'users-check' },
                        { key: 'nobody', label: 'Nobody', icon: 'eye-slash' },
                    ]"
                    class="ml-2"
                />
            </div>
            <div class="about-me-detail">
                <PickerArea v-model="form.detail"
                        set="apple"
                        :sheetSize="32"
                        :include="['search', 'recent', 'people']"
                        :showCategories="false"
                        placeholder="Write about you..."
                />
                <p class="text-muted mb-0 text-right">{{ detailCharCount }}/{{ max_chars }} characters</p>
            </div>
            <h6 class="mb-3">Social Links</h6>
            <div class="contact-social">
                <div class="icon-prefix-input mb-2">
                    <fp-icon name="facebook" />
                    <input type="text" class="form-control" maxlength="200" v-model="form.facebook" placeholder="Facebook profile link" />
                </div>
                <div class="icon-prefix-input mb-2">
                    <fp-icon name="twitter" />
                    <input type="text" class="form-control" maxlength="200" v-model="form.twitter" placeholder="Twitter profile link" />
                </div>
                <div class="icon-prefix-input mb-2">
                    <fp-icon name="linkedin" />
                    <input type="text" class="form-control" maxlength="200" v-model="form.linkedin" placeholder="Linkedin profile link" />
                </div>
                <div class="icon-prefix-input">
                    <fp-icon name="globe" />
                    <input type="text" class="form-control" maxlength="200" v-model="form.weblink" placeholder="Other links" />
                </div>
            </div>
            <div class="mt-3">
                <button type="submit" class="btn fp-btn-gradient px-3" :class="{ 'btn-loading': form.busy }" :disabled="form.busy">Save Changes</button>
            </div>
        </form>
    </fp-modal>
</template>
<script>
import FpModal from "~/components/ui/Modal.vue";
import Form from "vform";
import { mapGetters } from "vuex";
import PickerArea from "vue-emoji-mart-picker";
import AccessLevelSelector from '~/components/ui/AccessLevelSelector.vue';
export default {
    name: 'ModalAboutMe',
    components: {
        FpModal,
        PickerArea,
        AccessLevelSelector,
    },
    data() {
        return {
            form: new Form({
                user_id: '',
                detail: "",
                facebook: "",
                twitter: "",
                linkedin: "",
                weblink: "",
                visible_about_me: "public",
            }),
            max_chars: 250,
        };
    },
    computed: {
        profileLink() {
            return `${process.env.serverUrl}${this.$route.fullPath}`;
        },
        detailCharCount() {
            let detail = this.form.detail ? this.form.detail.replace(/<[^>]+>/g, " ") : "";
            return detail.length;
        },
        ...mapGetters({
            auth_user: "auth/user",
        }),
    },
    methods: {
        async loadProfile() {
            // const detail_response = await this.axios.post(`/user/get_detail`, {
            //     id: this.auth_user.id,
            // });
            this.form.visible_about_me = this.auth_user.profile ? this.auth_user.profile.visible_about_me : 'public';
            const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/get`, { user_id: this.auth_user.id });
            if (response.data.status === 'Success') {
                const profile = response.data.data;
                this.form.user_id = profile.user_id;
                this.form.detail = profile.detail || "";
                this.form.facebook = profile.facebook;
                this.form.twitter = profile.twitter;
                this.form.linkedin = profile.linkedin;
                this.form.weblink = profile.weblink;
            }
        },
        async save() {
            if (this.detailCharCount > this.max_chars) {
                this.$toast.error(`Your detail must be ${this.max_chars} characteres or less.`);
                return false;
            }
            const response = await this.form.post(`${process.env.timelineApiUrl}/profile/save_detail`);
            if (response.data.status === 'Success') {
                this.$emit('updated');
                await this.$store.dispatch("auth/fetchUser");
                this.$refs.aboutMeModal.close();
            }
        },
        open() {
            this.$refs.aboutMeModal.open();
        }
    }
}
</script>
<style lang="scss" scoped>
    .detail-form {
        .contact-social {
            svg {
                color: #8598B2;
            }
        }
        .about-me-detail {
            position: relative;
            &::v-deep {
                .emojipicker-area {
                    border-radius: 10px !important;
                }
            }
        }
    }
</style>