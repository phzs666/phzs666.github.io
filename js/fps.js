if (
    window.localStorage.getItem("fpson") === undefined ||
    window.localStorage.getItem("fpson") === "1"
) {
    var rAF = (function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    })();

    var frame = 0;
    var allFrameCount = 0;
    var lastTime = Date.now();
    var lastFrameTime = Date.now();

    var loop = function () {
        var now = Date.now();
        var fs = now - lastFrameTime;
        var fps = Math.round(1000 / fs);

        lastFrameTime = now;
        allFrameCount++;
        frame++;

        if (now > 1000 + lastTime) {
            fps = Math.round((frame * 1000) / (now - lastTime));
            let kd;

            if (fps <= 5) {
                kd = `<span style="color:#bd0000">卡成ppt🤢</span>`;
            } else if (fps <= 15) {
                kd = `<span style="color:red">电竞级帧率😖</span>`;
            } else if (fps <= 25) {
                kd = `<span style="color:orange">有点难受😨</span>`;
            } else if (fps < 35) {
                kd = `<span style="color:#9338e6">不太流畅🙄</span>`;
            } else if (fps <= 45) {
                kd = `<span style="color:#08b7e4">还不错哦😁</span>`;
            } else {
                kd = `<span style="color:#39c5bb">十分流畅🤣</span>`;
            }

            const fpsElement = document.getElementById("fps");
            if (fpsElement) {
                fpsElement.innerHTML = `FPS:${fps} ${kd}`;
            }

            frame = 0;
            lastTime = now;
        }

        rAF(loop);
    };

    loop();
} else {
    const fpsElement = document.getElementById("fps");
    if (fpsElement) {
        fpsElement.style.display = "none";
    }
}
