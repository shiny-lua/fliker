<template>
    <div class="complete-profile fp-card" :class="!loaded && 'd-none'">
        <h6 class="mb-3">Quick Links</h6>
        <fp-slider v-if="loaded" :slide-width="176" :slide-count="6" :item-padding="6">
            <div v-if="!status.image_status" class="profile-item-slide">
                <div class="profile-item fp-border-color-1" @click="editPhotos()">
                    <div class="profile-item-info">
                        <img src="~/assets/images/change_profile_picture.png" width="40" height="40" class="mx-auto" alt="" />
                        <p class="mb-0">Add profile photo and wallpaper</p>
                    </div>
                    <div class="text-center fp-border-color-1">
                        <a href="javascript:;" class="btn-complete-profile">
                            Edit profile photo
                            <fp-icon name="arrow-right" />
                        </a>
                    </div>
                </div>
            </div>
            <div v-if="!status.about_me_status" class="profile-item-slide">
                <div class="profile-item fp-border-color-1" @click="$refs.modalAboutMe.open()">
                    <div class="profile-item-info">
                        <img src="~/assets/images/add_about_me.png" width="40" height="40" class="mx-auto" alt="" />
                        <p class="mb-0">Add about yourself</p>
                    </div>
                    <div class="text-center fp-border-color-1">
                        <a href="javascript:;" class="btn-complete-profile">
                            Introduce yourself
                            <fp-icon name="arrow-right" />
                        </a>
                    </div>
                </div>
            </div>
            <div v-if="!status.basic_info_status" class="profile-item-slide">
                <div class="profile-item fp-border-color-1" @click="$refs.basicInfoModal.open()">
                    <div class="profile-item-info">
                        <img src="~/assets/images/delivery.png" width="40" height="40" class="mx-auto" alt="" />
                        <p class="mb-0" :style="{fontSize: '12px'}">Add your basic, work and education details.</p>
                    </div>
                    <div class="text-center fp-border-color-1">
                        <a href="javascript:;" class="btn-complete-profile">
                            Update basic details
                            <fp-icon name="arrow-right" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="profile-item-slide">
                <router-link :to="{name: 'merchant.promote'}" class="profile-item fp-border-color-1">
                    <div :to="{name: 'merchant.promote'}" class="profile-item-info">
                        <img src="~/assets/images/promote_business.png" width="40" height="40" class="mx-auto" alt="" />
                        <p class="mb-0">Promote your business</p>
                    </div>
                    <div class="text-center fp-border-color-1">
                        <a href="javascript:;"
                             class="btn-complete-profile"
                        >
                            Register &amp; Promote
                            <fp-icon name="arrow-right" />
                        </a>
                    </div>
                </router-link>
            </div>
            <div class="profile-item-slide">
                <router-link :to="{name: 'merchant.create_offer'}" class="profile-item fp-border-color-1">
                    <div class="profile-item-info">
                        <img src="~/assets/images/create_offers.png" width="40" height="40" class="mx-auto" alt="" />
                        <p class="mb-0">Create coupons, offers &amp; discounts</p>
                    </div>
                    <div class="text-center fp-border-color-1">
                        <a href="javascript:;"
                             class="btn-complete-profile"
                        >
                            Register &amp; Create
                            <fp-icon name="arrow-right" />
                        </a>
                    </div>
                </router-link>
            </div>
            <div class="profile-item-slide">
                <router-link :to="{name: 'ads.add'}" class="profile-item fp-border-color-1">
                    <div class="profile-item-info">
                        <img src="~/assets/images/create_ads.png" width="40" height="40" class="mx-auto" alt="" />
                        <p class="mb-0">Create local classified ads on FP</p>
                    </div>
                    <div class="text-center fp-border-color-1">
                        <a href="javascript:;" class="btn-complete-profile">
                            Post on FlickerPage
                            <fp-icon name="arrow-right" />
                        </a>
                    </div>
                </router-link>
            </div>
        </fp-slider>
        <edit-profile-photos ref="editPhotos" @updated="getStatus()" />
        <modal-about-me ref="modalAboutMe"
             @updated="getStatus"
        />

        <fp-modal v-if="auth_user" ref="basicInfoModal" name="basicInfoModal" title="Basic Information">
            <basic-information :user="auth_user" @updated="getStatus()" />
        </fp-modal>
    </div>
</template>
<script>
import FpSlider from "~/components/ui/FpSlider.vue";
import EditProfilePhotos from "~/components/fliconn/profile/EditProfilePhotos.vue";
import ModalAboutMe from '~/components/fliconn/profile/ModalAboutMe.vue';
import BasicInformation from '~/components/fliconn/profile/BasicInformation.vue';
import FpModal from "~/components/ui/Modal.vue";
export default {
    name: 'QuickLinks',
    components: {
        FpSlider,
        EditProfilePhotos,
        ModalAboutMe,
        BasicInformation,
        FpModal,
    },
    data() {
        return {
            status: {
                image_status: true,
                about_me_status: true,
                basic_info_status: true,
            },
            loaded: false,
        };
    },
    computed: {
        auth_user() {
            return this.$store.state.auth.user;
        }
    },
    mounted() {
        this.getStatus();
    },
    methods: {
        async getStatus() {
            this.$refs.basicInfoModal.close();
            // this.$refs.basicInfoModal.close();
            this.loaded = false;
            const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/get_complete_status`, {user_id: this.auth_user.id});
            this.status = response.data.data;
            this.loaded = true
        },
        editPhotos() {
            this.$refs.editPhotos.open();
        }
    }
}
</script>
<style lang="scss" scoped>
    .complete-profile {
        border-radius: 12px;
    }
    .profile-item-slide {
        padding: 0 6px;
        .profile-item {
            display: flex;
            flex-direction: column;
            border-radius: 12px;
            border-style: solid;
            border-width: 1px;
            width: 175px;
            height: 180px;
            padding: 0px;
            cursor: pointer;
            text-decoration: none;
            @media (max-width: 600px) {
                width: 171px;
            }
            .profile-item-info {
                padding-left: 10px;
                padding-right: 10px;
                display: flex;
                align-items: center;
                flex-grow: 1;
                text-align: center;
                flex-direction: column;
                img, svg {
                    margin-top: 30px;
                    margin-bottom: 12px;
                }
            }
            p {
                white-space: pre-wrap;
                line-height: 1.1;
                font-weight: 400;
                font-size: 13px;
            }
            div {
                &:nth-child(2) {
                    border-top-width: 1px;
                    border-top-style: solid;
                    padding: 8px 12px;
                    a {
                        font-size: 13px;
                        color: #FF22A1;
                    }
                }
            }
        }
    }
    .btn-complete-profile {
        font-weight: 400;
        font-size: 14.4px;
    }
</style>