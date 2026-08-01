<script setup>import BaseLayout from './BaseLayout.vue'</script>
<template><BaseLayout kind="quiz"><slot /><template #footer><slot name="footer" /></template></BaseLayout></template>
