module.exports = {
    getGems,
    getGemsPagination,
    getGem,
    createGem,
    updateGem,
    deleteGem,
    uploadPhotos,
    updateGemWithImages
}

const GemsSub = require('../models/Gemas')
const mongoose = require('mongoose')
const meteorID = require('meteor-mongo-id')
const Random = require('meteor-random')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: ''
})

function getGems(req, res){
    GemsSub.find({}, (err, concepts)=>{
        if(err) return res.status(500).send({message:`Problem with the searching request ${err}`})
        if(!concepts) return res.status(404).send({message: `Gems does not exist`})

        res.status(200).send({gems: concepts})
    })
}

function getGemsPagination(req, res){
    let perPage = parseInt(req.body.perPage)
    let page = parseInt(req.body.page)
    let gemsConceptsRes = null;
    
    let searchData = req.query.search

    GemsSub.find(searchData).skip((page - 1) * perPage)
    .limit(perPage)
    .sort({}) 
    .exec()
    .then((concepts)=>{
        res.set('X-limit', perPage)
        res.set('X-page', page)
        gemsConceptsRes = concepts
        console.info("Result", concepts)
        return GemsSub.count()
    })
    .then((total)=>{
        res.set('X-total', total)
        res.status(200).send({total: total, gemsTotal: gemsConceptsRes.length, gemsConcepts: gemsConceptsRes})
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send({message: `Error in request ${err}`})
    })
}

function getGem(req, res){
    let conceptID = req.body._id
    GemsSub.find({_id: conceptID}, (err, concept)=>{
        if(err) return res.status(500).send({message:`Problem with the searching request ${err}`})
        if(!concept) return res.status(404).send({message: `Gem does not exist`})

        res.status(200).send({gem: concept})
    })
}

function createGem(req, res){
    let gem = req.body
    console.log(req.body.specs)
    let g = {
        _id: Random.id(),
            name: gem.name,
            description: gem.description,
            price: gem.price,
            canPurchase: gem.canPurchase,
            specs: [{
                faces: gem.specs.faces,
                color: gem.specs.color,
                rarity: gem.specs.rarity,
                shine: gem.specs.shine,
            }],
            reviews: [{
                stars: gem.reviews.stars,
                body: gem.reviews.body,
                author: gem.reviews.author,
                createdOn: gem.reviews.createdOn
            }]
        
    }

    const gemToCreate = new GemsSub(g)

    gemToCreate.save((err, gemStored)=>{
        if(err) return res.status(400).send({message: `Error on model ${err}`})

        res.status(200).send({gem: gemStored})
    })
}

function updateGem(req, res){
    let conceptID = req.body._id
    let update = req.body.gem

    GemsSub.findByIdAndUpdate(conceptID, update, (err, concept) =>{
        if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        res.status(200).send({message: `Update Successfull`, gem: concept})
    })
}

function updateGemWithImages(_id, img){
    let conceptID = _id
    let update = img

    GemsSub.findByIdAndUpdate(conceptID, {"$push": {"images": update}},
    {"new": false, "upsert": false },
    (err, conceptUpdated)=>{
        if(err) res.status(500).send({message: `Error in the request ${err}`})
        console.log ("Gem Updated", conceptUpdated)
    })
}

function deleteGem(req, res){
    const conceptID = req.body._id
    GemsSub.remove({_id: conceptID}, (err, concept)=>{
        if(err) return res.status(500).send({message: `Problem with the searching request ${err}`})
        res.status(200).send({message: `Remove Completed`})
    })
}

function uploadPhotos(req, res){
    const path = req.files.file.path
    const gemID = req.body._id
    console.log(path)
    const uniqueFilename = Random.id()
    fs.readFile(path, function(err, data){
        if(err) {throw err}
        cloudinary.uploader.upload(path, 
            {public_id: `gemsImages/${uniqueFilename}`, tags:
        `gemsImages`},
            (err, result)=>{
                console.log(result)
                
                let routeIng = result.url
                let arrayRoute = routeIng.split("/")
                let finalUrl = arrayRoute[6] + "/" + arrayRoute[7] + "/" + arrayRoute[8]
                console.log("finalUrl", finalUrl)

                if(err) return res.status(500).send(err)
                fs.unlinkSync(path)
                updateGemWithImages(gemID, finalUrl)
                console.log ("This works")
            })
        })
    }
    


function formatDateName(now){
    let year = now.getFullYear()
    let month = now.getMonth() < 9 ? `0${now.getMonth() + 1}` : now.getMonth() + 1 
    let day = now.getDate() < 10 ? `0${now.getDate()}` :now.getDate()
    let hours = now.getHours() < 10 ? `0${now.getHours()}` :now.getHours()
    let minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` :now.getMinutes()
    let seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` :now.getSeconds()

    return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`
}