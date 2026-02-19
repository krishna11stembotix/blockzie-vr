
import * as THREE from 'three';

/**
 * Generates a low-poly city environment.
 * @param {THREE.Scene} scene 
 */
export function createCity(scene) {
    createGround(scene);
    createBuildings(scene);
    createTrees(scene);

    // Add some environmental fog
    scene.fog = new THREE.Fog(0xd0dce8, 10, 60);
}

function createGround(scene) {
    // Road/Asphalt base
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(planeGeometry, planeMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid visual for the central playground area
    const gridHelper = new THREE.GridHelper(20, 20, 0x555555, 0x444444);
    gridHelper.position.y = 0.01; // Slightly above ground
    scene.add(gridHelper);
}

function createBuildings(scene) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0); // Pivot at bottom

    // Pastel/City colors
    const colors = [
        0xFFAA00, // Orange
        0x00AAFF, // Blue
        0xFFFFFF, // White
        0xAAFF00, // Lime
        0xFF00AA  // Pink
    ];

    const count = 400;
    const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshStandardMaterial({ flatShading: true }), count);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    let i = 0;
    // Iterate over a grid to place buildings outside center
    for (let x = -50; x <= 50; x += 4) {
        for (let z = -50; z <= 50; z += 4) {
            // Keep center (d < 15) and roads clear
            if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;

            // Random chance to skip (roads)
            if (Math.random() > 0.7) continue;

            if (i >= count) break;

            const h = 1 + Math.random() * 8; // Height variation

            dummy.position.set(x, 0, z);
            dummy.scale.set(3, h, 3);
            dummy.updateMatrix();

            mesh.setMatrixAt(i, dummy.matrix);

            // Random City Colors
            const hex = colors[Math.floor(Math.random() * colors.length)];
            mesh.setColorAt(i, color.setHex(hex));

            i++;
        }
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
}

function createTrees(scene) {
    const treeCount = 80;

    // Simple Geometry
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const foliageGeo = new THREE.ConeGeometry(0.8, 1.5, 8);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });

    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const foliageMesh = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < treeCount; i++) {
        // Random placement in outskirts
        const angle = Math.random() * Math.PI * 2;
        const r = 16 + Math.random() * 30; // 16 to 46 units out
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);

        // Trunk
        dummy.position.set(x, 0.5, z);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        trunkMesh.setMatrixAt(i, dummy.matrix);

        // Foliage
        dummy.position.set(x, 1.5, z); // Above trunk
        dummy.scale.set(1.5, 1.5, 1.5); // Slightly larger foliage
        dummy.updateMatrix();
        foliageMesh.setMatrixAt(i, dummy.matrix);
    }

    scene.add(trunkMesh);
    scene.add(foliageMesh);
}
