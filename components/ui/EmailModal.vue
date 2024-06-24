<template>
    <fp-modal ref="emailModal" :name="emailModalName"
        title="Send an Email"
    >
        <div v-if="form.successful" class="text-center">
            <fp-icon name="check-success" />
            <h4 class="fp-text-active">Email sent successfully</h4>
        </div>
        <div v-else>
            <form action="" method="post" @submit.prevent="sendEmail">
                <div class="row mx-n2">
                    <div class="col-md-6 form-group px-2">
                        <label for="">Name</label>
                        <input type="text" class="form-control" v-model="form.name" maxlength="60" placeholder="Enter your full name" />
                        <has-error :form="form" field="name" />
                    </div>
                    <div class="col-md-6 form-group px-2">
                        <label>Email</label>
                        <input type="email" class="form-control" v-model="form.email" maxlength="100" placeholder="Enter your Email" />
                        <has-error :form="form" field="email" />
                    </div>
                    <div class="col-md-12 form-group mb-0 px-2">
                        <label for="">Message</label>
                        <textarea class="form-control" rows="5" v-model="form.message" maxlength="500" placeholder="Enter message details"></textarea>
                        <has-error :form="form" field="message" />
                        <div class="text-center mt-3" v-if="form.progress && form.file">
                            <div class="progress mx-auto" style="width: 80%; height: 8px;">
                                <div
                                    class="progress-bar progress-bar-striped progress-bar-animated"
                                    :style="{
                                        width: `${form.progress.percentage}%`,
                                    }"
                                ></div>
                            </div>
                            <p class="mt-1">
                                {{ form.progress.percentage }}% uploaded... please wait
                            </p>
                        </div>

                        <div class="mt-3 position-relative">
                            <label class="btn fp-btn-outline mb-0">
                                <fp-icon name="upload" class="fp-fs-20" />
                                Upload
                                <input type="file" name="file" multiple @change="handleFile" hidden accept="image/*" />
                            </label>
                            <button type="submit" class="btn fp-btn-gradient px-4 ml-3" :class="{ 'btn-loading': form.busy }" :disabled="form.busy">
                                Send
                            </button>
                        </div>
                        <div v-if="form.errors.has('file.0') || form.errors.has('file.1') || form.errors.has('file.2') || form.errors.has('file.3') || form.errors.has('file.4')"
                            class="text-center text-danger"
                        >
                            <p class="text-danger"><fa icon="question-circle" /> Sorry! Maximum allowed size is 20MB</p>
                        </div>
                        <div class="row mt-2 mx-n1 align-items-stretch" v-if="emailFiles.length">
                            <div class="col-4 image-container px-1" style="max-height: 120px;" v-for="(img, index) in emailFiles" :key="index">
                                <a href="javascript:;" class="btn-remove-image btn-sm" @click="removeEmailFile(index)">
                                    <fp-icon name="trash" />
                                </a>
                                <div class="video" v-if="checkVideo(img)">
                                    <video :src="img" width="100%" height="100%"></video>
                                </div>
                                <img :src="img" alt="" width="100%" height="100%" v-else-if="img.includes('data:image')" />
                                <p class="mt-4" style="font-weight: 500;" v-else>
                                    {{ emailFileNames[index] }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </fp-modal>
</template>
<script>
import FpModal from "./Modal.vue";
import Form from "vform";
export default {
    name: 'EmailModal',
    props: {
        email: { type: String,  required: true },
        url: { type: String, required: true },
        params: { type: Object, default: () => new Object() },
    },
    components: {
        FpModal,
    },
    data() {
        return {
            form: new Form({
                contact_email: this.email,
                name: "",
                email: "",
                message: "",
                file: null,
                ...this.params
            }),
            emailFiles: [],
            emailFileNames: [],
        }
    },
    computed: {
        emailModalName() {
            return `email_modal_${Math.round(Math.random() * 1000000)}`;
        },
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    methods: {
        open() {
            this.$refs.emailModal.open();
        },
        close() {
            this.$refs.emailModal.close();
        },
        handleFile(event) {
            if (event.target.files.length > 5) {
                this.$toast.error("You can upload max 5 files.");
                return false;
            }
            const files = event.target.files;
            this.emailFiles = [];
            this.emailFileNames = [];
            Array.from(files).forEach((file) => {
                if (file.size > 20971520) {
                    this.$toast.error("Sorry! Maximum allowed size is 20MB");
                    this.emailFiles = [];
                    this.emailFileNames = [];
                    return false;
                }
                this.emailFileNames.push(file.name);
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.emailFiles.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });
            this.form.file = files;
        },
        async sendEmail() {
            const response = await this.form.post(`${process.env.adsApiUrl}/post/send_email`);
            if (response.data.status === 'Success') {
                this.$emit('success');
            }
        },
        checkVideo(data) {
            return data.includes("video") || data.includes(".mp4") || data.includes(".3gp");
        },
        removeEmailFile(index) {
            this.emailFileNames.splice(index, 1);
            this.emailFiles.splice(index, 1);
            let imageArray = Array.from(this.form.file);
            imageArray.splice(index, 1);
            this.form.file = imageArray;
        },
    }
}
</script>
<style lang="scss" scoped>
    .image-container {
        img {
            border-radius: 6px;
        }
    }
</style>