<template>
    <div class="input-group phone-number-input">
        <div class="input-group-prepend">
            <button type="button" class="btn fp-btn-outline dropdown-toggle" :class="btnClass" data-toggle="dropdown">
                <img v-if="selected_country" :src="getFlag(selected_country)" width="24" height="16" />
                +{{selected_country?.phone_code}}
            </button>
            <div class="dropdown-menu fp-card rounded-lg fp-border-color-1 px-0 py-1">
                <a href="javascript:;"
                    v-for="item in countries"
                    :key="item.id"
                    class="dropdown-item"
                    @click.prevent="selectCountry(item)"
                >
                    <img :src="getFlag(item)" :alt="item.abbreviation" width="24" height="16" />
                    <span class="ml-1">+{{ item.phone_code }}({{item.name}})</span>
                </a>
            </div>
        </div>
        <input v-model="number"
             type="text"
             class="form-control"
             name="phone_number"
             :class="inputClass"
             :placeholder="placeholder"
             maxlength="10"
             :required="required"
             @keypress="NumbersOnly"
        />
    </div>
</template>
<script>
    export default {
        name: 'PhoneNumberInput',
        props: {
            inputClass: { type: [String, Object], default: '' },
            btnClass: { type: [String, Object], default: '' },
            required: { type: Boolean, default: true },
            value: { type: Object, required: true },
            placeholder: { type: String, default: 'Phone number' },
        },
        data() {
            return {
                country_id: 231,
                number: '',
                flag: 'us.png',
            }
        },
        computed: {
            selected_country() {
                return this.countries.find(i => i.id === this.country_id);
            },
            phoneNumberObj() {
                return {
                    country_id: this.selected_country ? this.selected_country.id : 231,
                    code: this.selected_country ? ('+' + this.selected_country.phone_code) : '+1',
                    number: this.number,
                };
            },
            countries() {
                return this.$store.getters['ads/countries'];
            }
        },
        watch: {
            value: {
                handler: function(val) {
                    this.country_id = val.country_id;
                    this.number = val.number;
                },
                deep: true,
            },
            number() {
                this.$emit('input', this.phoneNumberObj);
            },
            country_id() {
                this.$emit('input', this.phoneNumberObj);
            }
        },
        methods: {
            getFlag(item) {
                return `${process.env.authApiUrl.match(/^(https?:\/\/[^/]+)\//)[1]}/${item.flag}`;
            },
            selectCountry(item) {
                this.country_id = item.id;
            },
            NumbersOnly(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if (charCode < 48 || charCode > 57) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .phone-number-input {
        .dropdown-toggle {
            border-color: #D3DDEB !important;
        }
        .dropdown-menu {
            max-height: 200px;
            overflow-y: scroll;
            .dropdown-item {
                color: #64748B;
                display: flex;
                align-items: center;
                font-size: 13.2px;
                padding: 2px 8px;
                span {
                    display: inline-block;
                    max-width: calc(100% - 30px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    [data-theme=dark] {
        .phone-number-input {
            .dropdown-toggle {
                border-color: rgba(255, 255, 255, 0.2) !important;
            }
        }
    }
</style>