const width = 510;
const height = 510;
const brickSize = 510 / 64;

const getImageByBrightness = (pixelData, variant) => {

    const averageBrightness = calculateAverageBrightness(pixelData);
    
    for(let i = 0; i < variant.length; i++) {
        const { minBrightness, maxBrightness, imageSrc } = variant[i];

        if(averageBrightness > minBrightness && averageBrightness < maxBrightness) {
            return imageSrc;
        }
    }

    return 'white.jpg';
}

const calculateAverageBrightness = (data) => {
    let totalBrightness = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const brightness = 0.21 * r + 0.72 * g + 0.07 * b;
        totalBrightness += brightness;
        count++;
    }

    return totalBrightness / count;
}

module.exports.getBrickImage = (variant, ctx, x, y) => {
    const imageData = ctx.getImageData(x, y, brickSize, brickSize).data;
    const brickImage = getImageByBrightness(imageData, variant);

    return brickImage;
}

module.exports.setUpAndDraw = (canvas, image, ctx) => {
    const scale = Math.max(canvas.width / image.width, canvas.height / image.height);

    const newWidth = image.width * scale;
    const newHeight = image.height * scale;
    
    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    ctx.drawImage(image, offsetX, offsetY, newWidth, newHeight);
}