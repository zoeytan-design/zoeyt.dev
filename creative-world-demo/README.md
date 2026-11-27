# Zoey Creative World — Demo

钥匙开锁 → 穿过钥匙孔 → 进入未来创作工作室 → 探索作品 的可交互原型。仅用于本地运行，没有部署。

## 启动

需要 Node.js 18+。

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 生产构建 → dist/
npm run preview    # 本地预览构建结果
```

技术：Vite + React 18 + TypeScript + GSAP / ScrollTrigger。没有使用 Three.js：场景是分层 SVG（2.5D 视差 + 遮罩 + 滚动镜头）。

## 已实现

| 段落 | 内容 |
|---|---|
| A 门外 | 离焦柔边钥匙孔（参考图的构图：孔占满画面高度、边缘暖光、胶片颗粒）。孔内就是之后进入的同一个工作室实例。`Enter` → 钥匙靠近、对准、旋转 90°，室内灯光变亮 → 出现 `Scroll to enter`。`Skip intro` / `View work →` 随时可用。 |
| B 穿越 | 滚动进度（默认 1.3 个视口高）驱动锁面放大 + 场景三层不同速率推近；可倒退，连续无跳切。锁边是模糊遮罩，放大不会出现像素锯齿。 |
| C 工作室 | 挑高有机拱结构、窗外花园、工作桌、暖色台灯、坐着工作的背影（不是肖像）、室内植物、前景虚化叶子；呼吸感微动（灯光、植物、人物、雾）。游标视差最多 14px，仅限鼠标。 |
| D 作品 | 展位由数据生成（最多 6 个空间展位，超过的仍可从 Work 列表打开），每个有预览、名称、类型、View project。Hover/聚焦会发光。案例面板支持 Esc、焦点锁定、关闭后焦点回到原触发点。 |
| 导航 | 常驻 Work / About / Sound；到达工作室后多一个 `Door`（回到门口）。再次访问会直接回到工作室，不会强制重播入口。 |
| 音乐 | 默认关闭。两首曲目根据穿越进度等功率交叉淡化，案例打开时工作室曲目降低音量。缺少文件时显示 **Audio unavailable**。 |
| 手机 | 精简穿越，工作室底部显示可点的作品列表，不需要 hover，也不请求陀螺仪权限。 |
| 减少动态 | `prefers-reduced-motion`：不放大、不做视差和微动，锁面改为淡出，所有入口都还在。 |

## 占位内容（全部有标注）

- **场景视觉**：手绘矢量 SVG 占位（目标是高质量渲染图／插画）。页面上方标注 `Prototype · placeholder visuals`。
- **作品**：NightGuard VR 只写了已知事实（Unity、Meta Quest 3、手部互动、VR 康复游戏原型），其余段落明确写着“To be written”。Project 02 / 03（以及备用 04）是空白占位。所有案例都有 `Demo content` 标签，预览图都有 `Placeholder preview` 标签。
- **定位句**：“Designer exploring interaction, visual design and creative technology.” 是 demo 文案。
- **音乐**：没有附带任何音频文件。
- **字体**：Cormorant Garamond + Manrope（Google Fonts）。离线时会回退为系统字体。

## 修改方法

**作品**：`src/config/projects.ts` — 每条包含 `id, title, category, preview, summary, caseContent?`。
`preview` 可以是 `{ kind: 'image', src: '/work/nightguard.jpg', alt: '…' }`（图片放进 `public/work/`）。

**挑选与排序**：`src/config/site.ts` 中的 `selectedProjectIds`，数组顺序就是展位和列表的顺序。
测试时可以直接用网址：`/?projects=nightguard-vr,project-02`（这是为日后“针对不同公司／科系的分享版本”预留的入口）。

**文案、滚动距离、视差强度、音量**：都在 `src/config/site.ts`。

**展位位置**：`src/scene/geometry.ts` 中的 `EXHIBIT_SLOTS`（舞台坐标 1600×1000，`floorY` 决定透视大小）。

**音乐**：把合法授权的文件放进：

```
public/audio/entrance.mp3   # 入口：稀疏、空灵、神秘、有期待感
public/audio/studio.mp3     # 工作室：柔和电子氛围 + 自然质感，可循环
```

路径可以在 `site.audio` 修改。文件缺失、无法解码或浏览器拒绝播放时，都会显示 Audio unavailable。

**颜色**：`src/styles/global.css` 中的 `:root` 变量，以及 `site.ts` 中的 `palette`。

## 替换场景成高质量图片

场景分为三层，都使用同一个 1600×1000 的舞台坐标：

- `src/scene/StudioBack.tsx` — 建筑、窗、花园、地面、光
- `src/scene/StudioMid.tsx` — 桌、人物、台灯、植物（作品展位叠在这一层）
- `src/scene/StudioFront.tsx` — 前景虚化叶子、暗角

替换方式：生成 16:10 的图片（建议 3200×2000），分成 back / mid / front 三张 PNG（mid 和 front 需要透明背景），用 `<image href="/scene/back.webp" width="1600" height="1000" />` 替换对应 SVG 的内容。保持消失点大约在 (800, 590)、人物大约在 x≈836、地面线在 y≈700，这样钥匙孔构图和展位位置不需要修改。

**生成提示词（英文，可直接使用）**

> Cinematic wide interior of a private futuristic creative studio at dusk, eye-level camera at about 1.5 m, one-point perspective with vanishing point slightly below centre. A very tall, minimal hall with organic arched ribs like leaf veins, three tall arched glass windows on the back wall opening to a quiet garden with soft rolling hills, rounded trees and pale mist on the horizon, cool moonlight. In the middle ground, a woman seen from behind sitting at a long slim desk (hair tied up, no visible face), a translucent glass display glowing pale cyan in front of her, a warm brass desk lamp casting a small amber pool of light. A slender olive-like tree in a ceramic planter to the right. Polished dark floor with soft reflections of the windows, faint volumetric light shafts, thin haze. Palette: deep ink blue, charcoal, silver-white, pale cyan, with small warm lamp accents. Calm, spacious, museum-like, quiet, high detail, soft film grain, photographic, 16:10. No text, no logos, no neon, no HUD, no cyberpunk.

需要分层时，另外生成：“same scene, only the desk, figure, lamp and planter on transparent background”，以及“only out-of-focus foreground leaves at bottom corners on transparent background”。

## 已知限制

- 视觉完成度只达到占位级（矢量插画），还没有达到电影感渲染的目标品质。
- 钥匙是 2D 正面造型，转动方式是平面旋转，不是 3D 模型。
- 只在 headless Chrome 中测试过（桌机多种尺寸、390×844 手机模拟、reduced-motion、纯键盘操作）。还没有在 Safari / Firefox / 真机上测试。headless 软件渲染在 2560 宽时穿越动画较慢；GPU 浏览器预计更流畅，但需要实测。
- 手机竖屏只能看到场景中间部分，所以作品改为底部列表。
