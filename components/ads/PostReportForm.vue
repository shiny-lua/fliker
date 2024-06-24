<template>
    <form action="" @submit.prevent="submitFeedback">
        <div class="form-group">
            <label>Post ID <span class="text-danger">*</span></label>
            <input type="text" class="form-control" :class="{ 'is-invalid': contact_form.errors.has('post_id') }" readonly v-model="contact_form.post_id" placeholder="Post ID" />
            <has-error :form="contact_form" field="post_id" />
        </div>
        <div class="row mx-n2">
            <div class="col-md-6 px-2 form-group">
                <label>Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{ 'is-invalid': contact_form.errors.has('name') }" v-model="contact_form.name" placeholder="Enter full name" maxlength="50" />
                <has-error :form="contact_form" field="name" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label>Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" :class="{ 'is-invalid': contact_form.errors.has('email') }" v-model="contact_form.email" placeholder="Enter email address" maxlength="100" />
                <has-error :form="contact_form" field="email" />
            </div>
        </div>
        <div class="form-group mb-0">
            <label>Message <span class="text-danger">*</span></label>
            <textarea rows="5" class="form-control" :class="{ 'is-invalid': contact_form.errors.has('message') }" v-model="contact_form.message" maxlength="1000" placeholder="Enter short message"></textarea>
            <p class="text-right text-muted mb-0">{{contact_form.message ? contact_form.message.length : 0}}/ 1000</p>
            <has-error :form="contact_form" field="message" />
        </div>
        <div>
            <label class="btn fp-btn-outline mb-0">
                <fp-icon name="upload" class="fp-fs-20 fp-text-active" />
                Upload
                <input type="file" name="file" @change="handleFile" multiple hidden accept="image/*, video/*" />
            </label>
            <button type="submit" class="btn fp-btn-gradient px-4 ml-3" :class="{'btn-loading': contact_form.busy}" :disabled="contact_form.busy">Submit</button>
        </div>
        <div class="row mt-3 mx-n1 align-items-stretch" v-if="emailFiles.length">
            <div class="col-4 image-container px-1" style="max-height: 120px;" v-for="(img, index) in emailFiles" :key="index">
                <a href="javascript:;" class="btn-remove-image btn-sm" @click="removeEmailFile(index)">
                    <fp-icon name="trash" />
                </a>
                <div class="video" v-if="checkVideo(img)">
                    <video :src="img" width="100%" height="100%"></video>
                </div>
                <img v-else-if="img.includes('data:image')" :src="img" alt="" width="100%" height="100%" />
            </div>
        </div>
    </form>
</template>
<script>
import Form from "vform"
export default {
    name: 'PostReportForm',
    props: {
        post_id: { type: [String, Number], required: true },
    },
    data() {
        return {
            contact_form: new Form({
                post_id: this.post_id,
                name: '',
                email: '',
                message: '',
                file: null,
            }),
            emailFiles: [],
        };
    },
    methods: {
        async submitFeedback() {
            const response = await this.contact_form.post(`/report_scam_issue`);
            if (response.data.status === 'Success') {
                this.$fpSuccess('Message sent successfully. We will get back shortly.');
                this.$emit('sent');
            };
        },
        handleFile (event) {
            if (event.target.files.length > 5) {
                this.$toast.error('You can upload max 5 files.');
                return false
            }
            const files = event.target.files
            this.emailFiles = []
            Array.from(files).forEach(file => {
                if (file.size > 10485760) {
                    this.$toast.error('Sorry! Maximum allowed size is 10MB')
                    this.emailFiles = []
                    return false
                }
                let reader = new FileReader();
                reader.onload = e => {
                    this.emailFiles.push(e.target.result);
                };
                reader.readAsDataURL(file);
            })
            this.contact_form.file = files;
        },
        checkVideo(data) {
            return data.includes('video') || data.includes('.mp4') || data.includes('.3gp')
        },
        removeEmailFile(index) {
            this.emailFiles.splice(index, 1);
            let imageArray = Array.from(this.contact_form.file);
            imageArray.splice(index, 1);
            this.contact_form.file = imageArray
        },
    }
}
</script>
<style lang="scss" scoped>
    .uploader {
        font-size: 16px;
        margin-top: 8px;
    }
</style>