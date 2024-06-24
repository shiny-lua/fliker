<template>
    <div class="row">
        <div class="col-md-12">
            <h6 class="page-title">About Us</h6>
            <div class="fp-text-color-main">
                <p class="learning-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur id repudiandae quam deleniti aspernatur, accusantium temporibus accusamus cum, reprehenderit blanditiis corporis rem soluta, assumenda quod perspiciatis officia deserunt doloremque numquam.

                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur id repudiandae quam deleniti aspernatur, accusantium temporibus accusamus cum, reprehenderit blanditiis corporis rem soluta, assumenda quod perspiciatis officia deserunt doloremque numquam.

                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur id repudiandae quam deleniti aspernatur, accusantium temporibus accusamus cum, reprehenderit blanditiis corporis rem soluta, assumenda quod perspiciatis officia deserunt doloremque numquam.

                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur id repudiandae quam deleniti aspernatur, accusantium temporibus accusamus cum, reprehenderit blanditiis corporis rem soluta, assumenda quod perspiciatis officia deserunt doloremque numquam.
                </p>
            </div>
            <!-- <div class="learning-content" v-html="settings.about_us"></div> -->
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            settings: {
                about_us: '',
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            for (const key in this.settings) {
                this.axios.post(`/setting/get`, { key }).then(response => {
                    if (response.data.status == 'Success') {
                        this.settings[key] = response.data.data;
                    }
                });
            }
        }
    }
}
</script>