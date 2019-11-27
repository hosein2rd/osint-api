const Category = require('../../model/Category')
const ToolSet = require('../../model/ToolSet')
const { singleTootset, sections, store, deleteFile } = require('../../helper/utils')

module.exports = {
    createCategory: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        var path
        try {
            if (args.input.icon) {
                const { filename, mimetype, createReadStream } = await args.input.icon;
		console.log('filename =======================> ' + filename)
		console.log('mimetype =======================> ' + mimetype )
                var splitMimeType = mimetype.split('/')
                var imageType = splitMimeType[0]
                if (imageType != 'image') {
                    throw new Error('Icon is not image, its mimetype is ' + mimetype)
                }
                const stream = createReadStream()
                path = store({ stream, filename })
            }
            var toolset = await ToolSet.findById(args.input.tool_set_id)
            if (!toolset) throw new Error('Tool Set not found')
            var category = new Category({
                title: args.input.title,
                icon: path,
                tool_set_id: args.input.tool_set_id
            })
            var savedCategory = await category.save()
            toolset.categories.push(savedCategory._id)
            await toolset.save()
            var category = await Category.findById(savedCategory.id)
            return {
                ...category._doc,
                tool_set_id: singleTootset.bind(this, category._doc.tool_set_id),
                sections: sections.bind(this, category._doc.sections)
            }
        } catch (err) {
            throw err
        }
    },
    category: async(args) => {
        try {
            var category = await Category.findById(args.id)
            if (!category) throw new Error('Category not found')
            return {
                ...category._doc,
                tool_set_id: singleTootset.bind(this, category._doc.tool_set_id),
                sections: sections.bind(this, category._doc.sections)
            }
        } catch (err) {
            throw err
        }
    },
    categories: async() => {
        try {
            var categories = await Category.find()
            return await categories.map(category => {
                return {
                    ...category._doc,
                    tool_set_id: singleTootset.bind(this, category._doc.tool_set_id),
                    sections: sections.bind(this, category._doc.sections)
                }
            })
        } catch (err) {
            throw err
        }
    },
    updateCategory: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        var path
        try {
            var category = await Category.findById(args.input.id)
            if (!category) throw new Error('Category')
            if (args.input.title) { category.title = args.input.title }
            if (args.input.icon) {
                deleteFile(category.icon)
                const { filename, mimetype, createReadStream } = await args.input.icon;
                var splitMimeType = mimetype.split('/')
                var imageType = splitMimeType[0]
                if (imageType != 'image') {
                    throw new Error('Icon is not image, its mimetype is ' + mimetype)
                }
                const stream = createReadStream()
                path = store({ stream, filename })
                category.icon = path
            }
            if (args.input.tool_set_id) {
                var toolset = await ToolSet.findById(args.input.tool_set_id)
                if (!toolset) throw new Error('Tool Set not found')
                var prevToolset = await ToolSet.findById(category.tool_set_id)
                if (!prevToolset) throw new Error('Tool Set not found')
                var categories = prevToolset.categories
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i] == category.id) {
                        categories.splice(i, 1)
                    }
                }
                await prevToolset.save()
                toolset.categories.push(category.id)
                await toolset.save()
                category.tool_set_id = args.input.tool_set_id
            }
            var savedCategory = await category.save()
            var category = await Category.findById(savedCategory.id)
            return {
                ...category._doc,
                tool_set_id: category._doc.tool_set_id,
                sections: category._doc.sections
            }
        } catch (err) {
            throw err
        }
    },
    deleteCategory: async(args, req) => {
        // if(!req.isAuth) throw new Error('UnAuthorization')
        // if(req.user.type != 'admin') throw new Error('Access denied')
        try {
            var category = await Category.findById(args.id)
            if (!category) throw new Error('Category not found')
            await Category.deleteOne({ _id: category.id })
            var toolset = await ToolSet.findById(category.tool_set_id)
            var categories = toolset.categories
            for (var i = 0; i < categories.length; i++) {
                if (categories[i] == category.id) {
                    categories.splice(i, 1)
                }
            }
            await toolset.save()
            return { success: true }
        } catch (err) {
            throw err
        }
    }
}
