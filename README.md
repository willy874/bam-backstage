# Backstage

## Introduction

### 核心技術

| name     | version |
|----------|---------|
| Vue3     | 3.0.5   |
| Vite     | 1.2.3   |
| tailwind | 2.1.4   |

## Development

```bash
# step 1
$ npm install

# step 2
$ npm run dev
```

## Deploy

```bash
# step 1
$ npm install

# step 2
$ npm run build

# step 3
$ npm run serve
```

## Tools

依據 `tool.config.js` 設定運行

```bash
# 建立索引檔案
$ npm run tool index

# 將 svg 轉換為 Icon 可以的 JS 格式
$ npm run tool svg

# 自動建立基礎的 model
$ npm run tool model

# 建構 CKeditor 的基礎檔
$ npm run tool ckeditor
```