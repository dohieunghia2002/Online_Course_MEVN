import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue';
import Courses from '../views/Courses/Courses.vue';
import Teacher from '../views/Teacher/Teacher.vue';
import Login from '../views/Login/Login.vue';
import Signup from '../views/Signup/Signup.vue';
import CoursesTeacher from '../views/CoursesTeacher/CoursesTeacher.vue';
import CreateCourse from '../views/CreateCourse/CreateCourse.vue';
import EditCourse from '../views/EditCourse/EditCourse.vue';
import DetailCourse from '../views/DetailCourse/DetailCourse.vue';
import LockedCourse from '../views/LockedCourse/LockedCourse.vue';
import Admin from '../views/Admin/Admin.vue';
import CoursesStudent from '../views/CoursesStudent/CoursesStudent.vue';
import Learning from '../views/Learning/Learning.vue';
import LockedAdmin from '../views/LockedAdmin/LockedAdmin.vue';
import DetailTeacher from '../views/DetailTeacher/DetailTeacher.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/courses',
      name: 'courses',
      component: Courses
    },
    {
      path: '/course/new',
      name: 'course-new',
      component: CreateCourse
    },
    {
      path: '/course/:id/edit',
      name: 'course-edit',
      component: EditCourse
    },
    {
      path: '/course/:id/learning',
      name: 'learning',
      component: Learning
    },
    {
      path: '/course/:id',
      name: 'course-detail',
      component: DetailCourse
    },
    {
      path: '/teacher/:id/courses',
      name: 'teacher-courses',
      component: CoursesTeacher
    },
    {
      path: '/teacher/:id/locked',
      name: 'teacher-locked',
      component: LockedCourse
    },
    {
      path: '/teacher/:id',
      name: 'teacher-detail',
      component: DetailTeacher
    },
    {
      path: '/admin/locked',
      name: 'ad-locked',
      component: LockedAdmin
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: Teacher
    },
    {
      path: '/student/:id/courses',
      name: 'courses-student',
      component: CoursesStudent
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    }
  ]
})

export default router
