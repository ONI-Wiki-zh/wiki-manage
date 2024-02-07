export default class DateFormat {
  static formatDate(dateString: string) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  }
}
