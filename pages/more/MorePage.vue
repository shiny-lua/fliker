<template>
    <div>
        <ul class="breadcrumb">
            <li><router-link :to="{name: 'more'}" class="text-underline">Back</router-link></li>
            <li v-for="item in breadcrumbs" :key="item.label">
                <router-link v-if="item.route" :to="{name: item.route}">{{item.label}}</router-link>
                <a v-else href="javascript:;" class="text-dark">{{item.label}}</a>
            </li>
        </ul>
        <div>
            <slot />
        </div>
    </div>
</template>
<script>
export default {
    name: 'MorePage',
    props: ['breadcrumbs'],
}
</script>
<style lang="scss" scoped>
    ul.breadcrumb {
        padding: 10px 0;
        list-style: none;

        /* Display list items side by side */
        li {
            display: inline;
            font-size: 16px;
            a {
                color: #0275d8;
                text-decoration: none;
                font-weight: 500;
                &:hover {
                    color: #01447e;
                    text-decoration: underline;
                }
            }
        }

        /* Add a slash symbol (/) before/behind each list item */
        li+li:before {
            padding: 8px;
            color: black;
            content: "\003E";
        }
    }
</style>
