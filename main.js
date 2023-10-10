
import { scene, camera, renderer, controls } from './utils/init'

import * as THREE from 'three'

// import guiMove from './utils/gui'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'

const group = new THREE.Group() // 当前空间中所有标记


// 定义数据对象相关属性和值
// 准备创建纹理相关贴图函数
// 准备创建地上热点标记函数
// 准备dat.gui工具函数调整位置
const sceneInfoObj = {
  one: { // 第一个场景的数据
    publicPath: 'technology/1/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [ // 当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], // 平面的宽高
        position: [-0.46,-0.11,-0.11], // 位置
        rotation: [1.42,0.68,1.63], // 旋转角度值
        targetAttr:'two', // 点击向two场景切换
      }
    ]
  },
  two: {
    publicPath: 'technology/2/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [ // 当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], // 平面的宽高
        position: [0.47, -0.2, 0], // 位置
        rotation: [1.48, 0.26, -1.78], // 旋转角度值
        targetAttr: 'one',
      },
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], // 平面的宽高
        position: [-0.46,-0.16,-0.3], // 位置
        rotation: [1.21,0.78,0], // 旋转角度值
        targetAttr:'three', // 点击向two场景切换
      }
    ]
  },
  three: {
    publicPath: 'technology/3/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [ // 当前空间中所有标记信息对象
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], // 平面的宽高
        position: [0.4, -0.18, 0.32], // 位置
        rotation: [-1.53, -0.04, -1.26], // 旋转角度值
        targetAttr: 'two',
      },
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05], // 平面的宽高
        position: [0.32,-0.16,-0.33], // 位置
        rotation: [1.46,0.1,-0.17], // 旋转角度值
        targetAttr:'four', // 点击向two场景切换
      }
    ]
  },
  four: {
    publicPath: 'technology/4/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.05, 0.05],
        position: [-0.35, -0.22, 0.4],
        rotation: [-0.85, -0.45, -1.8],
        targetAttr: 'three' // 目标场景信息对象属性
      },
      {
        name: 'dom',
        position: [0.49, 0, 0],
        rotation: [0, -0.5 * Math.PI, 0],
        targetAttr: 'five', // 目标场景信息对象属性
        active(e) {
          setMateralCube(sceneInfoObj.five)
        }
      }
    ]
  },
  five: {
    publicPath: 'technology/5/',
    imgUrlArr: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    markList: [
      {
        name: 'landMark',
        imgUrl: 'other/landmark.png',
        wh: [0.03, 0.03],
        position: [-0.05, -0.05, 0.4],
        rotation: [1.21, -0.15, -0.69],
        targetAttr: 'four' // 目标场景信息对象属性
      },
      {
        name: 'video',
        imgUrl: 'video/movie.mp4',
        wh: [0.2, 0.1],
        position: [0.49, 0.04, 0.045],
        rotation: [0, -0.5 * Math.PI, 0],
        voice:{
          imgUrl1: 'other/novoice.png',
          imgUrl2: 'other/voice.png',
          p: [0.49, -0.04, 0.13],
          r: [0, -0.5 * Math.PI, 0]
        }
      }
    ]
  },

}

function createCube(){
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
  const cube = new THREE.Mesh(geometry, material)
  cube.scale.set(1, 1, -1)
  scene.add(cube)
  return cube
}

// 渲染下个场景清除上个场景的热点标记
function clear(){
  const list = [...group.children]
  console.log(list)
  list.forEach(obj=>{
    // 存在dom创建的3d对象
    if(!obj.isObject3D){
      obj.geometry.dispose()
      obj.material.dispose()
    }
    group.remove(obj)
  })
}

// 准备创建纹理相关贴图函数
function setMateralCube(infoObj){
  clear() // 清除上个场景间的标记
  const { publicPath, imgUrlArr, markList } = infoObj
  const textureLoader = new THREE.TextureLoader()
  // 设置当前纹理加载器公共基础路径
  textureLoader.setPath(publicPath)

  // 遍历纹理图片->映射成纹理对象->贴到立方体上
  const materialArr = imgUrlArr.map(imgStr=>{
    const texture = textureLoader.load(imgStr)
    // 图片颜色很浅 处理：three.js颜色通道为rgb颜色
    texture.colorSpace = THREE.SRGBColorSpace // 防止图片太浅了
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
  })
  cubeObj.material = materialArr

  // 4.3 准备创建地上热点标记函数
  markList.forEach(markObj => {
    // 如果是地上的热点标记，调用对应函数传递标记信息对象
    if(markObj.name === 'landMark') createLandMark(markObj)
    // 原生dom标记
    else if(markObj.name === 'dom') createDomMark(markObj)
    //video标记
    else if(markObj.name === 'video') createVideoMark(markObj)
    
    // 等待上边循环往组里加入当前场景所有标记物体后，把组放到场景中一起渲染
    scene.add(group)
    // 

  });
}

function createLandMark(infoObj){
  const {imgUrl, wh, position, rotation, targetAttr} = infoObj
  const geometry = new THREE.PlaneGeometry(...wh)
  const material = new THREE.MeshBasicMaterial({
    map: (new THREE.TextureLoader()).load(imgUrl),
    side: THREE.DoubleSide,
    transparent: true // 透明纹理 （镂空图只展示白色区域内容）
  })
  const mesh = new THREE.Mesh(geometry, material)
  // console.log(mesh)
  mesh.position.set(...position)
  mesh.rotation.set(...rotation)
  // 给地上热点标记添加名字-方便点击的时候进行区分
  mesh.name = 'mark'
  // three.js 3d物体也可以自定义属性和值（方便后续获取这个绑定的数据）
  // 绑定这个热点标记要切换到那个场景的信息对象
  mesh.userData.attr = targetAttr
  group.add(mesh)

  // guiMove(mesh)
}

function bindClick(){
  // 定义光线投射对象
  const rayCaster = new THREE.Raycaster()
  // 定义二维向量对象（保存转换后的平面 x，y 坐标值）
  const pointer = new THREE.Vector2()
  // 与3d物体交互事件绑定
  window.addEventListener('click', e=>{
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = - (e.clientY / window.innerHeight) * 2 + 1

     // 更新摄像机和鼠标之间的连线（位置）
     rayCaster.setFromCamera(pointer, camera)
     // 获取这条线穿过了哪些物体，收集成一个数组
     const list = rayCaster.intersectObjects(scene.children)
     // 查找到我点击热点标记的物体
     const obj = list.find(obj=>obj.object.name === 'mark')
     if(!obj){
       return
     }
    //  console.log(obj)
     // 提取物体上绑定的自定义属性 attr 切换我们的场景
     // 切换纹理 重新创建当前场景下的热点标记
     const infoObj = sceneInfoObj[obj.object.userData.attr]
     setMateralCube(infoObj)
  })
}

function createDomMark(infoObj){
  // console.log('infoObj',infoObj)
  const {position, rotation, active} = infoObj
  const tag = document.createElement('span')
  tag.className = 'mark-style'
  tag.innerHTML = '前进'
  // 类型1：原生 DOM 使用原生的事件绑定（设置 pointerEvents='all')
  tag.style.pointerEvents = 'all'
  tag.addEventListener('click', e => {
    // 为了保证这个函数调用，回调数据对象中的函数代码
    active(e)
  })
  // 原生标签的 px 的值会平移到 3d 空间中作为单位
  const tag3d = new CSS3DObject(tag) // 转3d对象
  tag3d.scale.set(1 / 800, 1 / 800, 1 / 800)
  tag3d.position.set(...position)
  tag3d.rotation.set(...rotation)
  group.add(tag3d)
}
function createVideoMark(infoObj){
  const { imgUrl, wh, position, rotation,voice} = infoObj
  // 原生的video
  const video = document.createElement('video')
  video.src = imgUrl
  // 默认静音
  video.muted = true
  // 加载完成播放
  video.addEventListener('loadedmetadata',()=>{
    video.play()
  })
  // 需要一个平面缓存几何体
  const plane = new THREE.PlaneGeometry(...wh)
  const material = new THREE.MeshBasicMaterial({
    map:(new THREE.VideoTexture(video))
  })
  const mesh = new THREE.Mesh(plane, material)
  mesh.position.set(...position)
  mesh.rotation.set(...rotation)
  group.add(mesh)

  // 播放按钮控制播放
  const { imgUrl1, imgUrl2, p, r} = voice
  const VoiceImg = document.createElement('img')
  const spanImg = document.createElement('span')
  spanImg.className = 'voice-style'
  spanImg.appendChild(VoiceImg)
  VoiceImg.src = imgUrl1
  VoiceImg.style.pointerEvents = 'all'
  VoiceImg.style.cursor = 'pointer'
  spanImg.addEventListener('click', e => {
    // 为了保证这个函数调用，回调数据对象中的函数代码
    video.muted = !video.muted // 关闭静音
    VoiceImg.src = video.muted?imgUrl1:imgUrl2
  })
  // 原生标签的 px 的值会平移到 3d 空间中作为单位
  const tag3d = new CSS3DObject(spanImg) // 转3d对象
  tag3d.scale.set(1 / 1200, 1 / 1200, 1 / 1200)
  tag3d.position.set(...p)
  tag3d.rotation.set(...r)
  group.add(tag3d)
}


const cubeObj = createCube()
setMateralCube(sceneInfoObj.one) // 默认先渲染第一个场景信息
bindClick()