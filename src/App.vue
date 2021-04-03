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
        </button>
        <button
          type="button"
          :class="$style.locationFrom__btn"
          :disabled="btnState.isDisable"
          @click="useCurrentLocation"
        >
          use current location
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
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
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
    });
    const weather = reactive({
      geolocation: "",
      location: "",
      state: "Clear",
      img: "https://openweathermap.org/img/wn/01d@4x.png",
      temp: "18",
    });
    const modalState = reactive({
      isActive: false,
    });

    const useCurrentLocation = async () => {
      btnState.isDisable = true;
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
        weather.geolocation = `${lat}, ${lon}`;
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

          modalState.isActive = true;
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

    const modalClose = () => {
      modalState.isActive = false;
      weather.geolocation = "";
      weather.location = "";
    };

    return {
      btnState,
      weather,
      modalState,
      useCurrentLocation,
      getWeather,
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
  padding: 20vh 10px 0;
  max-width: 660px;
  margin: 0 auto;
}

.title {
  text-align: center;
}

.locationFrom {
  margin-top: 30px;
  background-color: #f1f4f9;
}

.locationFrom__input {
  display: block;
  border: 1px solid #666;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.locationFrom__btn {
  width: 100%;
  max-width: 250px;
  margin: 30px auto 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  background-color: #f1f4f9;
  filter: drop-shadow(-4px -4px 4px #fff) drop-shadow(3px 3px 1px #e0e5ec);

  &:disabled {
    text-decoration: line-through;
  }
}

.fade_transition {
  transition: all 0.3s;
}

.fade_opacity {
  opacity: 0;
}
</style>
