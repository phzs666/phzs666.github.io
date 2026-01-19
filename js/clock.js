/* =========================================
 * Electric Clock - Final Stable Version
 * UTF-8 / No Garbled Text
 * ========================================= */

(function () {
    const CLOCK_ID = "hexo_electric_clock";

    /* ========= 从 Hexo 注入的配置 ========= */
    const QWEATHER_KEY = typeof qweather_key !== "undefined" ? qweather_key : "";
    const GAODE_KEY = typeof gaud_map_key !== "undefined" ? gaud_map_key : "";
    const RECTANGLE =
        typeof clock_rectangle !== "undefined"
            ? clock_rectangle
            : "113.449399,23.262524";
    const USE_DEFAULT_RECT =
        typeof clock_default_rectangle_enable !== "undefined" &&
        clock_default_rectangle_enable === "true";

    const QWEATHER_HOST = "api.qweather.com";

    /* ========= DOM ========= */
    function ensureBox() {
        let box = document.getElementById(CLOCK_ID);
        if (!box) {
            box = document.createElement("div");
            box.id = CLOCK_ID;
            box.className = "hexo-electric-clock";
            document.body.appendChild(box);
        }
        return box;
    }

    /* ========= 渲染 ========= */
    function render(weather, city) {
        const box = ensureBox();

        const weatherHTML = weather
            ? `
        <span class="card-clock-weather">
          <i class="qi-${weather.icon}-fill"></i>
          ${weather.text}
          <span>${weather.temp}</span>°C
        </span>
        <span class="card-clock-humidity">💧 ${weather.humidity}%</span>
      `
            : `<span class="card-clock-weather">Weather unavailable</span>`;

        box.innerHTML = `
      <div class="clock-row">
        <span id="clock-date"></span>
        ${weatherHTML}
      </div>
      <div class="clock-row">
        <span id="clock-time" class="card-clock-time"></span>
      </div>
      <div class="clock-row">
        <span class="card-clock-location">${city}</span>
        <span id="clock-ampm"></span>
      </div>
    `;

        startClock();
    }

    /* ========= 时间 ========= */
    function startClock() {
        const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const pad = (n) => (n < 10 ? "0" + n : n);

        function update() {
            const d = new Date();
            const h = d.getHours();
            const ampm = h >= 12 ? "PM" : "AM";

            document.getElementById("clock-time").innerText =
                pad(h) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());

            document.getElementById("clock-date").innerText =
                d.getFullYear() +
                "-" +
                pad(d.getMonth() + 1) +
                "-" +
                pad(d.getDate()) +
                " " +
                week[d.getDay()];

            document.getElementById("clock-ampm").innerText = ampm;
        }

        update();
        setInterval(update, 1000);
    }

    /* ========= 和风天气 ========= */
    function fetchWeather(location, city) {
        if (!QWEATHER_KEY) {
            console.error("[Clock] QWeather key missing");
            render(null, city);
            return;
        }

        const url = `https://${QWEATHER_HOST}/v7/weather/now?location=${location}&key=${QWEATHER_KEY}`;
        console.log("[Clock] Fetching weather:", url);

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.code === "200") {
                    console.log("[Clock] Weather data received:", data.now);
                    render(data.now, city);
                } else {
                    console.error("[Clock] QWeather API error:", data);
                    render(null, city);
                }
            })
            .catch((err) => {
                console.error("[Clock] QWeather fetch failed:", err);
                render(null, city);
            });
    }

    /* ========= 高德 IP 定位 ========= */
    function locateByGaodeIP() {
        if (!GAODE_KEY) {
            console.warn("[Clock] Gaode key missing, using fixed location");
            fetchWeather(RECTANGLE, "Fixed Location");
            return;
        }

        const url = `https://restapi.amap.com/v3/ip?key=${GAODE_KEY}`;
        console.log("[Clock] Gaode IP locate:", url);

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                console.log("[Clock] Gaode IP response:", data);
                if (data.status === "1" && data.rectangle) {
                    const [lng, lat] = data.rectangle.split(";")[0].split(",");
                    console.log("[Clock] Using IP location:", lng, lat, data.city);
                    fetchWeather(`${lng},${lat}`, data.city || "IP Location");
                } else {
                    console.warn("[Clock] Gaode IP failed, using fixed location");
                    fetchWeather(RECTANGLE, "Fixed Location");
                }
            })
            .catch((err) => {
                console.error("[Clock] Gaode IP error:", err);
                fetchWeather(RECTANGLE, "Fixed Location");
            });
    }

    /* ========= 浏览器定位 ========= */
    function locateByBrowser() {
        // 检查是否支持地理定位
        if (!navigator.geolocation) {
            console.warn("[Clock] Geolocation not supported");
            locateByGaodeIP();
            return;
        }

        // 检查是否为 HTTPS (localhost 除外)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            console.warn("[Clock] HTTPS required for geolocation (current: " + location.protocol + ")");
            locateByGaodeIP();
            return;
        }

        console.log("[Clock] Requesting browser geolocation...");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lng = pos.coords.longitude;
                const lat = pos.coords.latitude;
                console.log("[Clock] Browser geolocation success:", lng, lat);
                fetchWeather(`${lng},${lat}`, "Your Location");
            },
            (error) => {
                // 详细的错误信息
                const errorMessages = {
                    1: 'Permission denied by user',
                    2: 'Position unavailable',
                    3: 'Request timeout'
                };
                console.warn(
                    `[Clock] Browser geolocation failed: ${errorMessages[error.code] || 'Unknown error'}`,
                    error.message
                );
                console.log("[Clock] Falling back to IP location");
                locateByGaodeIP();
            },
            {
                timeout: 15000,              // 15秒超时
                enableHighAccuracy: false,   // 低精度模式,更快
                maximumAge: 300000           // 允许使用5分钟内的缓存
            }
        );
    }

    /* ========= 入口 ========= */
    function init() {
        console.log("[Clock] Initializing...");
        console.log("[Clock] Config:", {
            useDefaultRect: USE_DEFAULT_RECT,
            hasQWeatherKey: !!QWEATHER_KEY,
            hasGaodeKey: !!GAODE_KEY,
            protocol: location.protocol,
            hostname: location.hostname
        });

        if (USE_DEFAULT_RECT) {
            console.log("[Clock] Using fixed location");
            fetchWeather(RECTANGLE, "Fixed Location");
        } else {
            locateByBrowser();
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();