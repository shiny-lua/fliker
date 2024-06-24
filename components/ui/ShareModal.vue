<template>
    <fp-modal ref="shareModal"
        name="shareModal"
        title="Share Link"
        @before-close="closed"
    >
        <div v-if="sharing" class="share-modal">
            <h6 class="mb-3">Share this link via</h6>
            <div class="share-options mb-4">
                <a href="javascript:;" class="share-option fp-text-color-main" @click.prevent="openChat()">
                    <span class="share-icon flickerpage">
                        <img src="~/assets/images/logo.png" width="100%" height="100%" alt="">
                    </span>
                    FlickerPage
                </a>
                <share-network network="whatsapp"
                    class="share-option fp-text-color-main"
                    :url="sharing.url"
                    title=""
                    @open="$emit('shared')"
                >
                    <span class="share-icon whatsapp">
                        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.775 4.05938C20.2906 1.575 16.9781 0.25 13.5 0.25C6.2125 0.25 0.25 6.2125 0.25 13.5C0.25 15.8188 0.91251 18.1375 2.07189 20.125L0.25 26.75L7.20627 24.9281C9.19377 25.9219 11.3469 26.5844 13.5 26.5844C20.7875 26.5844 26.75 20.6219 26.75 13.3344C26.75 9.85625 25.2594 6.54375 22.775 4.05938ZM13.5 24.4313C11.5125 24.4313 9.52501 23.9344 7.86876 22.9406L7.53749 22.775L3.39686 23.9344L4.55626 19.9594L4.22499 19.4625C3.06561 17.6406 2.56874 15.6531 2.56874 13.6656C2.56874 7.70313 7.5375 2.73438 13.5 2.73438C16.4813 2.73438 19.1313 3.89375 21.2844 5.88125C23.4375 8.03437 24.4313 10.6844 24.4313 13.6656C24.4313 19.4625 19.6281 24.4313 13.5 24.4313ZM19.4625 16.15C19.1313 15.9844 17.475 15.1562 17.1438 15.1562C16.8125 14.9906 16.6469 14.9906 16.4812 15.3219C16.3156 15.6531 15.6531 16.3156 15.4875 16.6469C15.3219 16.8125 15.1562 16.8125 14.825 16.8125C14.4937 16.6469 13.5 16.3156 12.175 15.1562C11.1813 14.3281 10.5188 13.1688 10.3531 12.8375C10.1875 12.5063 10.3531 12.3406 10.5188 12.175C10.6844 12.0094 10.85 11.8437 11.0156 11.6781C11.1812 11.5125 11.1813 11.3469 11.3469 11.1813C11.5125 11.0156 11.3469 10.85 11.3469 10.6844C11.3469 10.5188 10.6844 8.8625 10.3531 8.2C10.1875 7.70313 9.85627 7.70312 9.69065 7.70312C9.52502 7.70312 9.35935 7.70312 9.0281 7.70312C8.86248 7.70312 8.53123 7.70312 8.19998 8.03437C7.86873 8.36562 7.04064 9.19375 7.04064 10.85C7.04064 12.5062 8.19999 13.9969 8.36561 14.3281C8.53124 14.4937 10.6844 17.9719 13.9969 19.2969C16.8125 20.4562 17.3094 20.125 17.9719 20.125C18.6344 20.125 19.9594 19.2969 20.125 18.6344C20.4562 17.8063 20.4563 17.1438 20.2906 17.1438C20.125 16.3156 19.7938 16.3156 19.4625 16.15Z" fill="white"/>
                        </svg>
                    </span>
                    WhatsApp
                </share-network>
                <a href="javascript:;" class="share-option fp-text-color-main" :class="showSmsForm && 'text-underline'" @click.prevent="showSmsForm = true">
                    <span class="share-icon messenger">
                        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.319 0.636813L10.6164 1.84144C9.44429 2.13113 8.32246 2.5956 7.28861 3.21924L6.65242 2.15389C7.79039 1.46475 9.0268 0.953176 10.319 0.636813ZM16.681 0.636813L16.3836 1.84144C17.5557 2.13113 18.6775 2.5956 19.7114 3.21924L20.3551 2.15389C19.2141 1.46536 17.9753 0.953846 16.681 0.636813ZM2.15388 6.64867C1.46538 7.78831 0.953857 9.02586 0.636797 10.319L1.84143 10.6164C2.13111 9.4443 2.59558 8.32247 3.21922 7.28863L2.15388 6.64867ZM1.49133 13.5C1.49124 12.8976 1.53654 12.2961 1.62685 11.7006L0.399636 11.5124C0.200121 12.8287 0.200121 14.1676 0.399636 15.4839L1.62685 15.2994C1.53668 14.7038 1.49138 14.1024 1.49133 13.5ZM20.3476 24.8423L19.7114 23.7808C18.6791 24.405 17.5585 24.8695 16.3873 25.1586L16.6847 26.3632C17.9754 26.0438 19.2103 25.531 20.3476 24.8423ZM25.5086 13.5C25.5086 14.1024 25.4633 14.7038 25.3731 15.2994L26.6003 15.4839C26.7998 14.1676 26.7998 12.8287 26.6003 11.5124L25.3731 11.7006C25.4634 12.2961 25.5087 12.8976 25.5086 13.5ZM26.3632 16.6772L25.1585 16.3798C24.8695 17.5533 24.405 18.6765 23.7807 19.7114L24.8461 20.3513C25.5353 19.2107 26.0468 17.9718 26.3632 16.6772ZM15.2994 25.3731C14.1066 25.5539 12.8934 25.5539 11.7006 25.3731L11.5161 26.6003C12.8312 26.7999 14.1688 26.7999 15.4839 26.6003L15.2994 25.3731ZM23.1671 20.6224C22.4516 21.5926 21.5937 22.4493 20.6224 23.1634L21.3602 24.1647C22.4301 23.3771 23.3766 22.4344 24.1685 21.3677L23.1671 20.6224ZM20.6224 3.83285C21.5938 4.54829 22.4517 5.4062 23.1671 6.37763L24.1685 5.63226C23.3794 4.56459 22.4354 3.62061 21.3677 2.8315L20.6224 3.83285ZM3.83283 6.37763C4.54827 5.4062 5.40619 4.54829 6.37761 3.83285L5.63225 2.8315C4.56457 3.62061 3.6206 4.56459 2.83148 5.63226L3.83283 6.37763ZM24.8461 6.64867L23.7807 7.28863C24.405 8.32084 24.8695 9.44152 25.1585 10.6127L26.3632 10.3153C26.0461 9.02329 25.5346 7.78698 24.8461 6.64867ZM11.7006 1.62687C12.8934 1.44615 14.1066 1.44615 15.2994 1.62687L15.4839 0.399651C14.1688 0.200116 12.8312 0.200116 11.5161 0.399651L11.7006 1.62687ZM4.46903 24.496L1.90542 25.0908L2.50397 22.5272L1.29558 22.2449L0.697028 24.8085C0.659578 24.9674 0.653831 25.1322 0.680115 25.2933C0.7064 25.4545 0.764201 25.6089 0.850211 25.7477C0.936222 25.8865 1.04876 26.007 1.18137 26.1023C1.31399 26.1975 1.46409 26.2657 1.62309 26.303C1.80903 26.3444 2.00181 26.3444 2.18776 26.303L4.75136 25.7119L4.46903 24.496ZM1.55156 21.1381L2.76372 21.4167L3.17781 19.6398C2.5731 18.6255 2.12271 17.5268 1.84143 16.3798L0.636797 16.6772C0.907757 17.7751 1.31763 18.8339 1.85648 19.8281L1.55156 21.1381ZM7.34884 23.8259L5.57201 24.24L5.85435 25.4522L7.16062 25.1473C8.15403 25.6877 9.21307 26.0977 10.3115 26.367L10.6089 25.1623C9.4655 24.8774 8.37068 24.4245 7.36014 23.8184L7.34884 23.8259ZM13.5 2.73362C7.55212 2.73739 2.73737 7.55967 2.73737 13.5038C2.74065 15.5283 3.31332 17.5112 4.38997 19.2258L3.35474 23.6452L7.77046 22.61C12.8036 25.7759 19.4516 24.2664 22.6175 19.2371C25.7834 14.2077 24.2777 7.55967 19.2483 4.38999C17.5266 3.30725 15.5339 2.73307 13.5 2.73362Z" fill="white"/>
                        </svg>
                    </span>
                    SMS
                </a>
                <share-network network="email"
                    class="share-option fp-text-color-main"
                    :url="sharing.url"
                    title=""
                    @open="$emit('shared')"
                >
                    <span class="share-icon email">
                        <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.90909 21.005H6.36364V10.1868L0 5.41406V19.0959C0 20.1522 0.855909 21.005 1.90909 21.005Z" fill="#4285F4"/>
                            <path d="M21.6365 21.005H26.091C27.1474 21.005 28.0001 20.1491 28.0001 19.0959V5.41406L21.6365 10.1868" fill="#34A853"/>
                            <path d="M21.6365 1.91451V10.1872L28.0001 5.41451V2.86905C28.0001 0.508143 25.3051 -0.837766 23.4183 0.578143" fill="#FBBC04"/>
                            <path d="M6.36353 10.1868V1.91406L13.9999 7.64134L21.6363 1.91406V10.1868L13.9999 15.9141" fill="#EA4335"/>
                            <path d="M0 2.86905V5.41451L6.36364 10.1872V1.91451L4.58182 0.578143C2.69182 -0.837766 0 0.508143 0 2.86905Z" fill="#C5221F"/>
                        </svg>
                    </span>
                    Gmail
                </share-network>
            </div>
            <form v-if="showSmsForm" class="sms-form mb-4 form-inline" @submit.prevent="shareBySms">
                <phone-number-input v-model="phoneNumberObj" class="flex-grow-1" />
                <button type="submit" class="btn btn-success ml-2" :class="sms_form.busy && 'btn-loading'" :disabled="sms_form.busy">Share</button>
            </form>
            <h6 class="mb-3">Or copy link</h6>
            <div class="copy-link pl-2">
                <fp-icon name="link" class="fp-text-color-main fp-fs-18" />
                <span class="sharing-link fp-text-color-main ml-1">{{ sharing.url }}</span>
                <a href="javascript:;" class="btn btn-sm fp-btn-gradient py-1 px-3 ml-auto" @click.prevent="copyUrl">Copy</a>
            </div>
        </div>
    </fp-modal>
</template>
<script>
import FpModal from "./Modal.vue";
import PhoneNumberInput from '../elements/PhoneNumberInput.vue';
import Form from "vform";
import eventBus from '~/plugins/event-bus';
export default {
    name: 'ShareModal',
    components: {
        FpModal,
        PhoneNumberInput,
    },
    data() {
        return {
            showSmsForm: false,
            phoneNumberObj: {
                country_id: 231,
                code: '+1',
                number: '',
            },
            sms_form: new Form({
                phone_number: '',
                content: '',
            }),
        }
    },
    computed: {
        sharing() {
            return this.$store.getters['sharing'];
        },
        open_share() {
            return this.$store.getters['open_share'];
        }
    },
    watch: {
        open_share(value) {
            if (value) {
                this.$refs.shareModal.open();
            } else {
                this.$refs.shareModal.close();
            }
        }
    },
    methods: {
        async copyUrl() {
            await this.$copyText(this.sharing.url);
            this.$toast.success("URL copied!");
            eventBus.$emit('shared', this.sharing);
            this.close();
        },
        open() {
            this.$refs.shareModal.open();
        },
        close() {
            this.$refs.shareModal.close();
        },
        async shareBySms() {
            this.sms_form.phone_number = `${this.phoneNumberObj.code}${this.phoneNumberObj.number}`;
            this.sms_form.content = this.sharing.url;
            try {
                const response = await this.sms_form.post('/send_sms');
                if (response.data.status === 'Success') {
                    eventBus.$emit('shared', this.sharing);
                    this.close();
                }
            } catch (error) {

            }
        },
        async openChat() {
            await this.$copyText(this.sharing.url);
            const chatOpened = this.$store.state.message.open_chat;
            this.close();
            if (!chatOpened) this.$store.dispatch('message/toggleChat');
            eventBus.$emit('shared', this.sharing);
        },
        closed() {
            this.$store.dispatch('toggleShare', false);
        },
    }
}
</script>
<style lang="scss" scoped>
    .share-options {
        display: flex;
        align-items: center;
        .share-option {
            margin-left: 20px;
            text-align: center;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            width: 75px;
            &:first-child {
                margin-left: 0;
            }
            .share-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 48px;
                border-radius: 6px;
                margin: auto;
                &.whatsapp {
                    background-color: #25D366;
                }
                &.messenger {
                    background-color: #3A76F0;
                }
                &.email {
                    background-color: #C3C3C3;
                }
            }
        }
    }
    .copy-link {
        background: #FF22A11A;
        border-radius: 8px;
        padding: 5px;
        display: flex;
        align-items: center;
        .sharing-link {
            flex-grow: 1;
            overflow: hidden;
            max-width: calc(100% - 100px);
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>