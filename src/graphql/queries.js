/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDrawing = /* GraphQL */ `
  query GetDrawing($id: ID!) {
    getDrawing(id: $id) {
      id
      clientId
      name
      data
      public
      itemType
      createdAt
      locked
    }
  }
`;
export const listDrawings = /* GraphQL */ `
  query ListDrawings(
    $filter: ModelDrawingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDrawings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        clientId
        name
        data
        public
        itemType
        createdAt
        locked
      }
      nextToken
    }
  }
`;
export const itemsByType = /* GraphQL */ `
  query ItemsByType(
    $itemType: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDrawingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    itemsByType(
      itemType: $itemType
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        clientId
        name
        data
        public
        itemType
        createdAt
        locked
      }
      nextToken
    }
  }
`;
