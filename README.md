# 九安医疗股价推送技能 📈

**九安医疗 (002432.SZ)** 定时股价查询与推送技能 for OpenClaw

## 快速开始

### 安装定时任务

```bash
# 方法 1：使用 npm 脚本
cd skills/jiuanyiliao
npm run setup

# 方法 2：直接运行脚本
node skills/jiuanyiliao/scripts/setup-cron.js

# 方法 3：使用 OpenClaw CLI（手动创建）
cmd /c openclaw cron add --name "九安医疗股价-09:35" --cron "35 9 * * 1-5" --tz "Asia/Shanghai" --message "查询九安医疗 (002432.SZ) 当前股价..." --announce --channel feishu --session isolated
```

### 删除定时任务

```bash
# 使用脚本自动删除所有相关任务
node skills/jiuanyiliao/scripts/remove-cron.js

# 或手动删除单个任务
cmd /c openclaw cron rm <任务 ID>
```

### 手动查询股价

```bash
node skills/jiuanyiliao/scripts/query-price.js
```

## 功能特性

- ✅ **6 个时间点自动推送**：09:35, 10:30, 11:30, 13:05, 14:00, 15:00
- ✅ **仅工作日执行**：周一至周五（中国 A 股交易日）
- ✅ **北京时间**：Asia/Shanghai 时区
- ✅ **飞书推送**：自动发送股价信息
- ✅ **东方财富网数据**：实时股价、涨跌幅、成交量等

## 推送时间说明

| 时间 | 说明 |
|------|------|
| 09:35 | 开盘后 5 分钟，观察开盘表现 |
| 10:30 | 上午盘中，交易活跃期 |
| 11:30 | 上午收盘前，锁定上午走势 |
| 13:05 | 下午开盘后 5 分钟，观察午后表现 |
| 14:00 | 下午盘中，关键时段 |
| 15:00 | 收盘时，最终收盘价 |

## 自定义配置

### 修改推送时间

编辑 `scripts/setup-cron.js`：

```javascript
const SCHEDULE_TIMES = [
  { hour: 9, minute: 35 },
  { hour: 10, minute: 30 },
  // 添加或修改时间...
];
```

### 修改推送渠道

编辑 `scripts/setup-cron.js`：

```javascript
const CHANNEL = 'feishu';  // 可选：feishu, telegram, whatsapp, discord
```

### 修改查询的股票

编辑相关脚本中的 `STOCK_INFO`：

```javascript
const STOCK_INFO = {
  name: '九安医疗',
  code: '002432',
  market: 'SZ',  // SZ=深圳，SH=上海
  url: 'https://quote.eastmoney.com/sz002432.html'
};
```

## 管理命令

```bash
# 查看所有定时任务
cmd /c openclaw cron list

# 查看任务执行历史
cmd /c openclaw cron runs

# 禁用任务
cmd /c openclaw cron disable <任务 ID>

# 启用任务
cmd /c openclaw cron enable <任务 ID>

# 立即测试任务
cmd /c openclaw cron run <任务 ID>
```

## 故障排除

### 任务未执行

1. 检查任务状态：`cmd /c openclaw cron list`
2. 查看执行历史：`cmd /c openclaw cron runs`
3. 确保 Gateway 运行：`openclaw gateway status`

### 数据获取失败

1. 检查网络连接
2. 手动测试浏览器访问东方财富网
3. 查看浏览器工具是否正常

## 依赖

- Node.js v16+
- OpenClaw 2026.3.0+
- browser 工具
- feishu 插件

## 文件结构

```
skills/jiuanyiliao/
├── SKILL.md              # 技能说明
├── package.json          # 项目配置
├── README.md             # 本文档
└── scripts/
    ├── setup-cron.js     # 安装脚本
    ├── remove-cron.js    # 删除脚本
    └── query-price.js    # 查询脚本
```

## 许可证

MIT License

---

*📈 投资有风险，入市需谨慎。数据仅供参考，不构成投资建议。*
