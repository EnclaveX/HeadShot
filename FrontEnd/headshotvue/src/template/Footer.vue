<template>
    <v-footer app>
        <span>{{$i18n.t('headshot.principal.cooprights')}} &copy; {{year}}</span>
    </v-footer>
</template>

<script>
export default {
    data(){
        return {
            year: 0
        }
    },
    created(){
        const currentDate   = new Date()
        this.year = currentDate.getFullYear()
    }
}
</script>

<style>

</style>
