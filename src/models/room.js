// 房间模型

const objs = []

var matArrayB = [];//外墙

function initMatArray() {
    matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca }));  //前  0xafc0ca :灰色
    matArrayB.push(new THREE.MeshPhongMaterial({ color: 0x9cb2d1 }));  //后  0x9cb2d1：淡紫
    matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xd6e4ec }));  //上  0xd6e4ec： 偏白色
    matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xd6e4ec }));  //下
    matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca }));  //左   0xafc0ca :灰色
    matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca }));  //右
}

function createWall(width, height, depth, angle, material, x, y, z) {
    var cubeGeometry = new THREE.BoxGeometry(width, height, depth);
    var cube = new THREE.Mesh(cubeGeometry, material);
    cube.position.set(x, y, z)
    cube.rotation.y += angle * Math.PI;  //-逆时针旋转,+顺时针
    return cube
}

function createFloor(width, height, depth) {
    return new Promise((resolve, reject) => {
        var loader = new THREE.TextureLoader();
        loader.load("/ecodestatic/test/resources/${appId}/floor.jpg", function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(5, 5);
            var floorGeometry = new THREE.BoxGeometry(width, height, depth);
            var floorMaterial = new THREE.MeshBasicMaterial({ color: 0Xe2e2e2, map: texture, side: THREE.DoubleSide });
            var floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.y = 0.5
            resolve(floor);
        });
    })
}

function createFront(width, height, depth, angle, material, x, y, z) {
    const shape = new THREE.Shape();
    // .lineTo(100, 0)绘制直线线段，线段起点：.currentPoint，线段结束点：(100,0)
    shape.lineTo(width, 0);
    shape.lineTo(width, height);
    shape.lineTo(0, height);

    // 门孔
    const hw = width * 0.5
    const hh = height * 0.9

    const startX = (width - hw) / 2
    const startY = (height - hh) / 2
    const hp = new THREE.Path();
    hp.moveTo(startX, startY);
    hp.lineTo(startX + hw, startY);
    hp.lineTo(startX + hw, startY + hh);
    hp.lineTo(startX, startY + hh);
    //三个内孔轮廓分别插入到holes属性中
    shape.holes.push(hp);

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: depth });

    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    // cube.rotation.y += angle * Math.PI;  //-逆时针旋转,+顺时针
    return cube
}

function create(x, y, z) {
    initMatArray();

    const group = new THREE.Group();

    const roomWidth = 200
    const roomHeight = 20
    const roomDepth = 100
    const wallDepth = 1

    // 地板
    createFloor(roomWidth, wallDepth, roomDepth).then(floor => {
        floor.name = '地板'
        objs.push(floor)
        group.add(floor)
    })

    // 墙面1 立方体比较长的面  左一
    const wall1 = createWall(wallDepth, roomHeight, roomDepth, 0, matArrayB, -roomWidth / 2, roomHeight / 2, 0);
    wall1.name = '左外墙'
    objs.push(wall1)
    group.add(wall1)

    // 墙面2  立方体比较长的面   右一
    const wall2 = createWall(wallDepth, roomHeight, roomDepth, 1, matArrayB, roomWidth / 2, roomHeight / 2, 0);
    wall2.name = '右外墙'
    objs.push(wall2)
    group.add(wall2)

    // 墙面3 门对面的墙 立方体比较短的面
    const wall3 = createWall(wallDepth, roomHeight, roomWidth, 1.5, matArrayB, 0, 10, -roomDepth / 2);
    wall3.name = '后外墙'
    objs.push(wall3)
    group.add(wall3)

    // 门面
    const front = createFront(roomWidth, roomHeight, wallDepth, 0, matArrayB, -roomWidth / 2, 0, roomDepth / 2);
    wall1.name = '前外墙'
    objs.push(front)
    group.add(front)

    return { objs, root: group }
}

export default {
    objs,
    create,
}