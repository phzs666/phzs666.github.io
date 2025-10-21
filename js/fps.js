// 获取本地开关
const fpson = window.localStorage.getItem("fpson");

// 只要不是 "0" 就显示 FPS
if (fpson === null || fpson === "1") {
    const rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(cb){ setTimeout(cb, 1000/60); };

    let frame = 0;
    let lastTime = Date.now();
    let lastFrameTime = Date.now();

    const loop = function() {
        const now = Date.now();
        const fs = now - lastFrameTime;
        const fps = Math.round(1000 / fs);
        lastFrameTime = now;
        frame++;

        if (now - lastTime > 1000) {
            const realFps = Math.round((frame * 1000) / (now - lastTime));
            let kd;

            if (realFps <= 5) {
                kd = `<span style="color:#bd0000">卡成ppt🤢</span>`;
            } else if (realFps <= 15) {
                kd = `<span style="color:red">电竞级帧率😖</span>`;
            } else if (realFps <= 25) {
                kd = `<span style="color:orange">有点难受😨</span>`;
            } else if (realFps < 35) {
                kd = `<span style="color:#9338e6">不太流畅🙄</span>`;
            } else if (realFps <= 45) {
                kd = `<span style="color:#08b7e4">还不错哦😁</span>`;
            } else {
                kd = `<span style="color:#39c5bb">十分流畅🤣</span>`;
            }

            const fpsElement = document.getElementById("fps");
            if (fpsElement) {
                fpsElement.innerHTML = `FPS: ${realFps} ${kd}`;
            }

            frame = 0;
            lastTime = now;
        }

        rAF(loop);
    };

    // 延迟执行，保证 DOM 已加载，断点可用
    window.addEventListener('DOMContentLoaded', loop);

} else {
    const fpsElement = document.getElementById("fps");
    if (fpsElement) fpsElement.style.display = "none";
}
