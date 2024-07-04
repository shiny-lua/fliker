<template>
    <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9 mt-2 mt-md-4 mb-5">
            <group-form :type="type"></group-form>
        </div>
    </div>
</template>
<script>
import GroupForm from "~/components/fliconn/group/GroupForm.vue"
export default {
    name: 'CreateGroup',
    middleware: 'auth',
    components: {
        GroupForm,
    },
    data() {
        const type = this.$route.params.type;
        return {
            type: type,
        }
    },
}
</script>

<style lang="scss" scoped>
.row {
    margin-inline: 0px;
}
</style>