# Valentine Visual Story - Kế hoạch cải tiến toàn diện

## Tổng quan yêu cầu

Dựa trên yêu cầu của USER, tôi đã phân loại thành các nhóm công việc sau:

---

## PHASE 1: Tối ưu hiệu năng & Sửa lỗi (Ưu tiên cao nhất)

### 1.1 Phân tích rò rỉ bộ nhớ (Memory Leak)
**Các điểm cần kiểm tra:**
- [ ] `useEffect` cleanup functions trong tất cả components
- [ ] Event listeners không được remove khi unmount
- [ ] `setInterval`/`setTimeout` không được clear
- [ ] Three.js geometries/materials không được dispose
- [ ] Animation frames không được cancel

**Files cần audit:**
- `FloatingWords.tsx` - timers
- `FloatingHearts.tsx` - animation loop
- `VisualStoryScene.tsx` - Three.js resources
- `CameraManager.tsx` - animation frames
- `TransitionController.tsx` - animation states

### 1.2 Tối ưu vòng lặp CPU
**Các điểm cần kiểm tra:**
- [ ] `useFrame` hooks chạy liên tục không cần thiết
- [ ] Re-renders không cần thiết do state changes
- [ ] Heavy computations trong render cycle
- [ ] Animation loops khi không visible

---

## PHASE 2: Story Flow & Camera Movement

### 2.1 Tổng hợp Flow câu chuyện hiện tại
```
PRELUDE (Màn hình chờ)
    ↓ [User click]
INTRO (Hoa hồng + Mascots xuất hiện)
    ↓ [Bloom > 80%]
    Text: "Có một món quà nhỏ..." → "Từng chút một..."
    ↓ [User đọc thư]
FLOWER (Camera focus vào hoa)
    ↓ [Scene transition]
CLIMAX (Letter + Envelope)
    Text: "Hiểu nhau hơn..."
    ↓ [User ăn chocolate]
CHOCOLATE (Camera focus vào chocolate)
    Text: "Ngọt ngào..."
    ↓ [Auto]
ENDING (Tổng kết)
```

### 2.2 Đề xuất cải tiến Story Flow
- Camera di chuyển smooth hơn với easing curves
- Text xuất hiện/ẩn với timing chính xác
- Ánh sáng thay đổi theo mood của từng scene
- Thêm particles/effects theo context

### 2.3 Sửa lỗi Story Data timing
- Auto-hide sau 5 giây
- Đảm bảo không overlap với 3D models
- Sync với camera movement

---

## PHASE 3: Audio System

### 3.1 Cấu trúc Audio Config
```typescript
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  avatar: string; // path to album art
  src: string; // path to mp3
}

interface AudioConfig {
  tracks: Track[];
  defaultVolume: number;
  autoplay: boolean;
}
```

### 3.2 UI Components cần tạo
- [ ] `MusicPlayer.tsx` - Player chính với controls
- [ ] `TrackList.tsx` - Danh sách bài hát
- [ ] `ProgressBar.tsx` - Thanh progress kéo được
- [ ] `VolumeSlider.tsx` - Điều chỉnh âm lượng

### 3.3 Features
- Play/Pause/Next/Previous
- Seek (kéo thanh progress)
- Volume control
- Track info display
- Cute UI design

---

## PHASE 4: Frame Selector Upgrade

### 4.1 Cải tiến UI
- Hiển thị preview thumbnail cho mỗi frame style
- Tên frame bên dưới thumbnail
- Grid layout thay vì list
- Hover effect để preview

### 4.2 Frame Styles
- Classic (Pink border)
- Kawaii (Cute decorations)
- Rose Gold (Luxury)
- Crystal (Glass effect)
- Floral (Nature theme)
- Cinematic (Dark film)

---

## PHASE 5: Camera Overlay (Webcam)

### 5.1 Features cần triển khai
- [ ] Toggle webcam on/off
- [ ] Draggable position
- [ ] Resizable (pinch/scroll)
- [ ] Beauty filters (blur, brightness)
- [ ] Mirror toggle
- [ ] Corner snap positions

### 5.2 Components
- `CameraOverlay.tsx` - Container chính
- `CameraControls.tsx` - Điều khiển filter
- `DraggableVideo.tsx` - Video element có thể kéo thả

### 5.3 Filters
- Smooth skin (blur nhẹ)
- Brightness adjustment
- Contrast adjustment
- Color filters (warm/cool)

---

## PHASE 6: Visual Effects Enhancement

### 6.1 Hiệu ứng gió (Wind Effect)
- [ ] Kiểm tra có tồn tại chưa
- [ ] Particle system cho lá bay
- [ ] Điều chỉnh tốc độ/góc độ
- [ ] Debug controls trong panel

### 6.2 Hiệu ứng ánh sáng chiều (Sunset Lighting)
- [ ] Warm tones (orange/pink gradient)
- [ ] Directional light với góc thấp
- [ ] Soft shadows
- [ ] Volumetric rays (optional)

### 6.3 Nâng cấp Floating Hearts
**Chất liệu mới:**
- Crystal (trong suốt, lấp lánh)
- Paper (texture giấy, màu pastel)
- Stone (marble texture)
- Glass (refraction effect)
- Metal (rose gold, silver)

**Hình dạng đa dạng:**
- Heart cổ điển
- Heart double
- Heart với wings
- Heart với sparkles

**Màu sắc:**
- Pink gradient
- Red to purple
- Gold sparkle
- Rainbow shimmer

---

## PHASE 7: Đề xuất Model mới

### 7.1 Models có thể thêm
- Butterflies (bướm bay quanh hoa)
- Petals falling (cánh hoa rơi)
- Sparkle particles
- Love birds
- Ribbon/Bow decorations

### 7.2 Hiệu ứng mới
- Bokeh background blur
- Lens flare
- Soft glow aura
- Particle trails

---

## Thứ tự triển khai đề xuất

1. **PHASE 1** - Tối ưu hiệu năng (2-3 giờ)
2. **PHASE 2** - Story Flow (1-2 giờ)
3. **PHASE 6.3** - Floating Hearts upgrade (1 giờ)
4. **PHASE 3** - Audio System (2-3 giờ)
5. **PHASE 4** - Frame Selector (1 giờ)
6. **PHASE 5** - Camera Overlay (2-3 giờ)
7. **PHASE 6.1-6.2** - Wind & Lighting (1-2 giờ)

---

## Câu hỏi xác nhận

Trước khi bắt đầu, tôi cần USER xác nhận:

1. **Ưu tiên:** Bạn muốn tôi bắt đầu với phase nào trước?
2. **Audio files:** Bạn đã có sẵn file nhạc MP3 chưa? Đường dẫn ở đâu?
3. **Camera filters:** Bạn muốn filter đơn giản hay phức tạp (cần WebGL shader)?
4. **Performance target:** Thiết bị mục tiêu là gì? (Mobile/Desktop/Both)
5. **Story content:** Bạn muốn giữ nguyên nội dung story hay viết lại?

---

*Kế hoạch này sẽ được cập nhật khi có thêm thông tin từ USER.*
