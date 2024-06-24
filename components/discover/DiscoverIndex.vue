<template>
    <div class="discover-index position-relative">
        <div class="discover-filter d-md-flex">
            <div class="icon-prefix-input discover-filter-location pr-3 mb-2 mb-md-0">
                <fp-icon name="search" style="font-size: 18px;" />
                <gmap-autocomplete :value="mapLocation.zipcode"
                     class="form-control w-100"
                     @place_changed="updateAddress"
                     placeholder="Zip Code"
                     @keypress.enter="$event.preventDefault()"
                ></gmap-autocomplete>
            </div>
            <div class="discover-types">
                <fp-slider :item-padding="6" :settings="{swipeToSlide: true}">
                    <div v-for="item in types" :key="item.value" class="px-2">
                        <a href="javascript:;" class="discover-type" :class="filter.type === item.value && 'active'" @click="selectType(item.value)">
                            <fp-icon :name="item.icon" class="fp-fs-18 mt-n-2px" />
                            {{ item.label }}
                        </a>
                    </div>
                    <template #prevArrow>
                        <div class="custom-arrow">
                            <a href="javascript:;" class="slick-arrow prev">
                                <fa icon="chevron-left" />
                            </a>
                        </div>
                    </template>
                    <template #nextArrow>
                        <div class="custom-arrow">
                            <a href="javascript:;" class="slick-arrow next">
                                <fa icon="chevron-right" />
                            </a>
                        </div>
                    </template>
                </fp-slider>
            </div>
        </div>
        <div class="map-wrapper">
            <gmap-map ref="mapRef"
                :options="mapOptions"
                :center="{lat: Number(mapLocation.latitude), lng: Number(mapLocation.longitude)}"
                :zoom="14"
                map-type-id="roadmap"
                style="width: 100%; height: 100%"
                @bounds_changed="boundsChangedMap"
            >
                <gmap-marker :position="{lat: Number(mapLocation.latitude), lng: Number(mapLocation.longitude)}" />
                <gmap-cluster>
                    <gmap-custom-marker v-for="(location, index) in locations"
                            :key="index"
                            :marker="{ lat: Number(location.latitude), lng: Number(location.longitude) }"
                            @mouseover.native="openInfoWindow(location)"
                    >
                        <div v-if="types.find(i => i.value === location.type)"
                             class="fp-discover-marker"
                        >
                            <fp-icon name="discover-marker" class="marker-icon" :style="{color: types.find(i => i.value === location.type).color}" />
                            <div class="type-icon">
                                <fp-icon :name="types.find(i => i.value === location.type).icon" />
                            </div>
                        </div>
                    </gmap-custom-marker>
                </gmap-cluster>
                <gmap-info-window v-if="infoWindowData"
                     ref="infoWindow"
                     :opened="infoWindowOpened"
                     :position="infoWindowPosition"
                     @closeclick="closeInfoWindow"
                >
                    <div class="info-window">
                        <div class="d-flex">
                            <div v-if="infoWindowData.image" class="location-image mr-2">
                                <img :src="infoWindowData.image" width="55" height="55" alt="" />
                            </div>
                            <div>
                                <div v-if="infoWindowData.type === 'People'" class="user-data">
                                    <router-link :to="{name: 'fliconn.profile', params: {username: infoWindowData.username}}" class="name" target="_blank">{{ infoWindowData.name }}</router-link>
                                    <p class="address fp-text-color-main">{{ infoWindowData.address }}</p>
                                    <p class="followers">{{ $nFormatter(infoWindowData.followers_count) }} Follower{{infoWindowData.followers_count > 1 ? 's' : ''}}</p>
                                </div>
                                <div v-else class="post-data">
                                    <router-link :to="{name: 'ads.detail', params: {slug: infoWindowData.slug}}" class="title" target="_blank">{{ infoWindowData.title }}</router-link>
                                </div>
                            </div>
                        </div>
                        <router-link v-if="infoWindowData.seller_name" :to="{name: 'automotive.seller_profile', params: {slug: infoWindowData.seller_slug}}" class="seller-name">{{ infoWindowData.seller_name }}</router-link>
                        <div v-if="infoWindowData.type === 'People' && infoWindowData.followable" class="mt-2">
                            <a href="javascript:;" class="btn btn-sm py-1 fp-btn-gradient btn-block btn-follow" @click="follow()">Follow</a>
                        </div>
                        <div v-if="infoWindowData.type !== 'People' && !infoWindowData.no_reply" class="contacts fp-text-color-main">
                            <a v-if="infoWindowData.phone_number" href="javascript:;" class="mr-3" @click="$refs.phoneNumberModal.open()"><fp-icon name="phone" class="fp-fs-18" /></a>
                            <a v-if="infoWindowData.email" href="javascript:;" class="mr-3" @click="$refs.emailModal.open()"><fp-icon name="email" class="fp-fs-22" /></a>
                            <a v-if="infoWindowData.enable_chat" href="javascript:;" class="d-md-none" @click="openMobileChat()"><fp-icon name="comment-dots-1" class="fp-fs-18" /></a>
                            <a v-if="infoWindowData.enable_chat" href="javascript:;" class="d-none d-md-inline" @click="openChat()"><fp-icon name="comment-dots-1" class="fp-fs-18" /></a>
                        </div>
                    </div>
                </gmap-info-window>
            </gmap-map>
        </div>
        <template v-if="infoWindowData && infoWindowData.type !== 'People'">
            <email-modal v-if="infoWindowData.email" ref="emailModal"
                :email="infoWindowData.email"
                :params="{post_id: infoWindowData.id}"
                :url="sendEmailUrl"
            />

            <phone-number-modal v-if="infoWindowData.phone_number" ref="phoneNumberModal"
                :phone_number="infoWindowData.phone_number"
                :name="infoWindowData.user_name"
            />
        </template>
    </div>
</template>
<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker';
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import FpSlider from "@/components/ui/FpSlider.vue"
import EmailModal from "~/components/ui/EmailModal.vue"
import PhoneNumberModal from "~/components/ui/PhoneNumberModal.vue"
export default {
    name: 'DiscoverIndex',
    components: {
        GmapCustomMarker,
        GmapCluster,
        FpSlider,
        EmailModal,
        PhoneNumberModal
    },
    data() {
        return {
            tm: null,
            locations: [],
            filter: {
                type: '',
            },
            mapLocation: {
                latitude: 37.7749295,
                longitude: -122.4194155,
                zipcode: '',
            },
            infoWindowOpened: false,
            infoWindowPosition: { lat: 37.7749295, lng: -122.4194155 },
            infoWindowData: null,
            mapDarkStyle: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#6b9a76" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }],
                },
                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9ca5b3" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#1f2835" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#f3d19c" }],
                },
                {
                    featureType: "transit",
                    elementType: "geometry",
                    stylers: [{ color: "#2f3948" }],
                },
                {
                    featureType: "transit.station",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#17263c" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#515c6d" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#17263c" }],
                },
            ],
            timer: null,
        }
    },
    computed: {
        mapOptions() {
            const options = {
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                    // {
                    //     featureType: "poi",
                    //     elementType: "labels",
                    //     stylers: [{ visibility: "off" }],
                    // }
                ],
                markers: false,
                disableDefaultUI: true
            };
            if (this.theme == 'dark') options.styles = this.mapDarkStyle;
            return options;
        },
        currentPosition() {
            if (this.auth_user.location) {
                return {
                    lat: Number(this.auth_user.location.latitude),
                    lng: Number(this.auth_user.location.longitude)
                }
            } else {
                return {
                    lat: 37.7749295,
                    lng: -122.4194155
                }
            }
        },
        types() {
            return [
                {
                    label: 'People',
                    value: 'People',
                    icon: 'user',
                    color: '#468FEA',
                },
                {
                    label: 'Services',
                    value: 'Services',
                    icon: 'ads-services',
                    color: '#12b5cb',
                },
                {
                    label: 'Automotives',
                    value: 'Automotives',
                    icon: 'automotive',
                    color: '#78909c',
                },
                {
                    label: 'For Sale',
                    value: 'For Sale',
                    icon: 'ads-for-sale',
                    color: '#6c9f43',
                },
                {
                    label: 'Jobs',
                    value: 'Jobs',
                    icon: 'ads-jobs',
                    color: '#34a853',
                },
                {
                    label: 'Accommodation',
                    value: 'Accommodation',
                    icon: 'ads-accommodation',
                    color: '#12b5cb',
                },
                {
                    label: 'Real Estate',
                    value: 'Real Estate',
                    icon: 'ads-real-estate',
                    color: '#12b5cb ',
                },
                {
                    label: 'Legal',
                    value: 'Legal/Lawyers',
                    icon: 'ads-legallawyers',
                    color: '#9cc0f9',
                },
                {
                    label: 'Pets',
                    value: 'Pets',
                    icon: 'ads-pets',
                    color: '#f29900',
                },
                {
                    label: 'Training/Lessons',
                    value: 'Training/Lessons',
                    icon: 'ads-traininglessons',
                    color: '#12b5cb',
                },
                {
                    label: 'Legal',
                    value: 'Other',
                    icon: 'ads-legallawyers',
                    color: '#c24a00',
                },
            ];
        },
        auth_user() {
            return this.$store.getters["auth/user"];
        },
        theme() {
            return this.$store.getters['theme'];
        },
        sendEmailUrl() {
            return `${process.env.adsApiUrl}/post/send_email`;
        }
    },
    mounted() {
        this.getCurrentLocation()
        this.loadLocations();
    },
    methods: {
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.getPosition);
            } else {
                alert("Geolocation is not supported by this browser. \n Please enable it.");
            }
        },
        getPosition(position) {
            this.mapLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                zipcode: '',
            }
        },
        async loadLocations() {
            this.infoWindowData = null;
            try {
                const response = await this.axios.post(`${process.env.discoverApiUrl}/discover/search`, this.filter);
                if (response.data.status === 'Success') {
                    this.locations = response.data.data;
                }
            } catch (error) {
                console.log(error)
            }
        },
        selectType(type) {
            this.location = [];
            this.filter.type = this.filter.type === type ? '' : type;
            this.loadLocations();
        },
        boundsChangedMap(event) {
            clearTimeout(this.tm);
            this.tm = setTimeout(() => {
                // console.log(event)
            }, 1000);
        },
        markerImage(url) {
            return {
                url: url,
                size: { width: 45, height: 60, f: 'px', b: 'px' },
                scaledSize: { width: 45, height: 60, f: 'px', b: 'px' },
            };
        },
        updateAddress(place) {
            if (!place.geometry) return false;
            this.mapLocation.latitude = place.geometry['location'].lat();
            this.mapLocation.longitude = place.geometry['location'].lng();
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] === "postal_code") {
                        this.mapLocation.zipcode = place.address_components[i].long_name;
                    }
                }
            }
            this.$refs.mapRef.panTo({lat: Number(this.mapLocation.latitude), lng: Number(this.mapLocation.longitude)});
        },
        openInfoWindow(location) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                await this.getLocationData(location);
                this.infoWindowPosition = { lat: Number(location.latitude), lng: Number(location.longitude) };
                this.infoWindowOpened = true;
            }, 300);
        },
        closeInfoWindow() {
            this.infoWindowOpened = false;
            this.infoWindowData = null;
        },
        async getLocationData(location) {
            const response = await this.axios.post(`${process.env.discoverApiUrl}/discover/get_location_information`, {location_id: location.id, type: location.type});
            if (response.data.status === 'Success') {
                this.infoWindowData = response.data.data;
            }
        },
        openChat() {
            if (!this.infoWindowData.user_name) {
                return false;
            }
            if (this.auth_user) {
                if (this.auth_user.id == this.infoWindowData.user_id) return false;
                this.$store.dispatch("message/openUserChatBox", { user_id: this.infoWindowData.user_id });
            } else {
                this.$login(this.$route.path);
            }
        },
        openMobileChat() {
            if (!this.infoWindowData.user_name) {
                return false;
            }
            if (this.auth_user) {
                if (this.auth_user.id == this.infoWindowData.user_id) return false;
                this.$router.push({name: 'account.messages', query: {user_id: this.infoWindowData.user_id}});
            } else {
                this.$login(this.$route.path);
            }
        },
        async follow() {
            const data = await this.$store.dispatch("requestFollow", this.infoWindowData.id);
            if (data.status === "Success") {
                this.$fpSuccess(data.message);
                this.infoWindowData.followable = false;
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .discover-filter {
        position: absolute;
        width: 100%;
        z-index: 1;
        top: 0;
        left: 0;
        padding: 16px;
        .discover-filter-location {
            width: 222px;
            input {
                background-color: #FFF;
                color: #64748B;
                max-width: 140px;
            }
        }
        .discover-types {
            @media (min-width: 601px) {
                width: calc(100% - 142px);
            }
            .discover-type {
                display: inline-block;
                height: 36px;
                color: #64748B;
                font-size: 13.6px;
                padding: 8px 12px;
                background-color: #FFF;
                border-radius: 6px;
                text-decoration: none;
                white-space: nowrap;
                &.active {
                    color: #FFF;
                    background-color: #FF22A1;
                }
            }
        }
        }
    .map-wrapper {
        height: 650px;
        border-radius: 12px;
        background-color: #FFF;
        overflow: hidden;
    }
    .fp-discover-marker {
        position: relative;
        cursor: pointer;
        .marker-icon {
            font-size: 40px;
        }
        .type-icon {
            position: absolute;
            width: 100%;
            text-align: center;
            font-size: 16px;
            top: 4px;
            left: 0;
            color: #FFF;
        }
    }
    .info-window {
        .location-image {
            width: 55px;
            height: 55px;
            img {
                border-radius: 6px;
                object-fit: cover;
            }
        }
        .user-data {
            max-width: 150px;
            min-width: 100px;
            .name {
                font-size: 13.6px;
                margin-bottom: 2px;
                font-weight: 500;
                padding-right: 10px;
                outline: none;
            }
            .address {
                font-size: 13px;
                font-weight: 400;
                margin-bottom: 4px;
            }
            .followers {
                font-weight: 400;
                font-size: 13px;
                margin-bottom: 0;
            }
        }
        .btn-follow {
            font-size: 14px;
            &:focus {
                box-shadow: none;
            }
        }
        .post-data {
            max-width: 150px;
            min-width: 100px;
            font-weight: 500;
            p:first-child {
                padding-right: 10px;
            }
            .title {
                font-size: 13.6px;
                color: #007BFF;
                padding-right: 12px;
                margin-bottom: 0;
                line-height: 1.2;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                outline: none;
            }
        }
        .seller-name {
            display: block;
            font-weight: 500;
            color: #FF22A1;
            line-height: 1;
            margin-top: 6px;
            margin-bottom: 2px;
            outline: none;
        }
        .contacts {
            margin-top: 8px;
            text-align: center;
        }
    }
</style>
<style lang="scss">
    .gm-style {
        .gm-style-iw-c {
            padding: 8px !important;
            .gm-style-iw-d {
                overflow: auto !important;
            }
        }
    }
    [data-theme=dark] {
        .gm-style {
            .gm-style-iw-c, .gm-style-iw-tc::after {
                background-color: #18243E;
            }
            .gm-style-iw-c > button.gm-ui-hover-effect {
                span {
                    background-color: #FFF !important;
                }
            }
        }
    }
</style>