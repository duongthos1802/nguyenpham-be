


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

export default {
  getSortProduct
}
