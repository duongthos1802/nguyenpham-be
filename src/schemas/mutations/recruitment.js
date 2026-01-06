// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const RecruitmentTC = composer.RecruitmentTC

export default {
  createRecruitment: RecruitmentTC.getResolver(RESOLVER_CREATE_ONE),
  updateRecruitment: RecruitmentTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyRecruitments: RecruitmentTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteRecruitment: RecruitmentTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyRecruitments: RecruitmentTC.getResolver(RESOLVER_REMOVE_MANY)
}
