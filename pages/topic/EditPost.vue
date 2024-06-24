<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-md-10 col-xl-8 mt-4 mt-md-5">
                <a href="javascript:;" @click.prevent="$router.back()">&lt;&lt; Back</a>
                <h5>
                    <a href="javascript:;" class="btn-ask" @click.prevent="showTermsAndGuideLines()">Terms and Guidelines</a>
                </h5>
                <div class="card card-body">
                    <post-form mode="edit" :id="id" :action="action" v-if="id"></post-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PostForm from "~/components/topic/PostForm.vue"
export default {
    components: {
        PostForm
    },
    data() {
        return {
            id: '',
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.id = this.$route.params.id
    },
    methods: {
        showTermsAndGuideLines() {
            this.$router.push({name: 'terms_of_use'});
        }
    }
}
</script>