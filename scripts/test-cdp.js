/**
 * CDP连接测试脚本
 * 
 * 使用方法：
 * node skills/jiuanyiliao/scripts/test-cdp.js
 * 
 * 此脚本用于测试CDP连接和股价查询功能
 */

const { execSync } = require('child_process');

const CDP_PORT = 9222;
const STOCK_SEARCH_URL = 'https://www.baidu.com/s?wd=九安医疗股价';

function execCommand(cmd, timeout = 30000) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout 
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

function testCDPConnection() {
  console.log('🔌 测试CDP连接...');
  const result = execCommand(`agent-browser --cdp ${CDP_PORT} status`);
  
  if (result.success) {
    console.log('✅ CDP连接成功');
    return true;
  } else {
    console.log(`❌ CDP连接失败: ${result.error}`);
    return false;
  }
}

function testStockQuery() {
  console.log('\n📈 测试股价查询...');
  
  // 打开百度搜索页面
  console.log(`打开: ${STOCK_SEARCH_URL}`);
  const openResult = execCommand(`agent-browser --cdp ${CDP_PORT} open "${STOCK_SEARCH_URL}"`, 45000);
  
  if (!openResult.success) {
    console.log(`❌ 打开页面失败: ${openResult.error}`);
    return false;
  }
  
  console.log('✅ 页面加载成功');
  
  // 等待页面加载完成
  console.log('等待页面加载完成...');
  const waitResult = execCommand(`agent-browser --cdp ${CDP_PORT} wait --load networkidle`, 30000);
  
  if (!waitResult.success) {
    console.log(`⚠️ 等待超时，继续执行`);
  }
  
  // 获取页面快照
  console.log('获取页面元素...');
  const snapshotResult = execCommand(`agent-browser --cdp ${CDP_PORT} snapshot -i`, 15000);
  
  if (!snapshotResult.success) {
    console.log(`❌ 获取快照失败: ${snapshotResult.error}`);
    return false;
  }
  
  console.log('✅ 页面元素获取成功');
  console.log('\n页面元素预览:');
  console.log(snapshotResult.output.substring(0, 500));
  
  return true;
}

function testFallbackMode() {
  console.log('\n🔄 测试回退模式（无CDP）...');
  
  const result = execCommand(`agent-browser open "${STOCK_SEARCH_URL}"`, 45000);
  
  if (result.success) {
    console.log('✅ 回退模式工作正常');
    return true;
  } else {
    console.log(`❌ 回退模式失败: ${result.error}`);
    return false;
  }
}

function main() {
  console.log('🧪 CDP连接测试工具\n');
  console.log('=' .repeat(60));
  
  // 测试CDP连接
  const cdpWorking = testCDPConnection();
  
  if (cdpWorking) {
    // 测试股价查询
    const queryWorking = testStockQuery();
    
    if (queryWorking) {
      console.log('\n🎉 CDP模式测试完成！');
      console.log('下一步：找到股价元素并提取数据');
      console.log('示例命令：agent-browser --cdp 9222 get text @e1');
    } else {
      console.log('\n⚠️ CDP查询测试失败，尝试回退模式');
      testFallbackMode();
    }
  } else {
    console.log('\n⚠️ CDP不可用，测试回退模式');
    testFallbackMode();
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 测试总结：');
  console.log('1. CDP模式：提供更稳定的连接和更好的错误处理');
  console.log('2. 回退模式：在CDP不可用时自动使用');
  console.log('3. 定时任务会自动选择最佳模式');
  console.log('\n故障排除：');
  console.log('- 确保Chrome已启用远程调试端口9222');
  console.log('- 检查网络连接是否正常');
  console.log('- 查看详细日志：openclaw logs --follow');
  console.log('='.repeat(60));
}

main();