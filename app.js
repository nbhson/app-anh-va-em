const yourDate = new Date("2024-01-14T00:00:00");
const HEART_LIFETIME_MS = 3000;
const MAX_HEARTS = 40; // chặn hiện tượng tim chồng chất khi click liên tục

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

  const audio = document.getElementById("myAudio");
  if (audio) {
    // Bắt đầu bằng mute để đi qua chính sách autoplay của trình duyệt;
    // click bất kỳ sẽ mở tiếng (playAudio()).
    audio.muted = true;
    audio.play().catch(function (e) {
      // Autoplay bị chặn là hành vi bình thường khi chưa có user gesture.
      console.info("Autoplay bị trình duyệt chặn — bấm để bật nhạc.", e);
    });
  }
});

document.addEventListener("click", function (e) {
  // Chỉ hiệu ứng tim khi click nền — bỏ qua click vào điều khiển audio/link.
  if (e.target.closest("button, a, input, select, textarea, audio")) return;

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
