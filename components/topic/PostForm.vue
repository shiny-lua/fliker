<template>
    <form action="" method="post" @submit.prevent="submit">
        <div class="form-group">
            <label>Post Subject/Title</label>
            <input type="text" name="subject" class="form-control tag-input" v-model="form.subject" placeholder="Enter a short title..." required maxlength="120" />
            <has-error :form="form" field="subject" />
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="detail" rows="5" class="form-control tag-input" v-model="form.detail" maxlength="10000" placeholder="Write details here..."></textarea>
            <p class="mb-0 text-right text-muted">{{form.detail ? form.detail.length : 0}} / 10000</p>
        </div>
        <div class="mb-3">
            <label class="cover-image">
                <a href="javascript:;" class="btn-delete ml-2" title="Delete" @click.prevent="removeImage" v-if="imageData">
                    <fa :icon="['far', 'trash-alt']" />
                </a>
                <img :src="imageData" alt="" v-if="imageData" />
                <p class="text-center mb-0" v-else>
                    <fp-icon name="upload" style="font-size: 36px;color: #FF22A1;" />
                    <br />
                    Click here to upload image
                </p>
                <input type="file" name="image" @change="handleFile" hidden accept="image/*" />
            </label>
            <div class="text-center mt-3" v-if="form.progress && form.image">
                <div class="progress mx-auto" style="height: 8px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{width:`${form.progress.percentage}%`}"></div>
                </div>
                <p class="mt-1">{{form.progress.percentage}}% uploaded... please wait</p>
            </div>
        </div>
        <div class="row mb-3 mx-n2">
            <div class="col-md-6 tags-input-wrapper px-2">
                <label for="" class="mb-1">Choose Tag</label>
                <multiselect
                    v-model="selected_topic"
                    :options="topics"
                    :preserve-search="true"
                    placeholder="Ex. #technology, #business... etc"
                    track-by="id"
                    label="name"
                    :show-labels="false"
                ></multiselect>
                <has-error :form="form" field="tags" />
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-end mt-2 mt-md-0 px-2" style="padding-top: 21px;">
                <div class="post_as">
                    <div v-if="form.post_as === 'display_name'">
                        <img :src="auth_user.photo_url" alt="">&nbsp;
                        {{auth_user.name}}
                    </div>
                    <div v-if="form.post_as === 'private'">
                        <img src="~/assets/images/icons/anonymous.png" alt="">&nbsp;
                        Private
                    </div>
                </div>
               <div class="icon-prefix-input ml-3">
                    <fp-icon name="globe" class="fp-fs-18" />
                    <select v-model="form.post_as" :class="{ 'is-invalid': form.errors.has('post_as') }" name="post_as" required class="form-control has-bg">
                        <option value="display_name">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="custom-control custom-checkbox mb-3">
            <input type="checkbox" class="custom-control-input" :class="{invalid: form.errors.has('is_accepted')}" id="is_accepted" name="accept" v-model="form.is_accepted" />
            <label class="custom-control-label fp-text-color-main" for="is_accepted">I have read and accept the <router-link :to="{name: 'terms_of_use'}" class="fp-text-active" target="_blank">Terms of use</router-link> and <router-link :to="{name: 'privacy_policies'}" class="fp-text-active" target="_blank">Privacy policy</router-link></label>
        </div>
        <div>
            <button type="button" class="btn fp-btn-outline" @click="$router.back()">Cancel</button>
            <button type="submit" class="btn fp-btn-gradient ml-2 px-4" :class="form.busy && 'btn-loading'" :disabled="form.busy || !form.is_accepted">Post</button>
        </div>
    </form>
</template>
<script>
import Form from 'vform'
import {mapGetters} from "vuex"
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'
import "vue-multiselect/dist/vue-multiselect.min.css"

export default {
    props: ['mode', 'id'],
    components: {
        Multiselect,
    },
    data() {
        return {
            post: null,
            form: new Form({
                id: '',
                topic_id: '',
                subject: '',
                detail: '',
                post_as: 'display_name',
                image: null,
                is_accepted: false,
            }),
            imageData: null,
            selected_topic: null,
        };
    },
    computed: {
        description_words: function() {
            let description = this.form.detail?this.form.detail.replace(/\n/g, ' '):"";
            let arr = description.split(' ')
            return arr.filter(i => i !== '').length
        },
        ...mapGetters({
            auth_user: 'auth/user',
            topics: 'topics/topics',
        }),
    },
    mounted() {
        console.log('here is topics', this.topics)
        this.$store.dispatch('topics/getTopics');
        if (this.mode == 'edit') {
            this.getDetail();
        }
    },
    methods: {
        getDetail() {
            this.axios.post(`${process.env.topicsApiUrl}/topic/get_detail`, {id: this.id}).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    this.post = result
                    this.form.id = result.id
                    this.form.subject = result.subject
                    this.form.topic_id = result.topic_id
                    this.form.detail = result.detail
                    this.form.post_as = result.post_as
                    this.form.tags = result.tags
                    if (result.image) {
                        this.imageData = result.image.src_url;
                    }
                }
            })
        },
        submit() {
            if (!this.auth_user) return this.$login(this.$route.path);
            this.form.topic_id = this.selected_topic ? this.selected_topic.id : '';
            let uri = this.mode == 'edit' ? `${process.env.topicsApiUrl}/topic/update` : `${process.env.topicsApiUrl}/topic/create`;

            this.$showLoading();
            this.form.post(uri, {
                onUploadProgress: e => {
                    this.$store.dispatch('setLoadingPercent', Math.ceil(e.loaded * 100 / e.total));
                }
            }).then(response => {
                this.$hideLoading();
                if (response.data.status == 'Success') {
                    this.$fpSuccess(`Created Successfully!`);
                    this.reset();
                    this.$router.back();
                }
            }).catch(() => {
                this.$hideLoading();
                this.$toast.error("Sorry, something went wrong!");
            });
        },
        reset() {
            this.form.reset();
            this.imageData = null;
        },
        handleFile (event) {
            const file = event.target.files[0]
            this.form.image = file;
            if (!file) return false
            let reader = new FileReader();
            reader.onload = e => {
                this.imageData = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeImage() {
            if (this.imageData.includes('http') && this.post && this.post.image) {
                Swal.fire({
                    title: 'Are you sure?',
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Cancel'
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios.delete(`${process.env.topicsApiUrl}/topic/image/delete/${this.post.image.id}`).then(response =>{
                            if (response.data.status == 'Success') {
                                this.$toast.success('Deleted successfully');
                                this.imageData = null;
                                this.form.image = null;
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                });
            } else {
                this.imageData = null;
                this.form.image = null;
            }
        },
    },
}
</script>
<style lang="scss" scoped>
    .post_as {
        display: flex;
        align-items: center;
        font-size: 15px;
        img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
            object-fit: cover;
        }
        div {
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .cover-image {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 175px;
        max-height: 200px;
        position: relative;
        border: 1px dashed #FF22A1;
        background: #FF22A114;
        border-radius: 10px;
        cursor: pointer;
        overflow: hidden;
        font-weight: 400;
        font-size: 16px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .btn-delete {
            position: absolute;
            top: 3px;
            right: 3px;
            font-size: 14px;
            background-color: #FF22A1;
            padding: 2px 5px 0;
            color: #FFF;
            border-radius: 4px;
        }
    }
</style>