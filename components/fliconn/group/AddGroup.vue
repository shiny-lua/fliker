<template>
    <div>
        <a href="javascript:;" class="add-button" @click="selectType()">
            <slot>
                <span class="btn fp-btn-gradient">
                    <fp-icon name="plus-square" class="fp-fs-18 mt-n-2px" />
                    Create a <span class="text-capitalize">{{ type }}</span>
                </span>
            </slot>
        </a>
        <div class="top-modal fp-modal">
            <fp-modal name="addGroupModal"
                :width="450"
                title="Create a Group or Page"
            >
                <div class="row mx-n2">
                    <div class="col-6 px-2">
                        <a href="javascript::" @click.prevent="createGroup('group')" class="btn-create-group fp-border-color-1 p-1 px-md-3">
                            <div class="icon fp-text-color-main">
                                <fa icon="users" />
                                <p class="mb-0">Group</p>
                            </div>
                            <p class="mb-0 fp-text-color-main font-weight-400">
                                Groups are designed to collaboratively discuss and post common ideas. All your group members are allowed post.
                            </p>
                        </a>
                    </div>
                    <div class="col-6 px-2">
                        <a href="javascript::" @click.prevent="createGroup('page')" class="btn-create-group fp-border-color-1 p-1 px-md-3">
                            <div class="icon fp-text-color-main">
                                <fa :icon="['far', 'file-alt']" />
                                <p class="mb-0">Page</p>
                            </div>
                            <p class="mb-0 font-weight-400 fp-text-color-main">
                                The focus of the pages is to build your network. Only the page admin can control and post all the page content.
                            </p>
                        </a>
                    </div>
                </div>
            </fp-modal>
        </div>
    </div>
</template>
<script>
import FpModal from "~/components/ui/Modal.vue";
export default {
    name: 'AddGroup',
    components: {
        FpModal,
    },
    props: {
        type: { type: String, default: 'group' },
    },
    methods: {
        selectType() {
            this.$modal.show('addGroupModal');
        },
        createGroup(type) {
            this.$router.push({name: 'fliconn.group.create', params: {type: type}});
            this.$modal.hide('addGroupModal');
            this.$emit('selected');
        },
    }
}
</script>
<style lang="scss" scoped>
    .btn-create {
        padding: 11px 20px;
        font-size: 12px;
        line-height: 1.29;
        color: #FFF;
        background-color: #28A745;
        border-radius: 10px;
        text-decoration: none;
        white-space: nowrap;
        @media (max-width: 600px) {
            padding: 11px 12px;
        }
    }
    .btn-create-group {
        display: block;
        text-decoration: none;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        transition: background .05s ease-in;
        height: 100%;
        @media (max-width: 600px) {
            font-size: 13.6px;
        }
        .icon {
            font-size: 31px;
            width: 65px;
            height: 65px;
            min-width: 65px;
            margin: 0 auto 6px;
            p {
                font-size: 18px;
            }
        }
    }
    .btn-close {
        position: absolute;
        top: 6px;
        right: 12px;
        cursor: pointer;
    }
    .add-button:hover {
        text-decoration: none;
    }
</style>