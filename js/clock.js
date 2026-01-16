/* ===============================
 * Electric Clock (Fixed Version)
 * Weather API: QWeather v7
 * Host: api.qweather.com
 * =============================== */

(function () {
    const CLOCK_ID = "hexo_electric_clock";

    /* ====== 配置（由 Hexo 注入） ====== */
    const QWEATHER_KEY =
        typeof qweather_key !== "undefined" ? qweather_key : "";
    const RECTANGLE =
        typeof clock_rectangle !== "undefined"
            ? clock_rectangle
            : "113.449399,23.262524";
    const USE_DEFAULT_RECT =
        typeof clock_default_rectangle_enable !== "undefined" &&
        clock_default_rectangle_enable === "true";

    const QWEATHER_HOST = "api.qweather.com";

    /* ====== 创建容器 ====== */
    function ensureClockBox() {
        let box = document.getElementById(CLOCK_ID);
        if (!box) {
            box = document.createElement("div");
            box.id = CLOCK_ID;
            box.className = "hexo-electric-clock";
            document.body.appendChild(box);
        }
        return box;
    }

    /* ====== 渲染 ====== */
    function renderClock(weather, city) {
        const box = ensureClockBox();

        const weatherHtml = weather
            ? `
      <span class="card-clock-weather">
        <i class="qi-${weather.icon}-fill"></i>
        ${weather.text}
        <span>${weather.temp}</span>°C
      </span>
      <span class="card-clock-humidity">💧${weather.humidity}%</span>
    `
            : `<span class="card-clock-weather">Weather unavailable</span>`;

        box.innerHTML = `
      <div class="clock-row">
        <span id="clock-date"></span>
        ${weatherHtml}
      </div>
      <div class="clock-row">
        <span id="clock-time" class="card-clock-time"></span>
      </div>
      <div class="clock-row">
        <span class="card-clock-location">${city || "Unknown"}</span>
        <span id="clock-ampm"></span>
      </div>
    `;

        startTime();
    }

    /* ====== 时间 ====== */
    function startTime() {
        const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

        function pad(n) {
            return n < 10 ? "0" + n : n;
        }

        function update() {
            const d = new Date();
            const h = d.getHours();
            const ampm = h >= 12 ? "PM" : "AM";

            const time =
                pad(h) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
            const date =
                d.getFullYear() +
                "-" +
                pad(d.getMonth() + 1) +
                "-" +
                pad(d.getDate()) +
                " " +
                week[d.getDay()];

            const timeDom = document.getElementById("clock-time");
            const dateDom = document.getElementById("clock-date");
            const ampmDom = document.getElementById("clock-ampm");

            if (timeDom) timeDom.innerText = time;
            if (dateDom) dateDom.innerText = date;
            if (ampmDom) ampmDom.innerText = ampm;
        }

        update();
        setInterval(update, 1000);
    }

    /* ====== 天气 ====== */
    function fetchWeather(location, cityName) {
        if (!QWEATHER_KEY) {
            renderClock(null, cityName);
            return;
        }

        fetch(
            `https://${QWEATHER_HOST}/v7/weather/now?location=${location}&key=${QWEATHER_KEY}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.code === "200") {
                    renderClock(data.now, cityName);
                } else {
                    console.error("Weather API error:", data);
                    renderClock(null, cityName);
                }
            })
            .catch((err) => {
                console.error("Weather fetch failed:", err);
                renderClock(null, cityName);
            });
    }

    /* ====== 入口 ====== */
    function init() {
        if (USE_DEFAULT_RECT) {
            fetchWeather(RECTANGLE, "Fixed Location");
        } else {
            // 不定位，直接用默认坐标
            fetchWeather(RECTANGLE, "Unknown");
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
