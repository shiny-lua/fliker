<template>
    <div class="row">
        <div class="col-md-6 d-none d-md-block">
            <div class="fp-card d-flex align-items-center justify-content-center h-100">
                <img src="@/assets/images/merchants/banner_discount.png" width="95%" alt="">
            </div>
        </div>
        <div class="col-md-6">
            <div class="fp-card form-wrapper py-lg-4 h-100">
                <h4 class="text-center mt-2 mb-3">{{mode === 'edit' ? 'Update' : 'Create'}} a <span class="fp-text-active">Coupon or Discount</span></h4>
                <form @submit.prevent="submit">
                    <div class="row mx-n2">
                        <div class="col-md-6 px-2 mb-3">
                            <label>Offer Type</label>
                            <select v-model="form.type" class="form-control has-bg mobile-has-no-bg" required :disabled="mode === 'edit'">
                                <option value="" hidden>Type</option>
                                <option value="Coupon">Coupon</option>
                                <option value="Discount">Discount</option>
                            </select>
                        </div>
                        <div class="col-md-6 px-2 mb-3">
                            <label>Offer Title</label>
                            <input v-model="form.name"
                                 type="text"
                                 class="form-control"
                                 :placeholder="form.type === 'Discount' ? `Ex. 20% discount on summer sale!` : 'Ex. 10% OFF on Clearance Sales!'"
                                 maxlength="60"
                                 required
                                 :disabled="mode === 'edit'"
                            />
                        </div>
                        <template v-if="form.type === 'Coupon'">
                            <div class="col-md-6 px-2 mb-3">
                                <label>Generate Coupon</label>
                                <div class="icon-prefix-input">
                                    <fp-icon name="refresh" class="cursor-pointer" :class="{ 'rotate': isRegeneratingCode }" @click="generateCouponCode()" />
                                    <input v-model="form.coupon_code"
                                        type="text"
                                        class="form-control"
                                        placeholder="Ex. ADD3251ZXY"
                                        maxlength="10"
                                        required
                                    />
                                </div>
                            </div>
                            <div class="col-md-6 px-2 mb-3">
                                <label>No.of Coupons</label>
                                <input v-model="form.no_of_coupons"
                                    type="number"
                                    class="form-control"
                                    placeholder="Ex. 100"
                                    required
                                />
                            </div>
                        </template>
                        <div class="col-md-6 px-2 mb-3">
                            <label>{{form.type === 'Discount' ? 'Original Price' : 'Total Price'}}</label>
                            <input v-model="form.original_price" type="number"
                                 class="form-control"
                                 placeholder="Ex. 80"
                                 maxlength="7"
                                 min="0"
                                 required
                                oninput="javascript: if (this.value.length > 7) {this.value = this.value.slice(0, 7);} if (this.value.includes('-')) {this.value = this.value.replace(/[^0-9]/g, '');}"
                            />
                        </div>
                        <div class="col-md-6 px-2 mb-3">
                            <label>{{form.type === 'Discount' ? '% of Discount' : '% OFF with Coupon'}}</label>
                            <div class="d-flex align-items-end">
                                <div class="flex-grow-1" :class="(form.original_price || form.discount) && 'mr-2'">
                                    <input v-model="form.discount" type="number"
                                        class="form-control discount-input"
                                        placeholder="Ex. 10"
                                        maxlength="2"
                                        min="0"
                                        required
                                        oninput="javascript: if (this.value.length > 2) {this.value = this.value.slice(0, 2);} if (this.value.includes('-')) {this.value = this.value.replace(/[^0-9]/g, '');}"
                                    />
                                </div>
                                <div class="d-flex align-items-center">
                                    <del v-if="form.original_price && form.discount" class="original-price fp-text-color-main">${{ form.original_price }}</del>
                                    <span v-if="form.original_price" class="price ml-2">${{ Math.round((1 - form.discount / 100) * form.original_price) }}</span>
                                    <span v-if="form.discount" class="discount ml-2">{{ form.discount }}% OFF</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 px-2 mb-3">
                            <label>Offer Valid Until</label>
                            <datepicker v-model="form.ends_at"
                                    :disabled-dates="disabledDates"
                                    :input-class="{
                                        'form-control': true,
                                    }"
                                    placeholder="Select Date"
                            ></datepicker>
                        </div>
                        <div class="col-md-6 px-2 mb-3">
                            <label>Choose Location for Your {{ form.type }}</label>
                            <gmap-autocomplete
                                class="form-control w-100"
                                :value="form.location"
                                @place_changed="updateAddress"
                                placeholder="Ex. San Diego"
                                style="max-width: 100%;"
                                @keypress.enter="$event.preventDefault()"
                            ></gmap-autocomplete>
                        </div>
                        <div v-if="merchant && categories.length" class="col-md-12 px-2 mb-3">
                            <label>Category</label>
                            <select class="form-control has-bg mobile-has-no-bg" v-model="form.category">
                                <option value="" hidden>Select Category</option>
                                <option v-for="(item, index) in categories" :key="index" :value="item">{{ item }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="d-flex image-uploader" :class="{'justify-content-center': previewImages.length === 0}">
                            <div v-for="(img, index) in previewImages" :key="index" class="image-container border-0 mb-0">
                                <a href="javascript:;" class="btn-remove-image btn-sm" @click.prevent="removeImage(index)">
                                    <fp-icon name="trash" />
                                </a>
                                <img :src="img" alt="" />
                            </div>
                            <label v-if="form.images.length < 3" class="image-selector ml-2">
                                <input type="file" hidden accept="image/*" multiple @change="handleImages" />
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2" stroke="#28A745" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001" stroke="#28A745" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M17 2V11M17 2L20 5M17 2L14 5" stroke="#28A745" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p>Upload Photos</p>
                                <p>(Allowed 3 max)</p>
                            </label>
                        </div>
                    </div>
                    <p class="mb-3 fp-text-color-main">
                        By clicking below, I agree to the
                        <router-link :to="{ name: 'terms_of_use' }" class="fp-text-active">Terms of use</router-link>
                        and that I have read the
                        <router-link :to="{ name: 'privacy_policies' }" class="fp-text-active">Privacy Statement</router-link>.
                    </p>
                    <div>
                        <button type="submit"
                             class="btn fp-btn-gradient px-4"
                             :class="form.busy && 'btn-loading'"
                             :disabled="form.busy"
                        >
                            {{mode === 'edit' ? 'Update' : 'Publish'}} {{form.type ? form.type : ''}}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import Datepicker from "vuejs-datepicker";
import Form from "vform";
export default {
    name: 'OfferForm',
    props: {
        mode: {type: String, default: 'add'}
    },
    components: {
        Datepicker,
    },
    data() {
        return {
            merchant: null,
            form: new Form({
                id: '',
                merchant_id: '',
                type: 'Discount',
                name: '',
                ends_at: '',
                original_price: '',
                discount: '',
                location: '',
                category: '',
                coupon_code: '',
                no_of_coupons: '',
                images: [],
            }),
            previewImages: [],
            isRegeneratingCode: false,
        }
    },
    computed: {
        disabledDates() {
            return {
                to: new Date(new Date().setDate(new Date().getDate() - 1)),
            }
        },
        categories() {
            if (this.merchant && Array.isArray(this.merchant.item_categories)) {
                return this.merchant.item_categories;
            } else {
                return [];
            }
        },
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    mounted() {
        this.getMerchant();
        if (this.mode === 'edit') {
            this.getOffer()
        }
    },
    methods: {
        async getMerchant() {
            try {
                const response = await this.axios.get(`${process.env.merchantApiUrl}/merchant/get_merchant_by_user/${this.auth_user.id}`);
                if (response.data.status === 'Success') {
                    this.merchant = response.data.data;
                    this.form.merchant_id = this.merchant.id;
                }
            } catch (e) {
                if (e.response.data.message === 'not_exists') {
                    this.$fpError('Merchant profile does not exists. Please create your merchant profile.');
                    this.$router.push({name: 'merchant.create'});
                }
            }
        },
        async getOffer() {
            const id = this.$route.params.id;
            const response = await this.axios.get(`${process.env.merchantApiUrl}/merchant/get_offer_by_id/${id}`);
            if (response.data.status === 'Success') {
                const offer = response.data.data;
                this.form.id = offer.id;
                this.form.merchant_id = offer.merchant_id;
                this.form.type = offer.type;
                this.form.name = offer.name;
                this.form.ends_at = offer.ends_at;
                this.form.original_price = offer.original_price;
                this.form.discount = offer.discount;
                this.form.location = offer.location;
                this.form.category = offer.category;
                this.form.coupon_code = offer.coupon_code;
                this.form.no_of_coupons = offer.no_of_coupons;
                this.previewImages = offer.images.map(i => i.src_url);
            }

        },
        async submit() {
            try {
                const response = await this.form.post(`${process.env.merchantApiUrl}/merchant/offer/save`);
                if (response.data.status === 'Success') {
                    this.$fpSuccess(`Your ${this.form.type} ${this.mode === 'edit' ? 'Updated' : 'Created'} Successfully!`);
                    this.form.reset();
                    setTimeout(() => {
                        if (this.mode === 'edit') {
                            this.$router.back();
                        } else {
                            this.$router.push({name: 'index', query: {tab: 'merchant'}});
                        }
                    }, 1000);
                }
            } catch (error) {

            }
        },
        updateAddress(place) {
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] === "locality") {
                        this.form.location = place.address_components[i].long_name;
                        return;
                    }
                    if (place.address_components[i].types[j] === "administrative_area_level_1") {
                        this.form.location = place.address_components[i].short_name;
                        return;
                    }
                    if (place.address_components[i].types[j] === "country") {
                        this.form.location = place.address_components[i].short_name;
                        return;
                    }
                }
            }
        },
        handleImages(event) {
            const files = event.target.files;
            files.forEach(file => {
                if (this.form.images.length < 3) {
                    this.form.images.push(file);
                    let reader = new FileReader();
                    reader.onload = e => {
                        this.previewImages.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        },
        removeImage(index) {
            this.form.images.splice(index, 1);
            this.previewImages.splice(index, 1);
        },
        generateCouponCode() {
            this.isRegeneratingCode = true;
            // Generate 4 random digits
            const randomDigits = Math.floor(1000 + Math.random() * 9000);

            // Generate 3 random characters from A to Z
            const randomChars = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                                String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                                String.fromCharCode(65 + Math.floor(Math.random() * 26));

            // Concatenate digits and characters
            const randomString = randomDigits.toString() + randomChars;

            const merchantPrefix = this.merchant.name.replace(/\s/g, '').toUpperCase().substring(0, 3);
            this.form.coupon_code = merchantPrefix + randomString;
            setTimeout(() => {
                this.isRegeneratingCode = false;
            }, 500);
        }
    }
}
</script>
<style lang="scss" scoped>
    .image-container {
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: solid 1px #c3c3c3;
        margin-left: 10px;
        position: relative;
        &:first-child {
            margin-left: 0;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
        }
    }
    .original-price {
        font-size: 16px;
    }
    .price {
        font-size: 16px;
        font-weight: 600;
    }
    .discount {
        padding: 7.2px 3px;
        background: rgba(255, 34, 161, 0.078);
        color: #FF22A1;
        border-radius: 8px;
        border: dashed 1px #FF22A1;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .image-uploader {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border: dashed 1px #28A745;
        border-radius: 8px;
        padding: 8px;
        background-color: #28A74514;
        .image-selector {
            width: 100px;
            height: 100px;
            text-align: center;
            margin-bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            p {
                margin-bottom: 0;
                &:last-child {
                    font-size: 12px;
                }
            }
        }
    }
    .discount-input {
        @media (max-width: 600px) {
            min-width: 120px;
        }
    }
    .rotate {
        transform: rotate(180deg); /* Rotate the icon 180 degrees */
        transition: transform 0.5s ease; /* Apply a smooth transition */
    }
</style>