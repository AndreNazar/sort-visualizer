require("./style.scss");

const bars = document.querySelectorAll('.bar');
const shuffle = document.querySelector('.random_btn');
const play = document.querySelector('.play_btn');

const audioContext = new window.AudioContext();

const canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

canvas.height = 500
canvas.width = 1050

let data: number[] = [];

data = new Array(100).fill(1)
drawBars(-1, -1, -1);

let buttonPlayed = false
let buttonShuffled = false

let indexFiller = 0

let interval: any;


function drawBars (indexpivot: number, indexleft: number, indexright: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rectWidth: number = 10;
    const spacing: number = 0;
    let x: number = 30;
    let y: number = canvas.height/2 - data[0]/2;
    for (let i = 0; i < data.length; i++) {

        if(indexpivot != -1 && indexleft != -1 && indexright != -1)
            ctx.fillStyle =
            i === indexpivot ? '#ed5761' 
            : (i === indexleft || i === indexright) ? '#404b62' 
            : '#161515';
        else ctx.fillStyle = '#161515';

        ctx.fillRect(x, y, rectWidth, data[i]); // Рисуем прямоугольник
        // Обновляем координаты для следующего прямоугольника
        x += rectWidth + spacing;
        y = canvas.height/2 - data[i + 1]/2;
    }
}

function playPic(note:number) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square'; // Тип волны: синусоида
    oscillator.frequency.value = note; // Устанавливаем частоту ноты
    
    gainNode.gain.value = 0.05; // Уровень громкости
    
    oscillator.start();
    
    setTimeout(() => {
        oscillator.stop();
    }, 10);
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 30));
  }

async function quickSort(arr: number[]) {
    const stack: number[][] = [];
    stack.push([0, arr.length - 1]);

    while (stack.length > 0) {
        const [low, high] = stack.pop() as number[];

        if (low < high) {
            const pivot = await partition(arr, low, high);
            

            stack.push([low, pivot - 1]);
            stack.push([pivot + 1, high]);
        }
    }


    drawBars(-1, -1, -1)
    data = arr
}

async function partition(arr: number[], low: number, high: number): Promise<number> {
    // Функция разделения массива на части относительно опорного элемента
    const pivot = arr[high]; // Опорный элемент
    let i = low - 1; // Индекс для меньших элементов
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Меняем элементы местами
        }
        drawBars(high, i, j)
        playPic(arr[j])
        await sleep()
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Помещаем опорный элемент на правильную позицию
    
    return i + 1; // Возвращаем позицию опорного элемента
}


shuffle.addEventListener("click", () => {
    if (!buttonShuffled && !buttonPlayed) {
        buttonShuffled = true
  
      let fillarray = setInterval(() => {
        let rand = Math.floor(Math.random() * (500 - 5) + 5)
        data[indexFiller] = rand
        playPic(rand * 6)
        drawBars(-1, -1, -1)
        if (indexFiller === 99) {
          clearInterval(fillarray)
          buttonShuffled = false
        } else indexFiller++
      }, 20)
      drawBars(-1, -1, -1)
      indexFiller = 0
    }
  })

  play.addEventListener("click", async () => {
    if (!buttonPlayed && !buttonShuffled) {
      buttonPlayed = true
      await quickSort(data)
      buttonPlayed = false
    }
  })