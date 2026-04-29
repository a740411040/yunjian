# Yun Jian Showcase

新中式笔记与社区体验展示项目。

这个仓库是 `Yun Jian / 云笺` 的公开展示版，重点呈现视觉设计、前端交互、移动端体验与 PWA 落地能力，不包含完整的私有业务后端与生产配置。

## Highlights

- 3 种主题模式
  - 昼白
  - 深色夜间
  - 浅色夜间

- 4 组随机首页风格
  - 中国风素雅视觉
  - 随机诗意文案
  - 更偏作品展示型的 landing 体验

- Mobile-first 优化
  - 手机端卡片和按钮布局统一
  - 主题浮层自动缩小为角落图标
  - 更适合触屏操作的交互密度

- PWA 支持
  - Manifest
  - 安装提示
  - 主屏图标
  - 基础离线壳

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Motion
- Lucide React

## Project Focus

这个展示仓主要关注以下方向：

- 东方审美界面表达
- 多主题系统设计
- PWA 安装体验
- 移动端网页接近 App 的交互处理
- 组件化前端组织方式

## Notes

这是展示版仓库，因此做了以下裁剪：

- 不包含真实环境变量
- 不包含完整 Supabase 生产配置
- 不包含完整管理后台能力
- 不包含全部私有业务数据流

如果你想看完整项目实现，可以基于这个展示版继续扩展 mock 数据层，或接入你自己的后端服务。

## Local Development

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Suggested Public Repo Structure

```txt
public/
src/
  app/
  components/
  lib/
  types/
README.md
```

## Showcase Direction

如果你把这个仓库作为作品集项目，建议重点补这些内容：

- 首页截图
- 手机端截图
- PWA 安装动图
- 主题切换前后对比
- 设计说明或交互拆解

## License

你可以根据自己的展示需求补充 License。
