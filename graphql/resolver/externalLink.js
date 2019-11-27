const ExternalLink = require('../../model/ExternalLink')
const Section = require('../../model/Section')
const Category = require('../../model/Category')
const { singleCategory, singleSection } = require('../../helper/utils')

module.exports = {
    createExternalLink: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var section = await Section.findById(args.input.section_id)
            if (!section) throw new Error('Section not found')
            var externalLink = new ExternalLink({
                name: args.input.name,
                url: args.input.url,
                target: args.input.target,
                item_type: args.input.item_type,
                section_id: args.input.section_id,
                category_id: section.category_id
            })
            var savedExternalLink = await externalLink.save()
            if (!savedExternalLink) {
                throw new Error({
                    success: false
                })
            }
            section.external_links.push(savedExternalLink.id)
            await section.save()
            var externalLink = await ExternalLink.findById(savedExternalLink.id)
            return {
                ...externalLink._doc,
                category_id: singleCategory.bind(this, externalLink._doc.category_id),
                section_id: singleSection.bind(this, externalLink._doc.section_id)
            }
        } catch (err) {
            throw err
        }
    },
    externalLink: async(args) => {
        try {
            var externalLink = await ExternalLink.findById(args.id)
            if (!externalLink) throw new Error('External Link not found')
            return {
                ...externalLink._doc,
                category_id: singleCategory.bind(this, externalLink._doc.category_id),
                section_id: singleSection.bind(this, externalLink._doc.section_id)
            }
        } catch (err) {
            throw err
        }
    },
    externalLinks: async() => {
        try {
            var externalLinks = await ExternalLink.find()
            return await externalLinks.map(externalLink => {
                return {
                    ...externalLink._doc,
                    category_id: singleCategory.bind(this, externalLink._doc.category_id),
                    section_id: singleSection.bind(this, externalLink._doc.section_id)
                }
            })
        } catch (err) {
            throw err
        }
    },
    deleteExternalLink: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var externalLink = await ExternalLink.findById(args.id)
            if (!externalLink) throw new Error('External Link not found')
            await ExternalLink.deleteOne({ _id: externalLink.id })
            var section = await Section.findById(externalLink.section_id)
            var externalLinks = section.external_links
            for (var i = 0; i < externalLinks.length; i++) {
                if (externalLinks[i] == externalLink.id) {
                    externalLinks.splice(i, 1)
                }
            }
            await section.save()
            return { success: true }
        } catch (err) {
            throw err
        }
    },
    updateExternalLink: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var externalLink = await ExternalLink.findById(args.input.id)
            if (!externalLink) throw new Error('External Link not found')
            if (args.input.name) { externalLink.name = args.input.name }
            if (args.input.url) { externalLink.url = args.input.url }
            if (args.input.target) { externalLink.target = args.input.target }
            if (args.input.item_type) { externalLink.item_type = args.input.item_type }
            if (args.input.section_id) {
                var section = await Section.findById(args.input.section_id)
                if (!section) throw new Error('Section not found')
                var prevSection = await Section.findById(externalLink.section_id)
                if (!prevSection) throw new Error('Section not found')
                var externalLinks = prevSection.external_links
                for (var i = 0; i < externalLinks.length; i++) {
                    if (externalLinks[i] == externalLink.id) {
                        externalLinks.splice(i, 1)
                    }
                }
                await prevSection.save()
                section.external_links.push(externalLink.id)
                await section.save()
                externalLink.section_id = args.input.section_id
                externalLink.category_id = section.category_id
            }
            await externalLink.save()
            var externalLink = await ExternalLink.findById(externalLink.id)
            return {
                ...externalLink._doc,
                category_id: externalLink._doc.category_id,
                section_id: externalLink._doc.section_id
            }
        } catch (err) {
            throw err
        }
    }
}