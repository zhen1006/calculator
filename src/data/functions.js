// 時間格式化工具
export const formatTime = (seconds) => {
  if (typeof seconds !== 'number' || seconds < 0) {
    return '0秒';
  }

  const timeUnits = [
    { value: Math.floor(seconds / 86400), unit: '天' },
    { value: Math.floor((seconds % 86400) / 3600), unit: '小時' },
    { value: Math.floor((seconds % 3600) / 60), unit: '分鐘' },
    { value: Math.floor(seconds % 60), unit: '秒' }
  ];

  return timeUnits
    .filter(({ value }) => value > 0)
    .map(({ value, unit }) => `${value}${unit}`)
    .join('') || '0秒';
};

// 數字格式化工具
export const formatNumber = (num, precision = 2) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return 'NaN';
  }

  const fixedNum = num.toFixed(precision);
  return fixedNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 文件下載工具
export const downloadFile = (filename, content, options = {}) => {
  const {
    type = 'text/plain',
    charset = 'utf-8'
  } = options;

  const element = document.createElement('a');
  const blob = new Blob([content], { type: `${type};charset=${charset}` });
  const url = URL.createObjectURL(blob);

  element.href = url;
  element.download = filename;
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();

  // 清理
  setTimeout(() => {
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  }, 100);
};

// 導出舊版兼容名稱
export const timeString = formatTime;
export const download = downloadFile;