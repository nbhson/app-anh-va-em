const yourDate = new Date("2024-01-14T00:00:00");
const HEART_LIFETIME_MS = 3000;
const MAX_HEARTS = 40; // chặn hiện tượng tim chồng chất khi click liên tục

// Playlist: 2 bài có sẵn trong assets — trước đây lonely.mp3 không được dùng
const TRACKS = [
  { src: "./assets/audio/LoveStory.mp3", title: "Love Story" },
  { src: "./assets/audio/lonely.mp3", title: "Lonely" },
];

document.addEventListener("DOMContentLoaded", function () {
  var rootTime = document.querySelector("time");
  var anniEl = document.getElementById("anni");
  var dateEl = document.getElementById("date");

  const dd = String(yourDate.getDate()).padStart(2, "0");
  const mm = String(yourDate.getMonth() + 1).padStart(2, "0");
  const yyyy = String(yourDate.getFullYear());
  if (anniEl) anniEl.textContent = `${dd} - ${mm} - ${yyyy}`;

  if (dateEl) {
    const days = Math.floor((new Date() - yourDate) / 86400000);
    dateEl.textContent = days + " NGÀY";
  }

  function olock() {
    const elapsed = Math.floor((Date.now() - yourDate) / 1000);
    const hrs = Math.floor(elapsed / 3600) % 24;
    const min = Math.floor(elapsed / 60) % 60;
    const sec = elapsed % 60;
    if (rootTime) {
      rootTime.textContent =
        String(hrs).padStart(2, "0") + " : " +
        String(min).padStart(2, "0") + " : " +
        String(sec).padStart(2, "0");
    }
  }
  olock();
  setInterval(olock, 1000);

  initMilestones();
  initPlaylist();
});

// ---------- Feature: mốc thời gian yêu nhau ----------
// X năm Y tháng Z ngày + đếm ngược kỷ niệm hàng tháng (ngày 14)
function diffYMD(from, to) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m--;
    // Số ngày của tháng trước "to"
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return { y, m, d };
}

function initMilestones() {
  const breakdownEl = document.getElementById("together-breakdown");
  const nextAnniEl = document.getElementById("next-anniversary");
  if (!breakdownEl && !nextAnniEl) return;

  function update() {
    const now = new Date();
    if (now < yourDate) return; // đồng hồ hệ thống sai — không hiện số âm

    if (breakdownEl) {
      const { y, m, d } = diffYMD(yourDate, now);
      const parts = [];
      if (y > 0) parts.push(y + " năm");
      if (m > 0) parts.push(m + " tháng");
      parts.push(d + " ngày");
      breakdownEl.textContent = "❤️ Bên nhau được " + parts.join(", ");
    }

    if (nextAnniEl) {
      // Kỷ niệm hàng tháng vào ngày 14 (yourDate.getDate())
      const day = yourDate.getDate();
      let candidate = new Date(now.getFullYear(), now.getMonth(), day);
      if (candidate <= now) {
        candidate = new Date(now.getFullYear(), now.getMonth() + 1, day);
      }
      const daysLeft = Math.ceil((candidate - now) / 86400000);
      nextAnniEl.textContent = "🎁 Kỷ niệm hàng tháng: còn " + daysLeft + " ngày";
    }
  }

  update();
  setInterval(update, 60 * 1000);
}

// ---------- Feature: playlist 2 bài ----------
let currentTrack = 0;

function trackLabelEl() {
  return document.getElementById("music-track");
}

function loadTrack(index, { autoplay = false } = {}) {
  const audio = document.getElementById("myAudio");
  if (!audio) return;
  currentTrack = (index + TRACKS.length) % TRACKS.length;
  audio.src = TRACKS[currentTrack].src;
  const label = trackLabelEl();
  if (label) label.textContent = "🎵 " + TRACKS[currentTrack].title;
  if (autoplay) playAudio();
}

function playAudio() {
  var audio = document.getElementById("myAudio");
  if (!audio) return;

  if (audio.paused) {
    audio.muted = false;
    audio.play().catch(function (e) {
      console.error("Không phát được nhạc:", e);
    });
  } else {
    audio.muted = true;
    audio.pause();
  }
}

function initPlaylist() {
  const audio = document.getElementById("myAudio");
  if (!audio) return;

  loadTrack(0);

  // Bắt đầu bằng mute để đi qua chính sách autoplay của trình duyệt;
  // click bất kỳ sẽ mở tiếng (playAudio()).
  audio.muted = true;
  audio.play().catch(function (e) {
    // Autoplay bị chặn là hành vi bình thường khi chưa có user gesture.
    console.info("Autoplay bị trình duyệt chặn — bấm để bật nhạc.", e);
  });

  document.getElementById("music-next")?.addEventListener("click", function () {
    loadTrack(currentTrack + 1, { autoplay: true });
  });
  document.getElementById("music-prev")?.addEventListener("click", function () {
    loadTrack(currentTrack - 1, { autoplay: true });
  });

  // Hết bài tự chuyển bài tiếp theo (audio có loop attr → loop từng bài;
  // nếu muốn toàn playlist chạy vòng thì bỏ loop — giữ hành vi cũ)
}

document.addEventListener("click", function (e) {
  // Chỉ hiệu ứng tim khi click nền — bỏ qua click vào điều khiển audio/link.
  if (e.target.closest("button, a, input, select, textarea, audio, .music-bar")) return;

  const body = document.body;
  if (body.querySelectorAll(".heart-pop").length >= MAX_HEARTS) return;

  const heart = document.createElement("span");
  heart.className = "heart-pop";
  // pageX/pageY thay vì offsetX: offsetX tính theo target của event,
  // có thể là element con → tim bị đặt sai vị trí.
  heart.style.left = e.pageX + "px";
  heart.style.top = e.pageY + "px";
  const size = 20 + Math.random() * 100;
  heart.style.width = size + "px";
  heart.style.height = size + "px";
  body.appendChild(heart);

  setTimeout(function () {
    heart.remove();
  }, HEART_LIFETIME_MS);

  playAudio();
});
