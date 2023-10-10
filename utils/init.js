// 目标：初始化three.js的基础环境
import * as THREE from 'three'
// 轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// css
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'

// 准备一些必要的全局属性
export let scene, camera, renderer, controls, css3dRenderer;

// 自调用函数
(function init(){

    scene = new THREE.Scene()
    // 透视相机
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    // 全景摄像机的位置要在里面 0.1的位置
    camera.position.z = 0.1
    // 创建渲染器，抗锯齿
    renderer = new THREE.WebGLRenderer({antialias:true})
    // 并设置画布大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 添加dom显示
    document.body.appendChild(renderer.domElement)
})();
 
(function controlsCreate(){
    // 轨道控制器
    controls = new OrbitControls( camera, renderer.domElement );
    // // 1、阻尼效果
    controls.enableDamping = true // 必须要有controls.update(); 才可以生效
    // 限制轨道控制器 垂直角度和缩放
    controls.minPolarAngle = 0.25 * Math.PI // 看到部分地面
    // 禁止缩放
    controls.enableZoom = false
})();

(function create3dRenderer(){
    css3dRenderer = new CSS3DRenderer()
    css3dRenderer.setSize(window.innerWidth, window.innerHeight)
    css3dRenderer.domElement.style.pointerEvents = 'none' // 在none条件下让标签触发鼠标交互事件 不让它与鼠标交互
    css3dRenderer.domElement.style.position = 'fixed' // 放到外层
    css3dRenderer.domElement.style.left = '0' 
    css3dRenderer.domElement.style.top = '0' 
    document.body.appendChild(css3dRenderer.domElement)
})();

(function createHelper(){
    // // 创建辅助坐标轴 5单位
    // const axesHelper = new THREE.AxesHelper(5);
    // // 添加到场景中去
    // scene.add( axesHelper );
})();

(function renderResize(){
    // 创建适配函数，监听浏览器resize事件
    window.addEventListener('resize', () => {
        // 调整渲染器画布大小，摄像机宽高比和更新视锥体空间
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        // 更新视锥体空间
        camera.updateProjectionMatrix()
    })
})();


(function renderLoop(){
    // 在循环渲染中更新场景渲染
    // 传入场景摄像机渲染画面
    renderer.render(scene, camera)
    // 手动用js代码更新过摄像机信息，必须调用轨道控制器
    controls.update();
    // 也要让 DOM 渲染器不断更新不同角度的最新画面
    css3dRenderer.render(scene, camera)
    // 浏览器刷新帧率后执行
    // 好处：当前页面暂停到后台结束递归
    requestAnimationFrame(renderLoop)
})();