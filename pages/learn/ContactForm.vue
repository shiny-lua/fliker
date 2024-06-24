<template>
    <div class="contact-form mt-4">
        <form action="" @submit.prevent="submit">
            <div class="row mx-n2">
                <div class="col-md-6 px-2 mb-3">
                    <label for="" class="">First Name <span class="text-danger">*</span></label>
                    <input v-model="form.first_name" type="text" class="form-control" :class="{ 'is-invalid': form.errors.has('first_name') }" placeholder="Enter First Name" required maxlength="50" />
                    <has-error :form="form" field="first_name" />
                </div>
                <div class="col-md-6 px-2 mb-3">
                    <label for="" class="">Last Name <span class="text-danger">*</span></label>
                    <input v-model="form.last_name" type="text" class="form-control" :class="{ 'is-invalid': form.errors.has('last_name') }" placeholder="Enter Last Name" required maxlength="50" />
                    <has-error :form="form" field="last_name" />
                </div>
            </div>
            <div class="row mx-n2">
                <div class="col-md-6 mb-3 px-2">
                    <label for="" class="">Email <span class="text-danger">*</span></label>
                    <input v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" placeholder="Enter Your Email" required maxlength="=200" />
                    <has-error :form="form" field="email" />
                </div>
                <div v-if="mode === 'careers'" class="col-md-6 mb-3 px-2">
                    <label for="" class="">Phone <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.phone_number" class="form-control" :class="{ 'is-invalid': form.errors.has('phone_number') }" placeholder="Enter Your Phone" required maxlength="20" />
                    <has-error :form="form" field="phone_number" />
                </div>
                <div v-if="mode === 'contact'" class="col-md-6 mb-3 px-2">
                    <label for="" class="">Select the issue <span class="text-danger">*</span></label>
                    <select v-model="form.issue" class="form-control" :class="{ 'is-invalid': form.errors.has('issue') }" required>
                        <option value="" hidden>Select the issue</option>
                        <option value="Related to Account">Related to Account</option>
                        <option value="Related to Content Posted">Related to Content Posted</option>
                        <option value="Related to Payments">Related to Payments</option>
                        <option value="Related to Automotive Profile">Related to Automotive Profile</option>
                        <option value="Related to Merchant Profile">Related to Merchant Profile</option>
                    </select>
                    <has-error :form="form" field="issue" />
                </div>
                <div v-if="mode === 'report'" class="col-md-6 mb-3 px-2">
                    <label for="" class="">Issue Type <span class="text-danger">*</span></label>
                    <select v-model="form.issue" class="form-control" :class="{ 'is-invalid': form.errors.has('issue') }" required>
                        <option value="" hidden>Select the issue type</option>
                        <option value="Report an account">Report an account</option>
                        <option value="Report an abuse">Report an abuse</option>
                        <option value="Report a bug / Something not working?">Report a bug / Something not working?</option>
                        <option value="Report a scam">Report a scam</option>
                        <option value="Other">Other</option>
                    </select>
                    <has-error :form="form" field="issue" />
                </div>
            </div>
            <div class="form-group mb-3">
                <label for="" class="">{{messageLabel}} <span class="text-danger">*</span></label>
                <textarea v-model="form.message"
                     rows="5"
                     class="form-control"
                     :class="{ 'is-invalid': form.errors.has('message') }"
                     required
                     :placeholder="messagePlaceholder"
                ></textarea>
                <has-error :form="form" field="message" />
            </div>
            <div>
                <label class="btn fp-btn-outline mb-0">
                    <fp-icon name="upload" class="fp-fs-20 fp-text-active" />
                    {{mode === 'careers' ? 'Resume' : 'Upload'}}
                    <input v-if="mode === 'careers'" type="file" name="file" @change="handleFile" hidden :accept="acceptsCareers" />
                    <input v-else type="file" name="file" multiple @change="handleFiles" hidden accept="image/*" />
                </label>
                <button type="submit" class="btn fp-btn-gradient px-4 ml-3" :class="{'btn-loading': form.busy}" :disabled="form.busy">Submit</button>
            </div>
            <div>
                <span class="fp-text-color-main" style="font-size: 12px;">{{mode === 'careers' ? '* Select word or pdf format' : '* Select up to 5 images'}}</span>
                <p v-if="mode === 'careers' && fileName" class="fp-text-color-info">{{ fileName }}</p>
                <div v-if="mode != 'careers' && previews.length" class="d-flex">
                    <img v-for="(img, index) in previews" :key="index" :src="img" width="40" height="40" class="rounded object-fit-cover mr-1" alt="" />
                </div>
                <has-error v-if="mode === 'careers'" :form="form" field="file" />
                <has-error v-else :form="form" field="files" />
            </div>
        </form>
    </div>
</template>
<script>
import Form from "vform"
export default {
    name: 'ContactForm',
    props: {
        url: { type: String, required: true },
        mode: { type: String, default: 'contact' }
    },
    data() {
        return {
            form: new Form({
                first_name: '',
                last_name: '',
                email: '',
                phone_number: '',
                message: '',
                issue: '',
                file: null,
                files: null,
            }),
            acceptsCareers: `application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/pdf,`,
            fileName: '',
            previews: [],
        };
    },
    computed: {
        messageLabel() {
            if (this.mode === 'contact') {
                return 'Details';
            }
            if (this.mode ==='report') {
                return 'Message';
            }
            if (this.mode === 'careers') {
                return 'About You';
            }
        },
        messagePlaceholder() {
            if (this.mode === 'contact') {
                return 'Describe the issue briefly';
            } else {
                return 'Message';
            }
        },
    },
    methods: {
        submit() {
            this.form.post(this.url).then(response => {
                this.$toast.success('Message sent successfully. We will get back shortly.');
                this.form.reset();
                this.previews = [];
                this.fileName = '';
            });
        },
        handleFile (event) {
            const file = event.target.files[0]
            this.form.file = file;
            this.fileName = file.name;
        },
        handleFiles(event) {
            const files = event.target.files;
            if (files.length > 5) {
                this.$toast.error('You can only upload up to 5 images');
                return;
            }
            this.form.files = files;
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.previews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .contact-form {
        @media (max-width: 600px) {
            border: none;
        }
    }
    .uploader {
        font-size: 16px;
        margin-top: 8px;
    }
</style>