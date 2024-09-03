<template>
  <div>
    <div class="text-center">
      <h1 class="mt-4">오늘의 평가 보기</h1>
      <p>오늘 날짜: {{ date }}</p>
    </div>

    <br />

    <div
      v-if="
        nameOfTheDay === 'monday' ||
        nameOfTheDay === 'tuesday' ||
        nameOfTheDay === 'thursday' ||
        nameOfTheDay === 'friday'
      "
    >
      <v-card elevation="0">
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
          <div class="px-3">
            {{ people }}명({{ divide(people, 74) * 100 }}%) 참여
          </div>
        </div>

        <br />

        <v-card-title class="text-center">오늘 메뉴</v-card-title>
        <v-card-text>
          <div
            v-for="(item, i) in sortedMenu"
            :key="item.name"
            :style="
              item.percentage <= 30
                ? 'color: red'
                : item.percentage <= 40
                ? 'color: #ff8c00'
                : item.percentage <= 45
                ? 'color: #2e8b57'
                : 'color: #4169e1'
            "
          >
            <v-progress-linear
              rounded-bar
              :model-value="item.percentage"
            ></v-progress-linear>
            <p>
              <b>{{ item.name }}</b> (만족도: {{ item.percentage }}%)
            </p>

            <br />
          </div>
        </v-card-text>

        <br />

        <v-card-title class="text-center">추천 보기</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(s, i) in Object.values(surveyResult ?? {})
                .sort((a, b) => a.today - b.today)
                .map((v) => v.suggestion)"
              :key="s"
              v-show="s"
              border="md"
              class="mb-2 rounded-lg"
              :style="
                Object.values(surveyResult ?? {})
                  .sort((a, b) => a.today - b.today)
                  .map((v) => v.today)[i] <= 2
                  ? 'color: red'
                  : Object.values(surveyResult ?? {})
                      .sort((a, b) => a.today - b.today)
                      .map((v) => v.today)[i] <= 3.5
                  ? 'color: #c76e00'
                  : 'color: green'
              "
            >
              <div class="text-center">
                <p class="ml-3 mt-3">"{{ s }}"</p>
                <v-rating
                  :model-value="
                    Object.values(surveyResult ?? {})
                      .sort((a, b) => a.today - b.today)
                      .map((v) => v.today)[i]
                  "
                  readonly
                  half-increments
                ></v-rating>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
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
import { ref, computed, onMounted } from "vue";

const route = useRoute();

const year = route.query.year;
const month = route.query.month;
const day = route.query.date;

const date = ref("");
const menu = ref([]);
const total = ref([]);
const nameOfTheDay = ref("");
const people = ref(0);
const todaysRating = ref(0);
const surveyResult = ref("");

const { $db } = useNuxtApp();

const sortedMenu = computed(() => {
  return menu.value
    .map((item, index) => {
      const percentage = convertToPercentage(
        divide(total.value[index], people.value)
      );
      return { name: item, percentage };
    })
    .sort((a, b) => b.percentage - a.percentage);
});

onMounted(() => {
  const today = new Date(`${parseInt(year)}-${parseInt(month)}-${parseInt(day)}`);
  const bef = getTheLastMonday(today);
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

  const todayRef = dbRef(
    $db,
    `menu/${getTheLastMonday(date.value)}/${nameOfTheDay.value}`
  );
  onValue(todayRef, (snapshot) => {
    if (snapshot.exists()) {
      menu.value = snapshot.val().split("\n");
    }
  });

  const surveyResultRef = dbRef($db, `survey/${date.value}`);
  onValue(surveyResultRef, (snapshot) => {
    if (snapshot.exists()) {
      surveyResult.value = snapshot.val();

      delete surveyResult.value["people"];
      delete surveyResult.value["todaysRating"];
      delete surveyResult.value["totalRating"];
    }
  });

  const totalRef = dbRef($db, `survey/${date.value}/totalRating`);
  onValue(totalRef, (snapshot) => {
    if (snapshot.exists()) {
      total.value = snapshot.val();
    }
  });

  const peopleRef = dbRef($db, `survey/${date.value}/people`);
  onValue(peopleRef, (snapshot) => {
    if (snapshot.exists()) {
      people.value = snapshot.val();
    }
  });

  const todaysRatingRef = dbRef($db, `survey/${date.value}/todaysRating`);
  onValue(todaysRatingRef, (snapshot) => {
    if (snapshot.exists()) {
      todaysRating.value = snapshot.val();
    }
  });
});
</script>
