var now = new Date();

function createtime() {
    // 当前时间
    now.setTime(now.getTime() + 1000);

    var start = new Date("08/01/2022 00:00:00"); // 旅行者1号开始计算的时间
    var dis = Math.trunc(23400000000 + ((now - start) / 1000) * 17); // 距离=秒数*速度
    var unit = (dis / 149600000).toFixed(6); // 天文单位

    var grt = new Date("10/19/2025 00:00:00"); // 网站诞生时间
    var days = (now - grt) / 1000 / 60 / 60 / 24;
    var dnum = Math.floor(days);
    var hours = (now - grt) / 1000 / 60 / 60 - 24 * dnum;
    var hnum = Math.floor(hours);
    if (String(hnum).length == 1) hnum = "0" + hnum;

    var minutes = (now - grt) / 1000 / 60 - 1440 * dnum - 60 * hnum;
    var mnum = Math.floor(minutes);
    if (String(mnum).length == 1) mnum = "0" + mnum;

    var seconds = (now - grt) / 1000 - 86400 * dnum - 3600 * hnum - 60 * mnum;
    var snum = Math.round(seconds);
    if (String(snum).length == 1) snum = "0" + snum;

    let currentTimeHtml = "";

    currentTimeHtml =
        hnum < 18 && hnum >= 9
            ? `<img class='boardsign' src='https://img.shields.io/badge/phzs%E5%B0%8F%E5%B1%8B-%E4%B8%8A%E7%8F%AD%E6%91%B8%E9%B1%BC%E4%B8%AD-green?color=green' title='什么时候能够实现财富自由呀~'>
         <div style="font-size:13px;font-weight:bold">
         本站居然运行了 ${dnum} 天 ${hnum} 小时 ${mnum} 分 ${snum} 秒 
         <i id="heartbeat" class='fas fa-heartbeat'></i> <br>
         旅行者 1 号当前距离地球 ${dis} 千米，约为 ${unit} 个天文单位 🚀
         </div>`
            : `<img class='boardsign' src='https://img.shields.io/badge/phzs%E5%B0%8F%E5%B1%8B-%E4%B8%8B%E7%8F%AD%E4%BC%91%E6%81%AF%E5%95%A6-green?color=green' title='下班了就该开开心心地玩耍~'>
         <div style="font-size:13px;font-weight:bold">
         本站居然运行了 ${dnum} 天 ${hnum} 小时 ${mnum} 分 ${snum} 秒 
         <i id="heartbeat" class='fas fa-heartbeat'></i> <br>
         旅行者 1 号当前距离地球 ${dis} 千米，约为 ${unit} 个天文单位 🚀
         </div>`;

    if (document.getElementById("workboard"))
        document.getElementById("workboard").innerHTML = currentTimeHtml;
}

// 设置重复执行函数，周期1000ms
setInterval(() => {
    createtime();
}, 1000);
