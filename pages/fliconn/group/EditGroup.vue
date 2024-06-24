<template>
    <div class="row justify-content-center">
        <div class="col-md-10 col-xl-8 mt-2 mt-md-3 mb-5">
            <group-form v-if="group" :group="group" :type="group.type" mode="edit"></group-form>
        </div>
    </div>
</template>
<script>
import GroupForm from "~/components/fliconn/group/GroupForm.vue"
export default {
    name: 'EditGroup',
    middleware: 'auth',
    components: {
        GroupForm,
    },
    data() {
        return {
            type: 'group',
            group: null,
        }
    },
    async mounted() {
        const group_id = this.$route.params.id
        const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_detail`, {group_id: group_id})
        this.group = response.data.data
    }
}
</script>