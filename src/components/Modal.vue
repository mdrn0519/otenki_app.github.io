<template>
  <div :class="$style.modal">
    <div :class="$style.modal__bg" @click="modalClose"></div>
    <div :class="$style.modal__contents">
      <div :class="$style.closeBtn" @click="modalClose">[X]</div>
      <p v-if="geolocation" :class="$style.geolocation">{{ geolocation }}</p>
      <p>In and around {{ location }}</p>
      <img :src="img" :class="$style.img" @load="isLoaded" />
      <p :class="$style.weather_state">{{ weather }}</p>
      <p :class="$style.weather_temp">{{ temp }} &#8451;</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
    const isLoaded = () => {
      context.emit("isLoaded");
    };
    const modalClose = () => {
      context.emit("modalClose");
    };
    return {
      isLoaded,
      modalClose,
    };
  },
});
</script>

<style lang="scss" module>
.modal {
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
}

.modal__bg {
  background-color: rgba(255, 255, 255, 0.4);
  height: 100%;
}

.modal__contents {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: 500px;
  justify-content: center;
  left: 50%;
  max-height: calc(100% - 80px);
  max-width: 400px;
  position: absolute;
  text-align: center;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 20px);
}

.img {
  height: auto;
  margin-top: 30px;
  width: 200px;
}

.geolocation {
  margin-bottom: 15px;
}

.weather_state {
  margin-top: 10px;
}

.weather_temp {
  margin-top: 30px;
}

.closeBtn {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
