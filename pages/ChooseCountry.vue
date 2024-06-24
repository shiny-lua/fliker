<template>
    <div class="row justify-content-center">
        <div class="col-md-8 pt-3 pt-md-5">
            <h4 class="text-center">Currently, we are operating in the following countries only.</h4>
            <h4 class="text-center">Please choose your country</h4>
            <div class="row mt-3 mt-md-4 justify-content-center">
                <div class="col-6 col-md-3 text-center mb-3" v-for="(country, index) in countries" :key="index">
                    <a class="country" @click.prevent="selectCountry(country)">
                        <img :src="`/flag/${country.abbreviation.toLowerCase()}.png`" />
                        <h5 class="mt-2">{{country.name}}</h5>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            countries: [],
        };
    },
    mounted() {
        this.getCountries();
    },
    methods: {
        getCountries() {
            this.axios.get(`${process.env.adsApiUrl}/country/category_countries`).then(response => {
                this.countries = response.data.data;
            });
        },
        async selectCountry(item) {
            let location = {
                country: item.abbreviation,
                county: '',
                city: '',
                state: '',
                zipcode: '',
                latitude: '',
                longitude: '',
            };
            await this.$store.dispatch('ads/setLocation', location);
            this.$router.push({name: 'index'});
        },
    }
}
</script>
<style scoped lang="scss">
    .country {
        font-size: 26px;
        display: block;
        cursor: pointer;
        img {
            width: 160px;
            height: 90px;
        }
    }
    h4 {
        @media (max-width: 600px) {
            font-size: 18px;
        }
    }
</style>