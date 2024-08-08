import {useEffect, useState} from "react";

const updateMaterial = (obj, color) => {
    const objects = []
    if (obj) {
        if (obj) {
            if (obj.type === 'Group') {
                obj.traverse?.(child => {
                    if (child.isObject3D) {
                        objects.push(child)
                    }
                })
            } else {
                objects.push(obj)
            }
        }
        objects.forEach(obj => {
            if (obj.material) {
                obj.userData = {...obj.userData, materialOriginal: obj.material}
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
                materials.forEach(it => {
                    const material = it.clone()
                    material.color.setHex(color)
                    material.opacity = 0.6
                    material.transparent = true
                    material.depthWrite = false
                    obj.material = material
                })
            }
        })
    }
    return objects
}

function UseSelectHighlight(props) {
    const {renderer, scene, camera, objectSelected} = props

    const [objectsHighlight, setObjectsHighlight] = useState([])

    useEffect(() => {
        if (renderer && scene && camera) {
            // 还原上一次高亮物体
            objectsHighlight.forEach(obj => {
                obj.material = obj.userData?.materialOriginal
            })

            const objects = updateMaterial(objectSelected, 0xfff000)
            setObjectsHighlight(objects)
        }

    }, [renderer, scene, camera, objectSelected])

    return objectsHighlight
}

export default UseSelectHighlight