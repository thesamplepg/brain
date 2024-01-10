module.exports.variant = [
    { minBrightness: 0, maxBrightness: 55, imageSrc: 'black.jpg' },
    { minBrightness: 55, maxBrightness: 102, imageSrc: 'dark_blue.jpg' },
    { minBrightness: 102, maxBrightness: 153, imageSrc: 'dark_grey.jpg' },
    { minBrightness: 153, maxBrightness: 204, imageSrc: 'grey.jpg' },
    { minBrightness: 204, maxBrightness: 255, imageSrc: 'white.jpg' }
]

module.exports.outputCode = {
    'black.jpg': 1,
    'dark_blue.jpg': 2,
    'dark_grey.jpg': 3,
    'grey.jpg': 4,
    'white.jpg': 5,
}
