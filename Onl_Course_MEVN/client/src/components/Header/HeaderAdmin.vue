<template>
    <div class="nav--pc h-100 grid wide">
        <div class="row h-100" style="align-items: center;">
            <div class="col lg-2 md-2 heading-welcome">
                <h3>Xin chào Admin!</h3>
            </div>

            <div class="col lg-2 lg-o-3 md-3 md-o-2 col-6">
                <div class="logo__wrapper">
                    <img src="../../assets/images/logo.png" class="logo" alt="logo">
                </div>
            </div>

            <div class="col lg-2 lg-o-3 md-3 md-o-2 col-6">
                <div class="btn--login" v-if="userStore?.account._id.length === 0">
                    <router-link :to="{ name: 'admin-login' }" class="btn__link">Đăng nhập</router-link>
                </div>

                <div class="user__menu h-100" v-else>
                    <div class="dropdown w-100 h-100">
                        <div class="dropbtn w-100 h-100" @click="handleToggleUserDropMenu">
                            <vue-avatar :username="nameAvatar()" id="dropbtn-avatar" />
                            {{ nameAvatar() }}
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
                                <li class="categories__item">
                                    <router-link :to="{ name: 'admin' }" class="categories__link">
                                        Danh mục
                                    </router-link>
                                </li>
                                <li class="categories__item">
                                    <router-link :to="{ name: 'ad-locked' }" class="categories__link">
                                        Danh sách đã khóa
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
        }
    },
}
</script>

<style lang="scss" scoped>
.logo__wrapper {
    width: 100%;

    .logo {
        height: calc($height-header * 80/100);
    }
}

.btn--login {
    color: white;
}

.btn__link {
    text-decoration: none;
    color: inherit;
    font-weight: 700;
    padding: 8px 12px;
    border-radius: 6px;
    background-color: $primary-color;
    font-size: 1.3rem;
    opacity: 0.8;
    color: $white-text-color;
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

@media (max-width: 739px) {
    .heading-welcome {
        display: none;
    }
}
</style>