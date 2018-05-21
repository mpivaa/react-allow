// @flow

export type ID = string | number
export type Level = string
export type Role = string
export type ComposedRole = string // 'level:role'
export type Resource = { id: ID }

export type User = {
  id?: ID,
  roles: ResourceRoles
}

export type ResourceRoles = {
  [Level]: {
    [ID]: Role
  }
}

export type Context = {
  user: User,
  [Level]: ?Resource
}

export type Config = {
  levels: [Level],
  default: Level,
  aliases: { [string]: Level }
}