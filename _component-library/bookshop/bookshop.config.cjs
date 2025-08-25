module.exports = {
    engines: {
        "@bookshop/eleventy-engine": {
            "plugins": ["./pathExists.js", "./removeExtraWhiteSpace.js"]
        }
    }
}
