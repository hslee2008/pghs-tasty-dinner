<template>
  <div class="mx-4">
    <v-card variant="tonal" class="mt-5 pb-2">
      <v-card-title class="text-center"> 석식 만족도 조사 </v-card-title>
      <v-card-subtitle class="text-center">
        {{ nameOfTheDay }}요일 {{ date }}
      </v-card-subtitle>
    </v-card>

    <br />

    <div
      v-if="
        nameOfTheDay === '월' ||
        nameOfTheDay === '화' ||
        nameOfTheDay === '목' ||
        nameOfTheDay === '금'
      "
    >
      <div v-if="!didSurvey">
        <div v-if="todayMenu">
          <v-card elevation="0">
            <div>
              <v-card-title class="text-center">
                오늘 석식은 몇 점? ({{ today }}점)
              </v-card-title>
              <div class="d-flex justify-center">
                <v-rating
                  v-model="today"
                  :length="5"
                  :size="40"
                  active-color="green-darken-2"
                  class="px-4"
                  empty-icon="mdi-food-apple-outline"
                  full-icon="mdi-apple"
                  half-increments
                />
              </div>
            </div>

            <br />
            <v-divider />
            <br />

            <v-card-title>메뉴별 만족도를 평가해주세요</v-card-title>
            <div v-for="(menu, i) in todayMenu.split('\n')" :key="menu">
              <v-card-text class="text-center">
                {{ menu }} ({{ rated[i] ?? 0 }}점)
              </v-card-text>

              <div class="d-flex justify-center">
                <v-rating
                  v-model="rated[i]"
                  :length="5"
                  :size="40"
                  active-color="green-darken-2"
                  class="px-4"
                  half-increments
                />
              </div>
            </div>

            <br />
            <v-divider />
            <br />

            <div>
              <v-card-title class="text-center">의견</v-card-title>
              <v-textarea
                v-model="suggestion"
                placeholder="자유롭게 의견을 작성해주세요"
                variant="outlined"
                rows="3"
                class="mx-3"
              ></v-textarea>
            </div>

            <br />

            <div class="d-flex justify-center mx-2">
              <v-btn
                color="primary"
                block
                @click="submit"
                :disabled="
                  rated.filter((el) => el !== null).length !== rated.length ||
                  today === 0 ||
                  todayMenu === ''
                "
              >
                제출하기
              </v-btn>
            </div>

            <br />
            <br />
          </v-card>

          <v-dialog v-model="dialog" max-width="290">
            <v-card>
              <v-card-title class="text-center">제출 완료</v-card-title>
              <v-card-text
                >다른 사람의 의견이 궁금하십니까?
                <NuxtLink to="/view" style="color: #6298d4">결과 보기</NuxtLink
                >를 누르세요</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="closeDialog">확인</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div v-else>
          <v-skeleton-loader
            class="mx-auto"
            elevation="12"
            max-width="400"
            type="table-heading, list-item-three-line, list-item-three-line, list-item-three-line"
          ></v-skeleton-loader>
        </div>
      </div>
      <div v-else>
        <v-empty-state
          image="https://vuetifyjs.b-cdn.net/docs/images/components/v-empty-state/astro-dog.svg"
        >
          <template v-slot:media>
            <v-img class="mb-8"></v-img>
          </template>

          <template v-slot:title>
            <div class="text-h6 text-high-emphasis">
              오늘은 이미 평가하셨습니다.
            </div>
          </template>

          <template v-slot:text>
            <div class="text-body-1">
              이미 평가하셨습니다. 다른 사람의 의견이 궁금하시다면
              <NuxtLink to="/view" style="color: #6298d4">결과 보기</NuxtLink>를
              누르세요
            </div>
          </template>
        </v-empty-state>
      </div>
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
import { get } from "firebase/database";

const date = ref("");
const nameOfTheDay = ref("");
const theMondayDateBefore = ref("");
const todayMenu = ref("");
const english_date = ref([
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]);

const today = ref(0);
const rated = ref([].fill(0, 0, todayMenu.value.split("\n").length));
const suggestion = ref("");

const didSurvey = ref(false);
const dialog = ref(false);

const { $db } = useNuxtApp();

const reset = () => {
  today.value = 0;
  rated.value = [].fill(0, 0, todayMenu.value.split("\n").length);
  suggestion.value = "";
};

onMounted(() => {
  const today =
    process.env.NODE_ENV == "development"
      ? new Date(getTheLastMonday(new Date()))
      : new Date();
  const bef = getTheLastMonday(today);

  date.value = formatDate(today).slice(0, 10);
  theMondayDateBefore.value = formatDate(bef).slice(0, 10);
  nameOfTheDay.value = ["일", "월", "화", "수", "목", "금", "토"][
    today.getDay()
  ];

  const todayRef = dbRef(
    $db,
    `menu/${theMondayDateBefore.value}/${english_date.value[today.getDay()]}`
  );
  onValue(todayRef, (snapshot) => {
    if (snapshot.exists()) {
      todayMenu.value = snapshot.val();
    }
  });

  didSurvey.value = localStorage.getItem("survey") == date.value.toString();
});

const submit = () => {
  localStorage.setItem("survey", today.value);

  const data = {
    date: date.value,
    today: today.value,
    rated: rated.value,
    suggestion: suggestion.value,
  };

  set(
    dbRef($db, `survey/${date.value}/${Math.random().toString(16).slice(2)}`),
    data
  );
  dialog.value = true;

  const surveyRef = dbRef($db, `survey/${date.value}/totalRating`);
  get(surveyRef).then((snapshot) => {
    if (snapshot.exists()) {
      const totalRating = snapshot.val();
      for (let i = 0; i < totalRating.length; i++) {
        totalRating[i] += rated.value[i];
      }
      set(surveyRef, totalRating);
    } else {
      set(surveyRef, rated.value);
    }
  });

  const peopleRef = dbRef($db, `survey/${date.value}/people`);
  get(peopleRef).then((snapshot) => {
    if (snapshot.exists()) {
      set(peopleRef, snapshot.val() + 1);
    } else {
      set(peopleRef, 1);
    }
  });

  const todaysRating = dbRef($db, `survey/${date.value}/todaysRating`);
  get(todaysRating).then((snapshot) => {
    if (snapshot.exists()) {
      set(todaysRating, snapshot.val() + today.value);
    } else {
      set(todaysRating, today.value);
    }
  });
};

const closeDialog = () => {
  dialog.value = false;
  reset();
};
</script>
