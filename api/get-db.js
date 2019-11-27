const express = require('express')
const fs = require('fs')
const exec = require("child_process").exec

const router = express.Router()
const Toolset = require('../model/ToolSet')
const Category = require('../model/Category')
const Section = require('../model/Section')
const Item = require('../model/Item')
const ImageItem = require('../model/ImageItem')
const ExternalLink = require('../model/ExternalLink')

router.get('/getjson', async(req, res, next) => {
    var db = await getDb()

    res.status(200).json({
        database: db
    })
})

router.post('/build', async(req, res, next) => {
    var db = await getDb()
    fs.writeFile("public/data/db.json", JSON.stringify(db), async function(err) {
        if (err) return res.status(500).json({
            error: err
        })

        exec('mv public/data/db.json ../osint-tools-frontend/src/data && cd && cd osint-tools-frontend && npm run build', async(err, stdout, stderr) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                    stderr: stderr
                })
            } else {
                exec('pm2 restart osint-app', (err, stdout, stderr) => {
                    if (err) { return res.status(500).json({ error: err }) }
                    res.status(200).json({
                        success: true
                    })
                })
            }
        })
    });
})

async function getToolsets() {
    return await Toolset.find()
}

async function getCategroies() {
    return await Category.find()
}

async function getSections() {
    return await Section.find()
}

async function getItems() {
    return await Item.find()
}

async function getImageItems() {
    return await ImageItem.find()
}

async function getExternalLinks() {
    return await ExternalLink.find()
}

async function getDb() {
    var db = []

    db = await pushToolset(db)
    db = await pushCategory(db)
    db = await pushSection(db)
    db = await pushItems(db)

    return db
}

async function pushToolset(db) {
    var toolsetArr = await getToolsets()
        //Push Toolset
    for (let t = 0; t < toolsetArr.length; t++) {
        db.push({
            id: toolsetArr[t]._id,
            icon: 'nothing-for-now',
            title: toolsetArr[t].title,
            items: []
        })
    }

    return db
}

async function pushCategory(db) {
    var categoryArr = await getCategroies()
        //Push Category
    for (let c = 0; c < categoryArr.length; c++) {
        for (let t = 0; t < db.length; t++) {
            if (db[t].id + '' == categoryArr[c].tool_set_id) {
                db[t].items.push({
                    id: categoryArr[c]._id,
                    title: categoryArr[c].title,
                    icon: categoryArr[c].icon,
                    subItem: [{
                            id: "1",
                            title: "ابزارها",
                            pageType: "SearchPage",
                            section: []
                        },
                        {
                            id: "2",
                            title: "لینک‌ها",
                            pageType: "ResourcePage",
                            section: []
                        },
                        {
                            id: "3",
                            title: "عکس‌ها",
                            pageType: "ImagePage",
                            section: []
                        }
                    ]
                })
            }
        }
    }

    return db
}

async function pushSection(db) {
    var sectionArr = await getSections()

    for (let t = 0; t < db.length; t++) {
        for (let c = 0; c < db[t].items.length; c++) {
            for (let s = 0; s < sectionArr.length; s++) {
                if (sectionArr[s].category_id + '' == db[t].items[c].id + '') {
                    if (sectionArr[s].page_type == 'input') {
                        var obj = {}
                        for(let it = 0; it < sectionArr[s].populate_item.length; it++) {
                            obj[sectionArr[s].populate_item[it].populate + ''] = ''
                        }
                        db[t].items[c].subItem[0].section.push({
                            id: sectionArr[s]._id,
                            title: sectionArr[s].title,
                            hasPapulate: sectionArr[s].has_populate,
                            papulateItem: obj,
                            items: []
                        })       
                    } else if (sectionArr[s].page_type == 'link') {
                        db[t].items[c].subItem[1].section.push({
                            id: sectionArr[s]._id,
                            title: sectionArr[s].title,
                            hasPapulate: sectionArr[s].has_populate,
                            papulateItem: {},
                            items: []
                        })
                    } else if (sectionArr[s].page_type == 'img') {
                        db[t].items[c].subItem[2].section.push({
                            id: sectionArr[s]._id,
                            title: sectionArr[s].title,
                            hasPapulate: sectionArr[s].has_populate,
                            papulateItem: {},
                            items: []
                        })
                    }
                }
            }
        }
    }

    return db
}

async function pushItems(db) {
    var itemArr = await getItems()
    var imageItemArr = await getImageItems()
    var externalLinkArr = await getExternalLinks()

    for (let t = 0; t < db.length; t++) {
        for (let c = 0; c < db[t].items.length; c++) {
            for (let i = 0; i < itemArr.length; i++) {
                for (let s = 0; s < db[t].items[c].subItem[0].section.length; s++) {
                    if (itemArr[i].section_id + '' == db[t].items[c].subItem[0].section[s].id + '') {
                        var section = await Section.findById(itemArr[i].section_id)
                        db[t].items[c].subItem[0].section[s].items.push({
                            id: itemArr[i]._id,
                            inputItems: itemArr[i].input_item,
                            submitUrl: [{
                                url: itemArr[i].url,
                                urlSecondItem: ""
                            }],
                            submitValue: itemArr[i].submit_value,
                            itemType: 'input',
                            onSubmit: itemArr[i].on_submit,
                            inSection: section.title,
                            isSubmitAll: itemArr[i].is_submit_all,
                            inCategory: itemArr[i].category_id
                        })
                    }
                }
            }

            for (let s = 0; s < db[t].items[c].subItem[0].section.length; s++) {
                for (let i = 0; i < db[t].items[c].subItem[0].section[s].items.length; i++) {
                    var arr = db[t].items[c].subItem[0].section[s].items[i].inputItems
                    db[t].items[c].subItem[0].section[s].items[i].inputItems = []
                    for (let index = 0; index < arr.length; index++) {
                        db[t].items[c].subItem[0].section[s].items[i].inputItems.push({
                            id: arr[index]._id,
                            name: arr[index].name,
                            type: arr[index].type,
                            isPapulate: arr[index].is_populate,
                            placeholder: arr[index].place_holder
                        })
                    }
                }
            }

            for (let l = 0; l < externalLinkArr.length; l++) {
                for (let s = 0; s < db[t].items[c].subItem[1].section.length; s++) {
                    if (externalLinkArr[l].section_id + '' == db[t].items[c].subItem[1].section[s].id + '') {
                        db[t].items[c].subItem[1].section[s].items.push({
                            id: externalLinkArr[l]._id,
                            name: externalLinkArr[l].name,
                            url: externalLinkArr[l].url,
                            target: externalLinkArr[l].target,
                            itemType: 'link'
                        })
                    }
                }
            }

            for (let g = 0; g < imageItemArr.length; g++) {
                for (let s = 0; s < db[t].items[c].subItem[2].section.length; s++) {
                    if (imageItemArr[g].section_id + '' == db[t].items[c].subItem[2].section[s].id + '') {
                        db[t].items[c].subItem[2].section[s].items.push({
                            id: imageItemArr[g]._id,
                            src: imageItemArr[g].src,
                            alt: imageItemArr[g].src,
                            itemType: 'Image'
                        })
                    }
                }
            }
        }
    }

    return db
}

module.exports = router
