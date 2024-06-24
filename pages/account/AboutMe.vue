<template>
    <div>
        <form v-if="auth_user.id == user.id" @submit.prevent="saveDetail">
            <textarea rows="10" class="form-control" v-model="form.detail" placeholder="Describe your briefly.."></textarea>
            <div class="text-center py-2">
                <button type="submit" class="btn btn-success px-4" :class="{'btn-loading': form.busy}">Save</button>
            </div>
        </form>
        <div v-else class="user-data">
            <p style="white-space:pre-line;font-weight: 500;">
                {{user.detail ? user.detail : 'No information was found'}}
            </p>
            <div class="mt-3 mt-md-4">
                <div class="row">
                    <div class="col-md-6">
                        <div class="user-info">
                            <fa icon="envelope" />
                            <span class="text-primary mx-2">{{showHidden ? user.email : hidden_email}}</span>
                            <fa v-if="user.hide_email" icon="eye-slash" class="hide" :title="`${user.first_name} has hidden their email`" />
                            <fa v-else icon="eye" class="show" @click="showCaptcha = true" />
                        </div>
                        <div class="user-info">
                            <fa icon="phone-alt" />
                            <span class="text-primary mx-2">{{showHidden ? user.phone_number : 'xxx-xxx-xxxx'}}</span>
                            <fa v-if="user.hide_email" icon="eye-slash" class="hide" :title="`${user.first_name} has hidden their phone`" />
                            <fa v-else icon="eye" class="show" @click="showCaptcha = true" />
                        </div>
                        <div v-if="user.gender" class="user-info">
                            <fa icon="user" />
                            <span class="text-primary mx-2">{{user.gender == 'custom' ? user.custom_gender : user.gender}}</span>
                        </div>
                        <div class="user-info">
                            <fa icon="calendar-alt" />
                            <span v-if="user.hide_dob" class="text-primary mx-2">xx/xx/xxxx</span>
                            <span v-else-if="user.show_only_date_month" class="text-primary mx-2">{{$moment(user.date_of_birth).format('D MMM')}}</span>
                            <span v-else class="text-primary mx-2">{{$moment(user.date_of_birth).format('MM/DD/YYYY')}}</span>
                            <fa v-if="user.hide_dob" icon="eye-slash" class="hide" :title="`${user.first_name} has hidden their date of birth`" />
                        </div>

                        <transition>
                            <div v-if="showCaptcha && showHidden == false" class="recaptcha-container">
                                <recaptcha
                                    @success="showHidden = true"
                                />
                            </div>
                        </transition>
                    </div>
                    <div class="col-md-6">
                        <div class="user-info">
                            <fa icon="user-graduate" />
                            <span class="text-primary mx-2">{{user.education ? user.education : 'No'}}</span>
                        </div>
                        <div class="user-info">
                            <fa icon="school" />
                            <span class="text-primary mx-2">{{user.school_university ? user.school_university : 'No'}}</span>
                        </div>
                        <div class="user-info">
                            <fa icon="briefcase" />
                            <span class="text-primary mx-2">{{user.occupation ? user.occupation : 'No'}}</span>
                        </div>
                        <div class="user-info">
                            <fa icon="building" />
                            <span class="text-primary mx-2">{{user.working_in ? user.working_in : 'No'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Form from "vform"
import {mapGetters} from "vuex"
export default {
    name: 'AboutMe',
    props: ['user'],
    data() {
        return {
            form: new Form({
                id: this.user.id,
                detail: this.user.detail,
            }),
            recaptcha_site_key: process.env.recaptchaSiteKey,
            showCaptcha: false,
            showHidden: false,
        }
    },
    computed: {
        hidden_email() {
            return this.user.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")
        },
        ...mapGetters({
            auth_user: 'auth/user',
        })
    },
    methods: {
        saveDetail() {
            this.form.post(`/user/save_detail`)
        }
    }
}
</script>
<style lang="scss" scoped>
    .user-data {
        .user-info {
            margin-bottom: 15px;
            .show {
                cursor: pointer;
            }
            svg {
                display: inline-block;
                width: 18px;
            }
        }
    }
</style>