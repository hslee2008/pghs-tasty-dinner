<template>
  <div>
    <v-card variant="tonal" class="mt-6">
      <v-card-title class="text-center"> 석식 메뉴 입력하기 </v-card-title>
    </v-card>

    <v-textarea
      v-model="menu.monday"
      class="mt-5"
      variant="outlined"
      :placeholder="`월요일 ${date.monday} 메뉴`"
      :label="`월요일 ${date.monday} 메뉴`"
      rows="9"
    ></v-textarea>
    <v-textarea
      v-model="menu.tuesday"
      variant="outlined"
      :placeholder="`화요일 ${date.tuesday} 메뉴`"
      :label="`화요일 ${date.tuesday} 메뉴`"
      rows="9"
    ></v-textarea>
    <v-textarea
      v-model="menu.thursday"
      variant="outlined"
      :placeholder="`목요일 ${date.thursday} 메뉴`"
      :label="`목요일 ${date.thursday} 메뉴`"
      rows="9"
    ></v-textarea>
    <v-textarea
      v-model="menu.friday"
      variant="outlined"
      :placeholder="`금요일 ${date.friday} 메뉴`"
      :label="`금요일 ${date.friday} 메뉴`"
      rows="9"
    ></v-textarea>

    <div class="d-flex justify-center">
      <v-btn class="mt-5 mb-5" block color="primary" @click="addMenu">
        메뉴 추가하기
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const date = ref({
  monday: "",
  tuesday: "",
  thursday: "",
  friday: "",
});
const menu = ref({
  monday: "",
  tuesday: "",
  thursday: "",
  friday: "",
});

const { $db } = useNuxtApp();

const refresh = () => {
  const mondayRef = dbRef($db, `menu/${date.value.monday}`);
  onValue(mondayRef, (snapshot) => {
    if (snapshot.exists()) {
      menu.value = snapshot.val();
    }
  });
};

onMounted(() => {
  const today = new Date();
  const nextMonday = getTheLastMonday(today);

  date.value.monday = formatDate(nextMonday).slice(0, 10);
  date.value.tuesday = formatDate(
    new Date(
      nextMonday.getFullYear(),
      nextMonday.getMonth(),
      nextMonday.getDate() + 1
    )
  ).slice(0, 10);

  date.value.thursday = formatDate(
    new Date(
      nextMonday.getFullYear(),
      nextMonday.getMonth(),
      nextMonday.getDate() + 3
    )
  ).slice(0, 10);

  date.value.friday = formatDate(
    new Date(
      nextMonday.getFullYear(),
      nextMonday.getMonth(),
      nextMonday.getDate() + 4
    )
  ).slice(0, 10);

  refresh();
});

const addMenu = () => {
  set(dbRef($db, `menu/${date.value.monday}`), menu.value);
  refresh();
};
</script>
