function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((res, rej) => {
    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    };
    const success: PositionCallback = (positon: GeolocationPosition) => {
      res(positon);
    };
    const err: PositionErrorCallback = (err: GeolocationPositionError) => {
      rej(err);
    };
    navigator.geolocation.getCurrentPosition(success, err, options);
  });
}

export default getCurrentLocation;
