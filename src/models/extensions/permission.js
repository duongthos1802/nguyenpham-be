import { isEqual, differenceWith, intersectionWith } from 'lodash'
import mongoose from 'mongoose'
// models
import models from '../index'
// composer
import composer from '../../schemas/composer'
// constants
import { ACTION_TYPE } from '../../constants/enum'
import {
  RESOLVER_CREATE_MANY,
  RESOLVER_REMOVE_MANY,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID
} from '../../constants/resolver'

const checkIsSamePermission = (arrVal, othVal) => {
  const isSameAction = arrVal.action === othVal.action
  const isSameResource = checkIsSameResource(arrVal, othVal)
  return isSameAction && isSameResource
}

const checkIsSameResource = (arrVal, othVal) =>
  isEqual(
    new mongoose.Types.ObjectId(arrVal.resource),
    new mongoose.Types.ObjectId(othVal.resource)
  )

const mapPermissions = ({
  newPermissions = [],
  listOldPermissions = [],
  roleId = null
}) => {
  if (!newPermissions || newPermissions.length === 0) {
    return []
  }
  return newPermissions
    .map((permission) => {
      const data = permission
      data.role = roleId
      const currentPermission = listOldPermissions.find((item) =>
        checkIsSameResource(item, data)
      )

      if (currentPermission) {
        data._id = currentPermission._id
      }

      return data
    })
    .filter((permission) => permission.action !== ACTION_TYPE.NO_CONTROL)
}

export const createPermissionsByRole = async ({
  roleId = null,
  listPermissions = []
}) => {
  const listNewPermissions = mapPermissions({
    newPermissions: listPermissions,
    roleId: roleId
  })

  await composer.PermissionTC.getResolver(RESOLVER_CREATE_MANY).resolve({
    args: {
      records: listNewPermissions
    }
  })
}

export const updatePermissionsByRole = async ({
  roleId,
  listPermissions = []
}) => {
  // 2.1. get current permissions
  const oldPermissions = await models.Permission.find({
    role: roleId
  })

  // 2.2. map new permissions
  const newPermissions = mapPermissions({
    listOldPermissions: oldPermissions,
    newPermissions: listPermissions,
    roleId: roleId
  })

  // 2.3. get unChange permissions
  const unChangePermissions = intersectionWith(
    oldPermissions,
    newPermissions,
    checkIsSamePermission
  )

  // 2.4. get change permissions
  const changePermissions = differenceWith(
    newPermissions,
    unChangePermissions,
    checkIsSameResource
  )

  // 2.5. get remove permissions
  const removePermissions = differenceWith(
    oldPermissions,
    newPermissions,
    checkIsSameResource
  )

  // 2.6. get create permissions
  const createPermissions = changePermissions.filter(
    (permission) => !permission._id
  )

  // 2.7. get update permissions
  const updatePermissions = changePermissions.filter(
    (permission) => permission._id
  )

  // delete permissions
  if (removePermissions.length > 0) {
    await composer.PermissionTC.getResolver(RESOLVER_REMOVE_MANY).resolve({
      args: {
        filter: {
          _ids: removePermissions.map((item) => item._id)
        }
      }
    })
  }

  // update permissions
  if (updatePermissions.length > 0) {
    await Promise.all(
      updatePermissions.map(
        async (permission) =>
          await composer.PermissionTC.getResolver(
            RESOLVER_UPDATE_BY_ID
          ).resolve({
            args: {
              record: permission
            }
          })
      )
    )
  }

  // create permissions
  if (createPermissions.length > 0) {
    await composer.PermissionTC.getResolver(RESOLVER_CREATE_MANY).resolve({
      args: {
        records: createPermissions
      }
    })
  }
}

export const deletePermissionsByRole = async ({ roleId }) =>
  await composer.PermissionTC.getResolver(RESOLVER_REMOVE_MANY).resolve({
    args: {
      filter: {
        role: roleId
      }
    }
  })

  export const getPermissionsLoginAdmin = async (user) => {
    let permissions =[]

    // 1. get list userRole by user
    const userRoles = await composer.UserRoleTC.getResolver(RESOLVER_FIND_MANY).resolve({
      args: {
        filter: {
          user: user._id
        }
      }
    })
    
    if(userRoles) {
      let listIdRole= []

      userRoles.forEach( userRole => listIdRole.push(userRole.role))

      // 2. get list permission by list role
     const listPermission = await models.Permission.find({role: {$in: listIdRole}})

     if(listPermission && listPermission.length > 0) {

      let indexItem = 0

      // 3. get resource by resourceId
      while (indexItem < listPermission.length) {

        const permission = listPermission[indexItem]

        const resourceData = await composer.ResourceTC.getResolver(RESOLVER_FIND_BY_ID).resolve({
          args: {
            _id: permission.resource
          }
        })
        
        if(resourceData) {
          permissions.push({
            resource: resourceData.code,
            action: permission.action
          })
        }
        indexItem ++
      }
     }
    }

    return permissions
  }

export default {
  createPermissionsByRole,
  updatePermissionsByRole,
  getPermissionsLoginAdmin
}
