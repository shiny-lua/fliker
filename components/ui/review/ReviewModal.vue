<template>
    <fp-modal ref="writeReviewModal"
        :name="modalName"
        @opened="updateForm"
        @closed="modalClosed"
    >
        <template #header>
            <div class="review-modal-header">
                <img :src="profileImage" width="40" height="40" class="profile-image" :alt="profileName" />
                <h6 class="mb-0 profile-name ml-2">{{ profileName }}</h6>
            </div>
        </template>
        <template>
            <form class="review-form-content" @submit.prevent="submitReview()">
                <div>
                    <div class="rating-wrapper mb-2">
                        <star-rating v-model="form.rating"
                                :star-size="20"
                                :show-rating="false"
                                :padding="10"
                        />
                        <has-error :form="form" field="rating" />
                    </div>
                    <textarea v-model="form.content"
                        class="form-control"
                        maxlength="1000"
                        rows="5"
                        placeholder="Write your review here..."
                    ></textarea>
                    <p class="text-right mb-0 text-muted">{{ form.content.length }} / 1000</p>
                </div>
                <p class="fp-text-color-main">Please review our <router-link :to="{ name: 'terms_of_use' }" class="fp-text-active" target="_blank">Terms Of Content</router-link> before writing a review.</p>
                <div>
                    <a href="javascript:;" class="btn fp-btn-outline px-4" @click.prevent="$refs.writeReviewModal.close()">Cancel</a>
                    <button type="submit"
                            class="btn fp-btn-gradient px-4 ml-3"
                            :class="form.busy && 'btn-loading'"
                            :disabled="form.busy"
                    >Submit</button>
                </div>
            </form>
        </template>
    </fp-modal>
</template>
<script>
import FpModal from "~/components/ui/Modal.vue";
import StarRating from 'vue-star-rating';
import Form from "vform";
export default {
    name: 'ReviewModal',
    props: {
        profileImage: { type: String, required: true },
        profileName: { type: String, required: true },
        url: { type: String, required: true },
        params: { type: Object, required: true },
    },
    components: {
        FpModal,
        StarRating,
    },
    data() {
        return {
            form: new Form({
                content: '',
                rating: 0,
            }),
        }
    },
    computed: {
        modalName() {
            return `write_review_modal_${Math.random().toString(6)}`;
        },
    },
    methods: {
        open() {
            this.$refs.writeReviewModal.open();
        },
        close() {
            this.$refs.writeReviewModal.close();
        },
        updateForm() {
            this.form.update({
                content: '',
                rating: 0,
                ...this.params
            });
        },
        async submitReview() {
            try {
                const response = await this.form.post(this.url);
                if (response.data.status === 'Success') {
                    this.$fpSuccess('Your review has been submitted successfully!');
                    this.$emit('submit', response.data.data)
                    this.form.reset();
                    this.$refs.writeReviewModal.close();
                }
            } catch (error) {

            }
        },
        modalClosed() {
            this.form.content = '';
            this.form.rating = 0;
            this.$emit('closed');
        }
    }
}
</script>
<style lang="scss" scoped>
    .review-modal-header {
        display: flex;
        align-items: center;
        margin: -6px 0 -8px;
        img {
            object-fit: cover;
            border-radius: 100%;
        }
        p {
            flex-grow: 1;
            max-width: calc(100% - 40px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 0;
            text-align: left;
            padding: 0 10px;
        }
    }
</style>