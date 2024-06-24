<template>
    <div class="post-user-detail">
        <div class="post-user-image-name">
            <img :src="user.photo_url" alt="" class="post-user-photo" width="45" height="45" />
            <p class="mb-0 ml-2">Posted by {{ user.name }}</p>
        </div>
        <div v-if="!post.no_reply_to_this_post" class="contact-links">
            <a v-if="post.contact_phone_number" href="javascript:;" class="contact-link" @click="$refs.phoneNumberModal.open()">
                <fp-icon name="phone" class="fp-fs-22" />
                Call
            </a>
            <a v-if="post.contact_email" href="javascript:;" class="contact-link" @click="$refs.emailModal.open()">
                <fp-icon name="email" class="fp-fs-24" />
                Email
            </a>
            <a v-if="post.enable_chat" href="javascript:;" class="contact-link d-inline d-md-none" @click="openMobileChat()">
                <fp-icon name="comment-dots-1" class="fp-fs-22" />
                Message
            </a>
            <a v-if="post.enable_chat" href="javascript:;" class="contact-link d-none d-md-inline" @click="openChat()">
                <fp-icon name="comment-dots-1" class="fp-fs-22" />
                Message
            </a>
        </div>
        <div v-if="post.automotive_seller" class="post-user-detail fp-text-color-main mt-3">
            <div class="post-user-detail-item">
                <div class="post-user-detail-field font-weight-bold">Seller :</div>
                <div class="post-user-detail-name">
                    <router-link :to="{
                            name: 'automotive.seller_profile',
                            params: { slug: post.automotive_seller.slug },
                        }"
                        class="text-underline fp-text-color-main"
                    >
                        {{ post.automotive_seller.name }}
                    </router-link>
                </div>
            </div>
            <div v-if="post.location" class="post-user-detail-item">
                <div class="post-user-detail-field">
                    <fp-icon name="location" class="fp-fs-20" />
                </div>
                <div class="post-user-detail-name">
                    {{ post.location.full_address ? post.location.full_address : post.location.display_address }}
                </div>
            </div>
            <div v-if="post.automotive_seller.business_hours" class="post-user-detail-item">
                <div class="post-user-detail-field">
                    <fp-icon name="calendar-1" class="fp-fs-20" />
                </div>
                <div class="post-user-detail-name">
                    {{ post.automotive_seller.business_hours }}
                </div>
            </div>
            <div v-if="post.automotive_seller.weblink" class="post-user-detail-item">
                <div class="post-user-detail-field">
                    <fp-icon name="globe" class="fp-fs-20" />
                </div>
                <div class="post-user-detail-name weblink">
                    <a :href="post.automotive_seller.weblink.includes('http') ? post.automotive_seller.weblink : `http://${post.automotive_seller.weblink}`"
                        target="_blank"
                        class="text-primary"
                    >{{ post.automotive_seller.weblink.slice(0, 30) }}{{ post.automotive_seller.weblink.length > 30 ? '...' : '' }}</a>
                </div>
            </div>
        </div>
        <div v-else-if="post.category && post.category.name === 'Real Estate'" class="post-user-detail fp-text-color-main mt-3">
            <div v-if="post.realtor || post.license" class="post-user-detail-item">
                <div class="post-user-detail-field">Realtor :</div>
                <div class="post-user-detail-name">
                    {{ post.realtor }} <span v-if="post.license">({{ post.license }})</span>
                </div>
            </div>
            <div v-if="post.contact_weblink" class="post-user-detail-item">
                <div class="post-user-detail-field">
                    <fp-icon name="globe" class="fp-fs-20" />
                </div>
                <div class="post-user-detail-name">
                    <a :href="post.contact_weblink.includes('http') ? post.contact_weblink : `http://${post.contact_weblink}`"
                        target="_blank"
                        class="text-primary"
                    >{{ post.contact_weblink.slice(0, 30) }}{{ post.contact_weblink.length > 30 ? '...' : '' }}</a>
                </div>
            </div>
            <div v-if="post.business_hours" class="post-user-detail-item">
                <div class="post-user-detail-field">
                    <fp-icon name="calendar-1" class="fp-fs-22" />
                </div>
                <div class="post-user-detail-name">
                    {{ post.business_hours }}
                </div>
            </div>
            <div v-if="post.business_location && post.business_address.full_address" class="post-user-detail-item">
                <div class="post-user-detail-field">
                    <fp-icon name="globe" class="fp-fs-20" />
                </div>
                <div class="post-user-detail-name">
                    {{ post.business_location.full_address }}
                </div>
            </div>
            <div v-if="post.locations && post.locations.length" class="post-user-detail-item">
                <div class="post-user-detail-field" style="width: 60px;white-space:nowrap;">Serves in:</div>
                <div class="post-user-detail-name">{{ post.locations.join(", ") }}</div>
            </div>
        </div>
        <div v-else-if="post.contact_weblink" class="post-user-detail fp-text-color-main mt-3">
            <div class="post-user-detail-item">
                <div class="post-user-detail-field">
                    <fp-icon name="globe" class="fp-fs-20" />
                </div>
                <div class="post-user-detail-name">
                    <a :href="post.contact_weblink.includes('http') ? post.contact_weblink : `http://${post.contact_weblink}`" class="text-primary" target="_blank">
                        {{ post.contact_weblink.slice(0, 30) }}{{ post.contact_weblink.length > 30 ? '...' : '' }}
                    </a>
                </div>
            </div>
        </div>

        <email-modal v-if="post && post.contact_email" ref="emailModal"
             :email="post.contact_email"
             :params="{post_id: post.id}"
             :url="sendEmailUrl"
        />

        <phone-number-modal v-if="post && post.contact_phone_number" ref="phoneNumberModal"
             :phone_number="post.contact_phone_number"
             :name="post.user.first_name"
        />

    </div>
</template>
<script>
import EmailModal from "~/components/ui/EmailModal.vue"
import PhoneNumberModal from "~/components/ui/PhoneNumberModal.vue"
export default {
    name: 'PostUserDetail',
    props: {
        post: { type: Object, required: true },
    },
    components: {
        EmailModal,
        PhoneNumberModal
    },
    computed: {
        user() {
            return this.post.user;
        },
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        sendEmailUrl() {
            return `${process.env.adsApiUrl}/post/send_email`;
        }
    },
    methods: {
        openChat() {
            if (!this.post.user) {
                return false;
            }
            if (this.auth_user) {
                if (this.auth_user.id == this.post.user_id) return false;
                this.$store.dispatch("message/openUserChatBox", { user_id: this.post.user_id });
            } else {
                this.$login(this.$route.path);
            }
        },
        openMobileChat() {
            if (!this.post.user) {
                return false;
            }
            if (this.auth_user) {
                if (this.auth_user.id == this.post.user_id) return false;
                this.$router.push({name: 'account.messages', query: {user_id: this.post.user_id}});
            } else {
                this.$login(this.$route.path);
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .post-user-image-name {
        display: flex;
        align-items: center;
        img {
            border-radius: 100%;
            object-fit: cover;
        }
    }
    .contact-links {
        margin-left: 51px;
        display: flex;
        align-items: center;
        .contact-link {
            color: #64748B;
            text-decoration: none;
            padding: 0 11px;
            border-left-style: solid;
            border-left-width: 1px;
            border-color: #ECF1F6;
            text-align: center;
            &:first-child {
                padding-left: 0;
                border-left: none;
            }
        }
    }
    [data-theme=dark] {
        .contact-links {
            .contact-link {
                border-color: #334557;
            }
        }
    }

    .automotive {
        &_location {
            margin-bottom: 3px;
            white-space: nowrap;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &_business_hours {
            margin-bottom: 3px;
            white-space: nowrap;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &_weblink {
            margin-bottom: 3px;
            white-space: nowrap;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .seller-padding-left {
            margin-top: 5px;
            padding-left: 30px;
        }
    }

    .post-user-detail {
        &-item {
            display: flex;
            margin-bottom: 4px;
            &:last-child {
                margin-bottom: 0;
            }
        }
        &-field {
            width: 50px;
            min-width: 50px;
            text-align: right;
        }
        &-name {
            padding-left: 8px;
            overflow: hidden;
        }
    }

    .automotive_business_hours {
        padding-left: 46px;
        white-space: pre-line;

        svg {
            margin-left: -17px;
        }
    }
</style>