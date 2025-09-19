import React, { useEffect, useState } from "react";
import Style from "../Components/Weather/Weather.module.css";
import Lottie from "lottie-react";
import dayAnimation from "../assets/day.json";

export default function SunPath({ daily }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toDate = (iso) => (iso ? new Date(iso) : null);

  const sunrise = toDate(daily?.sunrise?.[0]);
  const sunset = toDate(daily?.sunset?.[0]);

  const getSunPosition = () => {
    if (!sunrise || !sunset) return 0;
    if (now < sunrise) return 0;
    if (now > sunset) return 1;
    return (now - sunrise) / (sunset - sunrise);
  };

  const sunPosition = getSunPosition();

  const formatCountdown = (target) => {
    if (!target) return "—";
    let diff = Math.max(0, target - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const nextSunrise = now < sunrise ? sunrise : new Date(sunrise.getTime() + 24 * 3600 * 1000);
  const nextSunset = now < sunset ? sunset : new Date(sunset.getTime() + 24 * 3600 * 1000);

  return (
    <div className={Style.containerCircle}>
      <div className={Style.semiCircle}>
        <div
          className={Style.sun}
          style={{ left: `${sunPosition * 100}%` }}
        >
          🌞
        </div>
      </div>

      <div className={Style.times}>
        <div>
         {sunrise ? sunrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}  
          <div className={Style.countdown}>Next Sunrise in {formatCountdown(nextSunrise)}</div>
        </div>

        <div>
          <Lottie animationData={dayAnimation} loop={true} style={{ width: 180, height: 180 }} />
        </div>

        <div>
           {sunset ? sunset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}  
          <div className={Style.countdown}>Next Sunset in {formatCountdown(nextSunset)}</div>
        </div>
      </div>
    </div>
  );
}
