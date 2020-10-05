// composer
import composer from '../composer'
// constant
import {
  RESOLVER_FIND_BY_ID,
  RESOLVER_FIND_MANY
} from '../../constants/resolver'
// helper
import { pageHelper } from '../../models/extensions'


export default {
  getBannerHomePage: {
    type: composer.BannerGroupTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      // query
      try {
        // 1. get config home page
        const config = await pageHelper.getConfigHomePage()

        if (!config || !config.configBanner) {
          return null
        }

        // 2. get banner by config
        return await composer.BannerGroupTC.getResolver(
          RESOLVER_FIND_BY_ID
        ).resolve({
          args: {
            _id: config.configBanner.key
          }
        })
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  getServiceHomePage: {
    type: composer.HtmlBlockGroupTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      // query
      try {
        // 1. get config home page
        const config = await pageHelper.getConfigHomePage()

        if (!config || !config.configService) {
          return null
        }

        // 2. get service by config
        return await composer.HtmlBlockGroupTC.getResolver(
          RESOLVER_FIND_BY_ID
        ).resolve({
          args: {
            _id: config.configService.key
          }
        })
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  getEventHomePage: {
    type: composer.EventHomeTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      // query
      try {
        const event = {
          eventLeft: null,
          eventRight: null
        }
        // 1. get config home page
        const config = await pageHelper.getConfigHomePage()

        console.log('config.......', config);

        // if (!config && !config.configEventLeft && !config.configEventRight) {
        //   return null
        // }

        if (config) {

          const { configEventLeft, configEventRight } = config
          // 2. get event by config
          // let eventLeft = null

          if (configEventLeft) {
            event.eventLeft = await composer.HtmlBlockGroupTC.getResolver(
              RESOLVER_FIND_BY_ID
            ).resolve({
              args: {
                _id: configEventLeft.key
              }
            })
          }

          if (configEventRight) {
            event.eventRight = await composer.HtmlBlockGroupTC.getResolver(
              RESOLVER_FIND_BY_ID
            ).resolve({
              args: {
                _id: configEventRight.key
              }
            })
          }
        }

        return event

      } catch (error) {
        throw new Error(error)
      }
    }
  },
}
