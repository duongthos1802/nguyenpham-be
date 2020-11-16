import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'
import { DEFAULT_PAGE_SIZE, EUROPE_TIMEZONE, FORMAT_DATE_EN } from '../../constants'
import { dateTimeHelper, stringHelper } from '../../extensions'
import { sortHelper } from '../../models/extensions'
import { ApolloError } from 'apollo-server-express'
import { ERROR_MESSAGE } from '../../constants/errorCode'
import { models } from 'mongoose'

const CustomerTC = composer.CustomerTC

export default {
  customer: CustomerTC.getResolver(RESOLVER_FIND_BY_ID),
  customers: CustomerTC.getResolver(RESOLVER_FIND_MANY),
  customersConnection: CustomerTC.getResolver(RESOLVER_CONNECTION),
  customersCount: CustomerTC.getResolver(RESOLVER_COUNT),
  customersPagination: CustomerTC.getResolver(RESOLVER_PAGINATION),
  searchCustomer: {
    type: composer.SearchCustomerTC,
    args: {
      where: 'JSON',
      skip: 'Int',
      first: 'Int',
      sortBy: 'String'
    },
    resolve: async (_, args, context, info) => {
      try {

        if (!args) {
          return new ApolloError(
            ERROR_MESSAGE.MISSED_FIELD.text,
            ERROR_MESSAGE.MISSED_FIELD.extensionCode
          )
        }

        const { skip, first, where, sortBy } = args

        let optionMatchClause = {}
        let aggregateClause = []
        const searchCustomer = {
          total: 0,
          items: []
        }

        aggregateClause.push({
          $group: {
            _id: '$_id',
            items: { $last: '$$ROOT' }
          }
        })

        if (where) {
          const { status, startDate, endDate } = where
          // search by date
          if (startDate && endDate) {
            aggregateClause.push({
              $match: {
                $and: [
                  {
                    $or: [
                      {
                        $and: [
                          { 'items.date': { $gte: startDate } },
                          { 'items.date': { $lte: endDate } }
                        ]
                      }
                    ]
                  }
                ]
              }
            })
          }
          // search by status
          if (status) {
            aggregateClause.push({
              $match: {
                'items.status': stringHelper.regexMongooseKeyword(status)
              }
            })
          }
        }
        //sort by item
        aggregateClause.push({ $sort: sortHelper.getSortCustomer(sortBy) })

        aggregateClause.push({
          $group: {
            _id: null,
            count: { $sum: 1 },
            entries: { $push: '$items' }
          }
        })

        aggregateClause.push({
          $project: {
            _id: 0,
            total: '$count',
            items: {
              $slice: ['$entries', skip || 0, first || DEFAULT_PAGE_SIZE]
            }
          }
        })

        const customers = await models.Customer.aggregate(aggregateClause)

        // find customer with clauses
        if (!!customers) {
          if (customers.length > 0) {
            //list customer
            searchCustomer.total = customers[0].total
            searchCustomer.items = customers[0].items
          }
        }

        return searchCustomer
      } catch (error) {
        console.log('error.....', error)
        throw new Error(error)
      }
    }
  }
}
