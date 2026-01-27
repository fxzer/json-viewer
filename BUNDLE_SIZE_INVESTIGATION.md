# Rolldown 体积增加原因调研报告

## 概述

升级到 Vite 8 + Rolldown + Oxc 后，构建体积从 **3.0M** 增加到 **3.2M** (+6.7%)。本报告分析导致体积增加的具体原因。

## 详细数据对比

### Chunk 大小变化

| Chunk | Vite 7 (Rollup) | Vite 8 (Rolldown) | 差异 | 变化率 |
|-------|----------------|------------------|------|--------|
| **vendor** | 1,211.43 kB | 135.56 kB | **-1,075.87 kB** | -88.8% |
| **antv-g6** | 306.96 kB | 1,348.09 kB | **+1,041.13 kB** | +339.2% |
| **element-plus** | 108.82 kB | 285.46 kB | **+176.64 kB** | +162.3% |
| **codemirror** | 351.55 kB | 401.18 kB | +49.63 kB | +14.1% |
| **index entry** | 24.38 kB | 24.13 kB | -0.25 kB | -1.0% |
| **rolldown-runtime** | - | 1.20 kB | +1.20 kB | 新增 |

### 关键发现

1. **vendor chunk 大幅减少 88.8%**，说明 Rolldown 采用了不同的代码分割策略
2. **antv-g6 增加 339%**，成为体积增加的主要因素
3. **element-plus 增加 162%**，是第二大因素
4. **新增 Rolldown Runtime** (1.20 kB)

---

## 原因分析

### 1. 代码分割策略差异

**Vite 7 (Rollup)**:
- 使用 `manualChunks` 将所有第三方库集中到 vendor chunk
- 更激进的代码合并策略

**Vite 8 (Rolldown)**:
- 更精细的代码分割，将依赖分散到各自的命名 chunk
- 优先考虑缓存策略（单独的库可以独立缓存）

**影响**: 这不是真正的"体积增加"，而是**体积分布不同**。从总体积上看只增加了 200KB (+6.7%)，但 chunks 之间的分布发生了巨大变化。

### 2. CommonJS/ESM 互操作代码

根据 [Rolldown 官方文档 - Bundling CJS](https://rolldown.rs/in-depth/bundling-cjs)：

Rolldown 为处理 CommonJS 和 ES Module 互操作生成了额外的辅助函数：

```javascript
// Rolldown 生成的运行时辅助函数
var __commonJS = (callback) => { /* ... */ };
var __toESM = (module) => { /* ... */ };
```

**影响**:
- 新增 `rolldown-runtime.js` (1.20 kB)
- 各 chunk 中可能包含重复的互操作辅助代码
- 特别是对于大量使用 CommonJS 的库（如 antv-g6, element-plus）

### 3. Tree Shaking 策略差异

**element-plus 的 sideEffects 配置**:
```json
"sideEffects": [
  "dist/*",
  "theme-chalk/**/*.css",
  "theme-chalk/src/**/*.scss",
  "es/components/*/style/*",
  "lib/components/*/style/*"
]
```

这些文件被标记为"有副作用"，不能被 Tree Shaking 删除。Rolldown 在处理这些配置时可能比 Rollup 更保守。

**影响**: element-plus chunk 从 108.82 kB 增加到 285.46 kB

### 4. antv-g6 体积暴增分析

antv-g6 是增加最多的库 (+1,041 kB)，可能原因：

1. **CommonJS 模块处理**: antv-g6 可能包含大量 CommonJS 代码，Rolldown 生成的互操作代码更多
2. **依赖包含方式**: Rollup 和 Rolldown 在处理依赖图时可能有差异
3. **Tree Shaking 保守策略**: Rolldown 作为 beta 版本，可能采用更保守的策略避免删除必要的代码

### 5. 压缩器差异

虽然 Oxc Minifier 在基准测试中表现良好（压缩率略优于 esbuild），但在实际项目中：
- Oxc 的压缩策略可能与 esbuild 有细微差异
- 某些代码模式的压缩效果可能不同

**基准测试数据** (来源: [minification-benchmarks](https://github.com/privatenumber/minification-benchmarks)):

| 工具 | 压缩后大小 | 耗时 |
|------|-----------|------|
| esbuild | 19.33 KB | 23 ms |
| **Oxc** | **19.24 KB** | **10 ms** |

Oxc 在测试中表现更好，但实际项目中可能因为代码结构不同而产生差异。

---

## 总结

### 体积增加的真正原因

1. **代码分布变化** (主要原因): vendor → 各个独立 chunk，不是真正的体积增加
2. **Rolldown Runtime**: 新增 1.2 KB 运行时代码
3. **antv-g6 和 element-plus**: 由于 CommonJS 互操作和 Tree Shaking 策略差异导致
4. **实际净增加**: 约 200KB (+6.7%)

### 权衡考虑

| 方面 | Vite 7 (Rollup) | Vite 8 (Rolldown) |
|------|----------------|-------------------|
| 构建速度 | 12.23s | 3.20s (**-74%**) ⚡ |
| 总体积 | 3.0M | 3.2M (+6.7%) |
| 缓存策略 | 集中式 vendor | 独立库 chunk |
| 长期收益 | - | 更好的并行加载、缓存粒度 |

### 建议

1. **短期**: 接受 6.7% 的体积增加，换取 74% 的构建速度提升
2. **长期**: 等 Rolldown 正式版发布，Tree Shaking 和代码优化会更成熟
3. **优化**:
   - 为 antv-g6 和 element-plus 检查是否可以按需引入
   - 考虑使用动态 import() 进一步分割代码
   - 等待库作者更新 package.json 的 sideEffects 配置

### 参考资料

- [Rolldown - Bundling CJS](https://rolldown.rs/in-depth/bundling-cjs)
- [Vite 8 Migration Guide](https://main.vite.dev/guide/migration)
- [Oxc Minifier Announcement](https://oxc.rs/blog/2025-03-13-minifier-alpha)
- [JS Minification Benchmarks](https://github.com/privatenumber/minification-benchmarks)
- [极速优化：Rolldown代码分割与Tree Shaking实战指南](https://blog.csdn.net/gitblog_00702/article/details/150755375)
