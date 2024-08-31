<template>
  <div
    style="
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    "
    class="justify-center align-center ga-5"
  >
    <v-card variant="tonal" to="/view">
      <v-card-title>
        데이터 조회하기
      </v-card-title>
      <v-card-text>
        서식 평가 데이터 조회하기
      </v-card-text>
    </v-card>

    <v-card variant="tonal" to="/add">
      <v-card-title>
        메뉴 입력하기
      </v-card-title>
      <v-card-text>
        다음 주 메뉴 입력하기
      </v-card-text>
    </v-card>
  </div>
</template>
