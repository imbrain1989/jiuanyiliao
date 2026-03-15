/**
 * 九安医疗股价手动查询脚本（CDP增强版本）
 * 
 * 使用方法：
 * node skills/jiuanyiliao/scripts/query-price.js
 * 
 * 此脚本用于测试和手动查询股价
 * 使用Chrome DevTools Protocol (CDP) 获取实时股价数据
 */

const STOCK_INFO = {
  name: '九安医疗',
  code: '002432',
  market: 'SZ',
  searchUrl: 'https://www.baidu.com/s?wd=九安医疗股价',
  directUrl: 'https://quote.eastmoney.com/sz002432.html',
};

console.log('📈 九安医疗股价查询工具（CDP增强版本）\n');
console.log(`股票：${STOCK_INFO.name} (${STOCK_INFO.code}.${STOCK_INFO.market})`);
console.log(`数据源：百度搜索整合数据（使用Chrome CDP协议）`);
console.log('─'.repeat(60));
console.log('\nCDP增强查询方法：');
console.log('  1. 通过Chrome DevTools Protocol连接浏览器');
console.log('  2. 访问百度搜索获取整合股价数据');
console.log('  3. 使用精准元素定位提取数据');
console.log('  4. 支持自动重试和错误恢复');
console.log('\n执行命令：');
console.log(`  agent-browser --cdp 9222 open "${STOCK_INFO.searchUrl}"`);
console.log(`  agent-browser --cdp 9222 snapshot -i`);
console.log(`  agent-browser --cdp 9222 get text @price_element`);
console.log('─'.repeat(60));
console.log('\nCDP协议优势：');
console.log('  ✅ 更稳定的浏览器连接');
console.log('  ✅ 更精准的页面元素定位');
console.log('  ✅ 支持页面加载状态检测');
console.log('  ✅ 更好的错误处理和重试机制');
console.log('  ✅ 详细的调试和日志信息');
console.log('─'.repeat(60));
console.log('\n提示：此脚本仅显示查询信息，实际查询需要浏览器自动化工具。');
console.log('      定时任务会自动执行查询并推送结果。');
console.log('\n定时任务配置：');
console.log('  超时时间：120秒');
console.log('  重试次数：最多3次');
console.log('  失败通知：自动发送错误信息');