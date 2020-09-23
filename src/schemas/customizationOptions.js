import { MAX_VALID_LIMIT_ARG } from '../constants'

export const customizationOptions = {
  resolvers: {
    findMany: {
      limit: {
        defaultValue: MAX_VALID_LIMIT_ARG
      }
    }
  }
}
