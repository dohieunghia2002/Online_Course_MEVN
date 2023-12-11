<template>
    <div class="nav--pc h-100 grid wide" :key="idxMenu">
        <div class="row h-100" style="align-items: center;">
            <div class="h-100 col lg-2">
                <div class="logo__wrapper">
                    <img src="../../assets/images/logo.png" alt="logo" class="logo w-100">
                </div>
            </div>

            <div class="col lg-6">
                <ul class="menu">
                    <li class="menu__item" @click="() => idxMenu = 0">
                        <router-link :to="{ name: 'home' }" class="menu__link">Trang Chủ</router-link>
                    </li>
                    <li class="menu__item" @click="() => idxMenu = 1">
                        <router-link :to="{ name: 'courses' }" class="menu__link">Khóa Học</router-link>
                    </li>
                    <li class="menu__item" @click="() => idxMenu = 2">
                        <router-link :to="{ name: 'teacher' }" class="menu__link">Giáo Viên</router-link>
                    </li>
                </ul>
            </div>

            <div class="col-login col lg-2 lg-o-2">
                <div class="btn--login" v-if="userStore?.account._id.length === 0" @click="() => idxMenu = -1">
                    <router-link :to="{ name: 'login' }" class="btn__link">Đăng nhập</router-link>
                </div>

                <div class="user__menu h-100" v-else>
                    <div class="dropdown w-100 h-100">
                        <div class="dropbtn w-100 h-100" @click="handleToggleUserDropMenu" style="display: flex;">
                            <div class="avatar__wrapper" v-if="userStore?.account.avatar?.url">
                                <img :src="userStore?.account.avatar.url" alt="avatar" id="dropbtn-avatar"
                                    class="avatar w-100">
                            </div>
                            <vue-avatar :username="nameAvatar()" id="dropbtn-avatar" style="margin-right: 8px;" v-else />
                            <span>{{ nameAvatar() }}</span>
                        </div>

                        <div id="user-dropdown" class="dropdown__content">
                            <div class="user__info">
                                <p>{{ userStore.account.fullName }}</p>
                                <span style="font-size: 0.9rem; color: #969595; font-style: italic;">
                                    {{ userStore.account.role }}
                                </span>
                            </div>
                            <hr />

                            <ul class="categories">
                                <li class="categories__item" v-if="userStore.account.role == 'Teacher'">
                                    <router-link :to="{ name: 'teacher-courses', params: { id: userStore.account._id } }"
                                        class="categories__link">
                                        Khóa học của tôi
                                    </router-link>
                                </li>
                                <li class="categories__item" v-else>
                                    <router-link :to="{ name: 'courses-student', params: { id: userStore.account._id } }"
                                        class="categories__link">
                                        Khóa học của tôi
                                    </router-link>
                                </li>
                                <li class="categories__item" v-if="userStore.account.role == 'Teacher'">
                                    <router-link :to="{ name: 'teacher-locked', params: { id: userStore.account._id } }"
                                        class="categories__link">
                                        Khóa học đã khóa
                                    </router-link>
                                </li>
                                <li class="categories__item" @click="userStore.handleLogout()">
                                    <div class="categories__link">
                                        Đăng xuất
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../../stores/user.js';
import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";

export default {
    components: {
        VueAvatar
    },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            idxMenu: 0
        }
    },
    methods: {
        removeAccents(str) {
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },

        nameAvatar() {
            const temp = this.removeAccents(this.userStore.account.fullName);
            const name = temp.split(' ');
            return name[name.length - 1];
        },

        handleToggleUserDropMenu() {
            const userDropdown = document.getElementById('user-dropdown');
            userDropdown.classList.toggle('show');

            window.onclick = function (e) {
                if (!e.target.matches('#dropbtn-avatar') && !e.target.matches('.dropbtn')) {
                    var dropdowns = document.getElementsByClassName("dropdown__content");
                    if (userDropdown.classList.contains('show')) {
                        userDropdown.classList.remove('show');
                    }
                }
            }
        },

        activeMenuLink() {
            const menuItems = document.getElementsByClassName('menu__item');
            for (let i = 0; i < menuItems.length; i++) {
                if (i == this.idxMenu) {
                    menuItems[i].classList.add('active');
                } else {
                    menuItems[i].classList.remove('active');
                }
            }
        }
    },
    async mounted() {
        this.activeMenuLink();
    },
    async updated() {
        this.activeMenuLink();
    }
}
</script>

<style lang="scss" scoped>
.logo__wrapper {
    width: 100%;

    .logo {
        height: calc($height-header * 80/100);
    }
}

.menu {
    color: $primary-color;
    text-decoration: none;
    list-style: none;
    display: flex;
    justify-content: space-around;
}

.menu__item.active .menu__link {
    background-color: $primary-color;
    opacity: 0.8;
    color: $white-text-color;
}

.col-login {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.btn--login {
    color: white;
}

.btn__link,
.menu__link {
    text-decoration: none;
    color: inherit;
    font-weight: 700;
    font-size: 1.3rem;
    padding: 8px 12px;
    border-radius: 6px;
    text-transform: uppercase;
}

.btn__link,
.menu__link:hover {
    background-color: $primary-color;
    opacity: 0.8;
    color: $white-text-color;
}

.menu__link {
    display: block;
}

.btn__link {
    float: right;
}

.user__menu {
    float: inline-end;
}

.dropbtn {
    color: $black-text-color;
    font-weight: 600;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.dropdown {
    position: relative;
}

.dropdown__content {
    display: none;
    position: absolute;
    top: 110%;
    right: 5%;
    min-width: 220px;
    background-color: #e4e2e2;
    border-radius: 4px;
    overflow: hidden;
    text-align: center;
    cursor: pointer;

    &.show {
        display: block;
    }
}

.categories {
    list-style: none;
}

.categories__link {
    text-decoration: none;
    color: $black-text-color;
    display: block;
    width: 100%;
    line-height: 2.5rem;
    border-bottom: 1px solid #bfbebe;

    &:hover {
        background-color: $primary-color;
        color: white;
        opacity: 0.8;
    }
}

.avatar__wrapper {
    padding: 8px;
    width: 44.45%;
    max-height: 100%;

    .avatar {
        aspect-ratio: 1/1;
        border-radius: 50%;
    }
}

@media (max-width: 1023px) {
    .nav--pc {
        display: none !important;
    }
}
</style>