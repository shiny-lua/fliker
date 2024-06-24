<template>
    <div class="group-detail pt-3 pt-md-4">
        <group-card v-if="group" ref="groupCard"
             :group="group"
             class="mb-3"
             @fetch="getDetail"
        />
        <div v-if="group" class="d-flex">
            <div class="overview-content">
                <group-overview :group="group"
                     @join_removed="$refs.groupCard.getDetail()"
                />
            </div>
            <div class="similiar-groups d-none d-lg-block">
                <similar-groups :group_id="group.id" :type="group.type" class="mt-3" />
            </div>
        </div>
        <div v-if="loading && !group" class="text-center">
            <img src="~assets/images/logo_loading.gif" width="50" alt="" />
        </div>
    </div>
</template>
<script>
import GroupCard from "~/components/fliconn/group/GroupCard.vue"
import GroupOverview from "~/components/fliconn/group/GroupOverview.vue"
import SimilarGroups from "~/components/fliconn/group/SimilarGroups.vue"
export default {
    name: 'GroupDetail',
    components: {
        GroupCard,
        GroupOverview,
        SimilarGroups,
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    data() {
        return {
            group: null,
            loading: false,
        }
    },
    mounted() {
        this.$store.dispatch('setEnableChat', true);
        this.getDetail(true);
    },
    methods: {
        async getDetail(loading = false) {
            if (loading) this.loading = true;
            const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_detail`, {slug: this.$route.params.slug})
            if (response.data.status === 'Success') {
                this.group = response.data.data
                if (!this.auth_user && this.group.is_private) return this.$login(this.$route.path);
            }
            this.loading = false;
        },
    }
}
</script>
<style lang="scss" scoped>
    .group-detail {
        @media (min-width: 720px) {
            max-width: 880px;
            margin: 0 auto;
        }
        .similiar-groups {
            width: 320px;
            padding-left: 12px;
        }
        .overview-content {
            flex-grow: 1;
            @media (min-width: 720px) {
                max-width: calc(100% - 320px);
            }
        }
    }
</style>