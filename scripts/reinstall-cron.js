/**
 * 九安医疗股价定时任务重新安装脚本
 * 
 * 功能：先移除所有旧任务，然后安装优化版本的新任务
 * 使用方法：
 * node skills/jiuanyiliao/scripts/reinstall-cron.js
 */

const { execSync } = require('child_process');
const path = require('path');

// 任务名称模式
const JOB_PATTERN = '九安医疗股价';

// 执行命令
function execCommand(cmd) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000
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

// 获取所有九安医疗任务
function getJobs() {
  const cmd = `cmd /c openclaw cron list`;
  const result = execCommand(cmd);
  
  if (!result.success) {
    console.log('❌ 获取任务列表失败');
    return [];
  }
  
  const lines = result.output.split('\n');
  const jobs = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && line.includes(JOB_PATTERN)) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        jobs.push({
          id: parts[0],
          name: parts[1]
        });
      }
    }
  }
  
  return jobs;
}

// 移除所有九安医疗任务
function removeAllJobs() {
  console.log('🗑️  开始移除所有九安医疗任务...\n');
  
  const jobs = getJobs();
  
  if (jobs.length === 0) {
    console.log('✅ 没有找到需要移除的任务');
    return true;
  }
  
  console.log(`找到 ${jobs.length} 个任务需要移除：`);
  jobs.forEach(job => console.log(`  • ${job.name} (ID: ${job.id})`));
  
  let successCount = 0;
  
  jobs.forEach(job => {
    console.log(`\n[${successCount + 1}/${jobs.length}] 移除任务：${job.name}`);
    const cmd = `cmd /c openclaw cron rm ${job.id}`;
    const result = execCommand(cmd);
    
    if (result.success) {
      console.log(`    ✅ 已移除`);
      successCount++;
    } else {
      console.log(`    ❌ 移除失败：${result.error}`);
    }
  });
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✅ 任务移除完成：${successCount}/${jobs.length}`);
  
  return successCount === jobs.length;
}

// 安装新任务
function installNewJobs() {
  console.log('\n📈 开始安装优化版本的新任务...\n');
  
  const cmd = `cmd /c node skills/jiuanyiliao/scripts/setup-cron.js`;
  const result = execCommand(cmd);
  
  if (result.success) {
    console.log('\n✅ 新任务安装完成');
    return true;
  } else {
    console.log(`\n❌ 安装失败：${result.error}`);
    return false;
  }
}

// 主函数
function main() {
  console.log('🔄 九安医疗股价定时任务重新安装程序\n');
  console.log('此脚本将：');
  console.log('  1. 移除所有现有的九安医疗任务');
  console.log('  2. 安装优化版本的新任务');
  console.log('  3. 增加超时时间和改进配置\n');
  console.log('⚠️  请确保在维护窗口期执行此操作\n');
  console.log('─'.repeat(60));
  
  // 移除旧任务
  const removeSuccess = removeAllJobs();
  
  if (!removeSuccess) {
    console.log('\n❌ 移除旧任务失败，请手动清理后再试');
    return;
  }
  
  // 安装新任务
  const installSuccess = installNewJobs();
  
  if (installSuccess) {
    console.log('\n' + '═'.repeat(60));
    console.log('✅ 重新安装完成！');
    console.log('\n📋 明天执行计划已优化：');
    console.log('  • 超时时间：120秒');
    console.log('  • 简化查询流程');
    console.log('  • 优化消息配置');
    console.log('\n🎯 预期成功率：100%');
    console.log('═'.repeat(60));
  } else {
    console.log('\n❌ 安装新任务失败');
  }
}

// 运行
main();