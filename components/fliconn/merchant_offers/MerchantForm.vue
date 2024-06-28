<template>
    <div class="row row-eq-height">
        <div class="col-md-6 mb-0 d-none d-md-block">
            <div class="image-container h-100 mb-0 d-flex align-items-center justify-content-center">
                <img src="@/assets/images/merchants/banner_merchant.png" width="95%" alt="">
            </div>
        </div>
        <div class="col-md-6">
            <form v-if="step === 1" class="fp-card merchant-form px-lg-4 py-lg-5" @submit.prevent="step = 2">
                <div class="row mx-n2">
                    <div class="col-12 px-1">
                        <h4 class="text-center mt-2 mb-3 mb-md-4">{{mode === 'edit' ? 'Update' : 'Create'}} Your <span class="fp-text-active">Merchant Profile</span></h4>
                    </div>
                    <div class="col-md-6 px-2 mb-3">
                        <label>
                            Business or Store Name
                            <span v-if="mode === 'edit'" class="ml-1" v-tooltip="update_info_text">
                                <fa :icon="['far', 'question-circle']" />
                            </span>
                        </label>
                        <input v-model="form.name" type="text" class="form-control" placeholder="Enter business or store name" maxlength="60" required :disabled="mode === 'edit'" />
                    </div>
                    <div class="col-md-6 px-2 mb-3">
                        <label>Contact Person</label>
                        <input v-model="form.contact_person_name"  type="text" class="form-control" maxlength="60" placeholder="Contact person name" />
                    </div>
                    <div class="col-md-6 px-2 mb-3">
                        <label>Contact Email</label>
                        <input v-model="form.email" type="email" class="form-control" placeholder="Contact email" maxlength="150" />
                    </div>
                    <div class="col-md-6 px-2 mb-3">
                        <label>Contact Phone</label>
                        <phone-number-input v-model="phoneNumberObj" :required="false" placeholder="Contact Phone"/>
                    </div>
                    <div class="col-md-12 px-2 mb-3 position-relative">
                        <div class="d-flex align-items-center mb-2">
                            <label class="mb-0">Business or Store Location</label>
                            <div class="custom-control custom-checkbox ml-3">
                                <input v-model="form.is_online_business"
                                        type="checkbox"
                                        class="custom-control-input"
                                        id="is_online_business"
                                />
                                <label class="custom-control-label fp-text-active" for="is_online_business">Online Business</label>
                            </div>
                        </div>
                        <gmap-autocomplete v-show="!form.is_online_business"
                            class="form-control w-100"
                            :class="mode === 'edit' && 'pr-4'"
                            :value="form.address"
                            @place_changed="updateAddress"
                            placeholder="Business or Store Location"
                            style="max-width: 100%;"
                            @keypress.enter="$event.preventDefault()"
                            :disabled="mode === 'edit'"
                        ></gmap-autocomplete>
                        <span v-if="mode === 'edit'" class="ml-1" style="position:absolute;bottom:7px;right:20px;" v-tooltip="update_info_text">
                            <fa :icon="['far', 'question-circle']" />
                        </span>
                    </div>
                    <div class="col-md-12 px-2 mb-3">
                        <label>Choose Your Business Category</label>
                        <select v-model="form.category_id" class="form-control has-bg">
                            <option value="" hidden>Business category</option>
                            <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="col-md-12 px-2 mb-3">
                        <label>Add Items Categories</label>
                        <div>
                            <form class="d-flex" @submit.prevent="addCategory()">
                                <input ref="category_form" type="text" class="form-control flex-grow-1" placeholder="Ex. Men's Shoes" required maxlength="60" />
                                <button type="submit" class="btn fp-btn-gradient ml-2"><fa icon="plus" /> Add</button>
                            </form>
                            <div class="flex-wrap" v-show="form.item_categories.length">
                                <span v-for="(item, index) in form.item_categories" :key="index" class="information-item">
                                    {{item}}
                                    <fa icon="times" class="btn-remove" @click="form.item_categories.splice(index, 1)" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="mb-3 fp-text-color-main">
                        By clicking below, I agree to the
                        <router-link :to="{ name: 'terms_of_use' }" class="fp-text-active">Terms of use</router-link>
                        and that I have read the
                        <router-link :to="{ name: 'privacy_policies' }" class="fp-text-active">Privacy Statement</router-link>.
                    </p>
                    <div>
                        <button type="submit" class="btn fp-btn-gradient px-4">{{mode === 'edit' ? 'Update' : 'Register'}}</button>
                    </div>
                </div>
            </form>
            <form v-if="step === 2" class="fp-card merchant-form p-lg-5" @submit.prevent="submit">
                <div class="row mx-n2">
                    <div class="col-12 px-1">
                        <h4 class="text-center mt-2 mb-3">Your Company Logo</h4>
                    </div>
                    <div class="col-12 px-1 mb-3">
                        <label class="image-label mx-auto">
                            <img v-if="imageData" :src="imageData" width="100%" height="100%" class="form-image" alt="">
                            <fp-icon v-else name="camera-fill" class="fp-fs-30 fp-text-active" />
                            <input type="file" name="image" hidden accept="image/*" @change="handleImage" />
                        </label>
                    </div>
                    <div class="col-md-12 px-2 mb-3">
                        <label>Business website URL <span v-if="form.is_online_business" class="text-danger">*</span></label>
                        <input v-model="form.website_url"
                             type="text" class="form-control"
                             placeholder="Business website URL"
                             maxlength="250"
                             :required="form.is_online_business"
                        />
                        <has-error v-if="form.is_online_business" :form="form" field="website_url" />
                    </div>
                    <div class="col-md-12 px-2 mb-3">
                        <label>Business Hours <span class="text-danger">*</span></label>
                        <textarea v-model="form.business_hours"
                             rows="3"
                             class="form-control"
                             placeholder="Business hours"
                             maxlength="500"
                        ></textarea>
                        <has-error :form="form" field="business_hours" />
                    </div>
                    <div class="col-md-12 px-2 mb-4">
                        <p class="mb-3 fp-text-color-main">
                            By clicking below, I agree to the
                            <router-link :to="{ name: 'terms_of_use' }" class="fp-text-active">Terms of use</router-link>
                            and that I have read the
                            <router-link :to="{ name: 'privacy_policies' }" class="fp-text-active">Privacy Statement</router-link>.
                        </p>
                        <div class="text-center">
                            <button type="submit" class="btn fp-btn-gradient px-4" :class="form.busy && 'btn-loading'" :disabled="form.busy">{{mode === 'edit' ? 'Complete' : 'Complete Registration'}}</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import Form from "vform";
import PhoneNumberInput from "~/components/elements/PhoneNumberInput.vue";
export default {
    name: 'MerchantForm',
    props: {
        mode: {
            type: String,
            default: 'add',
        }
    },
    components: {
        PhoneNumberInput,
    },
    data() {
        return {
            step: 1,
            form: new Form({
                id: '',
                name: '',
                contact_person_name: '',
                email: '',
                phone_number: '',
                country_id: '',
                address: '',
                category_id: '',
                image: null,
                website_url: '',
                is_online_business: false,
                business_hours: '',
                item_categories: [],
            }),
            imageData: null,
            phoneNumberObj: {
                country_id: 231,
                code: '+1',
                number: '',
            },
            categories: [],
            update_info_text: `Field can not be modified. Please contact "seller-support@flickerpage.com" for changes.`,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        countries() {
            return this.$store.getters['ads/countries'];
        }
    },
    mounted() {
        this.getCategories();
        if (this.mode === 'edit') {
            this.getMerchant();
        }
    },
    methods: {
        async getMerchant() {
            const id = this.$route.params.id;
            const response = await this.axios.get(`${process.env.merchantApiUrl}/merchant/get_merchant_by_id/${id}`);
            if (response.data.status === 'Success') {
                const merchant = response.data.data;
                this.form.id = merchant.id;
                this.form.name = merchant.name;
                this.form.user_id = merchant.user_id;
                this.form.contact_person_name = merchant.contact_person_name;
                this.form.email = merchant.email;
                this.form.phone_number = merchant.phone_number;
                this.form.country_id = merchant.country_id;
                this.form.is_online_business = merchant.is_online_business;
                this.form.country_id = merchant.country_id;
                this.form.address = merchant.address;
                this.form.category_id = merchant.category_id;
                this.form.website_url = merchant.website_url;
                this.form.business_hours = merchant.business_hours;
                this.form.item_categories = merchant.item_categories && Array.isArray(merchant.item_categories) ? merchant.item_categories : [];

                this.imageData = merchant.image_url;

                const country = this.countries.find(i => i.id === merchant.country_id);
                this.phoneNumberObj = {
                    country_id: country.id,
                    code: `+${country.phone_code}`,
                    number: merchant.phone_number.slice(country.phone_code.length + 1),
                }
            }
        },
        async getCategories() {
            const response = await this.axios.get(`${process.env.merchantApiUrl}/merchant/get_categories`);
            this.categories = response.data.data;
        },
        handleImage(event) {
            const file = event.target.files[0]
            this.form.image = file;
            if (!file) return false
            let reader = new FileReader();
            reader.onload = e => {
                this.imageData = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        async submit() {
            if (this.phoneNumberObj.number) {
                this.form.country_id = this.phoneNumberObj.country_id;
                this.form.phone_number = `${this.phoneNumberObj.code}${this.phoneNumberObj.number}`;
            }
            try {
                const response = await this.form.post(`${process.env.merchantApiUrl}/merchant/save`);
                if (response.data.status === 'Success') {
                    this.$fpSuccess(`Your merchant profilie  ${this.mode === 'edit' ? 'updated' : 'created'} successfully!`);
                    this.$router.push({name: 'merchant.profile'});
                }
            } catch (error) {

            }
        },
        updateAddress(place) {
            this.form.address = place.formatted_address
            // console.log(place.name)
        },
        addCategory() {
            if (this.form.item_categories.length >= 100) {
                this.$fpError('Max list of categories is reached.');
                return false;
            }
            const category = this.$refs.category_form.value;
            if (this.form.item_categories.includes(category)) return;
            this.form.item_categories.push(category);
            this.$refs.category_form.value = '';
        },

    }
}
</script>
<style lang="scss" scoped>
    .row {
        margin-inline: 0 !important;
    }
    .image-container {
        img {
            object-fit: cover;
            border-radius: 12px;
        }
    }
    .image-label {
        width: 150px;
        height: 135px;
        background: #DADADA;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .form-image {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            object-fit: cover;
        }
    }
    .information-item {
        display: inline-block;
        border: solid 1px #64748B;
        color: #64748B;
        padding: 4px 8px 2px;
        margin-top: 8px;
        margin-right: 8px;
        font-size: 14.4px;
        font-weight: 400;
        border-radius: 5px;
        white-space: nowrap;
        .btn-remove {
            margin-left: 5px;
            cursor: pointer;
        }
    }
</style>