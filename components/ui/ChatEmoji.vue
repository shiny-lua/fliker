<template>
    <div class="dropdown dropdown-emoji">
        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" ref="dropdownToggle">
            <fp-icon name="emoji" class="fp-fs-22 fp-text-active" />
        </a>
        <div class="dropdown-menu">
            <div class="emoji-wrapper">
                <a v-for="(item, index) in emojiUrls"
                     :key="index"
                     href="javascript:;"
                     class="react-emoji zoom zoom-14"
                     @click="$emit('selected', item)"
                >
                    <img :src="item.url" width="32" height="32" :alt="item.alias">
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    import emojis from "./emoji";
    export default {
        name: 'ChatEmoji',
        data() {
            return {
                emojis: emojis,
            }
        },
        computed: {
            emojiUrls() {
                return this.emojis.map(i => {
                    return {
                        alias: i,
                        url: require(`@/assets/images/emojis/${i}.gif`),
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .dropdown-emoji {
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
            transform: translate3d(-143px, -275px, -10px) !important;
            width: 260px;
            padding: 8px 9px;
            border-radius: 8px;
            .title {
                font-weight: 500;
                font-size: 15px;
                margin-bottom: 4px;
            }
            .emoji-wrapper {
                display: flex;
                flex-wrap: wrap;
                .react-emoji {
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