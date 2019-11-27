module.exports = `
    type RootMutation {
        createUser(userInput: UserInput): Token
        deleteUser(id: ID): SuccessType
        updateUser(input: UserUpdateInput): User
        createToolSet(input: ToolSetInput): ToolSet
        updateToolSet(input: ToolSetUpdateInput): ToolSet
        deleteToolSet(id: String!): SuccessType
        createCategory(input: CategoryInput): Category
        updateCategory(input: CategoryUpdateInput): Category
        deleteCategory(id: ID!): SuccessType
        createSection(input: SectionInput): Section
        deleteSection(id: ID!): SuccessType
        createExternalLink(input: ExternalLinkInput): ExternalLink
        deleteExternalLink(id: ID!): SuccessType
        updateExternalLink(input: ExternalLinkUpdateInput): ExternalLink
        createItem(input: ItemInput): Item
        deleteItem(id: ID!): SuccessType
        updateItem(input: ItemUpdateInput): Item
        updateSection(input: SectionUpdateInput): Section
        createImageItem(input: ImageItemInput): ImageItem
        updateImageItem(input: ImageItemUpdateInput): ImageItem
        deleteImageItem(id: ID!): SuccessType
    }
`