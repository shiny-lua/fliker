<template>
    <div class="user-card fp-card p-0 pb-2 pb-md-3">
        <div class="user-information" v-if="user">
            <div v-if="user.cover_image_url" class="cover-image-wrapper">
                <img v-if="user.cover_image" class="cover-image" :src="user.cover_image_url" @click="openGallery('cover_image')" alt="" />
                <img v-else class="cover-image" src="@/assets/images/fp-default-bg.webp" alt="" />
                <profile-photo-editor v-if="auth_user && auth_user.id === user.id"
                     mode="cover"
                     class="cover-image-editor"
                     @updated="imageUpdated()"
                >
                    <span class="btn px-3 fp-bg-color-2">Edit Cover Image</span>
                </profile-photo-editor>
            </div>
            <div class="px-2 px-md-3">
                <div class="user-photo">
                    <div class="photo" :style="{backgroundImage: `url(${profilePhotoOutlineImage})`}">
                        <img :src="user.photo_url" class="fp-border-color" alt="" @click="openGallery('photo')" />
                        <profile-photo-editor v-if="auth_user && auth_user.id === user.id"
                            mode="photo"
                            class="photo-image-editor"
                            @updated="imageUpdated()"
                        >
                            <span class="btn-profile-img fp-border-color2"><fp-icon name="camera" /></span>
                        </profile-photo-editor>
                    </div>
                    <div class="mx-auto">
                        <p class="name d-flex align-items-center justify-content-center">
                            {{ user.name }}
                            <profile-status :user="user" page="profile" class="ml-2 mr-n4 d-inline-block profile-status" />
                        </p>
                        <p class="username text-center">(@{{user.username}})</p>
                    </div>
                </div>
                <div class="user-buttons">
                    <div class="d-flex align-items-center">
                        <div v-if="!isMyDetail && !user.blocked_me" class="actions mt-3 mt-md-0">
                            <div v-if="auth_user && user.is_requested_follow" class="dropdown mr-3">
                                <a href="javascript:;" class="btn fp-btn-gradient dropdown-toggle" data-toggle="dropdown" title="Follow request sent">
                                    <fp-icon name="user-check" class="fp-fs-18" />
                                    Request sent
                                </a>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item px-1 py-0" href="#" @click.prevent="cancelRequest()">Cancel</a>
                                </div>
                            </div>
                            <a v-else-if="auth_user && user.is_following && user.contact_me" href="javascript:;" class="btn fp-btn-gradient mr-3" @click="openChat()" title="Message">
                                <fp-icon name="comment-dots" class="fp-fs-20" />
                                Message
                            </a>
                            <a v-else-if="auth_user && !user.is_following" href="javascript:;" class="btn fp-btn-gradient mr-3" @click="follow()" title="Follow">
                                <fp-icon name="user-check" class="fp-fs-20" />
                                Follow
                            </a>
                        </div>
                        <div class="d-flex align-items-center mt-3 mt-md-0">
                            <a v-if="isMyDetail"
                                    href="javascript:;"
                                    class="btn fp-btn-gradient mr-3"
                                    title="About"
                                    @click.prevent="openDetailModal()"
                            >
                                <fp-icon name="edit" class="fp-fs-20" /> About Me
                            </a>
                            <a v-if="profile_option && profile_option.visible_detail"
                                    href="javascript:;"
                                    class="mr-3"
                                    @click="openBasicInfo()"
                                    title="Basic Information"
                            >
                                <fp-icon name="user" class="fp-fs-22 fp-text-color-main" />
                            </a>
                            <div class="dropdown dropdown-other-profile mr-3">
                                <a href="javascript:;" class="dropdown-toggle no-caret" data-toggle="dropdown">
                                    <fp-icon v-if="user.is_blocked" name="alert-triangle" class="fp-fs-24 fp-text-color-primary" />
                                    <fp-icon v-else name="information" class="fp-fs-24 fp-text-color-primary" />
                                </a>
                                <div class="dropdown-menu dropdown-menu-sm">
                                    <a href="javascript:;" class="dropdown-item" @click.prevent="share()">
                                        <fp-icon name="share" class="fp-fs-18" />
                                        Share Profile
                                    </a>
                                    <a v-if="!isMyDetail" href="javascript:;" class="dropdown-item" @click.prevent="report()">
                                        <fp-icon name="flag" class="fp-fs-18" />
                                        Report Profile
                                    </a>
                                    <a v-if="auth_user && !isMyDetail" href="javascript:;" class="dropdown-item" @click="blockUser()">
                                        <fp-icon name="ban" class="fp-fs-18" />
                                        {{ user.is_blocked ? 'Unblock' : 'Block'}}
                                    </a>
                                </div>
                            </div>
                            <a v-if="profile_option && profile_option.visible_detail"
                                 href="javascript:;"
                                 class="d-md-none"
                                 @click="$refs.lifeStyleModal.open()"
                            >
                                <fp-icon name="activity" class="fp-fs-24 fp-text-color-main" />
                            </a>
                        </div>
                    </div>
                    <div v-if="fliconn_profile && (fliconn_profile.facebook ||
                        fliconn_profile.twitter ||
                        fliconn_profile.linkedin ||
                        fliconn_profile.weblink)"
                        class="d-flex align-items-center mt-4 mb-3 follow-social"
                    >
                        Follow me:
                        <a v-if="fliconn_profile.facebook" :href="getValidUrl(fliconn_profile.facebook)" target="_blank" class="link-follow-social">
                            <fp-icon name="facebook-circle-fill" class="fp-fs-24" />
                        </a>
                        <a v-if="fliconn_profile.twitter" :href="getValidUrl(fliconn_profile.twitter)" target="_blank" class="link-follow-social">
                            <fp-icon name="twitter-circle-fill" class="fp-fs-24" />
                        </a>
                        <a v-if="fliconn_profile.linkedin" :href="getValidUrl(fliconn_profile.linkedin)" target="_blank" class="link-follow-social">
                            <fp-icon name="linkedin-circle-fill" class="fp-fs-28" />
                        </a>
                        <a v-if="fliconn_profile.weblink" :href="getValidUrl(fliconn_profile.weblink)" target="_blank" class="link-follow-social">
                            <fp-icon name="globe" class="fp-fs-24 fp-text-color-main" />
                        </a>
                    </div>
                </div>
                <div class="user-following d-flex">
                    <div class="user-followings text-center">
                        <fp-icon name="user-check" class="fp-fs-24 fp-text-color-main" />
                        <p class="mb-0">{{ user.following_count }} <span class="fp-text-color-main">Following</span></p>
                    </div>
                    <div class="user-followers text-center ml-md-4">
                        <fp-icon name="users-check" class="fp-fs-24 fp-text-color-main" />
                        <p class="mb-0">{{ user.followers_count }} <span class="fp-text-color-main">Followers</span></p>
                    </div>
                    <div v-if="fliconn_profile" class="user-posts text-center ml-md-4">
                        <fp-icon name="page" class="fp-fs-24 fp-text-color-main" />
                        <p class="mb-0">{{ fliconn_profile.user.posts_count }} <span class="fp-text-color-main">Posts</span></p>
                    </div>
                </div>
            </div>
        </div>

        <light-box ref="profileImageBox" :media="images" :show-light-box="false"></light-box>
        <fp-modal v-if="user"
             ref="basicInfoModal"
             name="basicInfoModal"
             title="Basic Information"
             :show-header="!user.blocked_me"
             :show-close-button="!user.blocked_me"
        >
            <h6 v-if="user.blocked_me" class="mb-0 text-center">
                <fp-icon name="alert-triangle" class="fp-fs-24 mt-n1" />
                {{ user.first_name }} has restricted or hidden their information
            </h6>
            <basic-information v-else :user="user" @updated="basicInfoUpdated()" />
        </fp-modal>
        <fp-modal v-if="user" ref="lifeStyleModal" name="lifeStyleModal" title="Lifestyle">
            <lifestyle v-if="!!fliconn_profile"
                 :isAccountPage="true"
                 :user="user"
                 :profile="fliconn_profile"
                 @updated="getDetail"
            />
        </fp-modal>
        <modal-about-me v-if="isMyDetail"
             ref="modalAboutMe"
        />
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import Swal from "sweetalert2";
    import ProfileStatus from "../ProfileStatus.vue";
    import FpModal from "~/components/ui/Modal.vue";
    import LightBox from "vue-it-bigger";
    import BasicInformation from "./BasicInformation.vue";
    import("vue-it-bigger/dist/vue-it-bigger.min.css");
    import ProfilePhotoEditor from "./ProfilePhotoEditor.vue";
    import ModalAboutMe from './ModalAboutMe.vue';
    import Lifestyle from "./Lifestyle.vue"
    import ProfilePhotoOutlineImage from '~/assets/images/outline_profile_photo.png'
    export default {
        name: "ProfileUserCard",
        props: ["user_id", "page"],
        components: {
            ProfileStatus,
            LightBox,
            BasicInformation,
            ProfilePhotoEditor,
            ModalAboutMe,
            FpModal,
            Lifestyle,
        },
        data() {
            return {
                user: null,
                profile: {},
                fliconn_profile: null,
                showAddress: true,

                progress: 0,
                editor_mode: null,
                edit_email: false,
                edit_phone_number: false,
                edit_dob: false,
                disabledDates: {
                    from: new Date(),
                },
            };
        },
        computed: {
            isMyDetail() {
                return this.auth_user && this.auth_user.id === this.user_id;
            },
            profileLink() {
                return `${process.env.serverUrl}${this.$route.fullPath}`;
            },
            images() {
                let images = [];
                if (this.user) {
                    images.push({
                        caption: null,
                        src: this.user.photo_url,
                        thumb: this.user.photo_url,
                        type: "image",
                    });
                    if (this.user.cover_image) {
                        images.push({
                            caption: null,
                            src: this.user.cover_image_url,
                            thumb: this.user.cover_image_url,
                            type: "image",
                        });
                    }
                }
                return images;
            },
            profilePhotoOutlineImage() {
                return ProfilePhotoOutlineImage;
            },
            ...mapGetters({
                auth_user: "auth/user",
                profile_option: "fliconn/profile_option",
            }),
        },
        watch: {
            user_id: function () {
                this.getDetail();
            },
        },
        mounted() {
            this.getDetail();
            this.$store.dispatch("fliconn/getProfileOption", this.user_id);
        },
        methods: {
            openDetailModal() {
                this.$refs.modalAboutMe.open();
            },
            async getDetail() {
                const response = await this.axios.post(`/user/get_detail`, {
                    id: this.user_id,
                });
                this.user = response.data.data;

                if (!this.user.location && this.auth_user.id == this.user_id) {
                    this.getCurrentLocation();
                }
                const profile_res = await this.axios.post(`${process.env.timelineApiUrl}/profile/get`, { user_id: this.user_id });
                this.fliconn_profile = profile_res.data.data;
            },
            getCurrentLocation() {
                if (this.auth_user.id != this.user_id) return false;
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
                            this.user.location = response.data.data;
                        });
                        this.showAddress = true;
                    }
                });
            },
            async follow() {
                if (!this.auth_user) return this.$login(this.$route.path);
                await this.proceedFollow();
            },
            async unfollow() {
                const response = await this.axios.post(`/user/unfollow`, {
                    user_id: this.user_id,
                    follower_id: this.auth_user.id,
                });
                if (response.data.status === "Success") {
                    this.$toast.success("Unfollowed successfully!");
                    this.getDetail();
                }
            },
            async proceedFollow() {
                const data = await this.$store.dispatch("requestFollow", this.user_id);
                if (data.status === "Success") {
                    let notiFb = this.$fire.database.ref("notifications/" + this.user_id).push();
                    notiFb.set({ notifier_id: this.auth_user.id, type: "follow_request" });
                    this.$fpSuccess(data.message);
                    this.getDetail();
                    this.$emit("follow");
                }
            },
            async openChat() {
                if (this.auth_user) {
                    if (this.auth_user.id === this.user_id) return false;
                    if (this.user.is_requested_follow) return false;
                    if (!this.user.is_following) {
                        const res = await this.confirmFollow();
                        if (res.isConfirmed) {
                            await this.proceedFollow();
                        }
                        return false;
                    }
                    if (!this.$store.getters.enable_chat) {
                        this.$store.dispatch("setEnableChat", true);
                    }
                    let payload = {
                        user_id: this.user_id,
                        is_online: this.user.is_online,
                    }
                    this.$store.dispatch("message/openUserChatBox", payload);
                } else {
                    this.$login(this.$route.path);
                }
            },
            confirmFollow() {
                return new Promise(async (resolve) => {
                    const result = await Swal.fire({
                        title: `Follow ${this.user.first_name} to send a message`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Follow",
                        cancelButtonText: "Cancel",
                    });
                    resolve(result);
                });
            },
            cancelRequest() {
                Swal.fire({
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios
                            .post(`/user/follow_requests/delete`, {
                                user_id: this.user_id,
                                type: "sent",
                            })
                            .then((response) => {
                                if (response.data.status == "Success") {
                                    this.getDetail();
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
            },
            openGallery(type) {
                let index = type === "cover_image" && this.user.cover_image ? 1 : 0;
                this.$refs.profileImageBox.showImage(index);
            },
            openBasicInfo() {
                this.$refs.basicInfoModal.open();
            },
            imageUpdated() {
                this.getDetail();
                this.$store.dispatch('auth/fetchUser');
            },
            getValidUrl(url) {
                if (!url.startsWith('http')) {
                    url = 'https://' + url;
                }
                return url;
            },
            basicInfoUpdated() {
                this.getDetail();
                this.$refs.basicInfoModal.close()
            },
            share() {
                const payload = {
                    model: 'user',
                    id: this.user.id,
                    url: this.profileLink,
                }
                this.$share(payload);
            },
            report() {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                const payload = {
                    url: '/report',
                    params: {
                        id: this.user.id,
                        model: 'user',
                    },
                }
                this.$report(payload);
            },
            async blockUser() {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                const response = await this.axios.post('user/block_user', {user_id: this.user.id});
                if (response.data.status === 'Success') {
                    this.user.is_blocked = response.data.data;
                    this.$fpSuccess(`You have ${this.user.is_blocked ? 'blocked' : 'unblocked'} this user successfully!`);
                }
            }
        },
    };
</script>
<style lang="scss" scoped>
    .cover-image-wrapper {
        position: relative;
        min-height: 270px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f8f8;
        border-radius: 10px 10px 0 0;
        img.cover-image {
            width: 100%;
            height: 270px;
            object-fit: cover;
            display: block;
            border-radius: 10px 10px 0 0;
        }

        .cover-image-editor {
            position: absolute;
            bottom: 20px;
            right: 20px;
            @media (max-width: 768px) {
                top: 10px;
                right: 10px;
                bottom: unset;
            }
        }
    }
    .user-photo {
        margin-top: -65px;
        .photo {
            width: 130px;
            height: 130px;
            margin: 0 auto;
            position: relative;
            background-size: 65px 130px;
            background-repeat: no-repeat;
            padding: 8px;
            img {
                width: 100%;
                height: 100%;
                border-style: solid;
                border-width: 4px;
                border-radius: 100%;
                object-fit: cover;
            }
            .photo-image-editor {
                position: absolute;
                bottom: 12px;
                right: 12px;
                display: flex;
                align-items: center;
                .btn-profile-img {
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 25px;
                    height: 25px;
                    border-style: solid;
                    border-width: 3px;
                    border-radius: 100%;
                    background: #FF22A1;
                    color: #fff;
                }
            }
        }
        .name {
            font-weight: 500;
            font-size: 18px;
            margin-top: 8px;
            margin-bottom: 0;
        }
        .username {
            color: #64748B;
            margin-bottom: 0;
        }
    }

    .user-following {
        @media (min-width: 601px) {
            float: right;
            position: relative;
            z-index: 1;
            margin-top: -105px;
        }
        @media (max-width: 600px) {
            margin-top: 12px;
            justify-content: space-between;
        }
    }

    .user-buttons {
        @media (min-width: 601px) {
            float: left;
            position: relative;
            z-index: 1;
            margin-top: -105px;
        }
        .actions {
            display: flex;
            align-items: center;
            button {
                text-align: center;
                width: 132px;
            }
            .dropdown-toggle::after {
                display: none;
            }
        }
    }

    @media (max-width: 720px) {
        .user-data {
            order: 1;
        }
    }

    .user-link {
        padding: 6px 8px;
        background: #007bff;
        color: #fff;
        text-decoration: none;
        text-align: center;
        font-weight: 500;
        cursor: pointer;
        & + .user-link {
            margin-left: 3px;
        }
    }
    .btn-message {
        color: #28a745;
        padding: 7px 20px 5px;
        background: transparent;
        border: solid 1px #28a745;
        font-weight: 500;
        text-decoration: none;
        border-radius: 10px;
        cursor: pointer;
        &:hover {
            text-decoration: none;
        }
    }
    .location-input {
        position: relative;
        &::v-deep {
            .pac-target-input {
                padding-left: 28px;
            }
        }
        .current-location-selector {
            position: absolute;
            top: 12px;
            left: 25px;
            color: #007bff;
            cursor: pointer;
        }
    }
    .btn-add {
        color: #28a745;
        border: none;
        border-radius: 100px;
        &:focus {
            outline: none;
        }
        &:disabled,
        &[disabled] {
            opacity: 0.5;
        }
    }
    .icon-details {
        width: 18px;
    }
    .user-data {
        .detail-item {
            display: inline-block;
            padding: 0 4px;
            border-right: solid 1.5px #212529;
            line-height: 1;
            color: #007bff;
            &:first-child {
                padding-left: 0;
            }
            &:last-child {
                border-right: none;
            }
        }
    }
    .follow-link {
        margin-right: -5px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        min-width: 100px;
        padding: 0 5px 0 5px;
        height: 40px;
        border-radius: 10px;
        background: #004080;
        color: white;
        text-decoration: none;
        &.active {
            background: rgba(40, 167, 69, 1);
            color: white;
        }
        .message-count {
            position: absolute;
            font-size: 13px;
            padding: 2px 5px;
            top: -3px;
            right: -15px;
        }
        img {
            height: 24px;
        }
        @media (max-width: 400px) {
            width: 60px;
            height: 36px;
            img {
                height: 22px;
            }
        }
        h6 {
            @media (min-width: 900px) {
                display: block;
                padding: 8px 5px 0 5px;
            }
            display: none;
        }
    }
    .user-card {
        border: none;
    }
    .follow-social {
        font-size: 16px;
        font-weight: 600;
        .link-follow-social {
            color: #212529;
            margin-left: 16px;
        }
    }

</style>
