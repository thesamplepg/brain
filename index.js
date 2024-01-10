const brain = require('brain.js');
const fs = require('fs');
const {loadImage, createCanvas} = require('canvas');
const {setUpAndDraw, getBrickImage} = require('./src/utils');
const { outputCode, variant } = require('./consts/index.js');

const width = 510;
const height = 510;
const brickSize = 510 / 64;


const trainingData = [];
const network = new brain.NeuralNetwork({hiddenLayers: [10, 10, 10]});

fs.readdir('./images', async (err, files) => {
    if(err) return console.log(err);
    
    const images = (files.length - 1) / 2;

    for(let i = 0; i < images; i++) {
        await getTrainingDataFromImage(i + 1);
    }

    if(isDataValid(trainingData)) {
        network.train(trainingData, {
            log: stats => console.log(stats),
            logPeriod: 10,
            errorThresh: 0.0002
        });

        const output = network.run(new Array(196).fill(0).map(normalizeInput));
        console.log(output)
        console.log(denormalizeOutput(output))

        const json = network.toJSON();
        const jsonString = JSON.stringify(json);

        fs.writeFileSync('model.json', jsonString)
    }
 })

const getTrainingDataFromImage = async (src) => {
    const canvases = {};

    for(let i = 0; i < 2; i++) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const image = await loadImage('./images/' + src + (i < 1 ? '-input.png' : '-result.png'));
        setUpAndDraw(canvas, image, ctx);

        canvases[i < 1 ? 'input' : 'output'] = [canvas, ctx];
    }

    return refactorData(canvases);
}

const normalizeInput = (value) => value / 255;
const normalizeOutput = (value) => (value - 1) / 4;
const denormalizeOutput = (value ) => value * 4 + 1

const refactorData = (canvases) => {

    const [canvas, ctx] = canvases.input;
    const [canvas2, ctx2] = canvases.output;


    for(let x = 0; x < canvas.width; x += brickSize) {
        for(let y = 0; y < canvas.height; y += brickSize) {

            const inputData = [...ctx.getImageData(x, y, brickSize, brickSize).data].map(normalizeInput);
            const outputData = normalizeOutput(outputCode[getBrickImage(variant, ctx, x, y)]);
            
            const dataPair = {
                input: inputData,
                output: [outputData]
            }
            
            trainingData.push(dataPair);
        }
    }
}

const isDataValid = (data) => {
    const result = trainingData.every(data => 
        data.input.every(v => !isNaN(v)) && !isNaN(data.output[0])
    );

    return result;
} 


// getTrainingDataFromImage('1')
//     .then(() => {
//         const isDataValid = trainingData.every(data => 
//             data.input.every(v => !isNaN(v)) && !isNaN(data.output[0])
//         );

//         if(isDataValid) {
//             network.train(trainingData, {
//                 log: stats => console.log(stats),
//                 logPeriod: 100,
//                 errorThresh: 0.0003
//             });

//             const output = network.run(new Array(196).fill(0).map(normalizeInput));
//             console.log(output)
//             console.log(denormalizeOutput(output))

//             const json = network.toJSON();
//             const jsonString = JSON.stringify(json);

//             fs.writeFileSync('model.json', jsonString);
//         }

//     })

// getTrainingDataFromImage('1.jpg').then(res => console.log(res))