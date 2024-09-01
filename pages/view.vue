<template>
  <div>
    <h1 class="mt-4">오늘의 평가 보기</h1>
    <p>오늘 날짜: {{ date }}</p>

    <br />

    <p>{{ people }}명 참여</p>

    <br />

    <div class="d-flex align-center flex-column my-auto">
      <div class="text-h2 mt-5">
        {{ divide(todaysRating, people) }}
        <span class="text-h6 ml-n3">/5</span>
      </div>

      <v-rating
        :model-value="divide(todaysRating, people)"
        color="yellow-darken-3"
        half-increments
        readonly
      ></v-rating>
      <div class="px-3">{{ people }}명 참여</div>
    </div>

    <br />

    <v-card
      elevation="0"
      v-if="
        nameOfTheDay === 'monday' ||
        nameOfTheDay === 'tuesday' ||
        nameOfTheDay === 'thursday' ||
        nameOfTheDay === 'friday'
      "
    >
      <v-card-title class="text-center">오늘 메뉴</v-card-title>
      <v-card-text>
        <div v-for="(m, i) in menu" :key="m">
          <v-progress-linear
            :model-value="convertToPercentage(divide(total[i], people))"
          ></v-progress-linear>
          <p>{{ m }}</p>

          <br />
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
import { get } from "firebase/database";
const date = ref("");
const menu = ref([]);
const total = ref([]);
const nameOfTheDay = ref("");
const people = ref(0);
const todaysRating = ref(0);

const { $db } = useNuxtApp();

onMounted(() => {
  const today = new Date();
  date.value = formatDate(today).slice(0, 10);

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
  get(todayRef).then((snapshot) => {
    if (snapshot.exists()) {
      menu.value = snapshot.val().split("\n");
    }
  });

  const totalRef = dbRef($db, `survey/${date.value}/totalRating`);
  get(totalRef).then((snapshot) => {
    if (snapshot.exists()) {
      total.value = snapshot.val();
    }
  });

  const peopleRef = dbRef($db, `survey/${date.value}/people`);
  get(peopleRef).then((snapshot) => {
    if (snapshot.exists()) {
      people.value = snapshot.val();
    }
  });

  const todaysRatingRef = dbRef($db, `survey/${date.value}/todaysRating`);
  get(todaysRatingRef).then((snapshot) => {
    if (snapshot.exists()) {
      todaysRating.value = snapshot.val();
    }
  });
});
</script>
