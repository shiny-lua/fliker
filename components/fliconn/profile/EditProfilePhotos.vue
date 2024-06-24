<template>
    <div class="edit-profile-photos">
        <div class="top-modal fp-modal">
            <modal :name="modalName"
                 :width="300"
                 height="auto"
            >
                <div v-if="mode" class="p-3">
                    <label class="btn fp-btn-danger btn-block mb-2" :for="modalName">
                        <fa :icon="['far', 'edit']" />
                        {{ mode === 'cover' ? 'Change Cover Photo' : 'Change Profile Picture'}}
                    </label>
                    <a href="javascript:;" class="btn fp-btn-danger btn-block" @click.prevent="mode === 'cover' ? removeCoverImage() : removeProfileImage()">
                        <fa :icon="['far', 'trash-alt']" />
                        {{ mode === 'cover' ? 'Delete Cover Photo' : 'Delete Profile Picture'}}
                    </a>
                </div>
                <div v-else class="p-3">
                    <a href="javascript:;" class="btn fp-btn-outline hoverable btn-block mb-2" @click.prevent="open('profile')">
                        Profile Picture
                    </a>
                    <a href="javascript:;" class="btn fp-btn-outline hoverable btn-block" @click.prevent="open('cover')">
                        Wallpaper
                    </a>
                </div>
            </modal>
        </div>
        <input type="file" hidden accept="image/*" @change="handleFile" :id="modalName" ref="imageEditInput" />
        <fp-image-editor ref="imageEditor"
             :src="imageData"
             @save="updateImage"
        />
    </div>
</template>
<script>
import Swal from "sweetalert2";
import FpImageEditor from "~/components/ui/FpImageEditor.vue";
export default {
    name: 'EditProfilePhotos',
    components: {
        FpImageEditor,
    },
    data() {
        return {
            mode: '',
            modalName: `edit_picture_modal_${Math.random()}`,
            imageData: '',
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    methods: {
        async open(mode = '') {
            this.mode = mode;
            await this.$nextTick();
            if ((this.mode === 'cover' && !this.auth_user.cover_image) || (this.mode === 'profile' && this.auth_user.photo_url.includes('gravatar'))) {
                this.$refs.imageEditInput.click();
                this.$modal.hide(this.modalName);
            } else {
                this.$modal.show(this.modalName);
            }
        },
        removeCoverImage() {
            this.$modal.hide(this.modalName);
            Swal.fire({
                title: "Do you really want to delete cover photo?",
                icon: "warning",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    let params = {
                        id: this.auth_user.id,
                    };
                    this.axios
                        .post(`/user/remove_cover_image`, params)
                        .then((response) => {
                            if (response.data.status == "Success") {
                                this.imageUpdated();
                                this.$toast.danger('Profile wallpaper deleted successfully!');
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        removeProfileImage() {
            this.$modal.hide(this.modalName);
            Swal.fire({
                title: "Do you really want to delete profile photo?",
                icon: "warning",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    let params = {
                        id: this.auth_user.id,
                    };
                    this.axios.post(`/user/remove_profile_image`, params).then((response) => {
                            if (response.data.status == "Success") {
                                this.imageUpdated();
                                this.$toast.danger('Profile picture deleted successfully!');
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        imageUpdated() {
            this.$emit('updated');
            this.$store.dispatch('auth/fetchUser');
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
        async updateImage(imageData) {
            const payload = {
                mode: this.mode,
                data: imageData,
            };
            const response = await this.axios.post('/user/update_user_image', payload);
            if (response.data.status === "Success") {
                const message = this.mode === 'cover' ? 'Profile wallpaper changed successfully!' : 'Profile picture changed successfully!';
                this.$fpSuccess(message);
                this.imageUpdated();
            }
        }
    }
}
</script>