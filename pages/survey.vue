<template>
  <div class="mx-4">
    <v-card variant="tonal" class="mt-5 pb-2">
      <v-card-title class="text-center"> 석식평가 </v-card-title>
      <v-card-subtitle class="text-center">
        {{ nameOfTheDay }}요일 {{ date }}
      </v-card-subtitle>
    </v-card>

    <br />

    <div v-if="nameOfTheDay === '월' || nameOfTheDay === '화' || nameOfTheDay === '목' || nameOfTheDay === '금'">
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
            />
          </div>
        </div>

        <br />
        <v-divider />
        <br />

        <v-card-title>메뉴별 만족도를 평가해주세요</v-card-title>
        <div v-for="(menu, i) in todayMenu.split('\n')" :key="menu">
          <v-card-text class="text-center">
            {{ menu }} ({{ rated[i] }}점)
          </v-card-text>

          <div class="d-flex justify-center">
            <v-rating
              v-model="rated[i]"
              :length="5"
              :size="40"
              active-color="green-darken-2"
              class="px-4"
            />
          </div>
        </div>

        <br />
        <v-divider />
        <br />

        <div>
          <v-card-title class="text-center">추천 메뉴</v-card-title>
          <v-textarea
            v-model="suggestion"
            placeholder="먹고 싶은 메뉴가 있으시면 적어주세요"
            variant="outlined"
            rows="3"
          ></v-textarea>
        </div>

        <br />

        <div class="d-flex justify-center">
          <v-btn
            color="primary"
            block
            @click="submit"
            :disabled="
              !suggestion ||
              rated.includes(0) ||
              rated.length < todayMenu.split('\n').length ||
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
            <NuxtLink to="/view" style="color: #6298d4">결과 보기</NuxtLink>를
            누르세요</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"
              >결과 보기</v-btn
            >
            <v-btn color="primary" text @click="closeDialog">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
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

const dialog = ref(false);

const totalRating = ref([].fill(0, 0, todayMenu.value.split("\n").length));

const { $db } = useNuxtApp();

const reset = () => {
  today.value = 0;
  rated.value = [].fill(0, 0, todayMenu.value.split("\n").length);
  suggestion.value = "";
};

onMounted(() => {
  const today = new Date();
  const bef = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - ((today.getDay() + 6) % 7) + 1
  );

  date.value = today.toISOString().slice(0, 10);
  theMondayDateBefore.value = bef.toISOString().slice(0, 10);
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
});

const submit = () => {
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
};

const closeDialog = () => {
  dialog.value = false;
  reset();
};
</script>
