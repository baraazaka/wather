import React, { useEffect, useState } from "react";
import Style from "./Weather.module.css";
import Logo from "../../assets/logo.svg";
import bg from "../../assets/bg-today-large.svg";
import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import sunnyIcon from "../../assets/icon-sunny.webp";
import cloudIcon from "../../assets/icon-partly-cloudy.webp";
import rainIcon from "../../assets/icon-rain.webp";
import snowIcon from "../../assets/icon-snow.webp";
import stormIcon from "../../assets/icon-storm.webp";
import fogIcon from "../../assets/icon-fog.webp";
import overcastIcon from "../../assets/icon-overcast.webp"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

import axios from "axios";

const weatherCodes = {
  0: sunnyIcon,
  1: sunnyIcon,
  2: cloudIcon,
  3: overcastIcon, 
  45: fogIcon,
  48: fogIcon,
  51: rainIcon, 53: rainIcon, 55: rainIcon,
  61: rainIcon, 63: rainIcon, 65: rainIcon,
  80: rainIcon, 81: rainIcon, 82: rainIcon,
  56: snowIcon, 57: snowIcon,
  66: snowIcon, 67: snowIcon,
  71: snowIcon, 73: snowIcon, 75: snowIcon,
  77: snowIcon,
  85: snowIcon, 86: snowIcon,
  95: stormIcon, 96: stormIcon, 99: stormIcon
};

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Berlin");
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: 52.52, longitude: 13.41 });
  const [searchResults, setSearchResults] = useState([]);

  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,relative_humidity_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
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
    if (searchQuery.trim() === "") {
      return;
    }
    
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

  const getWeatherIcon = (code) => {
    return weatherCodes[code] || "❓";
  };

  const getFormattedTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", { hour: "numeric" });
  };
  
  // <<<<<<<< تعديل حالة التحميل هنا >>>>>>>>>
 if (loading || !weatherData) {
  return (
  <div className={Style.loadingContainer}>
  <section className={Style.main}>
    {/* العناوين */}
    <div className={Style.skeletonHeader}>
      <Skeleton className="block h-8 w-24 rounded-md bg-[#3b3a55] animate-slowPulse" />
      <Skeleton className="block h-8 w-20 rounded-md bg-[#3b3a55] animate-slowPulse" />
    </div>

    {/* عنوان كبير */}
    <Skeleton className="block h-8 w-64 mt-8 mx-auto rounded-md bg-[#3b3a55] animate-slowPulse" />

    {/* شريط البحث */}
    <div className={Style.skeletonSearch}>
      <Skeleton className="block h-10 w-[70%] rounded-md bg-[#3b3a55] animate-slowPulse" />
      <Skeleton className="block h-10 w-[25%] rounded-md bg-[#3b3a55] animate-slowPulse" />
    </div>

    {/* المحتوى الرئيسي */}
    <div className={Style.skeletonMain}>
      {/* يسار */}
      <div className={Style.skeletonCard}>
        <Skeleton className="block h-full w-full rounded-md bg-[#3b3a55] animate-slowPulse" />
      </div>

      {/* يمين */}
      <div className={Style.skeletonHourly}>
        <Skeleton className="block h-full w-full rounded-md bg-[#3b3a55] animate-slowPulse" />
      </div>
    </div>
  </section>
</div>

  );
}
  // <<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>
  
  const { current, hourly, daily } = weatherData;

  return (
    <>
      <section className={Style.main}>
        <nav className={Style.navbar}>
          <div className={Style.sectionMain}>
            <img src={Logo} alt="this is Logo" />
            <div className={Style.Setting}>
              <DropdownMenu>
                <DropdownMenuTrigger className={Style.drop} asChild >
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

        <section>
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
                  <img
                    className={Style.sunny}
                    src={getWeatherIcon(current.weather_code)}
                    alt="this is icon"
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
                      <img
                        src={getWeatherIcon(daily.weather_code[index])}
                        alt="Weather icon"
                      />
                      <div className={Style.numberRain}>
                        <span>
                          {Math.round(daily.temperature_2m_max[index])}°
                        </span>
                        <span>
                          {Math.round(daily.temperature_2m_min[index])}°
                        </span>
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
                      Tuesday
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
                  <AiOutlineDown className={Style.iconsSitings} />
                </div>
              </div>
              <ScrollArea className="h-[577px] w-[340px] rounded-md ">
                <div className={Style.ScrollAreaAll}>
                  {hourly.time.slice(0, 12).map((time, index) => (
                    <div className={Style.Scroll} key={index}>
                      <div className={Style.Scrollsub}>
                        <img src={getWeatherIcon(hourly.weather_code[index])} alt="Weather icon" /> 
                        <span>{new Date(time).toLocaleTimeString("en-US", { hour: "numeric" })}</span>
                      </div>
                      <span className={Style.timeTemp}>{Math.round(hourly.temperature_2m[index])}°</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </main>
        </section>
      </section>
    </>
  );
}