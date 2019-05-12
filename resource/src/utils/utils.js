export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}


export function buildHttpQuery(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}



export const stateEnum = {
    '-1': '未申请',
    '0': '申报中',
    '1': '未通过',
    '2': '已通过',
    '3': '未获奖',
    '4': '已获奖',
}

export const levelEnum = {
    '0': '中心级',
    '1': '部门级',
    '2': '小组级',
    '3': '公司级',
}
