<template>
    <div>
        <form action="" method="post" @submit.prevent="submit">
            <div class="form-group">
                <label for="">Tag Name</label>
                <input type="text" class="form-control tag-input" v-model="form.name" placeholder="Ex. Covid-19 precautions" maxlength="30" required />
                <has-error :form="form" field="name" />
            </div>
            <div class="form-group">
                <label for="">What is this tag about?</label>
                <textarea class="form-control tag-input" rows="5" v-model="form.description" placeholder=" " maxlength="500"></textarea>
                <p class="text-right text-muted mb-0">{{ form.description ? form.description.length : 0}}/ 500</p>
            </div>
            <div class="mb-3">
                <label class="cover-image">
                    <a href="javascript:;" class="btn-delete ml-2" title="Delete" @click.prevent="removeImage" v-if="imageData">
                        <fa :icon="['far', 'trash-alt']" />
                    </a>
                    <img :src="imageData" alt="" v-if="imageData" />
                    <h6 class="text-center" v-else>
                        <fp-icon name="upload" style="font-size: 36px;color: #FF22A1;" />
                        <br />
                        Click here to upload image
                    </h6>
                    <input type="file" name="image" @change="handleFile" hidden accept="image/*" />
                </label>
                <div class="text-center mt-3" v-if="form.progress && form.image">
                    <div class="progress mx-auto" style="height: 8px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{width:`${form.progress.percentage}%`}"></div>
                    </div>
                    <p class="mt-1">{{form.progress.percentage}}% uploaded... please wait</p>
                </div>
            </div>
            <div v-if="mode === 'add'" class="custom-control custom-checkbox mb-3">
                <input type="checkbox" class="custom-control-input" :class="{invalid: form.errors.has('is_accepted')}" id="is_accepted" name="accept" v-model="form.is_accepted" />
                <label class="custom-control-label fp-text-color-main" for="is_accepted">I have read and accept the <router-link :to="{name: 'terms_of_use'}" class="fp-text-active" target="_blank">Terms of use</router-link> and <router-link :to="{name: 'privacy_policies'}" class="fp-text-active" target="_blank">Privacy policy</router-link></label>
            </div>
            <div>
                <button type="button" class="btn fp-btn-outline" @click="$router.back()">Cancel</button>
                <button type="submit" class="btn fp-btn-gradient ml-2" :class="form.busy && 'btn-loading'" :disabled="form.busy || !form.is_accepted">{{mode === 'edit' ? 'Update' : 'Create'}}</button>
            </div>
        </form>
    </div>
</template>
<script>
import Form from "vform"
export default {
    name: 'TopicForm',
    props: {
        mode: {type: String, default: 'add'},
        topic: {type: Object, default: null},
    },
    data: () => ({
        form: new Form({
            id: '',
            name: '',
            description: '',
            is_accepted: false,
            image: null,
        }),
        imageData: null,
    }),
    mounted() {
        if (this.mode == 'edit') {
            this.form.id = this.topic.id
            this.form.name = this.topic.name
            this.form.description = this.topic.description
            if (this.topic.image) {
                this.imageData = this.topic.image.src_url;
            }
        }
    },
    methods: {
        submit() {
            this.form.post(`${process.env.topicsApiUrl}/topic/save_topic`).then(response => {
                this.form.reset()
                this.$router.push({name: 'topic'})
            });
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
    }
}
</script>
<style lang="scss" scoped>
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
        // background: linear-gradient(0deg, rgba(40, 167, 69, 0.08), rgba(40, 167, 69, 0.08));
        background: #FF22A114;
        border-radius: 10px;
        cursor: pointer;
        overflow: hidden;
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
            background-color: #004080;
            padding: 2px 5px 0;
            color: #FFF;
            border-radius: 4px;
        }
    }
    .tag-input::placeholder {
        color: #bbbbbb;
    }
</style>