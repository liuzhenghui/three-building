import { useEffect, useState } from "react"

function UseOrbitControls(props) {
    const { renderer, scene, camera } = props

    const [control, setControl] = useState()

    useEffect(() => {
        if (camera && renderer) {
            const orbit = new ThreeAddons.OrbitControls(camera, renderer.domElement);
            orbit.update();
            orbit.addEventListener('change', () => {
                console.log('orbit change', camera.position)
                renderer.render(scene, camera);
            });

            setControl(orbit)
        }

    }, [renderer, scene, camera])

    return control
}

export default UseOrbitControls