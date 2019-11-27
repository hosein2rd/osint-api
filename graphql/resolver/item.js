const Item = require('../../model/Item')
const Section = require('../../model/Section')
const Category = require('../../model/Category')
const { singleSection, singleCategory } = require('../../helper/utils')

module.exports = {
    createItem: async(args, req) => {
        if (!req.isAuth) throw new Error('UnAuthorization')
        if (req.user.type != 'admin') throw new Error('Access denied')
        try {
            var section = await Section.findById(args.input.section_id)
            if (!section) throw new Error('Section not found')
            var item = new Item({
                input_item: args.input.input_item,
                url: args.input.url,
                submit_value: args.input.submit_value,
                item_type: args.input.item_type,
                on_submit: args.input.on_submit,
                section_id: args.input.section_id,
                is_submit_all: args.input.is_submit_all,
                description: args.input.description,
                lead: args.input.lead,
                category_id: section.category_id
            })
            var savedItem = await item.save()
            if (!savedItem) throw new Error('Item unsuccessfuly saved')
            var section = await Section.findById(savedItem.section_id)
            section.items.push(savedItem.id)
            await section.save()
            var item = await Item.findById(savedItem.id)
            return {
                ...item._doc,
                section_id: singleSection.bind(this, item._doc.section_id),
                category_id: singleCategory.bind(this, item._doc.category_id)
            }
        } catch (err) {
            throw err
        }
    },
    item: async(args) => {
        try {
            var item = await Item.findById(args.id)
            if (!item) throw new Error('Item not found')
            return {
                ...item._doc,
                section_id: singleSection.bind(this, item._doc.section_id),
                category_id: singleCategory.bind(this, item._doc.category_id)
            }
        } catch (err) {
            throw err
        }
    },
    items: async() => {
        try {
            var items = await Item.find()
            return await items.map(item => {
                return {
                    ...item._doc,
                    section_id: singleSection.bind(this, item._doc.section_id),
                    category_id: singleCategory.bind(this, item._doc.category_id)
                }
            })
        } catch (err) {
            throw err
        }
    },
    deleteItem: async(args, req) => {
        if (!req.isAuth) throw new Error('UnAuthorization')
        if (req.user.type != 'admin') throw new Error('Access denied')
        try {
            var item = await Item.findById(args.id)
            if (!item) throw new Error('Item not found')
            await Item.deleteOne({ _id: item.id })
            var itemId = item.id
            var sectionId = item.section_id
            var section = await Section.findById(sectionId)
            var items = section.items
            for (var i = 0; i < items.length; i++) {
                if (items[i] == itemId) {
                    items.splice(i, 1);
                }
            }
            await section.save()
            return { success: true }
        } catch (err) {
            throw err
        }
    },
    updateItem: async(args, req) => {
        if (!req.isAuth) throw new Error('UnAuthorization')
        if (req.user.type != 'admin') throw new Error('Access denied')
        try {
            var item = await Item.findById(args.input.id)
            if (!item) throw new Error('Item not found')
            if (args.input.input_item) { item.input_item = args.input.input_item }
            if (args.input.url) { item.url = args.input.url }
            if (args.input.submit_value) { item.submit_value = args.input.submit_value }
            if (args.input.item_type) { item.item_type = args.input.item_type }
            if (args.input.on_submit) { item.on_submit = args.input.on_submit }
            if (args.input.section_id) {
                var section = await Section.findById(args.input.section_id)
                if (!section) throw new Error('Section not found')
                var prev_section_id = item.section_id
                var prevSection = await Section.findById(prev_section_id)
                if (!prevSection) throw new Error('Section not found')
                var items = prevSection.items
                for (var i = 0; i < items.length; i++) {
                    if (items[i] == item.id) {
                        items.splice(i, 1)
                    }
                }
                await prevSection.save()
                section.items.push(item.id)
                section.save()
                item.section_id = args.input.section_id
                item.category_id = section.category_id
            }
            if (args.input.is_submit_all != undefined) { item.is_submit_all = args.input.is_submit_all }
            if (args.input.description) { item.description = args.input.description }
            if (args.input.description) { item.lead = args.input.lead }
            var savedItem = await item.save()
            if (!savedItem) throw new Error('Item not found')
            var item = await Item.findById(savedItem.id)
            return {
                ...item._doc,
                section_id: item._doc.section_id,
                category_id: item._doc.category_id
            }
        } catch (err) {
            throw err
        }
    }
}