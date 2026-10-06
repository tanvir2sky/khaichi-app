import { fol } from './fol'
import { food64 } from './food64'
import { pitha } from './pitha'
import type { Collection, CollectionId } from './types'
import { world } from './world'

export const COLLECTIONS: Collection[] = [food64, pitha, fol, world]
export const COLLECTION_BY_ID = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c])) as Record<CollectionId, Collection>

export { food64, pitha, fol, world }
export type { Collection, CollectionId }
