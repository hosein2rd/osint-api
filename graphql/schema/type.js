module.exports = `
    scalar Upload
    
    type User {
        _id: ID!
        firstname: String!
        lastname: String!
        email: String!
        username: String!
        password: String
    }

    type Token {
        user: User
        token: String!
    }

    type SuccessType {
        success: Boolean!
    }

    type ToolSet {
        _id: ID!
        title: String!
        icon: String
        categories: [Category!]!
    }

    type Category {
        _id: ID!
        title: String!
        icon: String
        tool_set_id: ToolSet
        sections: [Section!]!
    }

    type PopulateItem {
        populate: String!
    }

    type Section {
        _id: ID!
        title: String!
        category_id: Category!
        has_populate: Boolean
        populate_item: [PopulateItem]!
        page_type: String!
        items: [Item!]!
        external_links: [ExternalLink!]!
        image_items: [ImageItem!]!
    }

    type ExternalLink {
        _id: ID!
        name: String!
        url: String!
        target: String!
        item_type: String!
        section_id: Section
        category_id: Category
    }

    type InputItem {
        name: String!
        type: String!
        is_populate: Boolean
        place_holder: String
    }

    type Item {
        _id: ID!
        input_item: [InputItem]!
        url: String!
        submit_value: String!
        item_type: String!
        on_submit: String!
        section_id: Section
        is_submit_all: Boolean
        description: String
        lead: String
        category_id: Category
    }

    type ImageItem {
        _id: ID!
        src: String
        item_type: String
        section_id: Section
        category_id: Category
    }
`