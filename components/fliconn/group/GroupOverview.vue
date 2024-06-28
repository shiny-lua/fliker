<template>
    <div class="group-overview">
        <ul class="nav nav-filter justify-content-between mb-3 mb-md-4">
            <li class="nav-item">
                <a class="nav-link fp-text-color-main" :class="{ active: tab === 'timeline' }" @click.prevent="tab = 'timeline'">Posts <span v-if="group">({{group.posts_count}})</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link fp-text-color-main" :class="{ active: tab === 'members' }" @click.prevent="tab = 'members'">Members <span v-if="group">({{group.joined_count}})</span></a>
            </li>
            <li class="nav-item dropdown">
                <a href="javascript:;"
                    class="nav-link fp-text-color-main dropdown-toggle"
                    :class="{ active: tab === 'media' }"
                    @click.prevent="tab = 'media'"
                    data-toggle="dropdown"
                >
                    All Media <span v-if="group">({{group.media_count}})</span>
                    <fp-icon name="chevron-down" class="fp-fs-18" />
                </a>
                <div class="dropdown-menu">
                    <a href="javascript:;" class="dropdown-item" :class="media_type === 'image' && 'active'" @click.prevent="media_type = 'image'">
                        <fp-icon name="image-gallery" class="fp-fs-18" />
                        Photos
                    </a>
                    <a href="javascript:;" class="dropdown-item" :class="media_type === 'video' && 'active'" @click.prevent="media_type = 'video'">
                        <fp-icon name="video" class="fp-fs-18" />
                        Videos
                    </a>
                    <a href="javascript:;" class="dropdown-item" :class="media_type === 'document' && 'active'" @click.prevent="media_type = 'document'">
                        <fp-icon name="report" class="fp-fs-18" />
                        Documents
                    </a>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link fp-text-color-main" :class="{ active: tab === 'about' }" @click.prevent="tab = 'about'">About</a>
            </li>
        </ul>
        <div>
            <transition>
                <div v-if="group && tab === 'timeline'">
                    <add-post-link v-if="postable"
                         :query="{ group_id: group.id }"
                         :placeholder="`Post in this ${group.type}...`"
                         :bg-reverse-sm="false"
                    />
                    <div v-if="posts.length">
                        <timeline-item v-for="(item, index) in posts"
                             :key="index"
                             :post="item"
                             v-show="item.visible"
                             page="page"
                             @user-selected="goFliconnProfile(item.user)"
                             class="mb-3"
                        ></timeline-item>
                    </div>
                    <p v-else class="text-center text-muted mt-4">No posts found!</p>
                </div>
            </transition>
            <transition>
                <div v-if="group && tab === 'members'" class="px-1">
                    <!-- <div v-if="group.joins.length" class="row mx-n1">
                        <div v-for="item in group.joins" :key="item.id" class="col-6 col-md-4 px-1 mb-2" @click="goFliconnProfile(item)">
                            <group-member :group="group" :user="item"></group-member>
                        </div>
                    </div>
                    <p v-else class="text-center text-muted mt-4">No members found!</p> -->
                    <fliconn-user-list model="group"
                         :id="this.group.id"
                         :user_id="this.group.user_id"
                        @remove-joins="group.joined_count--"
                    />
                </div>
            </transition>
            <transition>
                <div v-if="group && tab === 'media'" class="px-1">
                    <div v-if="medias.length" class="row mx-n1">
                        <div v-for="(item, index) in medias" :key="index" class="col-4 col-md-3 px-1 mb-2">
                            <div class="media">
                                <fa v-if="item.mime === 'video'" :icon="['far', 'play-circle']" />
                                <video v-if="item.mime == 'video'"
                                     :src="item.src_url"
                                     class="mb-2"
                                     width="100%"
                                     height="100%"
                                    @click="openGallery(item.src_url)"
                                >
                                    <source :src="item.src_url" type="video/mp4" />
                                </video>
                                <img v-else-if="item.mime == 'image'"
                                     :src="item.src_url"
                                     alt=""
                                     @click="openGallery(item.src_url)"
                                />
                                <audio v-else-if="item.mime == 'audio'" :src="item.src_url" controls>
                                    <source :src="item.src_url" type="audio/ogg">
                                    <source :src="item.src_url" type="audio/mpeg">
                                    Your browser does not support the audio element.
                                </audio>
                                <a v-else-if="item.mime === 'text'"
                                     :href="item.src_url"
                                     download
                                     target="_blank"
                                     class="media-attachment"
                                >
                                    <img
                                        src="@/assets/images/icons/text-format.png"
                                        alt=""
                                        @click="downloadAttachment(item.src_url)"
                                    />
                                </a>
                                <a v-else-if="item.mime === 'word'"
                                     :href="item.src_url"
                                     download
                                     target="_blank"
                                     class="media-attachment"
                                >
                                    <img
                                        src="@/assets/images/icons/word.png"
                                        alt=""
                                        @click="downloadAttachment(item.src_url)"
                                    />
                                </a>
                                <a v-else-if="item.mime === 'pdf'"
                                     :href="item.src_url"
                                     download
                                     target="_blank"
                                     class="media-attachment"
                                >
                                    <img
                                        src="@/assets/images/icons/pdf.png"
                                        alt=""
                                        @click="downloadAttachment(item.src_url)"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-center text-muted mt-4">No media found!</p>
                </div>
            </transition>
            <transition>
                <div v-if="group && tab === 'about'" class="">
                    <p class="fp-text-color-main fp-border-color-1 font-weight-400 pb-3" style="border-bottom-style: solid; border-bottom-width: 1px;">{{ group.description }}</p>
                    <div class="row mx-n1 mx-md-n2">
                        <div class="col-md-6 px-1 px-md-2 mb-4">
                            <h6>Contact Info</h6>
                            <div class="group-info fp-text-color-main">
                                <fp-icon name="email" class="fp-fs-20" />
                                {{ show_email ? group.email : $hiddenEmailFormatter(group.email) }}
                                <a v-if="!show_email" href="javascript:;" @click.prevent="showRecaptcha('email')" class="ml-2">
                                    <fp-icon name="eye" class="fp-fs-20" />
                                </a>
                            </div>
                            <div v-if="group.phone_number" class="group-info fp-text-color-main">
                                <fp-icon name="phone" class="fp-fs-20" />
                                {{ show_phone_number ? group.phone_number : $hiddenPhoneNumberFormatter(group.phone_number) }}
                                <a v-if="!show_phone_number" href="javascript:;" @click.prevent="showRecaptcha('phone_number')" class="ml-2">
                                   <fp-icon name="eye" class="fp-fs-20" />
                                </a>
                            </div>
                            <div v-if="group.location" class="group-info fp-text-color-main mb-2">
                                <fp-icon name="location" class="fp-fs-22" />
                                <a href="javascript:;">{{ group.location.display_address }}</a>
                            </div>
                        </div>
                        <div v-if="group.facebook || group.twitter || group.linkedin || group.weblink" class="col-md-6 px-1 px-md-2 mb-4">
                            <h6>Social Links</h6>
                            <div v-if="group.facebook" class="group-link fp-text-color-main">
                                <fp-icon name="facebook" class="fp-fs-20" />
                                <a :href="group.facebook" target="_blank">{{ group.facebook }}</a>
                            </div>
                            <div v-if="group.twitter" class="group-link fp-text-color-main">
                                <fp-icon name="twitter" class="fp-fs-20" />
                                <a :href="group.twitter" target="_blank">{{ group.twitter }}</a>
                            </div>
                            <div v-if="group.linkedin" class="group-link fp-text-color-main">
                                <fp-icon name="linkedin" class="fp-fs-20" />
                                <a :href="group.linkedin" target="_blank">{{ group.linkedin }}</a>
                            </div>
                            <div v-if="group.weblink" class="group-link fp-text-color-main">
                                <fp-icon name="globe" class="fp-fs-18" />
                                <a :href="group.weblink" target="_blank">{{ group.weblink }}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <light-box ref="mediaGalleryBox" :media="galleries" :show-light-box="false"></light-box>

        <div class="auth-modal">
            <modal name="recaptcha" width="318" height="auto">
                <div class="p-2">
                    <h6 class="bg-danger text-center text-white mb-0 py-2">
                        Please verify you are a real person
                    </h6>
                    <div class="recaptcha-container">
                        <recaptcha @success="recaptchaSuccess" />
                    </div>
                </div>
            </modal>
        </div>
    </div>
</template>
<script>
    import TimelineItem from "~/components/fliconn/timeline/TimelineItem.vue";
    import AddPostLink from "~/components/fliconn/AddPostLink.vue";
    // import GroupMember from "./GroupMember.vue";
    import FliconnUserList from "~/components/fliconn/user/UserList.vue";
    import LightBox from "vue-it-bigger";
    import("vue-it-bigger/dist/vue-it-bigger.min.css");
    export default {
        name: "GroupOverview",
        props: {
            group: { type: Object, required: true },
        },
        components: {
            TimelineItem,
            LightBox,
            AddPostLink,
            FliconnUserList,
        },
        data() {
            return {
                recaptcha_site_key: process.env.recaptchaSiteKey,
                tab: "timeline",
                posts: [],
                medias: [],
                show_email: false,
                show_phone_number: false,
                recaptcha_field: "email",
                media_type: '',
            };
        },
        computed: {
            joined() {
                return this.auth_user && this.group && this.group.type === "group" && this.group.joins.find((i) => i.id === this.auth_user.id);
            },
            postable() {
                return this.auth_user && this.group && (this.group.user_id === this.auth_user.id || (this.group.is_postable && this.group.joins.find((i) => i.id === this.auth_user.id)));
            },
            galleries() {
                return this.medias.filter(i => i.mime === 'video' || i.mime === 'image').map((i) => {
                    let item = {
                        caption: null,
                        src: i.src_url,
                        thumb: i.src_url,
                        type: i.mime,
                    };
                    if (i.mime === "video") {
                        item.sources = [
                            {
                                src: i.src_url,
                                type: "video/mp4",
                            },
                        ];
                        item.width = 800;
                        item.height = 600;
                        item.autoplay = true;
                    }
                    return item;
                });
            },
            map_center() {
                return this.group && this.group.location
                    ? {
                          lat: Number(this.group.location.latitude),
                          lng: Number(this.group.location.longitude),
                      }
                    : null;
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        watch: {
            tab(value) {
                if (value === "media") {
                    this.getMedia();
                }
            },
            media_type(value) {
                this.getMedia();
            }
        },
        mounted() {
            this.getPosts();
        },
        methods: {
            async getPosts() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_posts`, { group_id: this.group.id });
                this.posts = response.data.data;
            },
            async getMedia() {
                let filter = {
                    media_type: this.media_type,
                    group_id: this.group.id,
                };
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_media`, filter);
                this.medias = response.data.data;
            },
            goFliconnProfile(item) {
                this.$router.push({
                    name: "fliconn.profile",
                    params: { username: item.username },
                });
            },
            openGallery(url) {
                const index = this.galleries.findIndex(i => i.src === url);
                this.$refs.mediaGalleryBox.showImage(index);
            },
            showRecaptcha(field) {
                this.recaptcha_field = field;
                this.$modal.show("recaptcha");
            },
            recaptchaSuccess() {
                if (this.recaptcha_field === "email") this.show_email = true;
                if (this.recaptcha_field === "phone_number") this.show_phone_number = true;
                this.$modal.hide("recaptcha");
            },
        },
    };
</script>
<style lang="scss" scoped>
    .nav.nav-filter {
        // flex-wrap: nowrap;
        // overflow: auto;
        .nav-link {
            background-color: unset;
            font-size: 14.4px;
            font-weight: bold;
            padding: 8px 10px 5px;
            cursor: pointer;
            border-bottom: solid 2px transparent;
            @media (max-width: 600px) {
                font-size: 13px;
                padding-left: 5px;
                padding-right: 5px;
            }
            &.active {
                color: #FF22A1;
                border-bottom-color: #FF22A1;
            }
            &:hover {
                color: #FF22A1;
            }
            &.dropdown-toggle {
                &::after {
                    display: none;
                }
            }
        }
        .dropdown {
            .dropdown-menu {
                padding: 0 10px;
                border-radius: 8px;
                .dropdown-item {
                    font-size: 14.4px;
                    padding: 8px 0px;
                    cursor: pointer;
                    border-bottom: 0.68px solid #0000001A;
                    line-height: 18px;
                    &:hover {
                        background: none;
                    }
                    &:last-child {
                        border-bottom: none;
                    }
                    &.active {
                        color: #28A745;
                        background: none;
                    }
                }
            }
        }
    }
    .connection-user {
        .user-profile {
            position: relative;
            padding-bottom: 100%;
            cursor: pointer;
            border-radius: 6px;
            overflow: hidden;
            .cover_image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .photo {
                position: absolute;
                left: 5px;
                bottom: 5px;
                border: solid 2px #004080;
                width: 35px;
                height: 35px;
                object-fit: cover;
                border-radius: 100px;
            }
        }
        .name {
            margin-bottom: 0;
            font-weight: 500;
            color: #212529;
        }
        .btn {
            color: #007bff;
            border: solid 1px #ced4da;
            font-weight: 500;
        }
    }
    .media {
        position: relative;
        padding-bottom: 100%;
        img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
        }
        video {
            position: absolute;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
        }
        svg {
            position: absolute;
            top: 40%;
            left: 40%;
            z-index: 1;
            font-size: 25px;
            color: #fff;
        }
    }
    .group-info {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-weight: 400;
        svg {
            width: 20px;
            min-width: 20px;
            margin-right: 8px;
        }
        a {
            color: inherit;
        }
    }
    .group-link {
        margin-bottom: 12px;
        font-weight: 400;
        svg {
            width: 24px;
        }
        a {
            text-decoration: none;
            color: inherit;
        }
    }
</style>
