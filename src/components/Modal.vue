<template>
  <div :class="$style.modal">
    <div :class="$style.modal__bg" @click="modalClose"></div>
    <div :class="$style.modal__contents">
      <div :class="$style.closeBtn" @click="modalClose">X</div>
      <p v-if="geolocation" :class="$style.geolocation">{{ geolocation }}</p>
      <p :class="$style.location">In and around {{ location }}</p>
      <img :src="img" :class="$style.img" />
      <p :class="$style.weather_state">{{ weather }}</p>
      <p :class="$style.weather_temp">{{ temp }} &#8451;</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    geolocation: {
      type: String,
      require: false,
    },
    location: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      require: true,
    },
    weather: {
      type: String,
      require: true,
    },
    temp: {
      type: String,
      require: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      isLoadet: false,
    });
    const modalClose = () => {
      context.emit("modalClose");
    };
    return {
      state,
      modalClose,
    };
  },
});
</script>

<style lang="scss" module>
.modal {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
}

.modal__bg {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
}

.modal__contents {
  width: calc(100% - 20px);
  max-width: 400px;
  height: 500px;
  max-height: calc(100% - 80px);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  text-align: center;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.img {
  height: auto;
  width: 200px;
  margin-top: 30px;
}

.location {
  margin-top: 15px;
}

.weather_state {
  margin-top: 10px;
}

.weather_temp {
  margin-top: 30px;
}

.closeBtn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
