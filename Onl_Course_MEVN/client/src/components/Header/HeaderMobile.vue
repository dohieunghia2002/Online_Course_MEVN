<template>
    <div class="nav--mobile h-100 grid wide">
        <div class="row h-100" style="align-items: center;">
            <div class="col md-1 col-1">
                <label for="nav-mobile__input" class="nav__bars-btn">
                    <font-awesome-icon :icon="['fas', 'bars']" class="menu__icon" />
                </label>
            </div>

            <div class="h-100 col md-6 md-o-2 col-6 col-o-1">
                <div class="nav-mobile__logo h-100">
                    <img src="../../assets/images/logo.png" alt="logo" class="logo__img w-100 h-100">
                </div>
            </div>
            <div class="h-100 col md-3 col-4" style="display: flex; align-items: center; justify-content: flex-end;">
                <div class="btn--login" v-if="userStore.account._id.length === 0">
                    <router-link :to="{ name: 'login' }" class="btn__link">Đăng nhập</router-link>
                </div>
                <div class="menu-user h-100" v-else>
                    <div class="avatar__wrapper">
                        <img :src="userStore.account.avatar.url" class="avatar w-100" alt="avatar">
                    </div>
                    <h3 class="user__name" style="margin-left: 6px;">
                        {{ name }}
                    </h3>
                </div>
            </div>
        </div>
    </div>

    <input type="checkbox" hidden class="nav-mobile__input" id="nav-mobile__input">
    <label for="nav-mobile__input" class="overlay--nav"></label>

    <nav class="nav-mobile__menu">
        <label for="nav-mobile__input" class="btn__close">
            <font-awesome-icon :icon="['fas', 'times']" />
        </label>
        <div style="margin-top: 2.75rem;"></div>
        <div class="user__wrapper" v-if="userStore.account._id.length > 0">
            <div class="avatar__container">
                <div class="user__avatar">
                    <img :src="userStore.account.avatar.url" class="avatar__img" alt="avatar">
                </div>
                <h4 class="text-center" style="line-height: 2.6rem;">{{ userStore.account.fullName }}</h4>
            </div>
        </div>
        <ul class="menu--personal" v-if="userStore.account._id.length > 0 && userStore.account.role === 'Student'">
            <li class="nav-mobile__item">
                <font-awesome-icon :icon="['fas', 'graduation-cap']" class="nav-mobile__icon" />
                <router-link :to="{ name: 'courses-student', params: { id: userStore.account._id } }"
                    class="nav-mobile__link">
                    Khóa học của tôi
                </router-link>
            </li>
        </ul>
        <ul class="menu--personal" v-if="userStore.account._id.length > 0 && userStore.account.role === 'Teacher'">
            <li class="nav-mobile__item">
                <font-awesome-icon :icon="['fas', 'school']" />
                <router-link :to="{ name: 'teacher-courses', params: { id: userStore.account._id } }"
                    class="nav-mobile__link">
                    Khóa học của tôi
                </router-link>
            </li>
            <li class="nav-mobile__item">
                <font-awesome-icon :icon="['fas', 'lock']" />
                <router-link :to="{ name: 'teacher-locked', params: { id: userStore.account._id } }"
                    class="nav-mobile__link">
                    Khóa học đã khóa
                </router-link>
            </li>
        </ul>
        <ul class="nav-mobile__list">
            <li class="nav-mobile__item" v-if="userStore.accessToken.length === 0">
                <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="nav-mobile__icon" />
                <router-link :to="{ name: 'login' }" class="nav-mobile__link">Đăng nhập</router-link>
            </li>
            <li class="nav-mobile__item">
                <font-awesome-icon :icon="['fas', 'home']" class="nav-mobile__icon" />
                <router-link :to="{ name: 'home' }" class="nav-mobile__link">Trang chủ</router-link>
            </li>
            <li class="nav-mobile__item">
                <font-awesome-icon :icon="['fas', 'graduation-cap']" class="nav-mobile__icon" />
                <router-link :to="{ name: 'courses' }" class="nav-mobile__link">Khóa học</router-link>
            </li>
            <li class="nav-mobile__item">
                <font-awesome-icon :icon="['fas', 'chalkboard-teacher']" class="nav-mobile__icon" />
                <router-link :to="{ name: 'teacher' }" class="nav-mobile__link">Giáo viên</router-link>
            </li>
            <li class="nav-mobile__item" @click="userStore.handleLogout()">
                <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="nav-mobile__icon" />
                <div class="nav-mobile__link">Đăng xuất</div>
            </li>
        </ul>
    </nav>
</template>

<script>
import { useUserStore } from '../../stores/user.js';

export default {
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },

    computed: {
        name() {
            const result = this.userStore.account.fullName.split(' ');
            return result[result.length - 1];
        }
    },
}
</script>

<style lang="scss" scoped>
.nav--mobile {
    display: none;
}

.nav__bars-btn {
    display: block;
    width: 36px;
    height: 36px;

    .menu__icon {
        width: 100%;
        height: 100%;
    }
}

.btn--login {
    width: 80%;
    height: 60%;
    background-color: $primary-color;
    color: $white-text-color;
    font-weight: 600;
    border: none;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn__link {
    color: inherit;
    text-decoration: none;
}

.nav-mobile__list {
    list-style: none;
}

.btn__close {
    position: absolute;
    font-size: 1.4rem;
    top: .8rem;
    right: 1rem;
    cursor: pointer;
    opacity: 1;

    &:hover {
        opacity: 0.6;
    }
}

.nav-mobile__item {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    padding: 1rem;
    color: $black-text-color;
    border-bottom: 1px solid $black-color;

    &:hover {
        background-color: rgb(244, 211, 167);
    }
}

.nav-mobile__link {
    display: inline-flex;
    flex: 1;
    text-decoration: none;
    color: inherit;
    margin-left: 16px;
}

.overlay--nav {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.nav-mobile__menu {
    background-color: rgb(247, 245, 245);
    position: fixed;
    top: 0;
    bottom: 0;
    width: 50%;
    max-width: 80%;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    transform: translateX(-100%);
    opacity: 0;
    transition: transform linear .6s, opacity linear .6s;
}

.menu-user {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.avatar__wrapper {
    display: flex;
    align-items: center;
    width: 48%;
    height: 100%;

    .avatar {
        aspect-ratio: 1/1;
        border-radius: 50%;
    }
}

.avatar__img {
    width: 50%;
    margin-left: 25%;
    border-radius: 50%;
}

#nav-mobile__input:checked~.overlay--nav {
    display: block;
}

#nav-mobile__input:checked~.nav-mobile__menu {
    transform: translateX(0);
    opacity: 1;
}

@media (max-width: 1023px) {
    .nav--mobile {
        display: block;
    }
}

@media (max-width: 739px) {
    .nav-mobile__menu {
        width: 75%;
    }

    .nav-mobile__item {
        font-size: 1.1rem;
    }

    .nav__bars-btn {
        margin-left: 10px;
    }

    .btn--login {
        margin-right: 10px;
    }
}
</style>