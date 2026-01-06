import composeWithMongoose from "graphql-compose-mongoose";
import composeWithDataLoader from "../../vendor/graphql-compose-dataloader";
// models
import models from "../../models";
// constants
import { CACHE_EXPIRATION } from "../../constants/cache";
// options
import { customizationOptions } from "../customizationOptions";
//composer
import composer from "../composer";
import {
  RESOLVER_RECIPE_FIND_MANY,
  RESOLVER_FIND_MANY,
  RESOLVER_COUNT,
  RESOLVER_FIND_BY_ID,
  RESOLVER_RECRUITMENT_COUNT,
  RESOLVER_RECRUITMENT_FIND_MANY,
} from "../../constants/resolver";

export const RecruitmentTC = composeWithDataLoader(
  composeWithMongoose(models.Recruitment, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION,
  }
);

RecruitmentTC.addRelation("category", {
  resolver: () => composer.CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.category,
  },
  projection: { category: 1 },
});

const resolverFindMany = RecruitmentTC.getResolver(RESOLVER_FIND_MANY);
const resolverCount = RecruitmentTC.getResolver(RESOLVER_COUNT);

RecruitmentTC.setResolver(
  RESOLVER_RECRUITMENT_FIND_MANY,
  resolverFindMany
    .addFilterArg({
      name: "keyword",
      type: "String",
      query: (rawQuery, value) => {
        rawQuery.name = stringHelper.regexMongooseKeyword(value);
      },
    })
     
    .addSortArg({
      name: "date_DESC",
      value: () => {
        return { createdAt: -1 };
      },
    })
    .addSortArg({
      name: "date_ASC",
      value: () => {
        return { createdAt: 1 };
      },
    })
    .addSortArg({
      name: "name_DESC",
      value: () => {
        return { name: -1 };
      },
    })
    .addSortArg({
      name: "name_ASC",
      value: () => {
        return { name: 1 };
      },
    })
);

RecruitmentTC.setResolver(
  RESOLVER_RECRUITMENT_COUNT,
  resolverCount.addFilterArg({
    name: "keyword",
    type: "String",
    query: (rawQuery, value) => {
      rawQuery.name = stringHelper.regexMongooseKeyword(value);
    },
  })
);

export default RecruitmentTC;
