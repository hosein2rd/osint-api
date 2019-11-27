module.exports = `
    type RootQuery {
        users: [User!]!
        getUser(id: ID): User
        login(input: LoginInput): Token
        toolSets: [ToolSet!]!
        toolSet(id: ID!): ToolSet
        category(id: ID!): Category
        categories: [Category!]!
        section(id: ID!): Section!
        sections: [Section!]!
        externalLink(id: ID!): ExternalLink
        externalLinks: [ExternalLink!]!
        item(id: ID!): Item
        items: [Item!]!
        imageItems: [ImageItem!]!
        imageItem(id: ID!): ImageItem
        logout: SuccessType
        refreshToken(token: String!): Token
    }
`