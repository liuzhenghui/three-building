import {useEffect, useState} from "react";

function UseSelectObject(props) {
    const {renderer, scene, camera, objectsSelectable = []} = props

    const [selected, setSelected] = useState()

    useEffect(() => {
        if (camera && renderer) {
            const width = renderer.domElement.clientWidth
            const height = renderer.domElement.clientHeight

            const raycaster = new THREE.Raycaster()
            const handleClick = event => {
                const px = event.offsetX;
                const py = event.offsetY;
                const x = (px / width) * 2 - 1;
                const y = -(py / height) * 2 + 1;

                raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
                const intersects = raycaster.intersectObjects(objectsSelectable);
                console.log('select...', intersects, objectsSelectable)
                if (intersects.length > 0) {
                    let obj = intersects[0].object
                    console.log('selected', obj.name, obj)
                    while (obj && obj.type === 'Mesh') {
                        obj = obj.parent
                    }
                    setSelected(obj)
                } else {
                    setSelected(undefined)
                }
            }
            renderer.domElement.addEventListener('click', handleClick)

            return () => {
                renderer && renderer.domElement.removeEventListener('click', handleClick)
            }
        }

    }, [renderer, scene, camera, objectsSelectable])

    return selected
}

export default UseSelectObject