<template>
    <div class="card-clips">
        <div class="cover">
            <div class="clips-user" @click.stop="goToProfile()">
                <img :src="clips.user.photo_url" class="mr-1" alt="" />
                {{ clips.user.first_name }}
            </div>
            <div class="description">
                {{clips.description }}
            </div>
            <span class="view_count">
                {{ $nFormatter(clips.view_count) }} views
            </span>

            <div class="dropdown dropdown-context-menu">
                <a href="javascript:;" class="dropdown-toggle btn-context-menu no-caret" data-toggle="dropdown">
                    <fp-icon name="dots-circle-h" class="fp-fs-22" />
                </a>
                <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                    <template v-if="isMyClips">
                        <li class="dropdown-item" @click="remove()">
                            <fp-icon name="trash" />
                            <div>
                                <p>Delete Short Flick</p>
                                <p>Permanently remove short flick</p>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <li v-if="!clips.is_reported" class="dropdown-item" @click="report()">
                            <fp-icon name="flag" />
                            <div>
                                <p>Report</p>
                                <p>Flag for admin review</p>
                            </div>
                        </li>
                        <li class="dropdown-item" @click="bookmark()">
                            <fp-icon name="heart" />
                            <div>
                                <p>{{ clips.is_bookmarked ? "Remove from Favourite" : "Favourite" }}</p>
                                <p>{{ clips.is_bookmarked ?  'Remove' : 'Save'}} this post in your favourite</p>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <video ref="clipVideo"
             :src="clips.path"
             class="card-img-top"
             :poster="clips.thumbnail_url"
             onmouseover="this.play()"
             onmouseleave="this.pause();"
             muted
             @click="$emit('open')"
        ></video>
    </div>
</template>
<script>
    import Swal from "sweetalert2";
    import { mapGetters } from "vuex";
    import eventBus from '~/plugins/event-bus';
    export default {
        name: "ClipsItem",
        props: {
            clips: { type: Object, required: true },
        },
        data() {
            return {
                duration: "",
            };
        },
        computed: {
            isMyClips() {
                return this.auth_user && this.auth_user.id === this.clips.id;
            },
            reportUrl() {
                return `${process.env.clipsApiUrl}/clips/report`;
            },
            ...mapGetters({
                auth_user: 'auth/user',
            })
        },
        mounted() {
            var _this = this;
            this.$refs.clipVideo.addEventListener("loadedmetadata", function () {
                _this.duration = new Date(this.duration * 1000).toISOString().substring(14, 19);
            });
            eventBus.$on('reported', (payload) => {
                this.reported(payload);
            });
        },
        beforeDestroy() {
            eventBus.$off('reported', (payload) => {
                this.reported(payload);
            });
        },
        methods: {
            goToProfile() {
                this.$router.push({
                    name: "fliconn.profile",
                    params: { username: this.clips.user.username },
                });
            },
            remove() {
                Swal.fire({
                    title: "Do you want to delete a short Flick?",
                    icon: "warning",
                    showCancelButton: true,
                    color: '#212529',
                    confirmButtonText: 'Yes',
                    confirmButtonColor: '#FF0000',
                    iconColor: '#FF0000'
                }).then((willDelete) => {
                    if (willDelete.isConfirmed) {
                        this.axios.delete(`${process.env.clipsApiUrl}/clips/delete/${this.clips.id}`).then((response) => {
                            this.$emit("deleted", this.clips.id);
                        });
                    }
                });
            },
            bookmark() {
                if (!this.auth_user) {
                    return false;
                }
                this.axios.post(`${process.env.clipsApiUrl}/clips/bookmark`, {
                        id: this.clips.id,
                        model: 'clip',
                    }).then((response) => {
                        if (response.data.status == "Success") {
                            this.clips.is_bookmarked = response.data.data;
                            if (!response.data.data) {
                                this.$emit('bookmark-removed');
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            report() {
                if (!this.auth_user) {
                    this.$login(this.$route.path);
                    return false;
                }
                if (this.clips.is_reported) {
                    return this.$toast.error("This short flicks has already been reported");
                }
                const payload = {
                    url: this.reportUrl,
                    params: {
                        id: this.clips.id,
                        model: 'clips',
                    },
                }
                this.$report(payload);
            },
            reported(payload) {
                if (payload.model === 'clips' && payload.id === this.clips.id) {
                    this.clips.is_reported = true;
                    if (this.clips.enable_notification) {
                        let notiFb = this.$fire.database.ref("notifications/" + this.clips.user_id).push();
                        notiFb.set({
                            notifier_id: this.auth_user.id,
                            type: "report_clips",
                        });
                    }
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
    .card-clips {
        position: relative;
        box-shadow: 4px 4px 9px 0px #00000026;
        height: 258px;
        border-radius: 8px;
        .cover {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 34px;
            .description {
                position: absolute;
                bottom: 0;
                width: 100%;
                font-size: 13px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 8px 2px;
                line-height: 15px;
            }
            .view_count {
                color: #FFF;
                font-size: 15px;
                font-weight: 400;
            }
        }
        .card-img-top {
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
        }
        .card-footer {
            height: 30px;
            font-size: 12px;
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 0;
            width: 100%;
            color: #999999;
            padding: 0 8px;
            svg {
                font-size: 14px;
            }
            img {
                width: 14px;
                height: 14px;
            }
        }
        &.mini {
            .cover {
                height: 120px;
            }
            .card-img-top {
                height: 120px;
            }
            .clips-user {
                img {
                    width: 30px;
                    height: 30px;
                }
            }
        }
        .clips-user {
            display: flex;
            align-items: center;
            font-weight: 400;
            font-size: 14.4px;
            position: absolute;
            top: 8px;
            left: 8px;
            z-index: 1;
            cursor: pointer;
            img {
                width: 40px;
                height: 40px;
                object-fit: cover;
                border: solid 2px #fff;
                border-radius: 100%;
            }
        }

        .dropdown-context-menu {
            position: absolute;
            top: 6px;
            right: 6px;
            z-index: 1;
        }
    }
</style>
