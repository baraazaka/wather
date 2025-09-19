import React, { useEffect, useState } from "react";
import Style from "./Weather.module.css";
import Logo from "../../assets/logo.svg";
import bg from "../../assets/bg-today-large.svg";
import { AiOutlineSetting, AiOutlineDown } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import SunTimes from "../SunTimes.jsx";
import Lottie from "react-lottie";

import sunnyAnimation from "../../assets/sunny.json";
import cloudAnimation from "../../assets/cloud.json";
import rainAnimation from "../../assets/rain.json";
import stormAnimation from "../../assets/storm.json";
import fogAnimation from "../../assets/fog.json";
import overcastAnimation from "../../assets/overcast.json";
import snowAnimation from "../../assets/snow.json";




import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Berlin");
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: 52.52,
    longitude: 13.41,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,relative_humidity_2m,weather_code&hourly=temperature_2m,weather_code&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(coordinates.latitude, coordinates.longitude);
  }, [coordinates]);

  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearchSuggestions = debounce(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`
      );
      if (geoResponse.data.results) {
        setSearchResults(geoResponse.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSearchResults([]);
    }
  }, 500);

  useEffect(() => {
    handleSearchSuggestions(searchQuery);
  }, [searchQuery]);

  const handleCitySelect = (result) => {
    setCoordinates({ latitude: result.latitude, longitude: result.longitude });
    setCity(result.name);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=1`
      );

      if (geoResponse.data.results && geoResponse.data.results.length > 0) {
        const { latitude, longitude, name } = geoResponse.data.results[0];
        setCoordinates({ latitude, longitude });
        setCity(name);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        console.error("City not found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getWeatherAnimation = (code) => {
    if ([0, 1].includes(code)) return sunnyAnimation;
    if ([2].includes(code)) return cloudAnimation;
    if ([3].includes(code)) return overcastAnimation;
    if ([45, 48].includes(code)) return fogAnimation;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return rainAnimation;
    if ([56, 57, 66, 67, 71, 73, 75, 77, 85, 86].includes(code)) return snowAnimation;
    if ([95, 96, 99].includes(code)) return stormAnimation;
    return sunnyAnimation;
  };

  if (loading || !weatherData) {
    return (
      <div className={Style.loadingContainer}>
        <section className={Style.main}>
          <div className={Style.skeletonHeader}>
            <Skeleton className="block h-8 w-24 rounded-md bg-[#3b3a55] animate-slowPulse" />
            <Skeleton className="block h-8 w-20 rounded-md bg-[#3b3a55] animate-slowPulse" />
          </div>
          <Skeleton className="block h-8 w-64 mt-8 mx-auto rounded-md bg-[#3b3a55] animate-slowPulse" />
          <div className={Style.skeletonSearch}>
            <Skeleton className="block h-10 w-[70%] rounded-md bg-[#3b3a55] animate-slowPulse" />
            <Skeleton className="block h-10 w-[25%] rounded-md bg-[#3b3a55] animate-slowPulse" />
          </div>
          <div className={Style.skeletonMain}>
            <div className={Style.skeletonCard}>
              <Skeleton className="block h-full w-full rounded-md bg-[#3b3a55] animate-slowPulse" />
            </div>
            <div className={Style.skeletonHourly}>
              <Skeleton className="block h-full w-full rounded-md bg-[#3b3a55] animate-slowPulse" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { current, hourly, daily } = weatherData;

  const daysOfWeek = daily.time.map((date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "long" })
  );

  const getHourlyForSelectedDay = () => {
    const targetDay = selectedDay || daysOfWeek[0];
    return hourly.time
      .map((time, index) => ({
        time,
        temp: hourly.temperature_2m[index],
        code: hourly.weather_code[index],
      }))
      .filter(
        (entry) =>
          new Date(entry.time).toLocaleDateString("en-US", {
            weekday: "long",
          }) === targetDay
      );
  };

  const hourlyData = getHourlyForSelectedDay();

  return (
    <section className={Style.main}>
      <nav className={Style.navbar}>
        <div className={Style.sectionMain}>
          <img src={Logo} alt="Logo" />
          <div className={Style.Setting}>
            <DropdownMenu>
              <DropdownMenuTrigger className={Style.drop} asChild>
                <button className={Style.ButtonDrop}>
                  <AiOutlineSetting className={Style.iconsSitings} />
                  Units
                  <AiOutlineDown className={Style.iconsSitings} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <h1 className={Style.hed}>How’s the sky looking today?</h1>

      <div className={Style.SearchContainer}>
        <div className={Style.searchInput}>
          <FaSearch className={Style.searchicon} />
          <input
            type="text"
            placeholder="Search for a place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchResults.length > 0 && (
          <div className={Style.searchResultsList}>
            {searchResults.map((result) => (
              <div
                key={result.id}
                className={Style.searchResultItem}
                onClick={() => handleCitySelect(result)}
              >
                {result.name}, {result.country}
              </div>
            ))}
          </div>
        )}
        <button className={Style.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>

      <SunTimes daily={daily} />

      <main className={Style.ContainerMain}>
        <div className={Style.leftMain}>
          <div
            className={Style.BackgroundImage}
            style={{ backgroundImage: `url(${bg})` }}
          >
            <div>
              <h2 className={Style.nameCity}>{city}</h2>
              <p className={Style.day}>Tuesday, Aug 5, 2025</p>
            </div>
            <div className={Style.contentBackground}>
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: getWeatherAnimation(current.weather_code),
                  rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                }}
                height={150}
                width={150}
              />
              <span className={Style.temperature}>
                {Math.round(current.temperature_2m)}°
              </span>
            </div>
          </div>

          <div className={Style.numberMain}>
            <div className={Style.feels}>
              <p>Feels Like</p>
              <span>{current.apparent_temperature}°</span>
            </div>
            <div className={Style.feels}>
              <p>Humidity</p>
              <span>{current.relative_humidity_2m}%</span>
            </div>
            <div className={Style.feels}>
              <p>Wind</p>
              <span>{current.wind_speed_10m} Km/h</span>
            </div>
            <div className={Style.feels}>
              <p>Precipitation</p>
              <span>{current.precipitation} mm</span>
            </div>
          </div>

          <div className={Style.dailyMain}>
            <h3>Daily forecast</h3>
            <div className={Style.allRain}>
              {daily.time.map((date, index) => (
                <div key={index} className={Style.rain}>
                  <p>{getDayOfWeek(date)}</p>
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: getWeatherAnimation(daily.weather_code[index]),
                      rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                    }}
                    height={60}
                    width={60}
                  />
                  <div className={Style.numberRain}>
                    <span>{Math.round(daily.temperature_2m_max[index])}°</span>
                    <span>{Math.round(daily.temperature_2m_min[index])}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={Style.rightMain}>
          <div className={Style.rightTop}>
            <h3>Hourly forecast</h3>
            <div className={Style.RightRightArea}>
              <DropdownMenu>
                <DropdownMenuTrigger className={Style.rightDrop}>
                  {selectedDay || daysOfWeek[0]}
                </DropdownMenuTrigger>
                <DropdownMenuContent className={Style.dropDay}>
                  <DropdownMenuSeparator />
                  {daysOfWeek.map((day, index) => (
                    <DropdownMenuItem key={index} onClick={() => setSelectedDay(day)}>
                      {day}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <AiOutlineDown className={Style.iconsSitings} />
            </div>
          </div>

          <ScrollArea className="h-[577px] w-[340px] rounded-md ">
            <div className={Style.ScrollAreaAll}>
              {hourlyData.slice(0, 12).map((item, index) => (
                <div className={Style.Scroll} key={index}>
                  <div className={Style.Scrollsub}>
                    <Lottie
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: getWeatherAnimation(item.code),
                        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                      }}
                      height={40}
                      width={40}
                    />
                    <span>
                      {new Date(item.time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                      })}
                    </span>
                  </div>
                  <span className={Style.timeTemp}>{Math.round(item.temp)}°</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </section>
  );
}
