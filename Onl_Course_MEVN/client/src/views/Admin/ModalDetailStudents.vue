<template>
    <section id="detail-quantity-student" class="modal--info text-center">
        <font-awesome-icon :icon="['fas', 'times']" class="icon--close" @click="toggleModalInfoStudents()" />
        <h2 class="modal__heading">Các học viên của khóa học {{ courseStore.nameCourse }}</h2>
        <hr>
        <div class="info__frame" v-for="(student, index) in courseStore.studentsCourse" :key="student.idStudent._id">
            <div class="info__avatar" v-if="student.idStudent.avatar === undefined">
                <vue-avatar :username="nameAvatar(student.idStudent.fullName)" />
            </div>
            <div class="info__avatar" v-else>
                <div class="avatar__wrapper">
                    <img :src="student.idStudent.avatar.url" class="w-100 h-100" alt="avatar">
                </div>
            </div>

            <div>
                <h4 class="info__fullname">{{ student.idStudent.fullName }}</h4>
            </div>

            <div class="info__contact">
                {{ student.idStudent.email }}
            </div>
        </div>
    </section>
</template>

<script>
import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";

import { useCourseStore } from "../../stores/course.js";

export default {
    components: {
        VueAvatar
    },
    setup() {
        const courseStore = useCourseStore();
        return {
            courseStore
        }
    },
    methods: {
        toggleModalInfoStudents() {
            const modalElement = document.getElementById('detail-quantity-student');
            modalElement.classList.toggle('show');
        },
        removeAccents(str) {
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
        nameAvatar(fullName) {
            const temp = this.removeAccents(fullName);
            const name = temp.split(' ');
            return name[name.length - 1];
        }
    },
}
</script>

<style lang="scss" scoped>
#detail-quantity-student {
    display: none;
    position: absolute;
    width: 50%;
    top: 20%;
    left: 25%;
    background-color: rgb(249, 246, 246);
    padding: 1rem 2.5rem;
    border-radius: 16px;
    min-height: 60vh;

    &.show {
        display: block;
    }
}

.icon--close {
    width: 28px;
    height: 28px;
    float: right;
    cursor: pointer;

    &:hover {
        color: #777;
    }
}

.modal__heading {
    margin-top: 1.5rem;
    line-height: 3.2rem;
}

.info__frame {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.avatar__wrapper {
    width: 50px;
    height: 50px;
    aspect-ratio: 1/1;
    max-width: 50px;
    max-height: 50px;
    border-radius: 50%;
    overflow: hidden;
}

@media (min-width: 740px) and (max-width: 1023px) {
    #detail-quantity-student {
        width: 90%;
        left: 5%;
    }
}

@media (max-width: 739px) {
    #detail-quantity-student {
        padding: 1rem .5rem;
        width: 96%;
        left: 2%;
    }

    .avatar__wrapper {
        width: 40px;
        height: 40px;
        aspect-ratio: 1/1;
        max-width: 40px;
        max-height: 40px;
    }

    .info__fullname {
        font-size: .9rem;
    }
}
</style>