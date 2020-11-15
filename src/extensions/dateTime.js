import moment from 'moment'

export const initNewDate = (currentDate) =>
  currentDate ? moment(currentDate) : moment(new Date())


export const formatDateTimeWithToken = (currentDate, format) => {
  return currentDate ? moment(currentDate).local().format(format) : null
}

export const subtractUnitTime = ({ currentDate, amount, unit }) =>
  moment(currentDate ? currentDate : new Date()).subtract(amount, unit)


export default {
  initNewDate,
  formatDateTimeWithToken,
  subtractUnitTime
}