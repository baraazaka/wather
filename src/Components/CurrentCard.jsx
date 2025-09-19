import Style from "./Weather.module.css";

export default function CurrentCard({ city, current, getWeatherIcon }) {
  return (
    <div className={Style.BackgroundImage}>
      <div>
        <h2 className={Style.nameCity}>{city}</h2>
        <p className={Style.day}>Tuesday, Aug 5, 2025</p>
      </div>
      <div className={Style.contentBackground}>
        <img
          className={Style.sunny}
          src={getWeatherIcon(current.weather_code)}
          alt="weather icon"
        />
        <span className={Style.temperature}>
          {Math.round(current.temperature_2m)}°
        </span>
      </div>
    </div>
  );
}
