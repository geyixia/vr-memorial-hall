// 封装调整物体位置和旋转角度的，图形用户页面
import * as dat from 'dat.gui'

const gui = new dat.GUI()

export default function guiMove(obj){
    gui.add(obj.position, 'x', -1, 1, 0.01).name('位移x')
    gui.add(obj.position, 'y', -1, 1, 0.01).name('位移y')
    gui.add(obj.position, 'z', -1, 1, 0.01).name('位移z')

    gui.add(obj.rotation, 'x', 0, 2 * Math.PI, 0.01).name('旋转 x')
    gui.add(obj.rotation, 'y', 0, 2 * Math.PI, 0.01).name('旋转 y')
    gui.add(obj.rotation, 'z', 0, 2 * Math.PI, 0.01).name('旋转 z')
}