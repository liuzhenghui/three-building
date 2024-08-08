import {useEffect, useState} from "react";

function UseOutlinePass(props) {
    const {renderer, scene, camera, objectSelected} = props

    const [outlinePass, setOutlinePass] = useState()
    const [selectedLast, setSelectedLast] = useState()

    useEffect(() => {
        if (renderer && scene && camera) {
            const width = renderer.domElement.clientWidth
            const height = renderer.domElement.clientHeight

            const composer = new ThreeAddons.EffectComposer(renderer);
            const renderPass = new ThreeAddons.RenderPass(scene, camera);
            composer.addPass(renderPass);
            const outlinePass = new ThreeAddons.OutlinePass(new THREE.Vector2(width, height), scene, camera);
            outlinePass.visibleEdgeColor.set(0xff0000); // 可见边缘颜色
            outlinePass.hiddenEdgeColor.set(0xffffff); // 隐藏边缘颜色
            outlinePass.edgeStrength = 5; // 边缘强度
            outlinePass.edgeThickness = 100; // 边缘厚度

            if (selectedLast) {
                selectedLast.userData = {
                    ...selectedLast.userData,
                    hasOutline: false
                }
                outlinePass.selectedObjects = scene.children.filter(item => item.userData.hasOutline);
                composer.removePass(outlinePass);
            }

            if (objectSelected) {
                objectSelected.userData = {
                    ...objectSelected.userData,
                    hasOutline: true
                }
                outlinePass.selectedObjects = scene.children.filter(item => item.userData.hasOutline);
                composer.addPass(outlinePass);
            }

            setSelectedLast(objectSelected)
            setOutlinePass(outlinePass)
        }

    }, [renderer, scene, camera, objectSelected])

    return outlinePass
}

export default UseOutlinePass