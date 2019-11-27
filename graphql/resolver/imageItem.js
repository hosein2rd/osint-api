const ImageItem = require('../../model/ImageItem')
const Section = require('../../model/Section')
const { store, singleCategory, singleSection, deleteFile } = require('../../helper/utils')

module.exports = {
    createImageItem: async (args, req) => {
        if(!req.isAuth) throw new Error('UnAuthorization')
        if(req.user.type != 'admin') throw new Error('Access denied')
        var path
        try {
            const { filename, mimetype, createReadStream } = await args.input.src;
            var splitMimeType = mimetype.split('/')
            var imageType = splitMimeType[0]
            if(imageType != 'image') {
                throw new Error('Icon is not image, its mimetype is ' + mimetype)
            }
            const stream = createReadStream()
            path = store({stream, filename})
            var section = await Section.findById(args.input.section_id)
            if(!section) throw new Error('Section not found')
            var imageItem = new ImageItem({
                src: path,
                item_type: args.input.item_type,
                section_id: args.input.section_id,
                category_id: section.category_id
            })
            var savedImageItem = await imageItem.save()
            section.image_items.push(savedImageItem)
            await section.save()
            return {
                ...savedImageItem._doc,
                section_id: singleSection.bind(this, savedImageItem._doc.section_id),
                category_id: singleCategory.bind(this, savedImageItem._doc.category_id)
            }
        } catch(err) {
            throw err
        }
    },
    imageItems: async () => {
        try {
            var imageItems = await ImageItem.find()
            return await imageItems.map(imageItem => {
                return {
                    ...imageItem._doc,
                    section_id: singleSection.bind(this, imageItem._doc.section_id),
                    category_id: singleCategory.bind(this, imageItem._doc.category_id)
                }
            })
        } catch(err) {
            throw err
        }
    },
    imageItem: async (args) => {
        try {
            var imageItem = await ImageItem.findById(args.id)
            if(!imageItem) throw new Error('Image Item not found')
            return {
                ...imageItem._doc,
                section_id: singleSection.bind(this, imageItem._doc.section_id),
                category_id: singleCategory.bind(this, imageItem._doc.category_id)
            }
        } catch(err) {
            throw err
        }
    },
    updateImageItem: async (args, req) => {
        if(!req.isAuth) throw new Error('UnAuthorization')
        if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var imageItem = await ImageItem.findById(args.input.id)
            if(!imageItem) throw new Error('Image Item not found')
            if(args.input.item_type) { imageItem.item_type = args.input.item_type }
            if(args.input.section_id) {
                var prevSection = await Section.findById(imageItem.section_id)
                var section = await Section.findById(args.input.section_id)
                if(!section) throw new Error('Section not found')
                var imageItems = prevSection.image_items
                for(var i = 0; i < imageItems.length; i++) {
                    if(imageItems[i] == imageItem.id) {
                        console.log('here')
                        imageItems.splice(i, 1)
                    }
                }
                await prevSection.save()
                imageItem.section_id = args.input.section_id
                imageItem.category_id = section.category_id
                section.image_items.push(imageItem.id)
                await section.save()
            }
            if(args.input.src) {
                deleteFile(imageItem.src)
                const { filename, mimetype, createReadStream } = await args.input.src;
                var splitMimeType = mimetype.split('/')
                var imageType = splitMimeType[0]
                if(imageType != 'image') {
                    throw new Error('Icon is not image, its mimetype is ' + mimetype)
                }
                const stream = createReadStream()
                path = store({stream, filename})
                imageItem.src = path
            }
            var savedImageItem = await imageItem.save()
            return {
                ...savedImageItem._doc,
                section_id: singleSection.bind(this, savedImageItem._doc.section_id),
                category_id: singleCategory.bind(this, savedImageItem._doc.category_id)
            }
        } catch(err) {
            throw err
        }
    },
    deleteImageItem: async (args, req) => {
        if(!req.isAuth) throw new Error('UnAuthorization')
        if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var imageItem = await ImageItem.findById(args.id)
            if(!imageItem) throw new Error('Image Item not found')
            var section = await Section.findById(imageItem.section_id)
            if(section) {
                var imageItems = section.image_items
                for(var i = 0; i < imageItems.length; i++) {
                    if(imageItems[i] == imageItem.id) {
                        imageItems.splice(i, 1)
                    }
                }
                await section.save()
            }
            await ImageItem.deleteOne({_id: imageItem.id})
            return { success: true }
        } catch(err) {
            throw err
        }
    }
}
