export class TimeUtil {

  public static dateFormat(date: Date, format: string): string {
    if (typeof(date) === 'string') {
      date = new Date(date);
    } else {
      date = new Date(date.getTime());
    }
    var year = '' + date.getFullYear();
    var month =('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hour = ('0' + date.getHours()).slice(-2);
    var minute = ('0' + date.getMinutes()).slice(-2);
    var second = ('0' + date.getSeconds()).slice(-2);

    const strAry: string[] = format.split('');
    for (let i: number = strAry.length - 1; i >= 0; i--) {
      switch (strAry[i]) {
        case 's':
          strAry[i] = second.length === 0 ? '' : second.slice(-1);
          second = second.slice(0, -1);
          break;
        case 'm':
          strAry[i] = minute.length === 0 ? '' : minute.slice(-1);
          minute = minute.slice(0, -1);
          break;
        case 'h':
          strAry[i] = hour.length === 0 ? '' : hour.slice(-1);
          hour = hour.slice(0, -1);
          break;
        case 'd':
          strAry[i] = day.length === 0 ? '' : day.slice(-1);
          day = day.slice(0, -1);
          break;
        case 'M':
          strAry[i] = month.length === 0 ? '' : month.slice(-1);
          month = month.slice(0, -1);
          break;
        case 'y':
          strAry[i] = year.length === 0 ? '' : year.slice(-1);
          year = year.slice(0, -1);
          break;
      }
    }
    return strAry.join('');
  }

  public static friendly(date: Date): string {
    date = new Date(date);
    const diff: number = (new Date().getTime() - date.getTime()) / 1000;
    if (diff < 60 * 10){ // 十分钟内
      return '刚刚';
    } else if (diff < 60 * 60) { // 1小时内
      return  Math.floor(diff / 60) + '分钟前';
    } else if (diff < 60 * 60 * 24) { // 24小时内
      return Math.floor(diff / 60 / 60) + '小时前';
    } else if (diff < 60 * 60 * 24 * 3) { // 3天内
      return Math.floor(diff / 60 / 60 / 24) + '天前';
    } else { // 超过3天
      return TimeUtil.concise(date);
    }
  }

  public static concise(date: Date): string {
    if (typeof(date) === 'string') {
      date = new Date(date);
    } else {
      date = new Date(date.getTime());
    }
    const nowDate: Date = new Date();
    const res: string = '';
    if (date.getFullYear() != nowDate.getFullYear()) {
      return TimeUtil.dateFormat(date, "yyyy-MM-dd hh:mm:ss");
    } else if (date.getMonth() != nowDate.getMonth() || date.getDate() != nowDate.getDate()) {
      return TimeUtil.dateFormat(date, "MM-dd hh:mm:ss");
    } else {
      return TimeUtil.dateFormat(date, "hh:mm:ss");
    }
  }

}
