<template>
    <div class="location-single" :style="{height: heightValue}">
        <img v-if="location.image" :src="location.image" alt="">
        <div class="flex-grow-1">
            <GmapMap ref="mapRef"
                :options="mapOption"
                :center="mapCenter"
                :zoom="12"
                map-type-id="roadmap"
                style="width: 100%; height: 100%"
            >
                <GmapCircle
                    :center="mapCenter"
                    :radius="2000"
                    :visible="true"
                    :editable="true"
                    :options="{
                        fillColor: 'blue',
                        fillOpacity: 0.3,
                        strokeColor: 'blue',
                        strokeOpacity: 0.5,
                        strokeWeight: 2,
                    }"
                />
            </GmapMap>
        </div>
    </div>
</template>
<script>
export default {
    name: 'LocationSingle',
    props: {
        location: { type: Object, required: true },
        height: {type: [String, Number], default: 180 },
    },
    computed: {
        heightValue() {
            return typeof this.height === 'number' ? `${this.height}px` : this.height;
        },
        mapCenter() {
            return {
                lat: this.location.latitude,
                lng: this.location.longitude,
            };
        },
        mapOption() {
            return {
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false,
                fullscreenControl: false
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .location-single {
        display: flex;
        img {
            height: 100%;
            flex-basis: 38%;
            object-fit: cover;
        }
        .map-container {
            height: 100%;
            flex-basis: 62%;
        }
    }
</style>