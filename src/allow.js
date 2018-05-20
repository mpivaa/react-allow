// @flow
import { isEmpty, some, map, slice, isNil, isUndefined, get } from 'lodash'
import type {
  Context,
  Level,
  Role,
  ComposedRole,
  Config
} from './types';

export let config: Config = {
  levels: ['app'],
  default: 'app',
  aliases: {
    'a': 'app'
  }
}

export function setupAllow(newConfig: Config) {
  config = {...config, ...newConfig}
}

export function isAllowed(ctx: ?Context, allowedRoles: [ComposedRole]): boolean {
  if(isValidContext(ctx)) {
    return some(parseRoles(allowedRoles), ([level, role]) => {
      if(isValidContext(ctx)) {
        return checkRole([level, role], ctx)
      }
      return false
    })
  } else {
    return false
  }
}

function checkRole([level: Level, role: Role], ctx: Context): boolean {
  const roleOnLevel = getRoleOnLevel(level, ctx)
  if(!isNil(roleOnLevel)) {
    return role === "*" || roleOnLevel === role
  } else {
    return false
  }
}

function parseRoles(allowedRoles: [ComposedRole]): Array<[Level, Role]> {
  return map(allowedRoles, composedRole => {
    const [level, role, ...ignore] = composedRole.split(':')
    const expandedLevel = expandLevel(level)
    return [expandedLevel, role]
  })
}

function getRoleOnLevel(level: Level, ctx: Context): ?Role {
  const { user } = ctx
  if(level === config.default) {
    return get(user, ['roles', level], null)
  } else {
    const id = get(ctx, [level, 'id'], null)
    return get(user, ['roles', level, id], null)
  }
}

function expandLevel(level: Level) {
  if(!isNil(config.aliases[level])) {
    return config.aliases[level]
  } else {
    return level
  }
}

function isValidContext(ctx: ?Context): boolean %checks {
  return !isEmpty(ctx) && !isNil(ctx) && !isNil(ctx.user)
}