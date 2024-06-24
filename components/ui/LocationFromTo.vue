<template>
    <div class="location-from-to" :style="{height: heightValue}">
        <GmapMap ref="mapRef"
            :center="mapCenter"
            :zoom="7"
            :options="mapOption"
            @tilesloaded="showDirections = true"
            style="width: 100%; height: 100%"
        >
            <DirectionsRenderer v-if="type === 'driving' || type === 'moving_address'"
                travelMode="DRIVING"
                :origin="mapOrigin"
                :destination="mapDestination"
            />
            <GmapMarker
                v-if="type === 'flying'"
                :position="{ lat: Number(from.latitude), lng: Number(from.longitude) }"
            />
            <GmapMarker
                v-if="type === 'flying'"
                :position="{ lat: Number(to.latitude), lng: Number(to.longitude) }"
            />
            <GmapPolyline
                v-if="type === 'flying'"
                :path.sync="flyingPath"
                :options="{
                    strokeColor:'#007BFF',
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                }"
            />
        </GmapMap>
    </div>
</template>
<script>
import DirectionsRenderer from "./DirectionsRenderer.js";
import { gmapApi } from 'vue2-google-maps'
export default {
    name: 'LocationFromTo',
    props: {
        from: { type: Object, required: true },
        to: { type: Object, required: true },
        type: { type: String, default: 'driving' },
        height: {type: [String, Number], default: 200 },
    },
    components: {
        DirectionsRenderer,
    },
    data() {
        return {
            showDirections: false,
        };
    },
    computed: {
        google: gmapApi,
        heightValue() {
            return typeof this.height === 'number' ? `${this.height}px` : this.height;
        },
        mapCenter() {
            return {
                lat: (Number(this.from.latitude) + Number(this.to.latitude)) / 2,
                lng: (Number(this.from.longitude) + Number(this.to.longitude)) / 2,
            }
        },
        mapOption() {
            return {
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false,
                fullscreenControl: false
            }
        },
        mapOrigin() {
            if (this.from.latitude !== '' && this.from.longitude !== '') {
                return {lat: Number(this.from.latitude), lng: Number(this.from.longitude)}
            } else {
                return null;
            }
        },
        mapDestination() {
            if (this.showDirections && this.to.latitude !== '' && this.to.longitude !== '') {
                return {lat: Number(this.to.latitude), lng: Number(this.to.longitude)}
            } else {
                return null;
            }
        },
        flyingPath() {
            if (this.from.address !== '' && this.to.address !== '') {
                return [
                    {lat: Number(this.from.latitude), lng: Number(this.from.longitude)},
                    {lat: Number(this.to.latitude), lng: Number(this.to.longitude)},
                ];
            } else {
                return null;
            }
        },
    },
    mounted() {
        var fromPos = new this.google.maps.LatLng(this.from.latitude, this.from.longitude);
        var toPos = new this.google.maps.LatLng(this.to.latitude, this.to.longitude);

        var bounds = new this.google.maps.LatLngBounds();
        bounds.extend(fromPos);
        bounds.extend(toPos);

        this.$refs.mapRef.fitBounds(bounds);
    }
}
</script>