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
            console.error("QWeather key missing");
            render(null, city);
            return;
        }

        const url = `https://${QWEATHER_HOST}/v7/weather/now?location=${location}&key=${QWEATHER_KEY}`;
        console.log("[QWeather]", url);

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.code === "200") {
                    render(data.now, city);
                } else {
                    console.error("QWeather error:", data);
                    render(null, city);
                }
            })
            .catch((err) => {
                console.error("QWeather fetch failed:", err);
                render(null, city);
            });
    }

    /* ========= 高德 IP 定位 ========= */
    function locateByGaodeIP() {
        if (!GAODE_KEY) {
            console.warn("Gaode key missing");
            fetchWeather(RECTANGLE, "Fixed Location");
            return;
        }

        const url = `https://restapi.amap.com/v3/ip?key=${GAODE_KEY}`;
        console.log("[Gaode IP]", url);

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "1" && data.rectangle) {
                    const [lng, lat] = data.rectangle.split(";")[0].split(",");
                    fetchWeather(`${lng},${lat}`, data.city || "IP Location");
                } else {
                    fetchWeather(RECTANGLE, "Fixed Location");
                }
            })
            .catch(() => {
                fetchWeather(RECTANGLE, "Fixed Location");
            });
    }

    /* ========= 浏览器定位 ========= */
    function locateByBrowser() {
        if (!navigator.geolocation) {
            locateByGaodeIP();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lng = pos.coords.longitude;
                const lat = pos.coords.latitude;
                console.log("[Browser Geo]", lng, lat);
                fetchWeather(`${lng},${lat}`, "Your Location");
            },
            () => locateByGaodeIP(),
            { timeout: 8000 }
        );
    }

    /* ========= 入口 ========= */
    function init() {
        if (USE_DEFAULT_RECT) {
            fetchWeather(RECTANGLE, "Fixed Location");
        } else {
            locateByBrowser();
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
