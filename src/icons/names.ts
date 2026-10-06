export const FOOD_ICONS = [
  'rosogolla', 'chomchom', 'sandesh', 'doi', 'gur', 'ghee', 'bowl', 'fish', 'shrimp', 'rice',
  'biryani', 'meat', 'tea', 'snack', 'greens',
] as const
export const FRUIT_ICONS = [
  'mango', 'jackfruit', 'coconut', 'citrus', 'fruit-round', 'fruit-bunch', 'fruit-long', 'fruit-star', 'fruit-pod',
] as const
export const PITHA_ICONS = ['pitha-bhapa', 'pitha-flat', 'pitha-roll', 'pitha-puli', 'pitha-fried', 'pitha-nakshi'] as const
export const OTHER_ICONS = ['globe'] as const

export const ICON_NAMES = [...FOOD_ICONS, ...FRUIT_ICONS, ...PITHA_ICONS, ...OTHER_ICONS] as const
export type IconName = (typeof ICON_NAMES)[number]

export function isIconName(s: string): s is IconName {
  return (ICON_NAMES as readonly string[]).includes(s)
}
