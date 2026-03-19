/**
 * 九安医疗股价定时任务安装脚本（优化版本）
 * 
 * 使用方法：
 * node skills/jiuanyiliao/scripts/setup-cron.js
 * 
 * 2026-03-12 优化重点：
 * 1. 增加任务超时时间到120秒
 * 2. 简化查询消息，减少浏览器操作复杂度
 * 3. 确保消息目标配置正确
 */

const { execSync } = require('child_process');
const path = require('path');

// 配置
const STOCK_INFO = {
  name: '九安医疗',
  code: '002432',
  market: 'SZ',
};

const SCHEDULE_TIMES = [
  { hour: 9, minute: 35, name: '09:35' },
  { hour: 10, minute: 30, name: '10:30' },
  { hour: 11, minute: 30, name: '11:30' },
  { hour: 13, minute: 5, name: '13:05' },
  { hour: 14, minute: 0, name: '14:00' },
  { hour: 15, minute: 0, name: '15:00' },
];

const CHANNEL = 'feishu';
const TIMEZONE = 'Asia/Shanghai';
const TASK_TIMEOUT = 120; // 任务超时时间（秒）
// 推送目标用户 ID（飞书 open_id）- 已验证正确的配置
const TARGET_USER = 'XXX';

// 生成 cron 表达式
function generateCron(hour, minute) {
  return `${minute} ${hour} * * 1-5`;
}

// 生成优化的任务消息（简化版，减少浏览器操作复杂度）
function generateMessage() {
  return `查询${STOCK_INFO.name} (${STOCK_INFO.code}.${STOCK_INFO.market}) 当前股价，通过浏览器访问百度搜索获取实时数据，然后发送股价信息给用户。`;
}

// 执行命令
function execCommand(cmd) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000 // 命令执行超时30秒
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: error.stdout || error.stderr 
    };
  }
}

// 主函数
function main() {
  console.log('📈 九安医疗股价定时任务安装程序（优化版本）\n');
  console.log(`股票：${STOCK_INFO.name} (${STOCK_INFO.code}.${STOCK_INFO.market})`);
  console.log(`推送渠道：${CHANNEL}`);
  console.log(`时区：${TIMEZONE}`);
  console.log(`任务超时：${TASK_TIMEOUT}秒`);
  console.log('─'.repeat(60));
  
  const message = generateMessage();
  const createdJobs = [];
  
  SCHEDULE_TIMES.forEach((schedule, index) => {
    const cronExpr = generateCron(schedule.hour, schedule.minute);
    const jobName = `${STOCK_INFO.name}股价-${schedule.name}`;
    
    console.log(`\n[${index + 1}/${SCHEDULE_TIMES.length}] 创建任务：${jobName}`);
    console.log(`    Cron: ${cronExpr}`);
    
    // 构建命令（优化版本）
    // 关键改进：增加 --timeout 参数，确保使用正确的 --to 参数
    const cmd = `cmd /c openclaw cron add --name "${jobName}" --cron "${cronExpr}" --tz "${TIMEZONE}" --message "${message}" --announce --channel ${CHANNEL} --to ${TARGET_USER} --session isolated --timeout ${TASK_TIMEOUT}`;
    
    const result = execCommand(cmd);
    
    if (result.success) {
      // 解析输出获取任务 ID
      const match = result.output.match(/"id":\s*"([^"]+)"/);
      const jobId = match ? match[1] : 'unknown';
      createdJobs.push({ name: jobName, id: jobId, schedule: schedule.name });
      console.log(`    ✅ 已创建 (ID: ${jobId})`);
    } else {
      console.log(`    ❌ 失败：${result.error}`);
      // 如果是权限问题，尝试使用备用方法
      if (result.error.includes('permission') || result.error.includes('unauthorized')) {
        console.log(`    🔄 尝试备用方法...`);
        const backupCmd = `cmd /c openclaw cron add --name "${jobName}" --cron "${cronExpr}" --tz "${TIMEZONE}" --message "${message}" --channel ${CHANNEL} --target user:${TARGET_USER} --session isolated --timeout ${TASK_TIMEOUT}`;
        const backupResult = execCommand(backupCmd);
        if (backupResult.success) {
          const match = backupResult.output.match(/"id":\s*"([^"]+)"/);
          const jobId = match ? match[1] : 'unknown';
          createdJobs.push({ name: jobName, id: jobId, schedule: schedule.name });
          console.log(`    ✅ 备用方法成功 (ID: ${jobId})`);
        }
      }
    }
  });
  
  console.log('\n' + '═'.repeat(60));
  console.log('✅ 安装完成！\n');
  
  if (createdJobs.length > 0) {
    console.log('已创建的任务：');
    createdJobs.forEach(job => {
      console.log(`  • ${job.name} - ${job.schedule} (ID: ${job.id})`);
    });
    
    console.log('\n📋 明天执行计划：');
    console.log('  09:35 - 重点关注（今日曾失败）');
    console.log('  10:30 - 重点关注（今日曾失败）');  
    console.log('  11:30 - 正常监控');
    console.log('  13:05 - 重点关注（今日曾失败）');
    console.log('  14:00 - 重点关注（今日曾失败）');
    console.log('  15:00 - 正常监控');
  }
  
  console.log('\n🔧 管理命令：');
  console.log('  查看任务列表：cmd /c openclaw cron list');
  console.log('  查看运行历史：cmd /c openclaw cron runs');
  console.log('  禁用任务：cmd /c openclaw cron disable <任务 ID>');
  console.log('  启用任务：cmd /c openclaw cron enable <任务 ID>');
  console.log('  手动执行：cmd /c openclaw cron run <任务 ID>');
  console.log('  删除任务：cmd /c openclaw cron rm <任务 ID>');
  
  console.log('\n⚠️ 监控建议：');
  console.log('  重点关注09:35和10:30的执行情况');
  console.log('  如果失败，检查：');
  console.log('    1. 浏览器服务状态');
  console.log('    2. Feishu授权状态');
  console.log('    3. 网络连接状态');
  console.log('═'.repeat(60));
}

// 运行
main();
