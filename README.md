# Pixel me

This project is based on the wonderful [Pixel art in React](https://github.com/jvalen/pixel-art-react) project by [Javier Valencia](https://github.com/jvalen/pixel-art-react)

## This project is built with GraphQL and the [GraphQL Transform](https://docs.amplify.aws/cli/graphql-transformer/overview) library.

There are a few main parts to this back end, but everything starts with the base GraphQL schema:

```graphql
type Drawing @model
@auth(rules: [{allow: public, operations: [create, read, update]}])
@key(name: "byItemType", fields: ["itemType", "createdAt"], queryField: "itemsByType") {
  id: ID!
  clientId: ID!
  name: String!
  data: String
  public: Boolean
  itemType: String
  createdAt: String
  locked: Boolean
}

type Subscription {
  onUpdateByID(id: ID!): Drawing
    @aws_subscribe(mutations: ["updateDrawing"])
}
```

You can see there are a couple of things going on her here with directives and a custom subscription:

- The `@model` directive will build out the DynamoDB table for the drawings
- The `@auth` directive allows the creation and editing of types, but restricts the deletion of them
- The `@key` directive gives us an easy way to run DynamoDB queries on the `itemType` field. This makes it easy to set custom access patterns on the `itemType` field. For instance, in the main view, we only query for `Public` drawings, but could also set this to anything that we'd like for additional data access patterns.
- The custom subscription of `onUpdateByID` allows us to create a subscription for individual drawings by `id`

### Deploy this app in your account

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/dabit3/pixel-me)