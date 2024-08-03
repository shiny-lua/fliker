<template>
    <div class="dropdown dropdown-gif">
        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" ref="dropdownToggle">
            <fp-icon name="gif" class="fp-fs-22 fp-text-active" />
        </a>
        <div class="dropdown-menu">
            <div class="gif-wrapper">
                <a v-for="(item, index) in gifUrls" :key="index" href="javascript:;" class="react-gif zoom zoom-14"
                   @click="$emit('selected', item)">
                    <img :src="item.url" style="size: 100%;" :alt="item.alias">
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import gifs from "./gif";
export default {
    name: 'ChatGif',
    data() {
        return {
            gifs: gifs,
        }
    },
    computed: {
        gifUrls() {
            return this.gifs.map(i => {
                return {
                    alias: i,
                    url: require(`@/assets/images/gif/${i}.gif`),
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.dropdown-gif {
    .dropdown-toggle {
        line-height: 22px;
        text-decoration: none;

        &::after {
            display: none;
        }

        &:hover {
            text-decoration: none;
        }

        .is_reacted {
            font-size: 13.6px;
        }
    }

    // @media (max-width: 600px) {
    //     .dropdown-menu {
    //         left: -130px !important;
    //         transform: none !important;
    //     }
    // }
    .dropdown-menu {
        position: absolute;
        top: 0;
        transform: translate3d(-156px, -275px, -10px) !important;
        width: 260px;
        height: 260px;
        padding: 8px 9px;
        border-radius: 8px;

        .title {
            font-weight: 500;
            font-size: 15px;
            margin-bottom: 4px;
        }

        .gif-wrapper {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
            /* Adjust min size as needed */
            gap: 4px;
            /* Space between items */

            .react-gif {
                display: block;
                border-radius: 5px;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>