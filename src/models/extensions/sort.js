


export const getSortProduct = (sort) => {
  switch (sort) {
    case 'date_DESC':
      return { 'items.createdAt': -1 }
    case 'date_ASC':
      return { 'items.createdAt': 1 }
    case 'category_DESC':
      return { 'items.category.name': -1 }
    case 'category_ASC':
      return { 'items.category.name': 1 }
    default:
      return { 'items.createdAt': 1 }
  }
}

export const getSortRecipe = (sort) => {
  switch (sort) {
    case 'date_DESC':
      return { 'items.createdAt': -1 }
    case 'date_ASC':
      return { 'items.createdAt': 1 }
    case 'category_DESC':
      return { 'items.category.name': -1 }
    case 'category_ASC':
      return { 'items.category.name': 1 }
    default:
      return { 'items.createdAt': 1 }
  }
}

export const getSortCategory = (sort) => {
  switch (sort) {
    case 'date_DESC':
      return { 'items.createdAt': -1 }
    case 'date_ASC':
      return { 'items.createdAt': 1 }
    case 'index_DESC':
      return { 'items.index': -1 }
    case 'index_ASC':
      return { 'items.index': 1 }
    default:
      return { 'items.createdAt': 1 }
  }
}

export default {
  getSortProduct,
  getSortRecipe,
  getSortCategory
}
