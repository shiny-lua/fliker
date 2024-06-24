<template>
    <div class="user-gallery fp-card p-2"
         :class="{
            'account-gallery': isAccountPage,
            'd-none': !isAccountPage && this.loaded && galleries.length === 0,
         }"
    >
        <div class="d-flex align-items-center mb-0">
            <h6 v-if="!isAccountPage" class="mb-1">Gallery</h6>
            <label v-else-if="isMyGallery" class="gallery-uploader fp-text-active mb-2 cursor-pointer">
                <fa icon="camera" />
                <span class="text-underline" style="font-size: 15px;">Add new Gallery</span>
                <input type="file" hidden multiple accept="image/*, video/*" @change="handleFiles" />
            </label>
        </div>

        <div>
            <div :class="`row fliconn-media mx-n1 count-${galleries.length}`" v-if="galleries.length">
                <div v-for="(image, index) in galleries"
                    :key="index" class="px-1 mb-2"
                    :class="col_class(index)"
                >
                    <div class="media zoom zoom-12">
                        <video
                            :src="image.src"
                            width="100%"
                            height="100%"
                            v-if="image.type == 'video'"
                            @click="openGallery(index)"
                        >
                            <source :src="image.src" type="video/mp4" />
                        </video>
                        <img
                            :src="image.thumb"
                            alt=""
                            width="100%"
                            height="100%"
                            @click="openGallery(index)"
                            v-else
                        />
                        <a v-if="isAccountPage && isMyGallery" href="javascript:;" class="btn-remove-image" @click.prevent="remove(image, index)">
                            <fp-icon name="trash" />
                        </a>
                    </div>
                </div>
            </div>
            <div v-if="auth_user && !isAccountPage && total > 9" class="text-right">
                <router-link :to="{name: 'fliconn.profile', params: {username: auth_user.username}, query: {tab: 'gallery'}}">more...</router-link>
            </div>
            <infinite-loading
                :distance="300"
                :identifier="infiniteId"
                @infinite="loadGallery"
            >
                <div slot="no-more"></div>
                <div class="text-center text-muted" slot="no-results">Gallery is empty</div>
            </infinite-loading>
        </div>

        <light-box
            ref="userGalleryBox"
            :media="galleries"
            :show-light-box="false"
        ></light-box>
        <uploading
            v-if="form.progress && form.progress.percentage"
            :progress="form.progress ? form.progress.percentage : 0"
            :success="form.successful"
            success-msg="Gallery updated successfully!"
        ></uploading>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import LightBox from 'vue-it-bigger'
import('vue-it-bigger/dist/vue-it-bigger.min.css')
import Form from "vform"
import Uploading from "~/components/elements/Uploading.vue"
export default {
    name: 'Gallery',
    props: {
        user_id: { type: Number, required: true },
        isAccountPage: { type: Boolean, default: false },
    },
    components: {
        LightBox,
        Uploading,
    },
    data() {
        return {
            galleries: [],
            loaded: false,
            per_page: this.isAccountPage ? 12 : 9,
            total: 0,
            page: 1,
            infiniteId: +new Date(),
            form: new Form({
                id: this.user_id,
                files: null,
            }),
        };
    },
    computed: {
        isMyGallery() {
           return this.auth_user && this.auth_user.id === this.user_id;
        },
        ...mapGetters({
            auth_user: 'auth/user',
        })
    },
    methods: {
        async loadGallery($state) {
            if (!this.isAccountPage && this.page > 1) {
                $state.complete();
                return false;
            }
            let params = {
                user_id: this.user_id,
                page: this.page,
                per_page: this.per_page
            }
            const response = await this.axios.post(`${process.env.timelineApiUrl}/fliconn/get_user_gallery`, params)
            if (response.data.status === 'Success') {
                let result = response.data.data
                if (result.galleries.current_page === 1) {
                    this.galleries = [];
                }
                if (result.media.length) {
                    this.galleries.push(...result.media);
                    this.page_count = result.galleries.last_page;
                    this.per_page = result.galleries.per_page;
                    this.total = result.galleries.total;
                    this.page++;
                    $state.loaded();
                } else {
                    $state.complete();
                }
                this.loaded = true
            }
        },
        openGallery(index) {
            this.$refs.userGalleryBox.showImage(index)
        },
        async handleFiles(event) {
            const files = event.target.files
            if (files.length > 15) {
                this.$toast.error('Upload maximum 15 images at a time!');
                return false;
            }
            this.form.files = files;
            await this.$nextTick()
            const response = await this.form.post(`${process.env.timelineApiUrl}/fliconn/upload_user_gallery`)
            if (response.data.status === 'Success') {
                this.page = 1;
                this.infiniteId++;
            }
        },
        async remove(item, index) {
            const response = await this.axios.delete(`${process.env.timelineApiUrl}/fliconn/gallery/delete/${item.id}`);
            if (response.data.status === 'Success') {
                this.galleries.splice(index, 1);
                this.$toast.success('Gallery deleted successfully!');
            }
        },
        col_class(index) {
            let division = this.isAccountPage ? 4 : 3;
            let gallery_length = this.galleries.length;
            let mod = gallery_length % division;
            if (mod === 0 || index <= (Math.floor(gallery_length / division) * division - 1)) {
                return this.isAccountPage ? 'col-4 col-lg-3' : 'col-4';
            } else if (mod === 1) {
                return 'col-12';
            } else if (mod === 2) {
                return 'col-6';
            } else {
                return 'col-4';
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    h6 {
        font-weight: 600;
    }
    .left-gallery {
        padding: 8px 10px;
        color: #FFF;
        background-color: #7092be;
        font-weight: 500;
        display: flex;
        align-items: center;
        h6 {
            color: #FFF;
        }
        label {
            color: #FFF;
            line-height: 20.63px;
        }
    }
    .user-gallery {
        .gallery-uploader {
            &::v-deep label {
                cursor: pointer;
            }
            @media (max-width: 600px) {
                background: unset;
                border: none;
                padding: 0;
                font-size: 20px;
            }
        }
    }
    .fliconn-media {
        .media {
            position: relative;
            padding-bottom: 100%;
            max-height: unset;
            margin-bottom: 0;
            img, video {
                position: absolute;
                object-fit: cover;
            }
            .btn-remove {
                position: absolute;
                top: 3px;
                right: 8px;
                background-color: #FFF;
                color: #dc3545;
                padding: 0 4px;
                border-radius: 4px;
                line-height: 22px;
            }
        }
    }
    .gallery-uploader {
        font-size: 18px;
    }
    .photo-title {
      background: #F5F5F5;
      border-radius: 5px;
      margin-bottom: 10px;
      align-items: center;
      height: 30px;
    }
    .photo_text {
      color: #007bff;
    }
</style>
