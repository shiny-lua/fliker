<template>
    <div class="profile-photo-editor">
        <div class="dropdown">
            <a href="javascript:;" class="dropdown-toggle d-block no-caret" data-toggle="dropdown">
                <slot></slot>
            </a>
            <div class="dropdown-menu mt-0">
                <a v-if="galleries_total > 0" href="javascript:;" class="dropdown-item fp-border-color-1" @click.prevent="$refs.galleryModal.open()">
                    <fp-icon name="image-gallery" />
                    Choose Image
                </a>
                <label class="dropdown-item fp-border-color-1 mb-0">
                    <fp-icon name="upload" />
                    Upload Image
                    <input type="file" hidden accept="image/*" @change="handleFile" />
                </label>
                <a v-if="hasImage"
                     href="javascript:;"
                     class="dropdown-item fp-border-color-1"
                     @click.prevent="mode === 'cover' ? removeCoverImage() : removeProfileImage()"
                >
                    <fp-icon name="trash" />
                    Remove
                </a>
            </div>
        </div>
        <fp-image-editor ref="imageEditor"
            :src="imageData"
            @save="updateImage"
        />
        <fp-modal ref="galleryModal"
             :name="galleryModalName"
             :height="380"
             :show-close-button="false"
             :show-header="false"
        >
            <div class="editor-gallery">
                <div class="row mx-n1">
                    <div v-for="(item, index) in galleries" :key="index" class="col-md-4 col-lg-3 px-1 mb-2">
                        <div class="media-container" @click="selectImage(item)">
                            <img :src="item.thumb" width="100%" height="100%" class="gallery-image" alt="">
                        </div>
                    </div>
                </div>
                <infinite-loading
                    :distance="200"
                    force-use-infinite-wrapper=".editor-gallery"
                    :identifier="infiniteId"
                    @infinite="loadGallery"
                >
                    <div slot="no-more"></div>
                    <div class="text-center text-muted" slot="no-results">Gallery is empty</div>
                </infinite-loading>
            </div>
        </fp-modal>
    </div>
</template>
<script>
import Swal from "sweetalert2";
import FpImageEditor from "~/components/ui/FpImageEditor.vue";
import FpModal from "~/components/ui/Modal.vue";

export default {
    name: 'ProfilePhotoEditor',
    props: {
        mode: { type: String, default: 'photo' },
    },
    components: {
        FpImageEditor,
        FpModal,
    },
    data() {
        return {
            imageData: null,
            galleries: [],
            page_gallery: 1,
            infiniteId: +new Date(),
            galleries_total: 0,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        hasImage() {
            if (this.mode === 'cover') return !!this.auth_user.cover_image;
            if (this.mode === 'photo') return !this.auth_user.photo_url.includes('gravatar');
        },
        galleryModalName() {
            return `gallery_modal_${this.mode}_${Math.round(Math.random() * 1000000)}`;
        }
    },
    mounted() {
        this.getGalleryTotal();
    },
    methods: {
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
        imageUpdated() {
            this.$emit('updated');
            this.$store.dispatch('auth/fetchUser');
        },
        removeCoverImage() {
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
                                this.$fpSuccess('Profile wallpaper deleted successfully!');
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        removeProfileImage() {
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
                                this.$fpSuccess('Profile picture deleted successfully!');
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
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
        },
        async loadGallery($state) {
            const params = {
                user_id: this.auth_user.id,
                type: 'image',
                page: this.page_gallery,
                per_page: 12
            }
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_user_gallery`, params)
                if (response.data.status === 'Success') {
                    let result = response.data.data
                    if (result.galleries.current_page === 1) {
                        this.galleries = [];
                    }
                    if (result.media.length) {
                        this.galleries.push(...result.media);
                        this.page_gallery++;
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            } catch (error) { }
        },
        async getGalleryTotal() {
            const params = {
                user_id: this.auth_user.id,
                type: 'image',
                page: 1,
                per_page: 12
            }
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_user_gallery`, params)
                if (response.data.status === 'Success') {
                    let result = response.data.data
                    this.galleries_total = result.galleries.total;
                }
            } catch (error) { }
        },
        async selectImage(image) {
            this.imageData = image.src;
            await this.$nextTick();
            this.$refs.imageEditor.open();
            this.$refs.galleryModal.close();
        }
    }
}
</script>
<style lang="scss" scoped>
    .profile-photo-editor {
        .dropdown-menu {
            padding-top: 4px;
            padding-bottom: 4px;
            .dropdown-item {
            font-size: 14.4px;
                padding: 8px 0;
                border-bottom-style: solid;
                border-bottom-width: 1px;
                cursor: pointer;
                &:last-child {
                    border-bottom: none;
                }
                svg {
                    font-size: 18px;
                }
            }
        }
        .editor-gallery {
            height: 365px;
            overflow: auto;
            &::-webkit-scrollbar {
                width: 0;
            }
            .media-container {
                position: relative;
                padding-bottom: 100%;
            }
            .gallery-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 6px;
            }
        }
    }
</style>