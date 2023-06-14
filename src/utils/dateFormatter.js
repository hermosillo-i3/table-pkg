const dayjs = require('dayjs');
const calendar = require('dayjs/plugin/calendar')
const localizedFormat = require('dayjs/plugin/localizedFormat');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/es');

dayjs.locale('es');
dayjs.extend(localizedFormat);
dayjs.extend(calendar)
dayjs.extend(relativeTime)

class DateFormatter {
   constructor(...args) {
      this.date = dayjs(...args);
   }

   isValid() {
      return this.date.isValid()
   }

   format(format) {
      return this.date.format(format);
   }

   add(number, entity) {
      return this.date.add(number, entity);
   }
   diff(date, unit, float) {
      return this.date.diff(date, unit, float)
   }
   fromNow(withoutSuffix) {
      return this.date.fromNow(withoutSuffix);
   }
   subtract(number, entity) {
      return this.date.subtract(number, entity);
   }

   weekday(number) {
      return this.date.day(number);
   }

   isAfter(date, number) {
      return this.date.isAfter(date, number);
   }

   isBefore(date, number) {
      return this.date.isBefore(date, number);
   }

   isSame(date, number) {
      return this.date.isSame(date, number);
   }

   toDate() {
      return this.date.toDate();
   }

   calendar(prop1, prop2) {
      return this.date.calendar(prop1, prop2);
   }

   month(props) {
      return this.date.month(props);
   }
   year(props) {
      return this.date.year(props);
   }
   startOf(props) {
      return this.date.startOf(props);
   }
   unix() {
      return this.date.unix();
   }
}

const dateFormatter = (...args) => new DateFormatter(...args);
export default dateFormatter; // hello