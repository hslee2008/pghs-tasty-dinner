<template>
  <div>
    <h1 class="mt-4">오늘의 평가 보기</h1>
    <p>오늘 날짜: {{ date }}</p>

    <br />

    <v-card
      elevation="0"
      v-if="
        nameOfTheDay === '월' ||
        nameOfTheDay === '화' ||
        nameOfTheDay === '목' ||
        nameOfTheDay === '금'
      "
    >
      <v-card-title class="text-center">오늘 메뉴</v-card-title>
      <v-card-text>
        <div
          v-for="(item, i) in menu.sort(
            (a, b) => total[menu.indexOf(b)] - total[menu.indexOf(a)]
          )"
          :key="item"
        >
          ({{ i + 1 }}등) {{ item }}
        </div>
      </v-card-text>
    </v-card>
    <div v-else>
      <v-card elevation="0">
        <v-card-title class="text-center">오늘은 석식이 없습니다</v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script setup>
const date = ref("");
const menu = ref([]);
const total = ref([]);
const nameOfTheDay = ref("");

const { $db } = useNuxtApp();

onMounted(() => {
  const today = new Date();
  date.value = today.toISOString().slice(0, 10);

  nameOfTheDay.value = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturay",
  ][today.getDay()];

  const todayRef = dbRef($db, `menu/${date.value}/${nameOfTheDay.value}`);
  onValue(todayRef, (snapshot) => {
    if (snapshot.exists()) {
      menu.value = snapshot.val().split("\n");
    }
  });

  const totalRef = dbRef($db, `survey/${date.value}/totalRating`);
  onValue(totalRef, (snapshot) => {
    if (snapshot.exists()) {
      total.value = snapshot.val();
    }
  });
});
</script>
