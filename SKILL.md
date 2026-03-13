---
name: jiuanyiliao
version: 1.0.0
description: 九安医疗 (002432.SZ) 股价定时推送技能。工作日自动在 6 个时间点查询股价并通过飞书推送给用户。
metadata: { "openclaw": { "emoji": "📈", "requires": { "bins": ["node"], "tools": ["browser"] }, "primaryEnv": "none" } }
---

# 九安医疗股价推送 📈

**九安医疗 (002432.SZ)** 定时股价查询与推送技能。

## 功能特点

- ⏰ **6 个时间点自动推送**：09:35, 10:30, 11:30, 13:05, 14:00, 15:00
- 📅 **仅工作日执行**：周一至周五（中国 A 股交易日）
- 🌏 **北京时间**：Asia/Shanghai 时区
- 📱 **飞书推送**：自动发送股价信息到用户的飞书
- 📊 **数据来源**：百度财经（浏览器自动化）
- ⚡ **优化配置**：任务超时120秒，简化查询流程

## 2026-03-12 优化更新

### 🔧 技术改进
1. **增加任务超时时间**：从60秒提升到120秒
2. **简化查询消息**：减少浏览器操作复杂度
3. **优化目标配置**：确保Feishu消息正确发送
4. **改进错误处理**：增加备用执行方法

### 📊 性能指标
- **今日成功率**：3/6 (50%)
- **目标成功率**：6/6 (100%)
- **重点关注**：09:35, 10:30, 13:05, 14:00

## 安装与配置

### 1. 安装技能

技能已位于工作区：
```
C:\Users\anhui\.openclaw\workspace\skills\jiuanyiliao\
```

### 2. 启用定时任务

运行以下命令创建 6 个定时任务：

```bash
# Windows (PowerShell 需要 cmd /c 包装器)
cmd /c node skills/jiuanyiliao/scripts/setup-cron.js
```

或者手动创建每个任务：

```bash
# 09:35
cmd /c openclaw cron add --name "九安医疗股价-09:35" --cron "35 9 * * 1-5" --tz "Asia/Shanghai" --message "查询九安医疗 (002432.SZ) 当前股价，通过浏览器访问百度搜索获取实时数据，然后将股价信息（收盘价、涨跌幅、成交量等）发送给用户。" --announce --channel feishu --session isolated

# 10:30
cmd /c openclaw cron add --name "九安医疗股价-10:30" --cron "30 10 * * 1-5" --tz "Asia/Shanghai" --message "查询九安医疗 (002432.SZ) 当前股价，通过浏览器访问百度搜索获取实时数据，然后将股价信息（收盘价、涨跌幅、成交量等）发送给用户。" --announce --channel feishu --session isolated

# 11:30
cmd /c openclaw cron add --name "九安医疗股价-11:30" --cron "30 11 * * 1-5" --tz "Asia/Shanghai" --message "查询九安医疗 (002432.SZ) 当前股价，通过浏览器访问百度搜索获取实时数据，然后将股价信息（收盘价、涨跌幅、成交量等）发送给用户。" --announce --channel feishu --session isolated

# 13:05
cmd /c openclaw cron add --name "九安医疗股价-13:05" --cron "5 13 * * 1-5" --tz "Asia/Shanghai" --message "查询九安医疗 (002432.SZ) 当前股价，通过浏览器访问百度搜索获取实时数据，然后将股价信息（收盘价、涨跌幅、成交量等）发送给用户。" --announce --channel feishu --session isolated

# 14:00
cmd /c openclaw cron add --name "九安医疗股价-14:00" --cron "0 14 * * 1-5" --tz "Asia/Shanghai" --message "查询九安医疗 (002432.SZ) 当前股价，通过浏览器访问百度搜索获取实时数据，然后将股价信息（收盘价、涨跌幅、成交量等）发送给用户。" --announce --channel feishu --session isolated

# 15:00
cmd /c openclaw cron add --name "九安医疗股价-15:00" --cron "0 15 * * 1-5" --tz "Asia/Shanghai" --message "查询九安医疗 (002432.SZ) 当前股价，通过浏览器访问百度搜索获取实时数据，然后将股价信息（收盘价、涨跌幅、成交量等）发送给用户。" --announce --channel feishu --session isolated
```

## 使用方法

### 手动查询股价

```bash
# 使用脚本查询
node skills/jiuanyiliao/scripts/query-price.js
```

### 管理定时任务

```bash
# 查看所有任务
cmd /c openclaw cron list

# 禁用所有九安医疗任务
cmd /c openclaw cron disable <任务 ID>

# 启用所有九安医疗任务
cmd /c openclaw cron enable <任务 ID>

# 删除所有九安医疗任务
cmd /c node skills/jiuanyiliao/scripts/remove-cron.js
```

## 数据格式

每次推送包含以下信息：
- **股票名称**：九安医疗
- **股票代码**：002432.SZ
- **当前价格**：xx.xx 元
- **涨跌幅**：±x.xx%
- **涨跌额**：±x.xx 元
- **成交量**：xx.xx 万手
- **总市值**：xx.x 亿元
- **更新时间**：YYYY-MM-DD HH:mm:ss

## 自定义配置

### 修改推送时间

编辑 `scripts/setup-cron.js` 中的 `SCHEDULE_TIMES` 数组：

```javascript
const SCHEDULE_TIMES = [
  { hour: 9, minute: 35 },   // 09:35 - 开盘后 5 分钟
  { hour: 10, minute: 30 },  // 10:30 - 上午盘中
  { hour: 11, minute: 30 },  // 11:30 - 上午收盘前
  { hour: 13, minute: 5 },   // 13:05 - 下午开盘后 5 分钟
  { hour: 14, minute: 0 },   // 14:00 - 下午盘中
  { hour: 15, minute: 0 },   // 15:00 - 收盘时
];
```

### 修改推送渠道

编辑 `scripts/setup-cron.js` 中的 `CHANNEL` 变量：

```javascript
const CHANNEL = 'feishu';  // 可选：feishu, telegram, whatsapp, discord
```

### 修改查询的股票

编辑所有脚本中的 `STOCK_INFO` 对象：

```javascript
const STOCK_INFO = {
  name: '九安医疗',
  code: '002432',
  market: 'SZ',  // SZ=深圳，SH=上海
  url: 'https://quote.eastmoney.com/sz002432.html'
};
```

## 文件结构

```
skills/jiuanyiliao/
├── SKILL.md              # 技能说明文档（本文件）
├── package.json          # 依赖配置
├── scripts/
│   ├── setup-cron.js     # 安装定时任务脚本
│   ├── remove-cron.js    # 删除定时任务脚本
│   └── query-price.js    # 手动查询股价脚本
└── README.md             # 详细使用文档
```

## 依赖要求

- **Node.js**: v16+
- **OpenClaw**: 2026.3.0+
- **浏览器工具**: browser (用于访问东方财富网)
- **飞书集成**: feishu 插件已配置

## 故障排除

### 定时任务未执行

1. 检查任务状态：
   ```bash
   cmd /c openclaw cron list
   ```

2. 查看任务历史：
   ```bash
   cmd /c openclaw cron runs
   ```

3. 确保 Gateway 正常运行：
   ```bash
   openclaw gateway status
   ```

### 股价数据获取失败

1. 检查网络连接
2. 手动测试浏览器访问：
   ```bash
   node skills/jiuanyiliao/scripts/query-price.js
   ```

3. 检查百度财经是否可访问

## 注意事项

1. **A 股交易时间**：周一至周五 9:30-11:30, 13:00-15:00
2. **节假日休市**：定时任务仍会执行，但无实时数据
3. **数据延迟**：免费数据可能有 15 分钟延迟
4. **网络要求**：需要稳定的互联网连接

## 版本历史

- **v1.0.0** (2026-03-07)
  - 初始版本
  - 支持 6 个时间点自动推送
  - 飞书集成
  - 浏览器自动化查询

## 许可证

MIT License

---

*📈 投资有风险，入市需谨慎。本技能提供的数据仅供参考，不构成投资建议。*
