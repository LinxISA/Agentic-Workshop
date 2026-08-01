<script setup>import BaseLayout from './BaseLayout.vue'; defineProps({ art: String })</script>
<template><BaseLayout kind="section" :art="art" scrim><slot /><template #footer><slot name="footer" /></template></BaseLayout></template>
