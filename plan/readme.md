# Plan — app-anh-va-em

> Trang kỷ niệm ngày yêu (vanilla HTML/CSS/JS + Bootstrap 5 CSS).

## Kết quả Review (audit đợt 1)

| # | Severity | Vị trí | Vấn đề | Fix |
|---|----------|--------|--------|-----|
| 1 | BUG | style.css | 2 `@keyframes animate` trùng tên → clouds đè animation tim, tim KHÔNG bay lên | Tách `animate-heart` / `animate-cloud` |
| 2 | BUG | app.js:51-52 | `e.offsetX/offsetY` tính theo event target (có thể là element con) → tim đặt sai vị trí | Dùng `pageX/pageY` |
| 3 | MAJOR | index.html:90-104 | jQuery 3.2.1 (7 năm tuổi, EOL) + Popper + Bootstrap 4 JS load nhưng KHÔNG dùng gì | Xóa 3 script |
| 4 | MAJOR | app.js | `innerHTML` với dữ liệu computed (rủi ro pattern) + chuỗi template nhiều dòng lộn xộn | `textContent` + `padStart` |
| 5 | MAJOR | app.js:42-46 | 2 listener `DOMContentLoaded` riêng biệt | Gộp 1 |
| 6 | MAJOR | app.js:48-65 | Click handler toàn cục: tim sinh cả khi bấm điều khiển audio + không giới hạn số tim | Guard + MAX_HEARTS=40 |
| 7 | MINOR | index.html:86 | `allow`, `volume` attributes không hợp lệ trên `<audio>` | Xóa |
| 8 | MINOR | app.js:45 | `audio.play()` không `.catch()` → unhandled rejection khi autoplay bị chặn | `.catch` có log |
| 9 | MINOR | style.css | Dead CSS `.fade-*` | Xóa |
| 10 | MINOR | index.html | `lang="en"` sai (nội dung tiếng Việt), thiếu meta description | `lang="vi"` + description |

## Trạng thái

- [x] Plan
- [x] Fix #1–#10
- [x] Commit + self-review

## Review Log

### Vòng 1
- Self-review: `node --check` pass. Hiệu ứng tim giờ hoạt động đúng (animation `animate-heart` forwards, hết 3s tự remove). Audio: autoplay muted → click mở tiếng. Không còn dependency chết (−3 request mạng, ~100KB).
