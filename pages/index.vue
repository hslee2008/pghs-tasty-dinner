<template>
  <div
    style="
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100vh;
      padding: 20px;
      gap: 20px;
    "
  >
    <h1 style="text-align: center;">저녁 몇 점?</h1>
    
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        justify-items: center;
        align-items: center;
      "
    >
      <v-card variant="tonal" to="/view">
        <v-card-title> 오늘의 평가 보기 </v-card-title>
        <v-card-text> 석식 평가 오늘의 평가 보기 </v-card-text>
      </v-card>

      <v-card variant="tonal" to="/add">
        <v-card-title> 메뉴 입력하기 </v-card-title>
        <v-card-text> 다음 주 메뉴 입력하기 </v-card-text>
      </v-card>

      <v-card variant="tonal" to="/add">
        <v-card-title> 과거 메뉴 보기 </v-card-title>
        <v-card-text> 과거의 평가된 메뉴를 확인하세요 </v-card-text>
      </v-card>
    </div>
  </div>
</template>
