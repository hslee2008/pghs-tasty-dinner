<template>
  <div>
    <div class="text-center">
      <h1 class="mt-4">오늘의 평가 보기</h1>
      <p>오늘 날짜: {{ date }}</p>
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

      <v-card-title class="text-center">오늘 메뉴</v-card-title>
      <v-card-text>
        <div v-for="(m, i) in menu" :key="m">
          <v-progress-linear
            :model-value="convertToPercentage(divide(total[i], people))"
          ></v-progress-linear>
          <p>
            <b>{{ m }}</b> (만족도:
            {{ convertToPercentage(divide(total[i], people)) }}%)
          </p>

          <br />
        </div>
      </v-card-text>

      <br />

      <v-card-title class="text-center">추천 보기</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(s, i) in Object.values(surveyResult ?? {}).map(
              (v) => v.suggestion
            )"
            :key="s"
            border="md"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-account"></v-icon>
            </template>

            <v-list-item-title class="ml-3 mt-3">"{{ s }}"</v-list-item-title>
            <v-rating
              :model-value="
                Object.values(surveyResult ?? {}).map((v) => v.today)[i]
              "
              readonly
            ></v-rating>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <div v-else>
      <v-empty-state
        image="https://vuetifyjs.b-cdn.net/docs/images/components/v-empty-state/astro-dog.svg"
      >
        <template v-slot:media>
          <v-img class="mb-8"></v-img>
        </template>

        <template v-slot:title>
          <div class="text-h6 text-high-emphasis">오늘은 석식이 없습니다.</div>
        </template>

        <template v-slot:text>
          <div class="text-body-1">
            월, 화, 목, 금요일을 제외하고는 판교고에서 석식을 받지 않습니다.
          </div>
        </template>
      </v-empty-state>
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
const surveyResult = ref("");

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

  const surveyResultRef = dbRef($db, `survey/${date.value}`);
  get(surveyResultRef).then((snapshot) => {
    if (snapshot.exists()) {
      surveyResult.value = snapshot.val();

      delete surveyResult.value["people"];
      delete surveyResult.value["todaysRating"];
      delete surveyResult.value["totalRating"];
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
