<template>
    <div class="grid wide">
        <div class="row">
            <div class="col lg-12 col-12">
                <h2>Chỉnh sửa khóa học</h2>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12 md-12 col-12">
                <div class="tabs" :key="tab">
                    <button class="tab__btn" type="button" @click="() => this.tab = 0">
                        Thông tin chung
                    </button>
                    <button class="tab__btn" type="button" @click="() => this.tab = 1">
                        Danh sách bài học
                    </button>
                    <button class="tab__btn" type="button" @click="() => this.tab = 2">
                        Danh sách học viên
                    </button>

                    <button type="button" class="button--delete lg" @click="toggleModal()">
                        Xóa khóa học
                    </button>
                    <button type="button" class="button--lock lg" @click="handleLockCourse()">
                        Khóa khóa học
                    </button>
                </div>
            </div>
        </div>
        <div class="row activities--extra">
            <div class="col md-12 col-12">
                <button type="button" class="button--delete" @click="toggleModal()">
                    Xóa khóa học
                </button>
                <button type="button" class="button--lock" @click="handleLockCourse()">
                    Khóa khóa học
                </button>
            </div>
        </div>
        <div class="row">
            <div class="tab__content col lg-12 md-12 col-12">
                <div class="row">
                    <InfoIntro />
                </div>
            </div>
            <div class="tab__content col lg-12 md-12 col-12">
                <div class="row">
                    <Lessons />
                </div>
            </div>
            <div class="tab__content col lg-12 md-12 col-12">
                <div class="row">
                    <StudentList />
                </div>
            </div>
        </div>

        <ModalDelete />
    </div>
</template>

<script>
import ModalDelete from '../../components/ModalDelete/ModalDelete.vue';
import InfoIntro from './InfoIntro.vue';
import StudentList from './StudentList.vue';
import Lessons from './Lessons.vue';

import { useUserStore } from '../../stores/user.js';
import courseService from '../../services/course.service.js';

export default {
    components: { ModalDelete, InfoIntro, StudentList, Lessons },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            tab: 0
        }
    },
    methods: {
        activeTab() {
            const tabBtn = document.getElementsByClassName('tab__btn');
            const content = document.getElementsByClassName('tab__content');
            for (let i = 0; i < tabBtn.length; i++) {
                if (i == this.tab) {
                    tabBtn[i].classList.add('active');
                    content[i].classList.add('active');
                }
                else {
                    tabBtn[i].classList.remove('active');
                    content[i].classList.remove('active');
                }
            }
        },
        toggleModal() {
            const overlayElement = document.getElementsByClassName('overlay')[0];
            const modalElement = document.getElementById('delete-course');
            overlayElement.classList.toggle('show');
            modalElement.classList.toggle('show');

            window.onclick = function (e) {
                if (e.target.matches('.overlay')) {
                    if (overlayElement.classList.contains('show') && modalElement.classList.contains('show')) {
                        overlayElement.classList.remove('show');
                        modalElement.classList.remove('show');
                    }
                }
            }
        },
        async handleLockCourse() {
            const idCourse = this.$route.params.id;
            const res = await courseService.softDelete(idCourse, this.userStore.accessToken);
            if (res.status == 200) {
                this.$router.push({ name: 'courses' });
            }
        }
    },
    async mounted() {
        this.activeTab();
    },
    async updated() {
        this.activeTab();
    }
}
</script>

<style lang="scss" scoped>
.tabs {
    margin: 0.75rem 0 1.2rem 0;
}

.tab__btn,
.button--delete,
.button--lock {
    font-size: 1.2rem;
    outline: none;
    cursor: pointer;
}

.button--delete,
.button--lock {
    padding: 9px 15px;
    color: $white-text-color;
    float: right;
    border-radius: 25px;
    opacity: 1;
    font-weight: 700;

    &:hover {
        opacity: 0.8;
    }
}

.button--delete {
    background-color: $red-color;
    border: 1px solid orangered;
    margin-left: 10px;
}

.button--lock {
    background-color: $yellow-color;
    border: 1px solid rgb(218, 239, 100);
}

.tab__btn {
    position: relative;
    border: none;
    opacity: 0.8;
    padding: 9px 12px;

    &::after {
        content: "";
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background-color: $primary-color;
    }

    &:hover {
        opacity: 1;
    }

    &.active {
        opacity: 1;

        &::after {
            display: block;
        }
    }
}

.tab__content {
    display: none;
    width: 100%;

    &.active {
        display: block;
    }
}

.activities--extra {
    display: none;
}

@media (max-width: 1023px) {

    .button--delete,
    .button--lock {
        float: left;

        &.lg {
            display: none;
        }
    }

    .button--delete {
        margin-left: 0;
        margin-right: 10px;
    }
}

@media (max-width: 739px) {
    .tab__btn {
        margin-top: .5rem;
        margin-right: .5rem;
    }
}
</style>