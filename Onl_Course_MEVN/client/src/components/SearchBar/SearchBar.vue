<template>
    <section id="search" class="text-center">
        <input type="search" :placeholder="placeholder ? placeholder : 'Tìm kiếm...'" name="search" class="search__input"
            v-model="userStore.contentSearch" @change="resetResult">
        <button type="button" class="search__btn" @click="clickSearch">
            <font-awesome-icon :icon="['fas', 'search']" />
        </button>
    </section>

    <ResultCourses v-if="userStore.isActiveSearch && categorySearch === 'course'" :key="catchUpdate" />
    <ResultTeachers v-if="userStore.isActiveSearch && categorySearch === 'teacher'" :key="catchUpdate" />
</template>

<script>
import ResultCourses from './ResultCourses.vue';
import ResultTeachers from './ResultTeachers.vue';
import { useUserStore } from '../../stores/user.js';

export default {
    components: { ResultCourses, ResultTeachers },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            catchUpdate: false
        }
    },
    props: ['categorySearch', 'placeholder'],
    methods: {
        clickSearch() {
            this.catchUpdate = !this.catchUpdate;
            this.userStore.contentSearch.length === 0 ? this.userStore.isActiveSearch = false : this.userStore.isActiveSearch = true
        },
        resetResult() {
            if (this.userStore.contentSearch.length === 0) {
                this.userStore.isActiveSearch = false
            }
        }
    },
}
</script>

<style lang="scss" scoped>
#search {
    margin-top: 1rem;
}

.search__input,
.search__btn {
    font-size: 1.2rem;
    line-height: 1.9rem;
}

.search__input {
    width: 26%;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    padding-left: 10px;
}

.search__btn {
    padding-left: 10px;
    padding-right: 10px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: $primary-color;
        opacity: 0.7;
        color: $white-color;
    }
}

@media (max-width: 1023px) {
    .search__input {
        width: 50%;
    }

    .search__input,
    .search__btn {
        font-size: 1.1rem;
        line-height: 1.6rem;
    }
}
</style>