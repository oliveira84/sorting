
let speedRange = document.querySelector("#speed");
let numElemRange = document.querySelector("#numElem");
let blurRange = document.querySelector("#blur");
let sortingID = 0;

const param = {
    speed: 50,
    numOfElements: 400,
    blurEffect: 1,
    comparisons: 0,
    swaps : {
        elem1: null,
        elem2: null,
    }
}

let jobQueue = [];

let array = createArray(param.numOfElements);
let drawer = new Particle(array, param)


document.querySelector("#shuffle").addEventListener("click", () => {
    beep();
    sortingID++;
    jobQueue.push(() =>{
        array = createArray(param.numOfElements);
        drawer.array = array;
    })
})
speedRange.addEventListener("input",() =>{
    param.speed = parseInt(speedRange.value);
})
blurRange.addEventListener("input",() =>{
    param.blurEffect = 1 - (parseInt(blurRange.value)/100);
})
numElemRange.addEventListener("input",() =>{
    sortingID++;
    jobQueue.push(() =>{
        param.numOfElements = parseInt(numElemRange.value);
        array = createArray(param.numOfElements);
        drawer.array = array;
    })
})

document.querySelector("#bubbleSort").addEventListener("click", () => {
    param.comparisons = 0;
    let myID = ++sortingID;
    jobQueue.push(()=>bubbleSort(myID))
})
document.querySelector("#selectionSort").addEventListener("click", () => {
    param.comparisons = 0;
    let myID = ++sortingID;
    jobQueue.push(()=>selectionSort(myID))
})
document.querySelector("#insertionSort").addEventListener("click", () => {
    param.comparisons = 0;
    let myID = ++sortingID;
    jobQueue.push(()=>insertionSort(myID))
})
document.querySelector("#mergeSort").addEventListener("click", () => {
    param.comparisons = 0;
    let myID = ++sortingID;
    jobQueue.push(()=>mergeSort(0, array.length-1, myID))
})
document.querySelector("#quickSort").addEventListener("click", () => {
    param.comparisons = 0;
    let myID = ++sortingID;
    jobQueue.push(()=>quickSort(0, array.length-1, myID))
})


function createArray(size) {
    let arr = []
    for (let i = 0; i < size; i++) {
        arr.push(i);
    }
    for (let index = arr.length - 1; index > 0; index--) {
        let j = Math.floor(Math.random() * (index + 1));
        let x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}

function swap(arr, pos1, pos2) {
    let temp = arr[pos1];
    arr[pos1] = arr[pos2];
    arr[pos2] = temp;
}

async function quickSort(first,last,mySortId){
    if(first >= last || sortingID !== mySortId) {
        return;
    }
    let pivot = await partition(first,last);
    await quickSort(first,pivot-1,mySortId,);
    await quickSort(pivot+1, last,mySortId);

    async function partition(first,last){
        swap(array,Math.floor(first+((last-first)/2)),last)
        let pivVal = array[last];
        let i = first;
        for (let j = first; j < last ; j++) {
            param.swaps.elem1 = array[j];
            param.swaps.elem2 = array[i];
            if(array[j] <= pivVal){
                swap(array,i++,j)
            }
            if(sortingID !== mySortId) {
                return;
            }
            param.comparisons++;
            if (param.comparisons % Math.ceil(param.speed/10) === 0 && sortingID === mySortId) {
                await new Promise(resolve => { requestAnimationFrame(resolve); });
            }
        }
        swap(array,i,last);
        return i;
    }
}

async function  insertionSort(mySortID){
    for (let i = 1; i < array.length; i++) {
        let newNum = array[i];
        let j = i -1;
        while(j >= 0 && array[j] > newNum){
            param.swaps.elem1 = array[i];
            param.swaps.elem2 = array[j];
            array[j+1] = array[j--];
            param.comparisons++;
            if (param.comparisons % Math.ceil(param.speed/1.3) === 0 && mySortID === sortingID) {
                await new Promise(resolve => { requestAnimationFrame(resolve); });
            }
        }
        array[j+1] = newNum;
        if (mySortID !== sortingID) return;
    }
}

async function mergeSort(start, end, mySortID){
    if (end - start <= 0 || sortingID !== mySortID){
        return;
    }
    const middlePos = Math.floor((end-start)/2) + start
    await mergeSort(start,middlePos, mySortID);
    await mergeSort(middlePos+1,end, mySortID);

    if (sortingID !== mySortID){
        return;
    }

    let tmpArr1 = array.slice(start,middlePos+1);
    let tmpArr2 = array.slice(middlePos+1,end +1);

    let counter1 = 0;
    let counter2 = 0;

    while(counter1 < tmpArr1.length || counter2 < tmpArr2.length){
        param.swaps.elem1 = array[start];
        param.swaps.elem2 = array[middlePos+counter2+1];
        if(counter1 >= tmpArr1.length){
            array[start++] = tmpArr2[counter2++];
        }
        else if (counter2 >= tmpArr2.length){
            array[start++] = tmpArr1[counter1++];
        }
        else if(tmpArr1[counter1] <= tmpArr2[counter2]){
            array[start++] = tmpArr1[counter1++];
        }
        else {
            array[start++] = tmpArr2[counter2++];
        }
        param.comparisons++;
        if (param.comparisons % Math.ceil(param.speed/10) === 0 && sortingID === mySortID) {
            await new Promise(resolve => { requestAnimationFrame(resolve); });
        }
    }
}

async function selectionSort(mySortID) {
    let min = 0;
    for (let i = 0; i < array.length-1; i++) {
        min = i
        for (let j = i+1; j < array.length; j++) {
            if (mySortID !== sortingID) {
                return;
            }
            if(array[j] < array[min]){
                min = j;
            }
            param.swaps.elem1 = array[j];
            param.swaps.elem2 = array[min];
            param.comparisons++;
            if (param.comparisons % Math.ceil(param.speed) === 0 && mySortID === sortingID) {
                await new Promise(resolve => { requestAnimationFrame(resolve); });
            }
        }
        if(min !== i){
            swap(array,i,min);
        }
    }
}

async function bubbleSort(mySortId) {
    for (let i = 0; i < array.length - 1; i++){
        for (let j = 0; j < array.length - i - 1; j++){
            if (mySortId !== sortingID) return;
            if (array[j] > array[j + 1]) {
                param.swaps.elem1 = array[j];
                swap(array, j, j + 1);
            }
            else {
                param.swaps.elem2 = array[j];
            }
            param.comparisons++;
            if (param.comparisons % Math.ceil(param.speed) === 0) {
                await new Promise(resolve => { requestAnimationFrame(resolve); });
            }
        }
    }
}



async function work(){
    while(jobQueue.length>0){
        await jobQueue.shift()();
    }
    setTimeout(work,250)
}

work().then( () => {console.log("Job queue initialized...")});

function beep() {
    let snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.rate
    snd.playbackRate = 5;
    snd.play();
}
