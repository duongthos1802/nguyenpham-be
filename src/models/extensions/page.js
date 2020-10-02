import composer from '../../schemas/composer'
import { RESOLVER_FIND_ONE } from '../../constants/resolver'

export const getConfigHomePage = async () => {
  const homePage = await composer.PageTC.getResolver(RESOLVER_FIND_ONE).resolve(
    {
      args: {
        filter: {
          isHomePage: true
        }
      }
    }
  )
  return homePage && homePage.config ? JSON.parse(homePage.config) : null
}

export default {
  getConfigHomePage
}
