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

## Round 2 (2026-10-29)

### Findings (audit đợt 2)

| # | Severity | Vị trí | Vấn đề | Xử lý |
|---|----------|--------|--------|-------|
| 1 | FEATURE GAP | assets/audio | `lonely.mp3` có trong repo nhưng KHÔNG được dùng — chỉ 1 bài duy nhất, không đổi được | Playlist 2 bài: nút ⏮/⏭ đổi bài, label tên bài, `src` set bằng JS |
| 2 | FEATURE GAP | index.html | Chỉ có tổng số ngày; không biết "X năm Y tháng Z ngày", không có countdown kỷ niệm hàng tháng | Section milestones: breakdown năm/tháng/ngày (diffYMD chuẩn lịch, handle tháng ngắn) + đếm ngược kỷ niệm ngày 14 hàng tháng, update mỗi phút |
| 3 | MINOR (a11y) | index.html | Ảnh avatar/heart/cloud không có `alt` — screen reader đọc URL file | `alt` mô tả cho ảnh nhân vật, `alt=""` + `aria-hidden` cho ảnh trang trí |
| 4 | MINOR | index.html:74-82 | Div gradient fade viết inline style | Tách class `.cloud-fade` |
| 5 | MINOR | index.html | `<audio>` trần, chiếm góc màn hình xấu | Music bar nổi giữa-dưới: nút đổi bài + label, glassmorphism, không che nội dung |
| 6 | MINOR | style.css | Không tôn trọng `prefers-reduced-motion` | Media query tắt/buộc ngắn animation tim + mây |
| 7 | MINOR | app.js | Ảnh nền gradient `#fff` fade cứng — giữ nguyên (khớp design), chỉ refactor class | — |

### Trạng thái Round 2

- [x] Plan
- [x] Features: milestones (breakdown + countdown), playlist 2 bài (prev/next/label)
- [x] A11y: alt/aria đầy đủ, reduced-motion support
- [x] Verify: `node --check` pass; review HTML structure; không regress fix round 1 (pageX/pageY, MAX_HEARTS, keyframes tách tên, autoplay catch đều còn)
- [x] Commit + self-review

### Verify Log
- `node --check app.js` → OK.
- Không build step; HTML đã đọc lại toàn bộ sau sửa — cấu trúc div cân đối, audio không còn `<source>` chết (src set bằng JS).
- Giữ nguyên hành vi round 1: tim sinh khi click nền (guard `closest("button, a, ...")` mở rộng thêm `.music-bar`), MAX_HEARTS=40, autoplay muted + catch.
