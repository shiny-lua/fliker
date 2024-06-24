<template>
    <div class="status-form-container mt-2 mt-md-0">
        <status-form />
    </div>
</template>
<script>
import StatusForm from "~/components/fliconn/status/StatusForm.vue";
export default {
    name: 'CreateStatus',
    components: {
        StatusForm,
    }
}
</script>