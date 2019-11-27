const User = require('../model/User')
const Category = require('../model/Category')
const ToolSet = require('../model/ToolSet')
const Section = require('../model/Section')
const Item = require('../model/Item')
const ExternalLink = require('../model/ExternalLink')
const fs = require('fs')
const ImageItem = require('../model/ImageItem')

const baseUrl = 'http://192.168.0.32'

exports.singleCategory = categoryId => {
    return Category.findById(categoryId).then(category => {
        return {
             ...category._doc,
             tool_set_id: this.singleTootset.bind(this, category._doc.tool_set_id),
             sections: this.sections.bind(this, category._doc.sections)
        }
    }).catch(err => {
        throw err
    })
}

exports.singleTootset = toolsetId => {
    return ToolSet.findById(toolsetId).then(toolset => {
        return {
            ...toolset._doc,
            categories: this.categories.bind(this, toolset._doc.categories)
        }
    }).catch(err => {
        throw err
    })
}

exports.singleSection = sectionId => {
    return Section.findById(sectionId).then(section => {
        return {
            ...section._doc,
            category_id: this.singleCategory.bind(this, section._doc.category_id),
            items: this.items.bind(this, section._doc.items),
            external_links: this.externalLinks.bind(this, section._doc.external_links)
        }
    }).catch(err => {
        throw err
    })
}

exports.singleCategory = categoryId => {
    return Category.findById(categoryId).then(category => {
        return {
            ...category._doc, 
            tool_set_id: this.singleTootset.bind(this, category._doc.tool_set_id), 
            sections: this.sections.bind(this, category._doc.sections)}
    }).catch(err => {
        throw err
    })
}

exports.categories = categoryIds => {
    return Category.find({_id: {$in: categoryIds}}).then(categories => {
        return categories.map(category => {
            return {
                ...category._doc,
                 tool_set_id: this.singleTootset.bind(this, category._doc.tool_set_id),
                 sections: this.sections.bind(this, category._doc.sections)
            }
        })
    }).catch(err => {
        throw err
    })
}

exports.sections = sectionIds => {
    return Section.find({_id: {$in: sectionIds}}).then(sections => {
        return sections.map(section => {
            return { 
                ...section._doc,
                category_id: this.singleCategory.bind(this, section._doc.category_id),
                items: this.items.bind(this, section._doc.items),
                external_links: this.externalLinks.bind(this, section._doc.external_links),
		image_items: this.imageItems.bind(this, section._doc.image_items)
            }
        })
    }).catch(err => {
        throw err
    })
}

exports.items = itemsIds => {
    return Item.find({_id: {$in: itemsIds}}).then(items => {
        return items.map(item => {
            return { ...item._doc, section_id: this.singleSection.bind(this, item._doc.section_id), category_id: this.singleCategory.bind(this, item._doc.category_id)}
        })
    }).catch(err => {
        throw err
    })
}

exports.externalLinks = externalLinkIds => {
    return ExternalLink.find({_id: {$in: externalLinkIds}}).then(externalLinks => {
        return externalLinks.map(externalLink => {
            return { 
                ...externalLink._doc,
                section_id: this.singleSection.bind(this, externalLink._doc.section_id),
                category_id: this.singleCategory.bind(this, externalLink._doc.category_id)
            }
        })
    }).catch(err => {
        throw err
    })
}

exports.imageItems = imageItemIds => {
    return ImageItem.find({_id: {$in: imageItemIds}}).then(imageItems => {
        return imageItems.map(imageItem => {
            return {
                ...imageItem._doc,
                section_id: this.singleSection.bind(this, imageItem._doc.section_id),
                category_id: this.singleCategory.bind(this, imageItem._doc.category_id)
            }
        })
    })
}

exports.store = function store({ stream, filename }) {
    const uploadDir = 'public/uploads';
    const path = `${uploadDir}/${Date.now()}-${filename}`;
    new Promise((resolve, reject) =>
      stream
        .on('error', error => {
          if (stream.truncated)
            fs.unlinkSync(path);
          reject(error);
        })
        .pipe(fs.createWriteStream(path))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ path }) )
    );
    return baseUrl + path.substring(6, path.length)
  }

exports.deleteFile = function deleteFile(path) {
    var url = path.split('/')
    fs.unlink('public/' + url[url.length - 2] + '/' + url[url.length - 1], err => {
        if (err) {
            console.log(err)
        }
    })
}
