import {useEffect, useRef, useCallback, useState} from "react";

import useRenderer from '../../hooks/three/UseRenderer'
import useOrbitControls from '../../hooks/three/UseOrbitControls'
import useTransformControls from '../../hooks/three/UseTransformControls'
import useSelectObject from "../../hooks/three/UseSelectObject";
import useOutlinePass from "../../hooks/three/UseOutlinePass";
import useSelectHighlight from "../../hooks/three/UseSelectHighlight";
import useFloors from "../../hooks/three/UseFloors";

function ThreeRenderer(props) {

    const canvasRef = useRef()
    const sceneRef = useRef()
    const [canvas, setCanvas] = useState()
    const [objs, setObjs] = useState([])
    const [objectsSelectable, setObjectsSelectable] = useState([])

    const callbackRef = useCallback((ref) => {
        if (!ref) return;
        canvasRef.current = ref;
        setCanvas(ref)
    }, [])

    // canvas 大小
    const dom = document.getElementsByClassName('three-renderer')
    const width = dom.length ? dom[0].clientWidth : 100;
    const height = dom.length ? dom[0].clientHeight : 100;

    console.log('ThreeRenderer width,height', width, height)
    const {renderer, scene, camera} = useRenderer({canvas, width, height})

    //
    const objectSelected = useSelectObject({renderer, scene, camera, objectsSelectable})
    useOrbitControls({renderer, scene, camera})
    useSelectHighlight({renderer, scene, camera, objectSelected})

    useFloors({renderer, scene, camera})

    useEffect(() => {
        if (typeof props.onLoad === 'function') {
            props.onLoad(scene)
        }

        if (scene) {
            // 加载模型
            const dracoLoader = new ThreeAddons.DRACOLoader()
            dracoLoader.setDecoderPath('resources/draco/')
            const gltfLoader = new ThreeAddons.GLTFLoader()
            gltfLoader.setDRACOLoader(dracoLoader);

            const allObjects = [];
            ['zhong.glb', 'zuo.glb', 'shu.glb', 'dimian.glb', 'zjc.glb'].forEach(file => {
                gltfLoader.load(`resources/models/${file}`, gltf => {
                    scene.add(gltf.scene)

                    gltf.scene.traverse(child => {
                        if (child.isObject3D) {
                            child.receiveShadow = true
                            console.log('traverse', child.name, child)
                            if (['zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5', 'zuoding'].indexOf(child.name) >= 0) {
                                allObjects.push(child);
                            }
                        }
                    })
                })
            })

            setObjectsSelectable(allObjects)
        }

    }, [scene])

    return (
        <div className="three-renderer" style={{overflow: 'hidden'}}>
            <canvas ref={callbackRef}></canvas>
        </div>
    )
}

export default ThreeRenderer