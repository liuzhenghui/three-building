import { useEffect, useRef, useState } from "react"

function UseRenderer(props) {
    console.log('UseRenderer props', props)
    const { canvas, width, height } = props

    const [renderer, setRenderer] = useState()
    const [scene, setScene] = useState()
    const [camera, setCamera] = useState()

    useEffect(() => {

        if (canvas) {
            const scene = new THREE.Scene()

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            renderer.setSize(width, height);
            renderer.setClearColor(0x4682B4, 0.6);
            renderer.setClearAlpha(0.6)
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(150, 80, 187);
            camera.lookAt(scene.position);
            scene.add(camera);

            // 灯光
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);   // 模拟远处类似太阳的光源
            directionalLight.position.set(0, 100, 0).normalize();
            scene.add(directionalLight);
            const ambient = new THREE.AmbientLight(0xffffff, 1);    // AmbientLight,影响整个场景的光源
            ambient.position.set(0, 0, 0);
            scene.add(ambient);

            // 渲染
            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();

            setRenderer(renderer)
            setScene(scene)
            setCamera(camera)
        }

    }, [canvas])

    return {
        renderer,
        scene,
        camera,
    }
}

export default UseRenderer