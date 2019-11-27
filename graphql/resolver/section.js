const Section = require('../../model/Section')
const Category = require('../../model/Category')
const Item = require('../../model/Item')
const { singleCategory, items, externalLinks, imageItems } = require('../../helper/utils')

module.exports = {
    createSection: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var category = await Category.findById(args.input.category_id)
            if (!category) throw new Error('Category not found')
            var section = new Section({
                title: args.input.title,
                category_id: args.input.category_id,
                has_populate: args.input.has_populate,
                populate_item: args.input.populate_item,
                page_type: args.input.page_type
            })
            var savedSection = await section.save()
            var category = await Category.findById(savedSection.category_id)
            category.sections.push(savedSection.id)
            await category.save()
            var section = await Section.findById(section.id)
            return {
                ...section._doc,
                category_id: singleCategory.bind(this, section._doc.category_id),
                items: items.bind(this, section._doc.items),
                external_links: externalLinks.bind(this, section._doc.external_links),
                image_items: imageItems.bind(this, section._doc.image_items)
            }
        } catch (err) {
            throw err
        }
    },
    section: async(args) => {
        try {
            var section = await Section.findById(args.id)
            if (!section) throw new Error('Section not found')
            return {
                ...section._doc,
                category_id: singleCategory.bind(this, section._doc.category_id),
                items: items.bind(this, section._doc.items),
                external_links: externalLinks.bind(this, section._doc.external_links),
                image_items: imageItems.bind(this, section._doc.image_items)
            }
        } catch (err) {
            throw err
        }
    },
    sections: async(args) => {
        try {
            var sections = await Section.find()
            return await sections.map(section => {
                return {
                    ...section._doc,
                    category_id: singleCategory.bind(this, section._doc.category_id),
                    items: items.bind(this, section._doc.items),
                    external_links: externalLinks.bind(this, section._doc.external_links),
                    image_items: imageItems.bind(this, section._doc.image_items)
                }
            })
        } catch (err) {
            throw err
        }
    },
    deleteSection: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var section = await Section.findById(args.id)
            if (!section) throw new Error('Section not found')
            await Section.deleteOne({ _id: section.id })
            var sectionId = section.id
            var category = await Category.findById(section.category_id)
            if (!category) throw new Error('Category not found')
            var sections = category.sections
            for (var i = 0; i < sections.length; i++) {
                if (sections[i] == sectionId) {
                    sections.splice(i, 1);
                }
            }
            await category.save()
            return { success: true }
        } catch (err) {
            throw err
        }
    },
    updateSection: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var section = await Section.findById(args.input.id)
            if (!section) throw new Error('Section not found')
            if (args.input.title) { section.title = args.input.title }
            if (args.input.category_id) {
                var category = await Category.findById(args.input.category_id)
                if (!category) throw new Error('Category not found')
                var prevCategory = await Category.findById(section.category_id)
                if (!prevCategory) throw new Error('Category not found')
                var sections = prevCategory.sections
                for (var i = 0; i < sections.length; i++) {
                    if (sections[i] == section.id) {
                        sections.splice(i, 1)
                    }
                }
                await prevCategory.save()
                category.sections.push(section.id)
                await category.save()
                section.category_id = args.input.category_id
            }
            if (args.input.has_populate != undefined) { section.has_populate = args.input.has_populate }
            if (args.input.populate_item) { section.populate_item = args.input.populate_item }
            if (args.input.page_type) { section.page_type = args.input.page_type }
            var savedSection = await section.save()
            if (!savedSection) throw new Error('Section not found')
            var section = await Section.findById(savedSection.id)
            return {
                ...section._doc,
                category_id: singleCategory.bind(this, section._doc.category_id),
                items: items.bind(this, section._doc.items),
                external_links: externalLinks.bind(this, section._doc.external_links),
                image_items: imageItems.bind(this, section._doc.image_items)
            }
        } catch (err) {
            throw err
        }
    }
}
