<template>
  <v-app>
    <VitePwaManifest />
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <v-main>
        <div class="d-flex justify-center">
          <NuxtPage />
        </div>
      </v-main>
    </NuxtLayout>
  </v-app>
</template>

<script setup>
const { $auth, $db } = useNuxtApp();

const router = useRouter();
const route = useRoute();

useHead({
  title: "저녁 몇 점?",
});
</script>
