<script setup>import BaseLayout from './BaseLayout.vue'; defineProps({ art: String })</script>
<template><BaseLayout kind="hero" :art="art" scrim><slot /><template #footer><slot name="footer" /></template></BaseLayout></template>
