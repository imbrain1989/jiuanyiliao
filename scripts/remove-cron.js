/**
 * 九安医疗股价定时任务删除脚本
 * 
 * 使用方法：
 * node skills/jiuanyiliao/scripts/remove-cron.js
 */

const { execSync } = require('child_process');

// 执行命令
function execCommand(cmd) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
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

// 获取任务列表（兼容不同格式）
function getJobList() {
  const result = execCommand('cmd /c openclaw cron list --json');
  if (result.success) {
    try {
      const data = JSON.parse(result.output);
      // 兼容两种格式：{jobs:[...]} 或 [{...}]
      return Array.isArray(data) ? data : (data.jobs || []);
    } catch (e) {
      return [];
    }
  }
  return [];
}

// 主函数
function main() {
  console.log('📈 九安医疗股价定时任务删除程序\n');
  
  const jobs = getJobList();
  const jiuanyiliaoJobs = jobs.filter(job => 
    job.name && job.name.includes('九安医疗股价')
  );
  
  if (jiuanyiliaoJobs.length === 0) {
    console.log('✅ 未找到九安医疗相关的定时任务');
    return;
  }
  
  console.log(`找到 ${jiuanyiliaoJobs.length} 个九安医疗定时任务：\n`);
  jiuanyiliaoJobs.forEach((job, index) => {
    console.log(`[${index + 1}] ${job.name}`);
    console.log(`    ID: ${job.id}`);
    console.log(`    计划：${job.schedule?.expr || 'N/A'}`);
    console.log();
  });
  
  console.log('─'.repeat(60));
  console.log('准备删除这些任务...\n');
  
  let deletedCount = 0;
  let failedCount = 0;
  
  jiuanyiliaoJobs.forEach(job => {
    console.log(`删除：${job.name} (${job.id})`);
    
    const cmd = `cmd /c openclaw cron rm ${job.id}`;
    const result = execCommand(cmd);
    
    if (result.success) {
      console.log(`    ✅ 已删除`);
      deletedCount++;
    } else {
      console.log(`    ❌ 失败：${result.error}`);
      failedCount++;
    }
  });
  
  console.log('\n' + '═'.repeat(60));
  console.log('删除完成！\n');
  console.log(`成功：${deletedCount} 个`);
  console.log(`失败：${failedCount} 个`);
  console.log('═'.repeat(60));
}

// 运行
main();
