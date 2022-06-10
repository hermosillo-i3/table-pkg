const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
require('dayjs/locale/es');
dayjs.locale('es');
dayjs.extend(localizedFormat);
class DateFormatter {
   constructor(...args) {
      this.date = dayjs(...args);
   }

   format(format) {
      return this.date.format(format);
   }
}

export default (...args) => new DateFormatter(...args);