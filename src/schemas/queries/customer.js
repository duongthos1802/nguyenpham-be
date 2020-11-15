import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'
import { DEFAULT_PAGE_SIZE, EUROPE_TIMEZONE, FORMAT_DATE_EN } from '../../constants'
import { dateTimeHelper } from '../../extensions'

const CustomerTC = composer.CustomerTC

export default {
  customer: CustomerTC.getResolver(RESOLVER_FIND_BY_ID),
  customers: CustomerTC.getResolver(RESOLVER_FIND_MANY),
  customersConnection: CustomerTC.getResolver(RESOLVER_CONNECTION),
  customersCount: CustomerTC.getResolver(RESOLVER_COUNT),
  customersPagination: CustomerTC.getResolver(RESOLVER_PAGINATION),
  // searchCustomer: {
  //   type: composer.SearchCustomerTC,
  //   args: {
  //     where: 'JSON',
  //     skip: 'Int',
  //     first: 'Int',
  //     sortBy: 'String'
  //   },
  //   resolve: async (_, { skip, first, where, sortBy }, context, info) => {
  //     try {
  //       let optionMatchClause = {}
  //       let aggregateClause = []
  //       const searchCustomer = {
  //         total: 0,
  //         items: []
  //       }

  //       if (where) {
  //         const {
  //           calendar,
  //           status
  //         } = where

  //         //search by status
  //         if (status) {
  //           optionMatchClause.status = { $in: [status] }
  //         }

  //         if (!isEmpty(optionMatchClause)) {
  //           aggregateClause.push({ $match: optionMatchClause })
  //         }

  //         if (calendar) {
  //           const { fromDate, toDate } = calendar
  //           if (fromDate !== undefined && toDate !== undefined) {
  //             const preDate = dateTimeHelper.formatDateTimeWithToken(
  //               dateTimeHelper.subtractUnitTime({
  //                 currentDate: toDate,
  //                 amount: 1,
  //                 unit: 'days'
  //               }),
  //               FORMAT_DATE_EN
  //             )

  //             const momentFromDate = {
  //               $dateFromString: {
  //                 dateString: fromDate,
  //                 timezone: EUROPE_TIMEZONE
  //               }
  //             }
  //             const momentToDate = {
  //               $dateFromString: {
  //                 dateString: toDate,
  //                 timezone: EUROPE_TIMEZONE
  //               }
  //             }
  //             const momentPreDate = {
  //               $dateFromString: {
  //                 dateString: preDate.toString(),
  //                 timezone: EUROPE_TIMEZONE
  //               }
  //             }

  //             //group object and adđ items element
  //             aggregateClause.push({
  //               $group: {
  //                 _id: '$_id',
  //                 calendar: { $last: '$calendar' },
  //                 items: { $last: '$$ROOT' }
  //               }
  //             })

  //             //unwind property calendar
  //             aggregateClause.push({
  //               $unwind: { path: '$calendar', preserveNullAndEmptyArrays: true }
  //             })

  //             //unwind property inActive in calendar
  //             aggregateClause.push({
  //               $unwind: {
  //                 path: '$calendar.inActive',
  //                 preserveNullAndEmptyArrays: true
  //               }
  //             })

  //             //init project and convert string to date time
  //             aggregateClause.push({
  //               $project: {
  //                 _id: 1,
  //                 //init calender
  //                 calendar: {
  //                   $cond: {
  //                     if: { $ifNull: ['$calendar.inActive', null] },
  //                     then: {
  //                       $cond: {
  //                         //if items active length = 2 return false
  //                         if: {
  //                           $gt: [
  //                             { $strLenCP: '$calendar.inActive' },
  //                             MIN_PRODUCT_INACTIVE_DATE
  //                           ]
  //                         },
  //                         //covert date time from string
  //                         then: {
  //                           $dateFromString: {
  //                             dateString: '$calendar.inActive',
  //                             timezone: EUROPE_TIMEZONE
  //                           }
  //                         },
  //                         else: null
  //                       }
  //                     },
  //                     //then: '$calendar.inActive',
  //                     else: null
  //                   }
  //                 },
  //                 items: 1
  //               }
  //             })

  //             //group calendar and get last item, first item
  //             aggregateClause.push({
  //               $group: {
  //                 _id: '$_id',
  //                 calendar: { $addToSet: '$calendar' },
  //                 items: { $last: '$items' }
  //               }
  //             })

  //             //sort item by calendar
  //             aggregateClause.push({ $unwind: '$calendar' })

  //             aggregateClause.push({ $sort: { calendar: 1 } })

  //             //group by lastCalendar, firstCalendar
  //             aggregateClause.push({
  //               $group: {
  //                 _id: '$_id',
  //                 calendar: { $push: '$calendar' },
  //                 items: { $last: '$items' },
  //                 lastCalendar: {
  //                   $last: '$calendar'
  //                 },
  //                 firstCalendar: {
  //                   $first: '$calendar'
  //                 }
  //               }
  //             })

  //             //check by from date and to date
  //             aggregateClause.push({
  //               $redact: {
  //                 $cond: [
  //                   {
  //                     $or: [
  //                       { $eq: [{ $in: [momentFromDate, '$calendar'] }, true] },
  //                       {
  //                         $eq: [
  //                           {
  //                             $and: [
  //                               { $in: [momentToDate, '$calendar'] },
  //                               { $in: [momentPreDate, '$calendar'] }
  //                             ]
  //                           },
  //                           true
  //                         ]
  //                       },
  //                       {
  //                         $eq: [
  //                           {
  //                             $and: [
  //                               { $gt: ['$firstCalendar', momentFromDate] },
  //                               { $lt: ['$lastCalendar', momentToDate] }
  //                             ]
  //                           },
  //                           true
  //                         ]
  //                       }
  //                     ]
  //                   },
  //                   '$$PRUNE',
  //                   '$$KEEP'
  //                 ]
  //               }
  //             })
  //           } else {
  //             //group items
  //             aggregateClause.push({
  //               $group: {
  //                 _id: '$_id',
  //                 items: { $last: '$$ROOT' }
  //               }
  //             })
  //           }
  //         } else {
  //           //group items
  //           aggregateClause.push({
  //             $group: {
  //               _id: '$_id',
  //               items: { $last: '$$ROOT' }
  //             }
  //           })
  //         }
  //       }

  //       aggregateClause.push({
  //         $group: {
  //           _id: null,
  //           count: { $sum: 1 },
  //           entries: { $push: '$items' }
  //         }
  //       })

  //       aggregateClause.push({
  //         $project: {
  //           _id: 0,
  //           total: '$count',
  //           items: {
  //             $slice: ['$entries', skip || 0, first || DEFAULT_PAGE_SIZE]
  //           }
  //         }
  //       })

  //       const customers = await models.Customer.aggregate(aggregateClause)

  //       // find customer with clauses
  //       if (!!customers) {
  //         if (customers.length > 0) {
  //           //list customer
  //           searchCustomer.total = requestRefunds[0].total
  //           searchCustomer.items = requestRefunds[0].items
  //         }
  //       }

  //       return searchCustomer
  //     } catch (error) {
  //       throw new Error(error)
  //     }
  //   }
  // }
}
