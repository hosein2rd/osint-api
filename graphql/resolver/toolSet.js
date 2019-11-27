const ToolSet = require('../../model/ToolSet')
const { categories, store, deleteFile } = require('../../helper/utils')

module.exports = {
    toolSets: async() => {
        try {
            var toolsets = await ToolSet.find()
            return await toolsets.map(toolset => {
                return {
                    ...toolset._doc,
                    _id: toolset.id,
                    categories: categories.bind(this, toolset._doc.categories)
                }
            })
        } catch (err) {
            throw err
        }
    },
    createToolSet: async(args, req) => {
        if (!req.isAuth) throw new Error('UnAuthorization')
        if (req.user.type != 'admin') throw new Error('Access denied')
        var path
        try {
            if (args.input.icon) {
                const { filename, mimetype, createReadStream } = await args.input.icon;
                var splitMimeType = mimetype.split('/')
                var imageType = splitMimeType[0]
                if (imageType != 'image') {
                    throw new Error('Icon is not image, its mimetype is ' + mimetype)
                }
                const stream = createReadStream()
                path = store({ stream, filename })
            }
            var toolSet = new ToolSet({
                title: args.input.title,
                icon: path
            })
            var savedToolset = await toolSet.save()
            if (!savedToolset) throw new Error('Tool Set not found')
            return {
                ...savedToolset._doc,
                categories: categories.bind(this, savedToolset._doc.categories)
            }
        } catch (err) {
            throw err
        }
    },
    updateToolSet: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        var path
        try {
            var toolSet = await ToolSet.findOne({ _id: args.input.id })
            if (!toolSet) {
                throw new Error('Tool Set not found')
            }
            if (args.input.title) {
                toolSet.title = args.input.title
            }
            if (args.input.icon) {
                deleteFile(toolSet.icon)
                const { filename, mimetype, createReadStream } = await args.input.icon;
                var splitMimeType = mimetype.split('/')
                var imageType = splitMimeType[0]
                if (imageType != 'image') {
                    throw new Error('Icon is not image, its mimetype is ' + mimetype)
                }
                const stream = createReadStream()
                path = store({ stream, filename })
                toolSet.icon = path
            }
            var savedToolset = await toolSet.save()
            var toolset = await ToolSet.findById(savedToolset.id)
            return {
                ...toolset._doc,
                categories: categories.bind(this, toolset._doc.categories)
            }
        } catch (err) {
            throw err
        }
    },
    deleteToolSet: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var toolSet = await ToolSet.findById(args.id)
            if (!toolSet) {
                throw new Error('Tool Set not found')
            }
            await ToolSet.deleteOne({ _id: toolSet.id })
            return { success: true }
        } catch (err) {
            throw err
        }
    },
    toolSet: async(args) => {
        try {
            var toolSet = await ToolSet.findById(args.id)
            if (!toolSet) throw new Error('Tool Set not found')
            return {
                ...toolSet._doc,
                categories: categories.bind(this, toolSet._doc.categories)
            }
        } catch (err) {
            throw err
        }
    }
}