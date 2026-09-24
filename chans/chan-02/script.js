import * as THREE from "three";

import {
    EffectComposer
} from "three/addons/postprocessing/EffectComposer.js";

import {
    RenderPass
} from "three/addons/postprocessing/RenderPass.js";

import {
    UnrealBloomPass
} from "three/addons/postprocessing/UnrealBloomPass.js";


import {
    lanternWishes,
    finalLetter
} from "./wishes.js";


/* ==========================================
   DOM
========================================== */

const app =
    document.getElementById("app");

const intro =
    document.getElementById("intro");

const startBtn =
    document.getElementById("startBtn");

const sceneUi =
    document.getElementById("sceneUi");

const sceneSubtitle =
    document.getElementById("sceneSubtitle");

const progressText =
    document.getElementById("progressText");

const finalBtn =
    document.getElementById("finalBtn");

const moveHint =
    document.getElementById("moveHint");


/* normal wish */

const wishOverlay =
    document.getElementById("wishOverlay");

const wishClose =
    document.getElementById("wishClose");

const wishTitle =
    document.getElementById("wishTitle");

const wishMessage =
    document.getElementById("wishMessage");

const wishImage =
    document.getElementById("wishImage");


/* final */

const finalOverlay =
    document.getElementById("finalOverlay");

const finalClose =
    document.getElementById("finalClose");

const finalTitle =
    document.getElementById("finalTitle");

const finalMessage =
    document.getElementById("finalMessage");

const finalImage =
    document.getElementById("finalImage");

const resetBtn =
    document.getElementById("resetBtn");


/* ==========================================
   DEVICE
========================================== */

const mobile =
    window.matchMedia(
        "(max-width: 700px)"
    ).matches;


/* ==========================================
   THREE SETUP
========================================== */

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x05040d
    );


scene.fog =
    new THREE.FogExp2(
        0x090515,
        0.044
    );


const camera =
    new THREE.PerspectiveCamera(
        46,
        innerWidth / innerHeight,
        0.1,
        100
    );


const cameraStart =
    new THREE.Vector3(
        0,
        mobile ? 3.0 : 3.15,
        mobile ? 17.0 : 16.0
    );


const cameraEnd =
    new THREE.Vector3(
        0,
        mobile ? 2.35 : 2.45,
        mobile ? 14.0 : 12.2
    );


camera.position.copy(
    cameraStart
);


const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        powerPreference:
            "high-performance"

    });

const backBtn =
    document.getElementById("backBtn");


renderer.setPixelRatio(

    Math.min(
        devicePixelRatio,
        mobile ? 1.5 : 2
    )

);


renderer.setSize(
    innerWidth,
    innerHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    1.15;


renderer.shadowMap.enabled =
    !mobile;


app.appendChild(
    renderer.domElement
);


/* ==========================================
   BLOOM
========================================== */

const composer =
    new EffectComposer(
        renderer
    );


composer.addPass(

    new RenderPass(
        scene,
        camera
    )

);


const bloom =
    new UnrealBloomPass(

        new THREE.Vector2(
            innerWidth,
            innerHeight
        ),

        1.4,
        0.7,
        0.08

    );


composer.addPass(
    bloom
);


/* ==========================================
   WORLD
========================================== */

const world =
    new THREE.Group();


scene.add(
    world
);


/* ==========================================
   LIGHTS
========================================== */

scene.add(

    new THREE.HemisphereLight(
        0x8a7bb8,
        0x160b18,
        1.15
    )

);


const keyLight =
    new THREE.DirectionalLight(
        0xffd7bb,
        1.4
    );


keyLight.position.set(
    4,
    7,
    6
);


scene.add(
    keyLight
);


const pinkLight =
    new THREE.PointLight(
        0xff4fb2,
        20,
        12,
        2
    );


pinkLight.position.set(
    -0.5,
    3,
    1
);


scene.add(
    pinkLight
);


/* ==========================================
   HELPERS
========================================== */

function rand(
    min,
    max
) {

    return (
        min
        +
        Math.random()
        *
        (
            max - min
        )
    );

}


function makeGlowTexture() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        256;

    canvas.height =
        256;


    const c =
        canvas.getContext(
            "2d"
        );


    const gradient =
        c.createRadialGradient(
            128,
            128,
            0,
            128,
            128,
            128
        );


    gradient.addColorStop(
        0,
        "rgba(255,245,200,1)"
    );


    gradient.addColorStop(
        0.20,
        "rgba(255,210,130,.75)"
    );


    gradient.addColorStop(
        0.55,
        "rgba(255,130,75,.18)"
    );


    gradient.addColorStop(
        1,
        "rgba(255,100,50,0)"
    );


    c.fillStyle =
        gradient;


    c.fillRect(
        0,
        0,
        256,
        256
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.colorSpace =
        THREE.SRGBColorSpace;


    return texture;

}


const glowTexture =
    makeGlowTexture();


/* ==========================================
   STARS
========================================== */

{

    const count =
        mobile
            ? 400
            : 750;


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        positions[i * 3] =
            rand(-18, 18);


        positions[i * 3 + 1] =
            rand(0, 11);


        positions[i * 3 + 2] =
            rand(-18, -5);

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )

    );


    world.add(

        new THREE.Points(

            geometry,

            new THREE.PointsMaterial({

                color:
                    0xffe9f6,

                size:
                    0.035,

                transparent:
                    true,

                opacity:
                    0.82,

                depthWrite:
                    false

            })

        )

    );

}


/* ==========================================
   MOON
========================================== */

const moonGroup =
    new THREE.Group();


const moon =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            mobile ? 0.82 : 1.05,
            40,
            40
        ),

        new THREE.MeshBasicMaterial({
            color:
                0xffefba
        })

    );


moonGroup.add(
    moon
);


const moonGlow =
    new THREE.Sprite(

        new THREE.SpriteMaterial({

            map:
                glowTexture,

            color:
                0xffd990,

            transparent:
                true,

            opacity:
                0.6,

            depthWrite:
                false,

            blending:
                THREE.AdditiveBlending

        })

    );


moonGlow.scale.set(
    6,
    6,
    1
);


moonGroup.add(
    moonGlow
);


moonGroup.position.set(
    mobile ? 3.2 : 4.3,
    5.3,
    -6.5
);


world.add(
    moonGroup
);


/* ==========================================
   ISLAND
========================================== */

function makeIsland() {

    const geometry =
        new THREE.IcosahedronGeometry(
            3.25,
            2
        );


    const positions =
        geometry.attributes.position;


    const v =
        new THREE.Vector3();


    for (
        let i = 0;
        i < positions.count;
        i++
    ) {

        v.fromBufferAttribute(
            positions,
            i
        );


        if (
            v.y < 0
        ) {

            const factor =
                THREE.MathUtils.mapLinear(
                    v.y,
                    -3.25,
                    0,
                    0.32,
                    1
                );


            v.x *= factor;
            v.z *= factor;

        }


        v.y *=
            v.y < 0
                ? 0.72
                : 0.30;


        v.x *=
            rand(
                0.95,
                1.05
            );


        v.z *=
            rand(
                0.95,
                1.05
            );


        positions.setXYZ(
            i,
            v.x,
            v.y,
            v.z
        );

    }


    geometry.computeVertexNormals();


    const rock =
        new THREE.Mesh(

            geometry,

            new THREE.MeshStandardMaterial({

                color:
                    0x291526,

                roughness:
                    0.95,

                flatShading:
                    true

            })

        );


    rock.position.y =
        -1.75;


    rock.scale.set(
        1.18,
        1,
        0.95
    );


    world.add(
        rock
    );


    const top =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                2.85,
                3,
                0.28,
                10
            ),

            new THREE.MeshStandardMaterial({

                color:
                    0x3d2235,

                roughness:
                    1,

                flatShading:
                    true

            })

        );


    top.position.y =
        -0.86;


    top.scale.z =
        0.87;


    world.add(
        top
    );

}


makeIsland();


/* ==========================================
   TREE
========================================== */

const tree =
    new THREE.Group();


world.add(
    tree
);


const tips = [];


const branchGeometry =
    new THREE.CylinderGeometry(
        0.68,
        1,
        1,
        7
    );


const branchMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x351326,

        roughness:
            0.9,

        flatShading:
            true

    });


const up =
    new THREE.Vector3(
        0,
        1,
        0
    );


function addBranch(
    start,
    direction,
    length,
    radius,
    depth
) {

    const end =
        start
            .clone()
            .add(

                direction
                    .clone()
                    .multiplyScalar(
                        length
                    )

            );


    const branch =
        new THREE.Mesh(
            branchGeometry,
            branchMaterial
        );


    branch.position
        .copy(start)
        .add(end)
        .multiplyScalar(0.5);


    branch.quaternion
        .setFromUnitVectors(

            up,

            direction
                .clone()
                .normalize()

        );


    branch.scale.set(
        radius,
        length,
        radius
    );


    tree.add(
        branch
    );


    if (
        depth <= 0
        ||
        length < 0.26
    ) {

        tips.push(
            end.clone()
        );

        return;

    }


    const childCount =
        depth >= 6
            ? 3
            : 2;


    for (
        let i = 0;
        i < childCount;
        i++
    ) {

        const sign =
            childCount === 2

                ? (
                    i === 0
                        ? -1
                        : 1
                )

                : i - 1;


        const child =
            direction.clone();


        child.applyAxisAngle(

            new THREE.Vector3(
                0,
                0,
                1
            ),

            rand(
                0.30,
                0.46
            )
            *
            sign

        );


        child.applyAxisAngle(

            new THREE.Vector3(
                0,
                1,
                0
            ),

            rand(
                -0.48,
                0.48
            )

        );


        child.normalize();


        addBranch(

            end,

            child,

            length
            *
            rand(
                0.67,
                0.76
            ),

            radius
            *
            0.72,

            depth - 1

        );

    }

}


addBranch(

    new THREE.Vector3(
        -0.45,
        -0.75,
        0
    ),

    new THREE.Vector3(
        0.05,
        1,
        0.02
    ).normalize(),

    2.45,

    0.22,

    mobile ? 6 : 7

);


/* ==========================================
   BLOSSOMS
========================================== */

const blossomGroup =
    new THREE.Group();


world.add(
    blossomGroup
);


function createBlossoms() {

    const amount =
        mobile
            ? 11
            : 17;


    const positions = [];
    const colors = [];


    const palette = [

        new THREE.Color(0xff4fd4),
        new THREE.Color(0xff79de),
        new THREE.Color(0xdb5cff),
        new THREE.Color(0xffb4eb),
        new THREE.Color(0xffffff)

    ];


    for (
        const tip
        of tips
    ) {

        for (
            let j = 0;
            j < amount;
            j++
        ) {

            const radius =
                Math.pow(
                    Math.random(),
                    0.55
                )
                *
                rand(
                    0.18,
                    0.62
                );


            const a =
                Math.random()
                *
                Math.PI
                *
                2;


            const b =
                Math.acos(
                    rand(-1, 1)
                );


            positions.push(

                tip.x
                +
                Math.sin(b)
                *
                Math.cos(a)
                *
                radius,

                tip.y
                +
                Math.cos(b)
                *
                radius
                *
                0.72,

                tip.z
                +
                Math.sin(b)
                *
                Math.sin(a)
                *
                radius

            );


            const color =
                palette[
                (
                    Math.random()
                    *
                    palette.length
                )
                |
                0
                ];


            colors.push(
                color.r,
                color.g,
                color.b
            );

        }

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(
            positions,
            3
        )

    );


    geometry.setAttribute(

        "color",

        new THREE.Float32BufferAttribute(
            colors,
            3
        )

    );


    blossomGroup.add(

        new THREE.Points(

            geometry,

            new THREE.PointsMaterial({

                size:
                    mobile
                        ? 0.15
                        : 0.18,

                vertexColors:
                    true,

                transparent:
                    true,

                opacity:
                    0.20,

                depthWrite:
                    false,

                blending:
                    THREE.AdditiveBlending

            })

        )

    );


    blossomGroup.add(

        new THREE.Points(

            geometry,

            new THREE.PointsMaterial({

                size:
                    mobile
                        ? 0.072
                        : 0.083,

                vertexColors:
                    true,

                transparent:
                    true,

                opacity:
                    0.98,

                depthWrite:
                    false,

                blending:
                    THREE.AdditiveBlending

            })

        )

    );

}


createBlossoms();


/* ==========================================
   LANTERN FACTORY
========================================== */

function makeLantern(
    scale,
    interactive = false
) {

    const group =
        new THREE.Group();


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xb3291e,

            emissive:
                0xff3f18,

            emissiveIntensity:
                2.5,

            roughness:
                0.44

        });


    const body =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.24,
                0.24,
                0.52,
                8
            ),

            bodyMaterial

        );


    body.scale.x =
        1.08;


    group.add(
        body
    );


    const capMaterial =
        new THREE.MeshStandardMaterial({
            color:
                0x6c231c
        });


    const capGeometry =
        new THREE.CylinderGeometry(
            0.18,
            0.18,
            0.06,
            8
        );


    const top =
        new THREE.Mesh(
            capGeometry,
            capMaterial
        );


    top.position.y =
        0.30;


    group.add(top);


    const bottom =
        top.clone();


    bottom.position.y =
        -0.30;


    group.add(bottom);


    const tassel =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.012,
                0.012,
                0.38,
                6
            ),

            new THREE.MeshBasicMaterial({
                color:
                    0xa93629
            })

        );


    tassel.position.y =
        -0.52;


    group.add(
        tassel
    );


    const glowMaterial =
        new THREE.SpriteMaterial({

            map:
                glowTexture,

            color:
                0xff5a2c,

            transparent:
                true,

            opacity:
                interactive
                    ? 0.52
                    : 0.30,

            depthWrite:
                false,

            blending:
                THREE.AdditiveBlending

        });


    const glow =
        new THREE.Sprite(
            glowMaterial
        );


    glow.scale.set(
        1.5,
        1.5,
        1
    );


    group.add(
        glow
    );


    /*
       invisible hitbox:
       giúp mobile dễ tap
    */

    if (
        interactive
    ) {

        const hitbox =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.48,
                    10,
                    10
                ),

                new THREE.MeshBasicMaterial({

                    transparent:
                        true,

                    opacity:
                        0.001,

                    depthWrite:
                        false

                })

            );


        group.add(
            hitbox
        );

    }


    group.scale.setScalar(
        scale
    );


    group.userData.isLantern =
        true;


    group.userData.interactive =
        interactive;


    group.userData.baseScale =
        scale;


    group.userData.hovered =
        false;


    group.userData.opened =
        false;


    group.userData.bodyMaterial =
        bodyMaterial;


    group.userData.glowMaterial =
        glowMaterial;


    return group;

}


/* ==========================================
   INTERACTIVE LANTERNS
========================================== */

const interactiveLanterns = [];

/* ==========================================
   SECRET LAST LANTERN
========================================== */

const SECRET_WISH_INDEX =
    lanternWishes.length - 1;

let secretLanternRevealed =
    false;


/*
   Mỗi wish tương ứng một vị trí.

   Đây là các đèn TO / GẦN.
*/

const lanternSlotsDesktop = [

    {
        x: -4.1,
        y: 1.55,
        z: 1.8,
        scale: 1.30
    },

    {
        x: 4.1,
        y: 1.50,
        z: 1.8,
        scale: 1.30
    },

    {
        x: -3.3,
        y: 3.65,
        z: 1.1,
        scale: 1.08
    },

    {
        x: 3.35,
        y: 3.70,
        z: 1.1,
        scale: 1.08
    },

    {
        x: -2.15,
        y: 5.15,
        z: 1.4,
        scale: 1.00
    },

    /* ĐÈN BÍ MẬT */
    {
        x: -0.45,
        y: 2.50,
        z: 2.70,
        scale: 1.25
    }

];


const lanternSlotsMobile =
    lanternSlotsDesktop
        .map(
            slot => ({

                ...slot,

                x:
                    slot.x * 0.58,

                y:
                    slot.y * 0.88,

                scale:
                    slot.scale * 0.90

            })
        );


const activeSlots =
    mobile
        ? lanternSlotsMobile
        : lanternSlotsDesktop;


lanternWishes
    .slice(
        0,
        activeSlots.length
    )
    .forEach(
        function (
            wish,
            index
        ) {

            const slot =
                activeSlots[index];


            const lantern =
                makeLantern(
                    slot.scale,
                    true
                );


            lantern.position.set(
                slot.x,
                slot.y,
                slot.z
            );


            lantern.userData.wish =
                wish;

            lantern.userData.wishIndex =
                index;

            lantern.userData.isSecret =
                index === SECRET_WISH_INDEX;


            /*
               Ẩn chiếc đèn cuối.
            */

            if (
                lantern.userData.isSecret
            ) {

                lantern.visible =
                    false;

            }


            world.add(
                lantern
            );


            interactiveLanterns.push({

                object:
                    lantern,

                baseX:
                    slot.x,

                baseY:
                    slot.y,

                speed:
                    rand(
                        0.04,
                        0.10
                    ),

                phase:
                    rand(
                        0,
                        Math.PI * 2
                    ),

                sway:
                    rand(
                        0.10,
                        0.23
                    )

            });

        }
    );


/* ==========================================
   DECORATIVE LANTERNS
========================================== */

const decorativeLanterns = [];


const decorativeCount =
    mobile
        ? 6
        : 12;


for (
    let i = 0;
    i < decorativeCount;
    i++
) {

    const depth =
        rand(
            -6,
            -1
        );


    /*
       small = decorative only
    */

    const scale =
        rand(
            0.32,
            0.68
        );


    const lantern =
        makeLantern(
            scale,
            false
        );


    lantern.position.set(

        rand(
            mobile ? -3.5 : -7,
            mobile ? 3.5 : 7
        ),

        rand(
            -1,
            7
        ),

        depth

    );


    world.add(
        lantern
    );


    decorativeLanterns.push({

        object:
            lantern,

        baseX:
            lantern.position.x,

        speed:
            rand(
                0.10,
                0.23
            ),

        phase:
            rand(
                0,
                Math.PI * 2
            ),

        sway:
            rand(
                0.05,
                0.20
            )

    });

}


/* ==========================================
   PETALS
========================================== */

const petalCount =
    mobile
        ? 70
        : 130;


const petals = [];


const petalPositions =
    new Float32Array(
        petalCount * 3
    );


for (
    let i = 0;
    i < petalCount;
    i++
) {

    const petal = {

        x:
            rand(-5, 5),

        y:
            rand(-1, 7),

        z:
            rand(-3, 3),

        speed:
            rand(
                0.12,
                0.32
            ),

        phase:
            rand(
                0,
                Math.PI * 2
            ),

        sway:
            rand(
                0.15,
                0.45
            )

    };


    petals.push(
        petal
    );


    petalPositions.set(

        [
            petal.x,
            petal.y,
            petal.z
        ],

        i * 3

    );

}


const petalGeometry =
    new THREE.BufferGeometry();


petalGeometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
        petalPositions,
        3
    )

);


const petalPoints =
    new THREE.Points(

        petalGeometry,

        new THREE.PointsMaterial({

            color:
                0xff7bd8,

            size:
                0.06,

            transparent:
                true,

            opacity:
                0.72,

            depthWrite:
                false,

            blending:
                THREE.AdditiveBlending

        })

    );


world.add(
    petalPoints
);


/* ==========================================
   RABBIT
========================================== */

function makeRabbit() {

    const group =
        new THREE.Group();


    const white =
        new THREE.MeshStandardMaterial({

            color:
                0xf7eef8,

            roughness:
                0.8

        });


    const dark =
        new THREE.MeshBasicMaterial({
            color:
                0x292029
        });


    const body =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.28,
                18,
                18
            ),

            white

        );


    body.scale.set(
        0.8,
        1.15,
        0.78
    );


    group.add(body);


    const head =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.22,
                18,
                18
            ),

            white

        );


    head.position.y =
        0.40;


    group.add(head);


    const earGeometry =
        new THREE.SphereGeometry(
            0.11,
            14,
            14
        );


    const leftEar =
        new THREE.Mesh(
            earGeometry,
            white
        );


    leftEar.scale.set(
        0.52,
        1.75,
        0.5
    );


    leftEar.position.set(
        -0.10,
        0.70,
        0
    );


    group.add(leftEar);


    const rightEar =
        leftEar.clone();


    rightEar.position.x =
        0.10;


    group.add(rightEar);


    const eyeGeometry =
        new THREE.SphereGeometry(
            0.023,
            10,
            10
        );


    const eye =
        new THREE.Mesh(
            eyeGeometry,
            dark
        );


    eye.position.set(
        -0.075,
        0.43,
        0.205
    );


    group.add(eye);


    const eye2 =
        eye.clone();


    eye2.position.x =
        0.075;


    group.add(eye2);


    group.position.set(
        1.30,
        -0.62,
        1
    );


    group.scale.setScalar(
        mobile
            ? 0.90
            : 1.03
    );


    world.add(group);


    return group;

}


const rabbit =
    makeRabbit();


/* ==========================================
   RAYCASTING
========================================== */

const raycaster =
    new THREE.Raycaster();


const pointer =
    new THREE.Vector2();


let hoveredLantern =
    null;


/*
   tìm group lantern từ mesh con
*/

function findLanternRoot(
    object
) {

    let current =
        object;


    while (
        current
    ) {

        if (
            current.userData
                ?.isLantern
        ) {

            return current;

        }


        current =
            current.parent;

    }


    return null;

}


/*
   raycast tại tọa độ pointer
*/

function raycastLantern(
    clientX,
    clientY
) {

    pointer.x =
        (
            clientX
            /
            innerWidth
        )
        *
        2
        -
        1;


    pointer.y =
        -(
            clientY
            /
            innerHeight
        )
        *
        2
        +
        1;


    raycaster.setFromCamera(
        pointer,
        camera
    );


    const objects =
        interactiveLanterns

            /*
               Chỉ raycast những đèn
               đang thực sự xuất hiện.
            */

            .filter(
                item =>
                    item.object.visible
            )

            .map(
                item =>
                    item.object
            );


    const hits =
        raycaster
            .intersectObjects(
                objects,
                true
            );


    if (
        hits.length === 0
    ) {

        return null;

    }


    return findLanternRoot(
        hits[0].object
    );

}


/* ==========================================
   HOVER
========================================== */

window.addEventListener(
    "pointermove",

    function (event) {

        if (
            !started
            ||
            wishOpen
            ||
            finalOpen
        ) {

            return;

        }


        targetX =
            (
                event.clientX
                /
                innerWidth
                -
                0.5
            )
            *
            2;


        targetY =
            (
                event.clientY
                /
                innerHeight
                -
                0.5
            )
            *
            2;


        if (
            event.pointerType
            ===
            "touch"
        ) {

            return;

        }


        const hit =
            raycastLantern(
                event.clientX,
                event.clientY
            );


        if (
            hoveredLantern
            &&
            hoveredLantern !== hit
        ) {

            hoveredLantern
                .userData
                .hovered =
                false;

        }


        hoveredLantern =
            hit;


        if (
            hoveredLantern
        ) {

            hoveredLantern
                .userData
                .hovered =
                true;


            document.body.style.cursor =
                "pointer";

        }

        else {

            document.body.style.cursor =
                "default";

        }

    }
);


/* ==========================================
   CLICK / TAP LANTERN
========================================== */

window.addEventListener(
    "pointerdown",

    function (event) {

        if (
            !started
            ||
            wishOpen
            ||
            finalOpen
        ) {
            return;
        }


        const lantern =
            raycastLantern(
                event.clientX,
                event.clientY
            );


        dragStartedOnLantern =
            Boolean(lantern);


        dragStartX =
            event.clientX;


        dragStartY =
            event.clientY;


        previousDragX =
            event.clientX;


        previousDragY =
            event.clientY;


        isDragging =
            true;


        document.body.style.cursor =
            "grabbing";

    }
);


window.addEventListener(
    "pointerup",

    function (event) {

        if (!isDragging) {
            return;
        }


        const movement =
            Math.hypot(

                event.clientX
                -
                dragStartX,

                event.clientY
                -
                dragStartY

            );


        isDragging =
            false;


        document.body.style.cursor =
            "grab";


        /*
           Nếu gần như không kéo
           → xem như click/tap.
        */

        if (
            movement < 8
            &&
            dragStartedOnLantern
        ) {

            const lantern =
                raycastLantern(
                    event.clientX,
                    event.clientY
                );


            if (lantern) {

                openLanternWish(
                    lantern
                );

            }

        }


        dragStartedOnLantern =
            false;

    }
);


window.addEventListener(
    "pointercancel",

    function () {

        isDragging =
            false;

        dragStartedOnLantern =
            false;

        document.body.style.cursor =
            "grab";

    }
);


/* ==========================================
   DISCOVERY STATE
========================================== */

const openedWishIndexes =
    new Set();


let wishOpen =
    false;


let finalOpen =
    false;

/* ==========================================
   REVEAL SECRET LANTERN
========================================== */

function revealSecretLantern() {

    if (
        secretLanternRevealed
    ) {
        return;
    }


    const secretItem =
        interactiveLanterns.find(
            item =>
                item.object
                    .userData
                    .isSecret
        );


    if (
        !secretItem
    ) {
        return;
    }


    secretLanternRevealed =
        true;


    const lantern =
        secretItem.object;


    /*
       Cho xuất hiện.
    */

    lantern.visible =
        true;


    /*
       Bắt đầu rất nhỏ.
       Animation loop hiện tại sẽ
       tự kéo nó về baseScale.
    */

    lantern.scale.setScalar(
        0.05
    );


    /*
       Sáng nổi bật khi vừa xuất hiện.
    */

    lantern
        .userData
        .glowMaterial
        .opacity =
        1;


    lantern
        .userData
        .bodyMaterial
        .emissiveIntensity =
        4;


    sceneSubtitle.textContent =
        "ơ... hình như còn một chiếc đèn nữa ♡";

}

function updateProgress() {

    /*
       Số đèn thường:
       không tính đèn bí mật.
    */

    const normalLanterns =
        interactiveLanterns.filter(
            item =>
                !item.object
                    .userData
                    .isSecret
        );


    const normalTotal =
        normalLanterns.length;


    /*
       Có bao nhiêu đèn thường
       đã được mở.
    */

    const normalOpened =
        normalLanterns.filter(
            item =>
                openedWishIndexes.has(
                    item.object
                        .userData
                        .wishIndex
                )
        ).length;


    /*
       GIAI ĐOẠN 1:
       chưa hiện đèn bí mật.
    */

    if (
        !secretLanternRevealed
    ) {

        progressText.textContent =
            `${normalOpened} / ${normalTotal} lời chúc`;


        /*
           Đã mở đủ 5 đèn đầu.
        */

        if (
            normalOpened
            ===
            normalTotal
        ) {

            revealSecretLantern();


            progressText.textContent =
                `${normalOpened} / ${interactiveLanterns.length} lời chúc`;

        }


        return;
    }


    /*
       GIAI ĐOẠN 2:
       chiếc thứ 6 đã xuất hiện.
    */

    const count =
        openedWishIndexes.size;


    const total =
        interactiveLanterns.length;


    progressText.textContent =
        `${count} / ${total} lời chúc`;


    /*
       Đã đọc luôn chiếc cuối.
    */

    if (
        count === total
    ) {

        finalBtn
            .classList
            .remove("hidden");


        sceneSubtitle.textContent =
            "em đã tìm thấy tất cả những chiếc đèn rồi ♡";

    }

}


/* ==========================================
   OPEN WISH
========================================== */

function openLanternWish(
    lantern
) {

    const wish =
        lantern
            .userData
            .wish;


    if (
        !wish
    ) {

        return;

    }


    wishOpen =
        true;


    lantern.userData.opened =
        true;


    openedWishIndexes.add(
        lantern
            .userData
            .wishIndex
    );


    /*
       chuyển đèn đã mở thành ánh vàng
    */

    lantern
        .userData
        .bodyMaterial
        .emissive
        .set(
            0xffb13b
        );


    lantern
        .userData
        .bodyMaterial
        .emissiveIntensity =
        3.5;


    lantern
        .userData
        .glowMaterial
        .color
        .set(
            0xffd06b
        );


    wishTitle.textContent =
        wish.title;


    wishMessage.textContent =
        wish.message;


    if (
        wish.image
    ) {

        wishImage.src =
            wish.image;


        wishImage.hidden =
            false;


        /*
           Nếu user quên thêm ảnh,
           không để icon ảnh lỗi.
        */

        wishImage.onerror =
            function () {

                wishImage.hidden =
                    true;

            };

    }

    else {

        wishImage.hidden =
            true;

    }


    wishOverlay
        .classList
        .remove("hidden");


    updateProgress();

}


/* ==========================================
   CLOSE WISH
========================================== */

function closeWish() {

    wishOpen =
        false;


    wishOverlay
        .classList
        .add("hidden");

}


wishClose.addEventListener(
    "click",
    closeWish
);


wishOverlay.addEventListener(
    "click",

    function (event) {

        if (
            event.target
            ===
            wishOverlay
        ) {

            closeWish();

        }

    }
);


/* ==========================================
   FINAL LETTER
========================================== */

finalBtn.addEventListener(
    "click",

    function () {

        finalOpen =
            true;


        finalTitle.textContent =
            finalLetter.title;


        finalMessage.textContent =
            finalLetter.message;


        if (
            finalLetter.image
        ) {

            finalImage.src =
                finalLetter.image;


            finalImage.hidden =
                false;


            finalImage.onerror =
                () =>
                    finalImage.hidden =
                    true;

        }

        else {

            finalImage.hidden =
                true;

        }


        finalOverlay
            .classList
            .remove("hidden");

    }
);


function closeFinal() {

    finalOpen =
        false;


    finalOverlay
        .classList
        .add("hidden");

}


finalClose.addEventListener(
    "click",
    closeFinal
);


/* ==========================================
   RESET EXPERIENCE
========================================== */

resetBtn.addEventListener(
    "click",

    function () {

        openedWishIndexes.clear();
        secretLanternRevealed =
            false;


        interactiveLanterns
            .forEach(
                function (item) {

                    const lantern =
                        item.object;


                    lantern
                        .userData
                        .opened =
                        false;


                    lantern
                        .userData
                        .hovered =
                        false;


                    lantern
                        .userData
                        .bodyMaterial
                        .emissive
                        .set(
                            0xff3f18
                        );


                    lantern
                        .userData
                        .bodyMaterial
                        .emissiveIntensity =
                        2.5;


                    lantern
                        .userData
                        .glowMaterial
                        .color
                        .set(
                            0xff5a2c
                        );

                    if (
                        lantern.userData.isSecret
                    ) {

                        lantern.visible =
                            false;

                    }

                }
            );


        finalBtn
            .classList
            .add("hidden");


        sceneSubtitle.textContent =
            "chạm vào những chiếc đèn nhấp nháy ✦";


        closeFinal();


        updateProgress();

    }
);


/* ==========================================
   START
========================================== */

let started =
    false;


startBtn.addEventListener(
    "click",

    function () {

        started =
            true;


        intro
            .classList
            .add("hidden");


        sceneUi
            .classList
            .remove("hidden");


        moveHint
            .classList
            .remove("hidden");


        setTimeout(
            () => {

                moveHint
                    .classList
                    .add("hidden");

            },

            6500
        );

    }
);


/* ==========================================
   BACK TO INTRO
========================================== */

backBtn.addEventListener(
    "click",

    function (event) {

        event.stopPropagation();


        /*
           Đóng popup nếu đang mở.
        */

        wishOpen = false;
        finalOpen = false;


        wishOverlay
            .classList
            .add("hidden");


        finalOverlay
            .classList
            .add("hidden");


        /*
           Quay về màn intro.
        */

        sceneUi
            .classList
            .add("hidden");


        moveHint
            .classList
            .add("hidden");


        intro
            .classList
            .remove("hidden");


        /*
           Tạm dừng chuyển động kiểu "đã bước vào".
           Nhưng KHÔNG reset lời chúc đã tìm.
        */

        started = false;


        document.body.style.cursor =
            "default";

    }
);

/* ==========================================
   CAMERA STATE
========================================== */

let reveal =
    0;


let pointerX = 0;
let pointerY = 0;

let targetX = 0;
let targetY = 0;


/* ==========================================
   DRAG TO ROTATE WORLD
========================================== */

let isDragging = false;

let dragStartedOnLantern = false;

let dragStartX = 0;
let dragStartY = 0;

let previousDragX = 0;
let previousDragY = 0;

let targetWorldYaw = 0;
let worldYaw = 0;

let targetWorldPitch = 0;
let worldPitch = 0;

const MAX_WORLD_PITCH = 0.10;


let elapsed =
    0;


let last =
    performance.now();


/* ==========================================
   ANIMATION
========================================== */

function animate(
    now
) {

    requestAnimationFrame(
        animate
    );


    const dt =
        Math.min(

            (
                now - last
            )
            /
            1000,

            0.033

        );


    last =
        now;


    elapsed +=
        dt;


    reveal +=
        (
            (
                started
                    ? 1
                    : 0.10
            )
            -
            reveal
        )
        *
        Math.min(
            1,
            dt * 1.8
        );


    pointerX +=
        (
            targetX
            -
            pointerX
        )
        *
        Math.min(
            1,
            dt * 3
        );


    pointerY +=
        (
            targetY
            -
            pointerY
        )
        *
        Math.min(
            1,
            dt * 3
        );


    /* camera */

    const desiredCamera =
        cameraStart
            .clone()
            .lerp(
                cameraEnd,
                reveal
            );


    camera.position.x =
        desiredCamera.x
        +
        pointerX
        *
        0.38;


    camera.position.y =
        desiredCamera.y
        -
        pointerY
        *
        0.18;


    camera.position.z =
        desiredCamera.z;


    camera.lookAt(
        pointerX * 0.11,

        1.35
        -
        pointerY * 0.07,

        0
    );


    /* ==================================
   WORLD ROTATION
================================== */

    worldYaw =
        THREE.MathUtils.lerp(

            worldYaw,

            targetWorldYaw,

            Math.min(
                1,
                dt * 7
            )

        );


    worldPitch =
        THREE.MathUtils.lerp(

            worldPitch,

            targetWorldPitch,

            Math.min(
                1,
                dt * 7
            )

        );


    world.rotation.y =
        worldYaw;


    world.rotation.x =
        worldPitch;


    /* blossom breathing */

    blossomGroup.rotation.y =
        Math.sin(
            elapsed * 0.08
        )
        *
        0.014;


    pinkLight.intensity =
        7
        +
        reveal
        *
        16
        +
        Math.sin(
            elapsed * 1.4
        )
        *
        1.4;


    bloom.strength =
        0.75
        +
        reveal
        *
        0.90;


    /* petals */

    const positions =
        petalGeometry
            .attributes
            .position
            .array;


    petals.forEach(
        function (
            petal,
            i
        ) {

            petal.y -=
                petal.speed
                *
                dt;


            petal.x +=
                Math.sin(
                    elapsed
                    *
                    0.8
                    +
                    petal.phase
                )
                *
                petal.sway
                *
                dt;


            if (
                petal.y
                <
                -1.4
            ) {

                petal.y =
                    rand(
                        5.5,
                        8
                    );


                petal.x =
                    rand(
                        -4.8,
                        4.8
                    );

            }


            positions[i * 3] =
                petal.x;


            positions[i * 3 + 1] =
                petal.y;


            positions[i * 3 + 2] =
                petal.z;

        }
    );


    petalGeometry
        .attributes
        .position
        .needsUpdate =
        true;


    /* interactive lanterns */

    interactiveLanterns
        .forEach(
            function (item) {

                const lantern =
                    item.object;


                lantern.position.x =
                    item.baseX
                    +
                    Math.sin(
                        elapsed
                        *
                        0.65
                        +
                        item.phase
                    )
                    *
                    item.sway;


                lantern.position.y =
                    item.baseY
                    +
                    Math.sin(
                        elapsed
                        *
                        0.55
                        +
                        item.phase
                    )
                    *
                    0.10;


                lantern.rotation.z =
                    Math.sin(
                        elapsed
                        *
                        0.8
                        +
                        item.phase
                    )
                    *
                    0.04;


                /*
                   hover scale
                */

                const base =
                    lantern
                        .userData
                        .baseScale;


                const targetScale =
                    lantern
                        .userData
                        .hovered

                        ? base * 1.14

                        : base;


                const newScale =
                    THREE.MathUtils
                        .lerp(

                            lantern.scale.x,

                            targetScale,

                            Math.min(
                                1,
                                dt * 10
                            )

                        );


                lantern.scale
                    .setScalar(
                        newScale
                    );


                /*
                   hover brightness
                */

                /* ==================================
   WISH LANTERN BLINK
================================== */

                if (
                    !lantern.userData.opened
                ) {

                    /*
                       Đèn chưa mở:
                       nhấp nháy liên tục để báo
                       đây là đèn có lời chúc.
                    */

                    const blink =
                        (
                            Math.sin(
                                elapsed * 3.4
                                +
                                item.phase
                            )
                            +
                            1
                        )
                        /
                        2;


                    /*
                       glow ngoài:
                       0.38 -> 0.92
                    */

                    lantern
                        .userData
                        .glowMaterial
                        .opacity =
                        0.38
                        +
                        blink
                        *
                        0.54;


                    /*
                       thân đèn sáng tối nhẹ
                    */

                    lantern
                        .userData
                        .bodyMaterial
                        .emissiveIntensity =
                        2.2
                        +
                        blink
                        *
                        1.8;


                    /*
                       Khi hover thêm một chút scale,
                       nhưng blink vẫn tiếp tục.
                    */

                    if (
                        lantern.userData.hovered
                    ) {

                        lantern
                            .userData
                            .glowMaterial
                            .opacity =
                            1;

                    }

                }

                else {

                    /*
                       Đèn đã đọc:
                       giữ màu vàng và ổn định.
                    */

                    lantern
                        .userData
                        .glowMaterial
                        .opacity =
                        0.58;


                    lantern
                        .userData
                        .bodyMaterial
                        .emissiveIntensity =
                        3.2;

                }

            }
        );


    /* decorative lanterns */

    decorativeLanterns
        .forEach(
            function (item) {

                const lantern =
                    item.object;


                if (
                    started
                ) {

                    lantern.position.y +=
                        item.speed
                        *
                        dt;

                }


                lantern.position.x =
                    item.baseX
                    +
                    Math.sin(
                        elapsed
                        *
                        0.7
                        +
                        item.phase
                    )
                    *
                    item.sway;


                if (
                    lantern.position.y
                    >
                    7.5
                ) {

                    lantern.position.y =
                        rand(
                            -1.6,
                            -0.4
                        );


                    item.baseX =
                        rand(
                            mobile
                                ? -3.5
                                : -7,

                            mobile
                                ? 3.5
                                : 7
                        );

                }

            }
        );


    /* rabbit breathing */

    rabbit.position.y =
        -0.62
        +
        Math.sin(
            elapsed * 1.15
        )
        *
        0.014;


    composer.render();

}


/* ==========================================
   RESIZE
========================================== */

window.addEventListener(
    "pointermove",

    function (event) {

        if (
            !started
            ||
            wishOpen
            ||
            finalOpen
        ) {
            return;
        }


        /* ==================================
           DRAG SCENE
        ================================== */

        if (isDragging) {

            const dx =
                event.clientX
                -
                previousDragX;


            const dy =
                event.clientY
                -
                previousDragY;


            previousDragX =
                event.clientX;


            previousDragY =
                event.clientY;


            /*
               Kéo ngang → xoay quanh cây
            */

            targetWorldYaw +=
                dx * 0.006;


            /*
               Kéo dọc nhẹ
            */

            targetWorldPitch +=
                dy * 0.0025;


            targetWorldPitch =
                THREE.MathUtils.clamp(

                    targetWorldPitch,

                    -MAX_WORLD_PITCH,

                    MAX_WORLD_PITCH

                );


            document.body.style.cursor =
                "grabbing";


            return;
        }


        /* ==================================
           NORMAL PARALLAX
        ================================== */

        targetX =
            (
                event.clientX
                /
                innerWidth
                -
                0.5
            )
            *
            2;


        targetY =
            (
                event.clientY
                /
                innerHeight
                -
                0.5
            )
            *
            2;


        if (
            event.pointerType
            ===
            "touch"
        ) {
            return;
        }


        /* ==================================
           LANTERN HOVER
        ================================== */

        const hit =
            raycastLantern(
                event.clientX,
                event.clientY
            );


        if (
            hoveredLantern
            &&
            hoveredLantern !== hit
        ) {

            hoveredLantern
                .userData
                .hovered =
                false;

        }


        hoveredLantern =
            hit;


        if (hoveredLantern) {

            hoveredLantern
                .userData
                .hovered =
                true;


            document.body.style.cursor =
                "pointer";

        }

        else {

            document.body.style.cursor =
                "grab";

        }

    }
);


/* ==========================================
   INIT
========================================== */

updateProgress();


requestAnimationFrame(
    animate
);