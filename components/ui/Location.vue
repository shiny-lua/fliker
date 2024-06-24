<template>
    <div class="address" :class="showAddress && 'show-address'">
        <a href="javascript:;" class="mr-1" @click.prevent="getCurrentLocation()" aria-label="Location">
            <fp-icon name="location" class="fp-fs-18" />
        </a>
        <span v-if="showAddress" class="location" @click="changeAddress()">{{ full_address }}</span>
        <gmap-autocomplete v-else
             ref="addressInput"
             class="form-control"
             @place_changed="updateAddress"
             @keypress.enter="$event.preventDefault()"
        />
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    export default {
        name: "Location",
        data: () => {
            return {
                showAddress: true,
            };
        },
        computed: {
            ...mapGetters({
                location: "ads/location",
            }),
            full_address() {
                let location = this.location;
                if (location && location.country) {
                    if (location.city === "" && location.state === "") {
                        return location.country;
                    } else if (location.city) {
                        return `${location.city}, ${location.state}` ;
                    } else if (location.state) {
                        return `${location.state}, ${location.country}` ;
                    }
                } else {
                    return "Choose Location";
                }
            },
        },
        mounted() {
            if (!this.location || !this.location.country) {
                this.getCurrentLocation();
            }
        },
        methods: {
            changeAddress() {
                this.showAddress = false;
                this.$nextTick(() => this.$refs.addressInput.$el.focus());
            },
            updateAddress(place) {
                let location = {
                    city: "",
                    state: "",
                    county: "",
                    zipcode: "",
                    country: "",
                    address: "",
                    latitude: place.geometry["location"].lat(),
                    longitude: place.geometry["location"].lng(),
                };
                for (var i = 0; i < place.address_components.length; i++) {
                    for (var j = 0; j < place.address_components[i].types.length; j++) {
                        if (place.address_components[i].types[j] === "postal_code") {
                            location.zipcode = place.address_components[i].long_name;
                        }
                        if (place.address_components[i].types[j] === "administrative_area_level_1") {
                            location.state = place.address_components[i].short_name;
                        }
                        if (place.address_components[i].types[j] === "administrative_area_level_2") {
                            let county = place.address_components[i].short_name;
                            county = county.replace(" County", "");
                            location.county = county;
                        }
                        if (place.address_components[i].types[j] === "locality") {
                            location.city = place.address_components[i].long_name;
                        }
                        if (place.address_components[i].types[j] === "country") {
                            location.country = place.address_components[i].short_name;
                        }
                    }
                }
                location.address = this.getFullAddress(location);
                this.$store.dispatch("ads/setLocation", location);
                this.showAddress = true;
            },
            getCurrentLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.getPosition);
                } else {
                    alert("Geolocation is not supported by this browser. \n Please enable it.");
                }
            },
            getPosition(position) {
                var currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    county: "",
                    city: "",
                    state: "",
                    zipcode: "",
                    country: "",
                };
                let payload = {
                    type: "latlng",
                    params: `${currentLocation.latitude},${currentLocation.longitude}`,
                };
                this.axios.post(`/get_google_map_address`, payload).then((response) => {
                    if (response.data.status == "Success") {
                        let location = response.data.data;
                        currentLocation.country = location.country;
                        currentLocation.city = location.city;
                        currentLocation.state = location.state;
                        currentLocation.county = location.county;
                        currentLocation.zipcode = location.zipcode;
                        currentLocation.address = this.getFullAddress(currentLocation);
                        this.$store.dispatch("ads/setLocation", currentLocation);
                        this.showAddress = true;
                        if(this.$route.path != '/ads')
                            this.$router.push({ name: "ads" });
                    }
                });
            },
            getFullAddress(location) {
                if (location.city && location.state) return `${location.city}, ${location.state}`;
                if (location.country && location.state) return `${location.state}, ${location.country}`;
                if (location.country) return `${location.country}`;
                return '';
            }
        },
    };
</script>
<style lang="scss" scoped>
    .address {
        display: flex;
        align-items: center;
        .location {
            margin-bottom: 0;
            font-size: 16px;
            line-height: 38px;
            white-space: nowrap;
            cursor: pointer;
            text-decoration: underline;
        }
        &::v-deep .pac-target-input {
            @media (max-width: 600px) {
                padding: 7px 0 7px 7px;
                border-radius: 6px;
            }
        }
    }
</style>
