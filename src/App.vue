<template>
  <div :class="$style.contentWrapper">
    <div :class="$style.content">
      <h1 :class="$style.title">mdrn otenki app</h1>
      <form :class="$style.locationFrom" @submit.prevent="getWeather">
        <input
          v-model="weather.location"
          type="text"
          autofocus
          placeholder="Ex) tokyo"
          :class="$style.locationFrom__input"
        />
        <button
          type="submit"
          :disabled="btnState.isDisable || !weather.location"
          :class="$style.locationFrom__btn"
        >
          Input
          <div
            v-if="isUseSpinner && !btnState.isUseGeolocation"
            :class="$style.spinner"
          >
            <div :class="$style.spinner__circle"></div>
            <div :class="[$style.spinner__circle, $style.center]"></div>
            <div :class="[$style.spinner__circle, $style.right]"></div>
          </div>
        </button>
        <button
          type="button"
          :class="$style.locationFrom__btn"
          :disabled="btnState.isDisable"
          @click="useCurrentLocation"
        >
          use current location
          <div
            v-if="isUseSpinner && btnState.isUseGeolocation"
            :class="$style.spinner"
          >
            <div :class="$style.spinner__circle"></div>
            <div :class="[$style.spinner__circle, $style.center]"></div>
            <div :class="[$style.spinner__circle, $style.right]"></div>
          </div>
        </button>
      </form>
    </div>
    <transition
      :enter-from-class="$style.fade_opacity"
      :enter-active-class="$style.fade_transition"
      :leave-active-class="$style.fade_transition"
      :leave-to-class="$style.fade_opacity"
    >
      <Modal
        v-show="modalState.isActive"
        :geolocation="weather.geolocation"
        :location="weather.location"
        :img="weather.img"
        :weather="weather.state"
        :temp="weather.temp"
        @modal-close="modalClose"
        @is-loaded="isLoaded"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import axios from "axios";
import getCurrentPosition from "./ts/getCurrentLocation";
import Modal from "./components/Modal.vue";

export default defineComponent({
  name: "App",
  components: {
    Modal,
  },
  setup() {
    const btnState = reactive({
      isDisable: false,
      isUseGeolocation: false,
    });

    const weather = reactive({
      geolocation: "",
      location: "",
      state: "",
      img: "",
      temp: "",
    });

    const modalState = reactive({
      isActive: false,
    });

    const isUseSpinner = computed(() => {
      return btnState.isDisable && !modalState.isActive;
    });

    const useCurrentLocation = async () => {
      btnState.isDisable = true;
      btnState.isUseGeolocation = true;
      try {
        if (!navigator.geolocation) {
          throw "Geolocation is not supported by your browser";
        } else {
          const position = await getCurrentPosition();
          getWeather(position.coords.latitude, position.coords.longitude);
        }
      } catch (e) {
        let errText: string;
        switch (e.code) {
          case 1:
            errText = "位置情報の取得に失敗しました。(PERMISSION_DENIED)";
            break;
          case 2:
            errText = "位置情報の取得に失敗しました。(POSITION_UNAVAILABLE)";
            break;
          case 3:
            errText = "位置情報の取得に失敗しました。(TIMEOUT)";
            break;
          //geolocationをサポートしていない場合
          default:
            errText = e;
        }
        window.alert(errText);
        btnState.isDisable = false;
      }
    };

    const getWeather = (lat: number, lon: number) => {
      if (!btnState.isDisable) btnState.isDisable = true;
      let apiUrl;
      if (lat !== undefined && lon !== undefined) {
        // use geolocation
        const round = (n: number) => {
          return Math.round(n * 10000) / 10000;
        };
        weather.geolocation = `${round(lat)}, ${round(lon)}`;
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0a9f76b40749280f3266017a63c98261&lang=ja`;
      } else {
        // use city name
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weather.location}&appid=0a9f76b40749280f3266017a63c98261&lang=ja`;
      }
      axios
        .get(apiUrl)
        .then(({ data }) => {
          weather.location = data.name;
          weather.state = data.weather[0].main;
          weather.img = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
          weather.temp = `${Math.round(data.main.temp - 273.15)}`;
        })
        .catch(({ response }) => {
          let errText: string;
          switch (response.status) {
            case 404:
              errText =
                "該当の都市を見つけられませんでした。都道府県名をローマ字で入力するか別の場所を入力してください。";
              break;
            case 429:
              errText = "時間を開けて入力してください。";
              break;
            default:
              errText =
                "Error #401. Please confirm to https://openweathermap.org/faq#error401";
          }
          window.alert(errText);
        })
        .finally(() => {
          btnState.isDisable = false;
        });
    };

    const isLoaded = () => {
      modalState.isActive = true;
    };

    const modalClose = () => {
      btnState.isUseGeolocation = false;
      modalState.isActive = false;
      weather.geolocation = "";
      weather.location = "";
      weather.img = "";
    };

    return {
      btnState,
      weather,
      modalState,
      isUseSpinner,
      useCurrentLocation,
      getWeather,
      isLoaded,
      modalClose,
    };
  },
});
</script>

<style>
.beforeEnter {
  opacity: 0;
}
</style>

<style lang="scss" module>
.contentWrapper {
  min-height: 100vh;
  position: relative;
}

.content {
  margin: 0 auto;
  max-width: 660px;
  padding: 20vh 10px 0;
}

.title {
  text-align: center;
}

.locationFrom {
  background-color: #f1f4f9;
  margin-top: 30px;
}

.locationFrom__input {
  border: 1px solid #666;
  display: block;
  margin: 0 auto;
  max-width: 300px;
  width: 100%;
}

.locationFrom__btn {
  align-items: center;
  background-color: #f1f4f9;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  display: flex;
  filter: drop-shadow(-4px -4px 4px #fff) drop-shadow(3px 3px 1px #e0e5ec);
  height: 40px;
  justify-content: center;
  margin: 30px auto 0;
  max-width: 250px;
  position: relative;
  width: 100%;

  &:disabled {
    text-decoration: line-through;
  }
}

.spinner {
  align-items: center;
  background-color: #f1f4f9;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.spinner__circle {
  animation: fade 1.2s infinite;
  background-color: #92959b;
  border-radius: 50%;
  height: 6px;
  width: 6px;

  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  &:not(:last-child) {
    margin-right: 5px;
  }

  &.center {
    animation-delay: 0.4s;
  }

  &.right {
    animation-delay: 0.8s;
  }
}

.fade_transition {
  transition: all 0.3s;
}

.fade_opacity {
  opacity: 0;
}
</style>
