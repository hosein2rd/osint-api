module.exports = `
    input UserInput {
        firstname: String!
        lastname: String!
        email: String!
        username: String!
        password: String!
    }

    input UserUpdateInput {
        _id: ID!
        firstname: String
        lastname: String
        email: String
        username: String
        password: String
    }

    input LoginInput {
        username: String
        email: String
        password: String!
    }

    input ToolSetInput {
        title: String!
        icon: Upload
    }

    input ToolSetUpdateInput {
        id: ID!
        title: String
        icon: Upload
    }

    input CategoryInput {
        title: String!
        icon: Upload
        tool_set_id: ID!
    }

    input CategoryUpdateInput {
        id: ID!
        title: String
        icon: Upload
        tool_set_id: ID
    }

    input PopulateItemInput {
        populate: String
    }

    input SectionInput {
        title: String!
        category_id: ID!
        has_populate: Boolean!
        populate_item: [PopulateItemInput!]
        page_type: String!
    }

    input ExternalLinkInput {
        name: String!
        url: String!
        target: String!
        item_type: String!
        section_id: ID!
    }

    input ExternalLinkUpdateInput {
        id: ID!
        name: String
        url: String
        target: String
        item_type: String
        section_id: ID
    }

    input InputItemInput {
        name: String!
        type: String!
        is_populate: Boolean
        place_holder: String
    }

    input ItemInput {
        input_item: [InputItemInput!]
        url: String!
        submit_value: String!
        item_type: String!
        on_submit: String!
        section_id: ID!
        is_submit_all: Boolean!
        description: String
        lead: String
    }

    input ItemUpdateInput {
        id: ID!
        input_item: [InputItemInput]
        url: String
        submit_value: String
        item_type: String
        on_submit: String
        section_id: ID
        is_submit_all: Boolean
        description: String
        lead: String
    }

    input SectionUpdateInput {
        id: ID!
        title: String
        category_id: ID
        has_populate: Boolean
        populate_item: [PopulateItemInput]
        page_type: String
    }

    input ImageItemInput {
        src: Upload!
        item_type: String!
        section_id: ID!
    }

    input ImageItemUpdateInput {
        id: ID!
        src: Upload
        item_type: String
        section_id: ID
    }
`