<template>
    <nav class="navbar navbar-dark navbar-expand-lg bg-black fixed-top position-relative">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <img src="../assets/logo-e1694516836643.png" alt="logo" class="img px-2" height="30px" />
                PowerTrack
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar"
                aria-labelledby="offcanvasDarkNavbarLabel">
                <div class="offcanvas-header">
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/" exact>Home</router-link>
                        </li>
                        <li v-if="isHome" class="nav-item">
                            <a class="nav-link" href="#dashboard">Energy Data</a>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/calculator">Calculator</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/contact">Help</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/login">Login</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/signup">Signup</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    computed: {
        isHome() {
            return this.$route.path === '/';
        }
    }
};
</script>

<style scoped>
.nav-item {
    padding-right: 40px;
    text-transform: uppercase;
    color: white;
    font-weight: bold;
}

.nav-link {
    color: white;
    text-decoration: none;
}

.nav-link.active {
    border-bottom: 2px solid rgb(162, 255, 70);
}
</style>