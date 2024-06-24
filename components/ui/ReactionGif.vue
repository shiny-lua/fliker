<template>
    <div class="dropdown dropdown-gif">
        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
            <fp-icon name="gif" class="fp-fs-18" />
        </a>
        <div class="dropdown-menu dropdown-menu-right">
            <div class="gif-wrapper">
                <a href="javascript:;" v-for="(item, index) in gifImages" :key="index" class="react-gif zoom zoom-14" @click.stop="$emit('selected', item)">
                    <img :src="item.url" width="32" height="32" alt="">
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    import gifs from "./gif.js";
    export default {
        name: 'ReactionGif',
        data() {
            return {
                gifs: gifs,
            }
        },
        computed: {
            gifImages() {
                return this.gifs.map(i => {
                    return {
                        name: i,
                        // url: require(`@/assets/images/gifs/${i}.gif`),
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .dropdown-gif {
        .dropdown-toggle {
            line-height: 22px;
            font-size: 21px;
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
        @media (max-width: 600px) {
            .dropdown-menu {
                left: -130px !important;
                transform: none !important;
            }
        }
        .dropdown-menu {
            width: 260px;
            padding: 9px;
            border-radius: 8px;
            .gif-wrapper {
                display: flex;
                flex-wrap: wrap;
                .react-gif {
                    margin-bottom: 0;
                    font-size: 22px;
                    display: block;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    text-decoration: none;
                }
            }
        }
    }
</style>