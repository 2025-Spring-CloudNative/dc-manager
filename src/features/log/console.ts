export function logApiData(data: any[] | undefined, label: string = 'API Data') {
    if (!Array.isArray(data)) {
      console.warn(`${label}: No data or not an array`);
      return;
    }
  
    console.log(`${label}:`);
    data.forEach((item, index) => {
      const line = Object.entries(item)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      console.log(`[${index}] ${line}`);
    });
  }