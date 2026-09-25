# 构建性能测试报告

## 基准测试（当前配置）

### 构建配置

- **Vite**: v7.2.2
- **打包器**: Rollup（Vite 默认）
- **压缩器**: esbuild
- **测试时间**: 2026-01-27

### 构建时间

- **构建耗时**: 12.23s
- **CPU 使用**: 103% (14.96s user + 3.50s system)

### 构建产物

#### 总体积

- **总大小**: 3.0M

#### 详细文件大小

| 文件/目录                | 大小 |
| ------------------------ | ---- |
| dist/chunks              | 1.9M |
| dist/assets              | 416K |
| dist/preview.svg         | 576K |
| dist/entries             | 24K  |
| dist/logo_512.png        | 40K  |
| dist/workbox-e3490c72.js | 16K  |

#### 主要 Chunk 大小（未压缩）

| Chunk                    | 大小        | Gzip      |
| ------------------------ | ----------- | --------- |
| vendor-YDV7X9kX.js       | 1,211.43 kB | 386.24 kB |
| codemirror-CRD633Ca.js   | 351.55 kB   | 112.65 kB |
| antv-g6-DgQcaEUb.js      | 306.96 kB   | 86.84 kB  |
| element-plus-BEaZcBpM.js | 108.82 kB   | 37.24 kB  |
| index-CGDA7_4w.js        | 24.38 kB    | 10.56 kB  |

### 模块统计

- **转换模块数**: 2931 modules

### 警告信息

- 部分 chunk 超过 500 kB，建议使用动态导入进行代码分割

---

## 升级后测试（Vite 8 + Rolldown + Oxc）

### 构建配置

- **Vite**: v8.0.0-beta.10
- **打包器**: Rolldown（替代 Rollup）
- **JS 转换**: Oxc（替代 esbuild）
- **JS 压缩**: Oxc Minifier（默认）
- **CSS 压缩**: Lightning CSS（默认）
- **测试时间**: 2026-01-27

### 构建时间

- **构建耗时**: 3.97s
- **CPU 使用**: 54% (7.81s user + 3.29s system)
- **性能提升**: **67.5% 更快** (12.23s → 3.97s)

### 构建产物

#### 总体积

- **总大小**: 3.2M
- **大小变化**: +6.7% (由于 Rolldown 的打包策略略有不同)

#### 详细文件大小

| 文件/目录                | 大小 |
| ------------------------ | ---- |
| dist/chunks              | 2.1M |
| dist/assets              | 400K |
| dist/preview.svg         | 576K |
| dist/entries             | 24K  |
| dist/logo_512.png        | 40K  |
| dist/workbox-4723e66c.js | 16K  |

#### 主要 Chunk 大小（未压缩）

| Chunk                    | 大小        | Gzip      |
| ------------------------ | ----------- | --------- |
| antv-g6-CMyEQx9\_.js     | 1,348.09 kB | 383.19 kB |
| codemirror-B2miKIDl.js   | 401.18 kB   | 129.10 kB |
| element-plus-T_4zRX3j.js | 285.46 kB   | 101.28 kB |
| vendor-C3L6zmku.js       | 135.56 kB   | 48.24 kB  |
| index-CaCXIgFp.js        | 24.13 kB    | 10.26 kB  |

### 模块统计

- **转换模块数**: 3049 modules (+118)

### 配置变化

- `build.rollupOptions` → `build.rolldownOptions`
- `esbuild` → `oxc`
- `manualChunks` → `codeSplitting` (advancedChunks 已弃用)

---

## 性能对比

| 指标       | Vite 7 (Rollup) | Vite 8 (Rolldown) | 变化          |
| ---------- | --------------- | ----------------- | ------------- |
| 构建时间   | 12.23s          | 3.97s             | **-67.5%** ⚡ |
| 总体积     | 3.0M            | 3.2M              | +6.7%         |
| 转换模块数 | 2931            | 3049              | +4%           |

### 总结

✅ **性能提升显著**：构建时间从 12.23s 降低到 3.97s，性能提升约 68%

⚠️ **注意事项**：

1. `advancedChunks` 选项已被弃用，未来应使用 `codeSplitting`
2. 构建产物体积略有增加（+6.7%），但考虑到构建速度的大幅提升，这是可以接受的
3. 需要等 Vite 8 正式版发布后再用于生产环境
