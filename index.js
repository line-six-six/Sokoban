const map = document.querySelector('.map');
const reset = document.querySelector('.reset');
const selectLevel = document.querySelector('.selectLevel');
let allTd;
let self;
let doubleUp, doubleDown, doubleLeft, doubleRight;
let currentLevel = selectLevel.value.split(',')[0];

// 设置关卡
const level = {
    one: {
        size: 6,
        self: 27,
        box: [14 ,15 ,20],
        wall: [1, 2, 3, 7, 9, 10, 11, 12, 13, 17, 18, 22, 23, 24, 25, 26, 28, 32, 33, 34],
        destination: [8, 16, 19],
    },
    two: {
        size: 6,
        self: 13,
        box: [14, 15],
        wall: [0, 1, 2, 3, 4, 5, 6, 12, 18, 24, 11, 17, 21, 22, 23, 25, 27, 31, 32, 33],
        destination: [10, 26],
    },
    three: {
        size: 8,
        self: 10,
        box: [27, 37, 42],
        wall: [1, 2, 3, 4, 5, 6, 9, 14, 17, 21, 22, 23, 24, 25, 31, 32, 36, 39, 40, 44, 47, 48, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        destination: [11, 12, 13],
    },
    four: {
        size: 8,
        self: 28,
        box: [21, 27, 34],
        wall: [2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 20, 23, 24, 31, 32, 35, 39, 40, 45, 46, 47, 48, 53, 56, 57, 58, 59, 60, 61],
        destination: [19, 26, 43],
    },
    five: {
        size: 8,
        self: 43,
        box: [19, 27, 36],
        wall: [2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 20, 23, 24, 31, 32, 35, 37, 39, 40, 41, 47, 49, 50, 55, 58, 59, 60, 61, 62, 63],
        destination: [13, 18, 26],
    },
}

// 创建地图
function createdMap(num) {
    let createTd = '';
    let createTr = '';
    // 创建td
    for (let i = 0; i < num; i++) {
        const td = '<td></td>'
        createTd += td;
    }
    // 创建tr
    for (let i = 0; i < num; i++) {
        // 把创建好的td放入tr
        const tr = '<tr>' + createTd + '</tr>';
        createTr += tr;
    }
    // 把创建好的tr和td放到table里面
    map.innerHTML = createTr;
    //获取所有单元格
    allTd = document.querySelectorAll('.map tr td')
}
//创建目标
function destination() {
    const destination = document.createElement('div');
    destination.classList.add('destination');
    destination.setAttribute('destination', 'destination');
    return destination;
}

// 布置
function arrange(level) {
    // 创建地图
    createdMap(level.size);
    // 创建自己
    allTd[level.self].classList.add('self');
    allTd[level.self].setAttribute('data-target', 'self');
    // 创建箱子
    level.box.forEach(item => {
        allTd[item].classList.add('box');
        allTd[item].setAttribute('data-target', 'box');
    });
    // 创建墙体
    level.wall.forEach(item => {
        allTd[item].classList.add('wall');
        allTd[item].setAttribute('data-target', 'wall');
    });
    // 创建目标
    level.destination.forEach(item => {
        allTd[item].appendChild(destination());
    });
}
arrange(level.one);
//开局提示
function tip(){alert("使用‘↑’‘↓’‘←’‘→’键移动神乐~")}
setTimeout(tip,500);

// 获取旁边上左下右的四个相邻td元素
function getSelfBeside(target) {
    // 获取空格子左边的元素
    const Left = target.previousElementSibling || null;
    // 获取空格子右边的元素
    const Right = target.nextElementSibling || null;
    // 获取空格子上边的元素
    let Up;
    if (target.parentElement.previousElementSibling) {
        Up = target.parentElement.previousElementSibling.children[target.cellIndex];
    } else {
        Up = null;
    }
    // 获取空格子下边的元素
    let Down;
    if (target.parentElement.nextElementSibling) {
        Down = target.parentElement.nextElementSibling.children[target.cellIndex];
    } else {
        Down = null;
    }
    // 返回空格子旁边上左下右的四个相邻td元素
    return {
        Left,
        Right,
        Up,
        Down
    };
}
// 自己移动
function selfMove(direction, self) {
    direction.classList.add('self');
    direction.setAttribute('data-target', 'self');
    self.classList.remove('self');
    self.removeAttribute('data-target');
}
// 箱子移动
function boxMove(direction, double) {
    direction.classList.remove('box');
    direction.removeAttribute('data-target');
    double.classList.add('box');
    double.setAttribute('data-target', 'box');
}
// 操作
function operate(direction, double) {
    // 前方 没有空余位置 或 有墙体，则返回
    if (direction == null || direction.getAttribute('data-target') == 'wall') return;
    // 如果前方有箱子
    if (direction.getAttribute('data-target') == 'box') {
        // 前方的前方 没有空余位置 或 有箱子 或 有墙体，则返回
        if (double == null || double.getAttribute('data-target') == 'box' || double.getAttribute(
            'data-target') == 'wall') return;
        boxMove(direction, double);
    }
    selfMove(direction, self);
    ifVictory();
}

// 当按下相应的按键时，触发相应的操作
document.addEventListener('keydown', event => {
    self = document.querySelector('.map tr td[data-target="self"]');
    // 获取自己旁边的四个相邻td元素，并解构赋值
    let {
        Left,
        Right,
        Up,
        Down
    } = getSelfBeside(self);
    // 获取双倍距离
    doubleUp = Up ? getSelfBeside(Up).Up : null;
    doubleDown = Down ? getSelfBeside(Down).Down : null;
    doubleLeft = Left ? getSelfBeside(Left).Left : null;
    doubleRight = Right ? getSelfBeside(Right).Right : null;
    // 操作
    if (event.key == 'ArrowUp') {
        operate(Up, doubleUp);
    } else if (event.key == 'ArrowDown') {
        operate(Down, doubleDown);
    } else if (event.key == 'ArrowLeft') {
        operate(Left, doubleLeft);
    } else if (event.key == 'ArrowRight') {
        operate(Right, doubleRight);
    }
});
function switchLevel(currentLevel) {
    switch (currentLevel) {
        case "one":
            return "two,2";
        case "two":
            return "three,3";
        case "three":
            return "four,4";
        case "four":
            return "five,5";
        case "five":
            return "one,1";
        default:
            return "one,1"; // 默认返回第一关
    }
}
// 更新关卡并重新开始游戏
function updateLevelAndRestart(nextLevel) {
    alert(`恭喜!你通过了第${selectLevel.value.split(',')[1]}关~`);
    selectLevel.value = nextLevel;
    currentLevel = nextLevel.split(',')[0];
    arrange(level[currentLevel]);
}

// 选择关卡
selectLevel.addEventListener('change', function () {
    arrange(level[`${selectLevel.value.split(',')[0]}`]);
});
// 点击按钮重置
reset.addEventListener('click', function () {
    arrange(level[`${selectLevel.value.split(',')[0]}`]);
});


//统计与胜利
function ifVictory() {
    let destinationNum = 0;
    let allDestination = document.querySelectorAll('.destination');
    allDestination.forEach(item => {
        item.classList.remove('destinationFinish','destinationSelf');
        if (item.parentElement.getAttribute('data-target') === 'box') {
            item.classList.add('destinationFinish');
            destinationNum++;
        }
        if(item.parentElement.getAttribute('data-target') === 'self'){
            item.classList.add('destinationSelf');
        }
    });
    if (destinationNum >= allDestination.length) {
        setTimeout(() => {
            updateLevelAndRestart(switchLevel(currentLevel));
        }, 100);
    }
}

