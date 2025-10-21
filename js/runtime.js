setInterval(() => {
    const createTime = new Date('2025-10-17 00:00:00'); // 建站时间
    const now = new Date();

    let diffSeconds = Math.floor((now - createTime) / 1000);

    const years = Math.floor(diffSeconds / (365 * 24 * 3600));
    diffSeconds %= 365 * 24 * 3600;

    const days = Math.floor(diffSeconds / (24 * 3600));
    diffSeconds %= 24 * 3600;

    const hours = Math.floor(diffSeconds / 3600);
    diffSeconds %= 3600;

    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;

    const pad = n => n.toString().padStart(2, '0');

    const isOpen = hours >= 9 && hours < 18;
    const statusBadge = isOpen
        ? `<img class='boardsign' src='https://img.shields.io/badge/phzs-营业中-6adea8?style=social&logo=cakephp' title='距离百年老店也就差不到一百年~'>`
        : `<img class='boardsign' src='https://img.shields.io/badge/phzs-打烊了-6adea8?style=social&logo=coffeescript' title='这个点了应该去睡觉啦，熬夜对身体不好哦'>`;

    const html = `
    ${statusBadge}
    <div id="runtime">
      ${years} YEAR ${days} DAYS ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}
    </div>
  `;

    const workboard = document.getElementById("workboard");
    if (workboard) workboard.innerHTML = html;

}, 1000);
