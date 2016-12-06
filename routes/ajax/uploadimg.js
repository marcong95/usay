const crypto = require('crypto')
const debug = require('debug')('usay:server')
const express = require('express')
const fs = require('fs')
const multiparty = require('connect-multiparty')

const router = express.Router()
const imgPath = __dirname + '/../../public/common/images/picture/'

router.post('/', multiparty(), function(req, res) {
    console.log(req.body, req.files)
    // ignore any file except the first one
    let f = req.files.file_data
    let rs = fs.createReadStream(f.path)
    let ws = fs.createWriteStream(imgPath + f.name)
    let hash = crypto.createHash('md5')
    rs.on('data', function(chunk) {
        hash.update(chunk)
        ws.write(chunk)
        debug(`Received ${chunk.length} bytes of data.`)
    })
    rs.on('end', function(chunk) {
        let digested = hash.digest('hex')
        let fileExt = f.name.replace('.*\.(?=\w+)', '')
        let newName = imgPath + digested + fileExt
        ws.close()
        fs.rename(imgPath + f.name, newName)
        res.send({
            done: true,
            url: newName
        })
    })
    debug('ReadStream event registered.')
})

module.exports = router