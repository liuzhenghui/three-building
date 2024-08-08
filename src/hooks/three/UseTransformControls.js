import { useEffect, useState } from "react"

let selected

function UseTransformControls(props) {
    const { renderer, scene, camera, objs = [] } = props

    const [control, setControl] = useState()

    useEffect(() => {
        if (camera && renderer) {
            const control = new ThreeAddons.TransformControls(camera, renderer.domElement)
            const width = renderer.domElement.clientWidth
            const height = renderer.domElement.clientHeight

            control.addEventListener('change', function () {
                console.log('transformControls change')
            })

            if (objs.length) {
                control.attach(objs[0])
            }

            const raycaster = new THREE.Raycaster()
            const handleClick = event => {
                const px = event.offsetX;
                const py = event.offsetY;
                const x = (px / width) * 2 - 1;
                const y = -(py / height) * 2 + 1;

                raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersects = raycaster.intersectObjects(objs);
                if (intersects.length > 0) {
                    console.log('objs', objs, intersects, (selected != intersects[0].object))
                    if (selected != intersects[0].object) {
                        selected = intersects[0].object
                        control.attach(selected)
                        console.log('control.attach', selected)
                        renderer.render(scene, camera)
                    }
                } else {
                    selected && control.detach(selected)
                }
            }
            renderer.domElement.addEventListener('click', handleClick)

            scene.add(control)
            setControl(control)

            return () => {
                renderer && renderer.domElement.removeEventListener('click', handleClick)
            }
        }

    }, [renderer, scene, camera, objs])


    return control
}

export default UseTransformControls