import moment from 'moment'

export const initNewDate = (currentDate) =>
  currentDate ? moment(currentDate) : moment(new Date())

export default {
  initNewDate
}