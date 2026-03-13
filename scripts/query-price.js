/**
 * 九安医疗股价手动查询脚本（百度版本）
 * 
 * 使用方法：
 * node skills/jiuanyiliao/scripts/query-price.js
 * 
 * 此脚本用于测试和手动查询股价
 * 使用百度搜索方法获取实时股价数据
 */

const STOCK_INFO = {
  name: '九安医疗',
  code: '002432',
  market: 'SZ',
  searchUrl: 'https://www.baidu.com/s?wd=九安医疗股价',
  directUrl: 'https://quote.eastmoney.com/sz002432.html',
};

console.log('📈 九安医疗股价查询工具（百度版本）\n');
console.log(`股票：${STOCK_INFO.name} (${STOCK_INFO.code}.${STOCK_INFO.market})`);
console.log(`数据源：百度搜索整合数据`);
console.log('─'.repeat(60));
console.log('\n方法1：通过百度搜索获取股价：');
console.log(`\n${STOCK_INFO.searchUrl}\n`);
console.log('方法2：直接访问东方财富网：');
console.log(`\n${STOCK_INFO.directUrl}\n`);
console.log('或者运行以下命令：');
console.log('  browser.open ' + STOCK_INFO.searchUrl);
console.log('  browser.snapshot\n');
console.log('─'.repeat(60));
console.log('\n提示：此脚本仅显示查询信息，实际查询需要浏览器自动化工具。');
console.log('      定时任务会自动执行查询并推送结果。');
console.log('\n百度搜索特点：');
console.log('  ✅ 整合多个财经平台数据');
console.log('  ✅ 实时更新');
console.log('  ✅ 一站式查询，无需跳转');
console.log('  ✅ 包含新闻、股评等附加信息');