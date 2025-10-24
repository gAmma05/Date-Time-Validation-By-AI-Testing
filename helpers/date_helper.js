const Helper = require('@codeceptjs/helper');

class DateHelper extends Helper {
  isValidFormat(dateString) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  isValidDate(dateString) {
    if (!this.isValidFormat(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
}

module.exports = DateHelper;
