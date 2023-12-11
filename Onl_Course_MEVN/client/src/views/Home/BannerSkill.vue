<template>
    <div class="frame__skill">
        <section class="wrapper">
            <div class="frame__header">
                <h3 class="header__heading">Skill</h3>
            </div>

            <div class="frame__content row">
                <div class="col lg-3 md-4 col-6" v-for="(skill) in skills" :key="skill.id">
                    <div class="skill__item">
                        <img :src="skill.logo" :alt="skill.name" class="skill__logo">

                        <div class="item__side--right">
                            <h4>{{ skill.name }}</h4>
                            <p>Xem khóa học</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            skills: [
                { id: 1, name: 'C', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306311/logo_languages_programming/c_b0jwow.png' },
                { id: 2, name: 'C++', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306311/logo_languages_programming/c_plus_plus_l6wobx.png' },
                { id: 3, name: 'Python', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306312/logo_languages_programming/python_js8rbo.png' },
                { id: 4, name: 'Java', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306312/logo_languages_programming/java_th3rwe.png' },
                { id: 5, name: 'HTML', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306312/logo_languages_programming/html_vnbrcm.png' },
                { id: 6, name: 'CSS', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306312/logo_languages_programming/css_o1itkd.png' },
                { id: 7, name: 'Javascript', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306312/logo_languages_programming/javascript_zukbu0.png' },
                { id: 8, name: 'Nodejs', logo: 'https://res.cloudinary.com/ddr8slya4/image/upload/v1698306313/logo_languages_programming/nodejs_jbm6lw.png' }
            ]
        }
    },
}
</script>

<style lang="scss" scoped>
.frame__skill {
    min-height: 268px;
    color: $white-text-color;
    background-color: $primary-color;
    opacity: 0.9;
    border-radius: 25px;
    margin-bottom: 2rem;

    .wrapper {
        padding: 1rem 1.5rem;
    }
}

.header__heading {
    font-size: 1.3rem;
    line-height: 2rem;
    border-bottom: 2px solid rgb(227, 244, 41);
    width: 10%;
}

.skill__item {
    display: flex;
    background-color: rgba(249, 249, 97, 0.82);
    margin: 1rem 0;
    border: 2px solid orange;
    border-radius: 8px;
    padding: 6px;
}

.skill__logo {
    width: 30%;
    aspect-ratio: 1/1;
}

.item__side--right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-weight: 700;
}

@media (max-width: 1023px) {
    .nav--pc {
        display: none !important;
    }

    .frame__content {
        justify-content: center;
    }
}

@media (max-width: 739px) {
    .frame__skill {
        border-radius: 15px;
    }

    .skill__logo {
        width: 20%;
    }

    .skill__item {
        margin: .5rem 0;
    }
}
</style>