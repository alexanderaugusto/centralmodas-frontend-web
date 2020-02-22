const INITIAL_STATE = {
  product: null,
  products: [],
  searchText: ""
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        searchText: ""
      }
    case "GET_PRODUCT_INFO":
      return {
        ...state,
        product: action.payload,
        searchText: ""
      }
    case "GET_PRODUCT_BY_CATEGORY":
      return {
        ...state,
        products: action.payload,
        searchText: ""
      }
    case "GET_PRODUCT_OFFERS":
      return {
        ...state,
        products: action.payload,
        searchText: ""
      }
    case "SEARCH_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        searchText: action.text
      }

    default:
      return state
  }
}