import mongoose from "mongoose";
// models
import models from "../../models";
// composer
import composer from "../composer";
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_FIND_ONE,
  RESOLVER_BLOG_FIND_MANY,
  RESOLVER_RECRUITMENT_FIND_MANY,
} from "../../constants/resolver";
import { sortHelper } from "../../models/extensions";
import { stringHelper } from "../../extensions";
import { isBuffer } from "lodash";
import CategoryTC from "../composer/category";
import { CATEGORY_STATUS, BLOG_STATUS } from "../../constants/enum";

const RecruitmentTC = composer.RecruitmentTC;

export default {
  recruitment: RecruitmentTC.getResolver(RESOLVER_FIND_BY_ID),
  recruitments: RecruitmentTC.getResolver(RESOLVER_FIND_MANY),
  recruitmentsConnection: RecruitmentTC.getResolver(RESOLVER_CONNECTION),
  recruitmentsCount: RecruitmentTC.getResolver(RESOLVER_COUNT),
  recruitmentsPagination: RecruitmentTC.getResolver(RESOLVER_PAGINATION),
  searchRecruitments: {
    type: composer.SearchRecruitmentTC,
    args: {
      where: "JSON",
      skip: "Int",
      first: "Int",
      sortBy: "String",
    },
    resolve: async (_, { skip, first, where, sortBy }, context, info) => {
      // try {
      let optionMatchClause = {};
      let aggregateClause = [];
      const searchRecruitment = {
        total: 0,
        items: [],
      };

      if (where) {
        const { keyword, status } = where;

        //search keyword
        if (keyword && keyword !== "") {
          optionMatchClause.name = stringHelper.regexMongooseKeyword(keyword);
        }
        if (status && status !== "") {
          optionMatchClause.status = stringHelper.regexMongooseKeyword(status);
        }
      }

      if (Object.keys(optionMatchClause).length > 0) {
        aggregateClause.push({ $match: optionMatchClause });
      }

      //group items
      aggregateClause.push({
        $group: {
          _id: "$_id",
          items: { $last: "$$ROOT" },
        },
      });

      let sortByRecruitment = sortHelper.getSortBlog(sortBy);
      sortByRecruitment = {
        ...sortByRecruitment,
      };

      aggregateClause.push({ $sort: sortByRecruitment });

      aggregateClause.push({
        $group: {
          _id: null,
          count: { $sum: 1 },
          entries: { $push: "$items" },
        },
      });

      aggregateClause.push({
        $project: {
          _id: 0,
          total: "$count",
          items: {
            $slice: ["$entries", skip || 0, first || 10],
          },
        },
      });
      const recruitment = await models.Recruitment.aggregate(aggregateClause);
      // find blogs with clauses
      if (!!recruitment) {
        if (recruitment.length > 0) {
          //list Blog
          searchRecruitment.total = recruitment[0].total;
          searchRecruitment.items = recruitment[0].items;
        }
      }

      return searchRecruitment;
    },
  },

  searchRecruitmentBySlugId: {
    type: composer.RecruitmentCustomTC,
    args: {
      where: "JSON",
    },
    resolve: async (_, { where }, context, info) => {
      try {
        // let category = null
        let blogs = [];
        let total = 0;

        const { _id, slug, limit, skip } = where;

        if (_id) {
          blogs = await BlogTC.getResolver(
            RESOLVER_RECRUITMENT_FIND_MANY
          ).resolve({
            args: {
              filter: {
                status: BLOG_STATUS.PUBLISHED,
              },
              sort: "date_DESC",
              limit: limit || 9,
              skip: skip || 0,
            },
          });

          total = await RecruitmentTC.getResolver(RESOLVER_COUNT).resolve({
            args: {
              filter: {
                status: BLOG_STATUS.PUBLISHED,
              },
            },
          });
        }

        return {
          blogs,
          total,
        };
      } catch (error) {}
    },
  },
};
