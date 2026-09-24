import * as THREE from "three";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import {
    lanternWishes,
    finalLetter
} from "./wishes.js";


/* =========================================================
   DOM
========================================================= */

const $ = (id) =>
    document.getElementById(id);


const app =
    $("app");

const intro =
    $("intro");

const startBtn =
    $("startBtn");

const backBtn =
    $("backBtn");

const sceneUi =
    $("sceneUi");

const sceneSubtitle =
    $("sceneSubtitle");

const progressText =
    $("progressText");

const finalBtn =
    $("finalBtn");

const moveHint =
    $("moveHint");


/* normal wish */

const wishOverlay =
    $("wishOverlay");

const wishClose =
    $("wishClose");

const wishTitle =
    $("wishTitle");

const wishMessage =
    $("wishMessage");

const wishImage =
    $("wishImage");


/* final */

const finalOverlay =
    $("finalOverlay");

const finalClose =
    $("finalClose");

const finalTitle =
    $("finalTitle");

const finalMessage =
    $("finalMessage");

const finalImage =
    $("finalImage");

const resetBtn =
    $("resetBtn");


const mobile =
    window.matchMedia(
        "(max-width: 700px)"
    ).matches;

const questionOverlay =
    $("questionOverlay");

const questionCard =
    $("questionCard");

const questionText =
    $("questionText");

const questionOptions =
    $("questionOptions");

const questionFeedback =
    $("questionFeedback");


/* =========================================================
   THREE.JS SETUP
========================================================= */

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
        mobile ? 48 : 46,
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

        antialias:
            true,

        powerPreference:
            "high-performance"

    });


renderer.setPixelRatio(

    Math.min(
        devicePixelRatio,
        mobile
            ? 1.5
            : 2
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
    1.12;


renderer.shadowMap.enabled =
    !mobile;


renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


renderer.domElement.style.touchAction =
    "none";


app.appendChild(
    renderer.domElement
);


/* =========================================================
   BLOOM
========================================================= */

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


/* =========================================================
   WORLD
========================================================= */

const world =
    new THREE.Group();


scene.add(
    world
);


/* =========================================================
   LIGHTS
========================================================= */

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


keyLight.castShadow =
    !mobile;


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


const characterLight =
    new THREE.PointLight(
        0xffc067,
        5.0,
        6,
        2
    );


characterLight.position.set(
    1.4,
    1.3,
    2.2
);


scene.add(
    characterLight
);


/* =========================================================
   HELPERS
========================================================= */

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
            max
            -
            min
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


/* =========================================================
   STARS
========================================================= */

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

        positions[
            i * 3
        ] =
            rand(
                -18,
                18
            );


        positions[
            i * 3 + 1
        ] =
            rand(
                0,
                11
            );


        positions[
            i * 3 + 2
        ] =
            rand(
                -18,
                -5
            );

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


/* =========================================================
   MOON
========================================================= */

const moonGroup =
    new THREE.Group();


const moon =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            mobile
                ? 0.82
                : 1.05,

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
    mobile
        ? 3.2
        : 4.3,
    5.3,
    -6.5
);


world.add(
    moonGroup
);


/* =========================================================
   FLOATING ISLAND
========================================================= */

function makeIsland() {

    const geometry =
        new THREE.IcosahedronGeometry(
            3.25,
            2
        );


    const positions =
        geometry
            .attributes
            .position;


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
                THREE.MathUtils
                    .mapLinear(

                        v.y,
                        -3.25,
                        0,
                        0.32,
                        1

                    );


            v.x *=
                factor;


            v.z *=
                factor;

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


    rock.castShadow =
        !mobile;


    rock.receiveShadow =
        !mobile;


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


    top.receiveShadow =
        !mobile;


    world.add(
        top
    );

}


makeIsland();


/* =========================================================
   TREE
========================================================= */

const tree =
    new THREE.Group();


world.add(
    tree
);


const tips =
    [];


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
        .multiplyScalar(
            0.5
        );


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


    branch.castShadow =
        !mobile;


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


        child.x +=
            rand(
                -0.04,
                0.04
            );


        child.z +=
            rand(
                -0.12,
                0.12
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

    mobile
        ? 6
        : 7

);


/* =========================================================
   BLOSSOMS
========================================================= */

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


    const positions =
        [];


    const colors =
        [];


    const palette = [

        new THREE.Color(
            0xff4fd4
        ),

        new THREE.Color(
            0xff79de
        ),

        new THREE.Color(
            0xdb5cff
        ),

        new THREE.Color(
            0xffb4eb
        ),

        new THREE.Color(
            0xffffff
        )

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
                    rand(
                        -1,
                        1
                    )
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


/* =========================================================
   VÕ HỒN ĐƯỜNG CHARACTER + NAME
========================================================= */

const characterGroup =
    new THREE.Group();


characterGroup.position.set(
    mobile
        ? 0.95
        : 1.30,
    -0.72,
    1.35
);


world.add(
    characterGroup
);


/* glow phía sau nhân vật */

const characterGlow =
    new THREE.Sprite(

        new THREE.SpriteMaterial({

            map:
                glowTexture,

            color:
                0xffc26e,

            transparent:
                true,

            opacity:
                0.20,

            depthWrite:
                false,

            blending:
                THREE.AdditiveBlending

        })

    );


characterGlow.scale.set(
    mobile
        ? 2.7
        : 3.2,

    mobile
        ? 3.5
        : 4.2,

    1
);


characterGlow.position.set(
    0,

    mobile
        ? 1.25
        : 1.45,

    -0.08
);


characterGroup.add(
    characterGlow
);


let voHonDuong =
    null;


const characterLoader =
    new THREE.TextureLoader();


characterLoader.load(

    "./images/vo-hon-duong.png",

    function (texture) {

        texture.colorSpace =
            THREE.SRGBColorSpace;


        const material =
            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthWrite:
                    false,

                alphaTest:
                    0.02,

                /*
                   Giảm độ sáng ảnh để không bị bloom cháy.
                   Không ảnh hưởng label ANXinhĐẹp.
                */
                color:
                    new THREE.Color(
                        0x909090
                    ),

                opacity:
                    0.96

            });


        const sprite =
            new THREE.Sprite(
                material
            );


        const image =
            texture.image;


        const ratio =
            image?.width
                &&
                image?.height

                ? image.width
                /
                image.height

                : 0.62;


        const height =
            mobile
                ? 2.55
                : 3.05;


        sprite.scale.set(

            height
            *
            ratio,

            height,

            1

        );


        sprite.position.set(
            0,
            height / 2,
            0.05
        );


        sprite.userData.baseY =
            sprite.position.y;


        voHonDuong =
            sprite;


        characterGroup.add(
            sprite
        );

    },


    undefined,


    function (error) {

        console.error(
            "Không tải được ./images/vo-hon-duong.png",
            error
        );

    }

);


/* =========================================================
   NAME: ANXinhĐẹp
========================================================= */

function createNameLabel(
    text
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        1024;

    canvas.height =
        256;


    const c =
        canvas.getContext(
            "2d"
        );


    const bg =
        c.createLinearGradient(
            0,
            0,
            1024,
            0
        );


    bg.addColorStop(
        0,
        "rgba(70,20,52,0)"
    );


    bg.addColorStop(
        0.18,
        "rgba(75,20,54,.74)"
    );


    bg.addColorStop(
        0.82,
        "rgba(75,20,54,.74)"
    );


    bg.addColorStop(
        1,
        "rgba(70,20,52,0)"
    );


    c.fillStyle =
        bg;


    c.beginPath();


    c.roundRect(
        70,
        46,
        884,
        160,
        80
    );


    c.fill();


    c.textAlign =
        "center";


    c.textBaseline =
        "middle";


    c.font =
        "700 88px Arial, sans-serif";


    c.shadowColor =
        "rgba(255,188,83,.95)";


    c.shadowBlur =
        24;


    c.fillStyle =
        "#ffe8a3";


    c.fillText(
        text,
        512,
        126
    );


    c.font =
        "46px Georgia";


    c.shadowBlur =
        10;


    c.fillStyle =
        "#f6a5d4";


    c.fillText(
        "✦",
        145,
        126
    );


    c.fillText(
        "✦",
        879,
        126
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.colorSpace =
        THREE.SRGBColorSpace;


    const sprite =
        new THREE.Sprite(

            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthWrite:
                    false,

                depthTest:
                    false

            })

        );


    sprite.scale.set(

        mobile
            ? 1.75
            : 2.15,

        mobile
            ? 0.44
            : 0.54,

        1

    );


    sprite.position.set(

        0,

        mobile
            ? 2.90
            : 3.42,

        0.12

    );


    sprite.renderOrder =
        999;


    return sprite;

}


const characterName =
    createNameLabel(
        "ANXinhĐẹp"
    );


characterGroup.add(
    characterName
);


/* =========================================================
   LANTERNS
========================================================= */

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


    group.add(
        top
    );


    const bottom =
        top.clone();


    bottom.position.y =
        -0.30;


    group.add(
        bottom
    );


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


    if (
        interactive
    ) {

        /*
           hitbox vô hình
           giúp desktop/mobile dễ click hơn
        */

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


/* =========================================================
   INTERACTIVE LANTERNS
========================================================= */

const interactiveLanterns =
    [];


/* ==========================================
   SECRET FINAL QUESTION
========================================== */

const SECRET_WISH_INDEX =
    Math.min(
        lanternWishes.length,
        6
    ) - 1;


let secretLanternRevealed =
    false;


const lanternSlotsDesktop = [

    /* 1 — trái dưới */
    {
        x: -4.45,
        y: 1.20,
        z: 1.7,
        scale: 1.22
    },

    /* 2 — phải dưới */
    {
        x: 4.55,
        y: 1.25,
        z: 1.7,
        scale: 1.20
    },

    /* 3 — trái giữa */
    {
        x: -3.65,
        y: 3.35,
        z: 1.15,
        scale: 1.02
    },

    /* 4 — phải giữa, hạ xuống để tránh mặt trăng */
    {
        x: 4.15,
        y: 2.85,
        z: 1.25,
        scale: 1.00
    },

    /* 5 — trên trái */
    {
        x: -2.15,
        y: 5.20,
        z: 1.15,
        scale: 0.92
    },

    /* 6 — gần trung tâm nhưng lệch trái */
    {
        x: -0.75,
        y: 2.35,
        z: 2.10,
        scale: 0.98
    }

];


const lanternSlotsMobile =
    lanternSlotsDesktop
        .map(

            function (slot) {

                return {

                    ...slot,

                    x:
                        slot.x
                        *
                        0.56,

                    y:
                        slot.y
                        *
                        0.88,

                    scale:
                        slot.scale
                        *
                        0.88

                };

            }

        );


const activeSlots =
    mobile
        ? lanternSlotsMobile
        : lanternSlotsDesktop;


const wishCount =
    Math.min(
        lanternWishes.length,
        activeSlots.length
    );


lanternWishes
    .slice(
        0,
        wishCount
    )
    .forEach(

        function (
            wish,
            index
        ) {

            const slot =
                activeSlots[
                index
                ];


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


            /*
               Câu cuối là câu bí mật.
            */

            lantern.userData.isSecret =
                index === SECRET_WISH_INDEX;


            /*
               Ban đầu giấu hoàn toàn
               chiếc đèn thứ 6.
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
                        Math.PI
                        *
                        2
                    ),

                sway:
                    rand(
                        0.10,
                        0.23
                    )

            });

        }

    );


/* =========================================================
   DECORATIVE LANTERNS
========================================================= */

const decorativeLanterns =
    [];


const decorativeCount =
    mobile
        ? 6
        : 12;


for (
    let i = 0;
    i < decorativeCount;
    i++
) {

    const lantern =
        makeLantern(
            rand(
                0.32,
                0.68
            ),
            false
        );


    lantern.position.set(

        rand(
            mobile
                ? -3.5
                : -7,

            mobile
                ? 3.5
                : 7
        ),

        rand(
            -1,
            7
        ),

        rand(
            -6,
            -1
        )

    );


    world.add(
        lantern
    );


    decorativeLanterns.push({

        object:
            lantern,

        baseX:
            lantern
                .position
                .x,

        speed:
            rand(
                0.10,
                0.23
            ),

        phase:
            rand(
                0,
                Math.PI
                *
                2
            ),

        sway:
            rand(
                0.05,
                0.20
            )

    });

}


/* =========================================================
   PETALS
========================================================= */

const petalCount =
    mobile
        ? 70
        : 130;


const petals =
    [];


const petalPositions =
    new Float32Array(
        petalCount
        *
        3
    );


for (
    let i = 0;
    i < petalCount;
    i++
) {

    const petal = {

        x:
            rand(
                -5,
                5
            ),

        y:
            rand(
                -1,
                7
            ),

        z:
            rand(
                -3,
                3
            ),

        speed:
            rand(
                0.12,
                0.32
            ),

        phase:
            rand(
                0,
                Math.PI
                *
                2
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

        i
        *
        3

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


/* =========================================================
   RAYCASTING
========================================================= */

const raycaster =
    new THREE.Raycaster();


const pointer =
    new THREE.Vector2();


let hoveredLantern =
    null;


function findLanternRoot(
    object
) {

    let current =
        object;


    while (
        current
    ) {

        if (
            current
                .userData
                ?.isLantern
        ) {

            return current;

        }


        current =
            current.parent;

    }


    return null;

}


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

            .filter(
                function (item) {

                    return (
                        item
                            .object
                            .visible
                    );

                }
            )

            .map(
                function (item) {

                    return item.object;

                }
            );


    const hits =
        raycaster
            .intersectObjects(
                objects,
                true
            );


    return (
        hits.length

            ? findLanternRoot(
                hits[0].object
            )

            : null
    );

}


/* =========================================================
   DISCOVERY STATE
========================================================= */

const openedWishIndexes =
    new Set();


let wishOpen =
    false;

let questionOpen =
    false;

let finalOpen =
    false;


/*
   Đèn đang được hỏi.
*/
let pendingLantern =
    null;





/* ==========================================
   REVEAL SECRET QUESTION LANTERN
========================================== */

function revealSecretLantern() {

    if (
        secretLanternRevealed
    ) {

        return;

    }


    const secretItem =
        interactiveLanterns.find(

            function (item) {

                return (
                    item
                        .object
                        .userData
                        .isSecret
                );

            }

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
       Xuất hiện từ rất nhỏ,
       animation loop sẽ tự scale
       về kích thước bình thường.
    */

    lantern.scale.setScalar(
        0.05
    );


    /*
       Cho nó sáng nổi bật
       ngay lúc xuất hiện.
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


    if (
        sceneSubtitle
    ) {

        sceneSubtitle.textContent =
            "ơ... vẫn còn một câu đặc biệt nữa kìa 🏮";

    }

}


function updateProgress() {

    /*
       5 câu đầu:
       tất cả đèn không phải secret.
    */

    const normalLanterns =
        interactiveLanterns.filter(

            function (item) {

                return (
                    !item
                        .object
                        .userData
                        .isSecret
                );

            }

        );


    /*
       Đếm số câu thường
       đã trả lời đúng.
    */

    const normalOpened =
        normalLanterns.filter(

            function (item) {

                return (
                    openedWishIndexes.has(

                        item
                            .object
                            .userData
                            .wishIndex

                    )
                );

            }

        ).length;


    /* ==================================
       GIAI ĐOẠN 1:
       CHƯA HIỆN CÂU ĐẶC BIỆT
    ================================== */

    if (
        !secretLanternRevealed
    ) {

        if (
            progressText
        ) {

            progressText.textContent =
                `${normalOpened} / ${normalLanterns.length} câu hỏi`;

        }


        /*
           Trả lời đúng đủ 5 câu đầu.
        */

        if (
            normalLanterns.length > 0
            &&
            normalOpened
            ===
            normalLanterns.length
        ) {

            revealSecretLantern();


            /*
               Sau khi đèn thứ 6 xuất hiện:
               chuyển counter thành 5/6.
            */

            if (
                progressText
            ) {

                progressText.textContent =
                    `${openedWishIndexes.size} / ${interactiveLanterns.length} câu hỏi`;

            }

        }


        return;

    }


    /* ==================================
       GIAI ĐOẠN 2:
       CÂU ĐẶC BIỆT ĐÃ XUẤT HIỆN
    ================================== */

    const count =
        openedWishIndexes.size;


    const total =
        interactiveLanterns.length;


    if (
        progressText
    ) {

        progressText.textContent =
            `${count} / ${total} câu hỏi`;

    }


    /*
       Hoàn thành luôn câu đặc biệt.
    */

    if (
        count === total
        &&
        total > 0
    ) {

        finalBtn
            ?.classList
            .remove(
                "hidden"
            );


        if (
            sceneSubtitle
        ) {

            sceneSubtitle.textContent =
                "xong hết rồi đó ♡";

        }

    }

    else {

        finalBtn
            ?.classList
            .add(
                "hidden"
            );

    }

}


/* =========================================================
   IMAGE HELPER
========================================================= */

function setImageOrHide(
    imgElement,
    src
) {

    if (
        !imgElement
    ) {

        return;

    }


    if (
        !src
    ) {

        imgElement.hidden =
            true;


        imgElement
            .removeAttribute(
                "src"
            );


        return;

    }


    imgElement.hidden =
        false;


    imgElement.src =
        src;


    imgElement.onerror =
        function () {

            imgElement.hidden =
                true;

        };

}


/* =========================================================
   OPEN WISH
========================================================= */


/* ==========================================
   OPEN QUESTION
========================================== */

function openLanternQuestion(
    lantern
) {

    const wish =
        lantern
            ?.userData
            ?.wish;


    if (
        !wish
    ) {
        return;
    }


    /*
       Đèn đã hoàn thành rồi:
       có thể cho xem lại lời chúc.
    */

    if (
        lantern
            .userData
            .opened
    ) {

        openLanternWish(
            lantern,
            false
        );

        return;

    }


    questionOpen =
        true;


    pendingLantern =
        lantern;


    questionText.textContent =
        wish.question
        ??
        "Câu hỏi";


    questionFeedback.textContent =
        "";


    questionCard
        .classList
        .remove(
            "wrong"
        );


    questionOptions.innerHTML =
        "";


    wish.options
        .forEach(

            function (
                option,
                index
            ) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "answer-btn";


                button.textContent =
                    option;


                /*
                   CÂU CUỐI:
                   đáp án sai chạy trốn.
                */

                if (
                    wish.runawayWrongAnswer
                    &&
                    index
                    !==
                    wish.correctIndex
                ) {

                    button.classList.add(
                        "runaway"
                    );


                    setupRunawayAnswer(
                        button
                    );

                }


                /*
                   ANXinhĐẹp
                */

                if (
                    wish.runawayWrongAnswer
                    &&
                    index
                    ===
                    wish.correctIndex
                ) {

                    button.classList.add(
                        "correct-special"
                    );

                }


                button.addEventListener(

                    "click",

                    function (event) {

                        event.stopPropagation();


                        /*
                           Nút chạy trốn tuyệt đối
                           không được nhận click.
                        */

                        if (
                            wish.runawayWrongAnswer
                            &&
                            index
                            !==
                            wish.correctIndex
                        ) {

                            moveRunawayButton(
                                button
                            );

                            return;

                        }


                        answerQuestion(
                            index
                        );

                    }

                );


                questionOptions.appendChild(
                    button
                );

            }

        );


    questionOverlay
        .classList
        .remove(
            "hidden"
        );

}


/* ==========================================
   ANSWER QUESTION
========================================== */

function answerQuestion(
    selectedIndex
) {

    if (
        !pendingLantern
    ) {
        return;
    }


    const wish =
        pendingLantern
            .userData
            .wish;


    /*
       ĐÚNG
    */

    if (
        selectedIndex
        ===
        wish.correctIndex
    ) {

        questionFeedback.textContent =
            "✨ Chính xác!";


        const lantern =
            pendingLantern;


        setTimeout(

            function () {

                closeQuestion();


                openLanternWish(
                    lantern,
                    true
                );

            },

            500

        );


        return;

    }


    /*
       SAI
    */

    questionFeedback.textContent =
        "Sai mất rồi 😌 chơi lại nha...";


    questionCard
        .classList
        .remove(
            "wrong"
        );


    /*
       restart animation
    */
    void questionCard.offsetWidth;


    questionCard
        .classList
        .add(
            "wrong"
        );


    setTimeout(

        function () {

            closeQuestion();


            resetGame();

        },

        1400

    );

}


/* ==========================================
   CLOSE QUESTION
========================================== */

function closeQuestion() {

    questionOpen =
        false;


    pendingLantern =
        null;


    questionOverlay
        ?.classList
        .add(
            "hidden"
        );

}

function openLanternWish(
    lantern,
    markCompleted = true
) {

    const wish =
        lantern
            ?.userData
            ?.wish;


    if (
        !wish
    ) {

        return;

    }


    wishOpen =
        true;


    if (
        markCompleted
    ) {

        lantern.userData.opened =
            true;


        openedWishIndexes.add(

            lantern
                .userData
                .wishIndex

        );

    }


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


    if (
        wishTitle
    ) {

        wishTitle.textContent =
            wish.title
            ??
            "Lời chúc";

    }


    if (
        wishMessage
    ) {

        wishMessage.textContent =
            wish.message
            ??
            "";

    }


    setImageOrHide(
        wishImage,
        wish.image
    );


    wishOverlay
        ?.classList
        .remove(
            "hidden"
        );


    updateProgress();

}


/* =========================================================
   CLOSE WISH
========================================================= */

function closeWish() {

    wishOpen =
        false;


    wishOverlay
        ?.classList
        .add(
            "hidden"
        );

}


wishClose
    ?.addEventListener(
        "click",
        closeWish
    );


wishOverlay
    ?.addEventListener(

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
   RUNAWAY ANSWER
========================================== */

function setupRunawayAnswer(
    button
) {

    /*
       Vị trí dịch chuyển hiện tại.
    */
    button.userDataRunaway = {

        x: 0,
        y: 0,

        /*
           Không cho chạy liên tục.
        */
        lastMove: 0

    };


    /*
       Mobile:
       vừa định chạm là né.
    */
    button.addEventListener(

        "pointerdown",

        function (event) {

            if (
                event.pointerType
                ===
                "touch"
            ) {

                event.preventDefault();
                event.stopPropagation();


                moveRunawayButton(
                    button,
                    event.clientX,
                    event.clientY
                );

            }

        }

    );

}


questionCard.addEventListener(

    "pointermove",

    function (event) {

        if (
            !questionOpen
            ||
            event.pointerType
            ===
            "touch"
        ) {

            return;

        }


        const button =
            questionOptions
                .querySelector(
                    ".runaway"
                );


        if (
            !button
        ) {

            return;

        }


        const rect =
            button
                .getBoundingClientRect();


        const centerX =
            rect.left
            +
            rect.width / 2;


        const centerY =
            rect.top
            +
            rect.height / 2;


        const distance =
            Math.hypot(

                event.clientX
                -
                centerX,

                event.clientY
                -
                centerY

            );


        /*
           Chỉ khi chuột tới khá gần
           mới bắt đầu né.

           65–75px sẽ có cảm giác
           "sắp bấm được rồi".
        */

        if (
            distance < 72
        ) {

            moveRunawayButton(

                button,

                event.clientX,
                event.clientY

            );

        }

    }

);



function moveRunawayButton(
    button,
    pointerClientX = null,
    pointerClientY = null
) {

    const state =
        button.userDataRunaway;


    if (
        !state
    ) {

        return;

    }


    const now =
        performance.now();


    /*
       Sau mỗi lần né,
       đứng yên khoảng 480ms.

       → không còn chạy vù vù liên tục.
    */
    if (
        now
        -
        state.lastMove
        <
        480
    ) {

        return;

    }


    state.lastMove =
        now;


    const container =
        questionOptions;


    const containerRect =
        container
            .getBoundingClientRect();


    const buttonRect =
        button
            .getBoundingClientRect();


    /*
       Vị trí ban đầu của nút
       trước khi transform.
    */
    const baseLeft =
        button.offsetLeft;


    const baseTop =
        button.offsetTop;


    const padding =
        10;


    /*
       Giới hạn translate để nút
       không chạy khỏi popup.
    */
    const minX =
        padding
        -
        baseLeft;


    const maxX =
        containerRect.width
        -
        button.offsetWidth
        -
        padding
        -
        baseLeft;


    const minY =
        padding
        -
        baseTop;


    const maxY =
        containerRect.height
        -
        button.offsetHeight
        -
        padding
        -
        baseTop;


    let directionX =
        Math.random()
            >
            0.5
            ? 1
            : -1;


    let directionY =
        (
            Math.random()
            -
            0.5
        )
        *
        0.65;


    /*
       Nếu biết vị trí chuột,
       ưu tiên chạy NGƯỢC khỏi chuột.
    */
    if (
        pointerClientX !== null
        &&
        pointerClientY !== null
    ) {

        const centerX =
            buttonRect.left
            +
            buttonRect.width
            /
            2;


        const centerY =
            buttonRect.top
            +
            buttonRect.height
            /
            2;


        let dx =
            centerX
            -
            pointerClientX;


        let dy =
            centerY
            -
            pointerClientY;


        const length =
            Math.hypot(
                dx,
                dy
            )
            ||
            1;


        directionX =
            dx
            /
            length;


        directionY =
            dy
            /
            length;

    }


    /*
       Không chạy quá xa.

       Đây là điểm tạo cảm giác
       trêu ngươi thay vì teleport.
    */
    const distance =
        rand(
            75,
            115
        );


    let nextX =
        state.x
        +
        directionX
        *
        distance;


    let nextY =
        state.y
        +
        directionY
        *
        distance;


    /*
       Một chút lệch ngẫu nhiên
       để không chạy theo đường thẳng.
    */
    nextX +=
        rand(
            -18,
            18
        );


    nextY +=
        rand(
            -15,
            15
        );


    nextX =
        THREE.MathUtils.clamp(

            nextX,

            minX,

            maxX

        );


    nextY =
        THREE.MathUtils.clamp(

            nextY,

            minY,

            maxY

        );


    /*
       Nếu bị dồn sát mép,
       cho nó lách sang hướng khác.
    */
    if (
        Math.abs(
            nextX
            -
            state.x
        )
        <
        28
    ) {

        nextX =
            THREE.MathUtils.clamp(

                state.x
                +
                (
                    Math.random()
                        >
                        0.5
                        ? 75
                        : -75
                ),

                minX,

                maxX

            );

    }


    state.x =
        nextX;


    state.y =
        nextY;


    button.style.transform =
        `translate3d(${nextX}px, ${nextY}px, 0)`;

}

/* =========================================================
   FINAL LETTER
========================================================= */

finalBtn
    ?.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();


            finalOpen =
                true;


            if (
                finalTitle
            ) {

                finalTitle.textContent =
                    finalLetter.title
                    ??
                    "♡";

            }


            if (
                finalMessage
            ) {

                finalMessage.textContent =
                    finalLetter.message
                    ??
                    "";

            }


            setImageOrHide(
                finalImage,
                finalLetter.image
            );


            finalOverlay
                ?.classList
                .remove(
                    "hidden"
                );

        }

    );


function closeFinal() {

    finalOpen =
        false;


    finalOverlay
        ?.classList
        .add(
            "hidden"
        );

}


finalClose
    ?.addEventListener(
        "click",
        closeFinal
    );


finalOverlay
    ?.addEventListener(

        "click",

        function (event) {

            if (
                event.target
                ===
                finalOverlay
            ) {

                closeFinal();

            }

        }

    );


/* =========================================================
   INTRO / BACK
========================================================= */

let started =
    false;


startBtn
    ?.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();


            started =
                true;


            intro
                ?.classList
                .add(
                    "hidden"
                );


            sceneUi
                ?.classList
                .remove(
                    "hidden"
                );


            moveHint
                ?.classList
                .remove(
                    "hidden"
                );


            setTimeout(

                function () {

                    moveHint
                        ?.classList
                        .add(
                            "hidden"
                        );

                },

                6500

            );

        }

    );


backBtn
    ?.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();


            wishOpen =
                false;


            finalOpen =
                false;


            wishOverlay
                ?.classList
                .add(
                    "hidden"
                );


            finalOverlay
                ?.classList
                .add(
                    "hidden"
                );


            sceneUi
                ?.classList
                .add(
                    "hidden"
                );


            moveHint
                ?.classList
                .add(
                    "hidden"
                );


            intro
                ?.classList
                .remove(
                    "hidden"
                );


            started =
                false;


            document.body.style.cursor =
                "default";

        }

    );


/* =========================================================
   RESET
========================================================= */

// resetBtn
//     ?.addEventListener(

//         "click",

//         function (event) {

//             event.stopPropagation();


//             openedWishIndexes
//                 .clear();


//             // secretLanternRevealed =
//             //     false;


//             interactiveLanterns
//                 .forEach(

//                     function (item) {

//                         const lantern =
//                             item.object;


//                         lantern.userData.opened =
//                             false;


//                         lantern.userData.hovered =
//                             false;


//                         lantern.visible =
//                             true;


//                         lantern
//                             .userData
//                             .bodyMaterial
//                             .emissive
//                             .set(
//                                 0xff3f18
//                             );


//                         lantern
//                             .userData
//                             .bodyMaterial
//                             .emissiveIntensity =
//                             2.5;


//                         lantern
//                             .userData
//                             .glowMaterial
//                             .color
//                             .set(
//                                 0xff5a2c
//                             );


//                         lantern
//                             .userData
//                             .glowMaterial
//                             .opacity =
//                             0.52;


//                         lantern.scale
//                             .setScalar(
//                                 lantern
//                                     .userData
//                                     .baseScale
//                             );

//                     }

//                 );


//             finalBtn
//                 ?.classList
//                 .add(
//                     "hidden"
//                 );


//             if (
//                 sceneSubtitle
//             ) {

//                 sceneSubtitle.textContent =
//                     "chạm vào những chiếc đèn nhấp nháy ✦";

//             }


//             closeFinal();


//             closeWish();


//             updateProgress();

//         }

//     );

resetBtn
    ?.addEventListener(

        "click",

        function (event) {

            event.stopPropagation();

            closeFinal();
            closeWish();
            closeQuestion();

            resetGame();

        }

    );


/* =========================================================
   DRAG TO ROTATE
========================================================= */

let pointerX =
    0;


let pointerY =
    0;


let targetX =
    0;


let targetY =
    0;


let isDragging =
    false;


let dragStartedOnLantern =
    false;


let dragStartX =
    0;


let dragStartY =
    0;


let previousDragX =
    0;


let previousDragY =
    0;


let targetWorldYaw =
    0;


let worldYaw =
    0;


let targetWorldPitch =
    0;


let worldPitch =
    0;


const MAX_WORLD_PITCH =
    0.10;


function isUiTarget(
    target
) {

    return Boolean(

        target
            ?.closest
            ?.(
                "button, .wish-card, .final-card"
            )

    );

}


/* =========================================================
   POINTER DOWN
========================================================= */

window.addEventListener(

    "pointerdown",

    function (event) {

        if (
            !started
            ||
            questionOpen
            ||
            wishOpen
            ||
            finalOpen
            ||
            isUiTarget(
                event.target
            )
        ) {

            return;

        }


        const lantern =
            raycastLantern(
                event.clientX,
                event.clientY
            );


        dragStartedOnLantern =
            Boolean(
                lantern
            );


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


        try {

            renderer
                .domElement
                .setPointerCapture
                ?.(
                    event.pointerId
                );

        }

        catch { }


        document.body.style.cursor =
            "grabbing";

    }

);


/* =========================================================
   POINTER MOVE
========================================================= */

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


        if (
            isDragging
        ) {

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


            targetWorldYaw +=
                dx
                *
                0.006;


            targetWorldPitch +=
                dy
                *
                0.0025;


            targetWorldPitch =
                THREE.MathUtils
                    .clamp(

                        targetWorldPitch,

                        -MAX_WORLD_PITCH,

                        MAX_WORLD_PITCH

                    );


            document.body.style.cursor =
                "grabbing";


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
            hoveredLantern
            !==
            hit
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
                "grab";

        }

    }

);


/* =========================================================
   POINTER UP
========================================================= */

window.addEventListener(

    "pointerup",

    function (event) {

        if (
            !isDragging
        ) {

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


        try {

            renderer
                .domElement
                .releasePointerCapture
                ?.(
                    event.pointerId
                );

        }

        catch { }


        document.body.style.cursor =
            started
                ? "grab"
                : "default";


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


            if (
                lantern
            ) {

                openLanternQuestion(
                    lantern
                );

            }

        }


        dragStartedOnLantern =
            false;

    }

);


/* =========================================================
   POINTER CANCEL
========================================================= */

window.addEventListener(

    "pointercancel",

    function () {

        isDragging =
            false;


        dragStartedOnLantern =
            false;


        document.body.style.cursor =
            started
                ? "grab"
                : "default";

    }

);


/* =========================================================
   ANIMATION
========================================================= */

let reveal =
    0;


let elapsed =
    0;


let last =
    performance.now();


function animate(
    now
) {

    requestAnimationFrame(
        animate
    );


    const dt =
        Math.min(

            (
                now
                -
                last
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
            dt
            *
            1.8
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
            dt
            *
            3
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
            dt
            *
            3
        );


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
        0.30;


    camera.position.y =
        desiredCamera.y
        -
        pointerY
        *
        0.15;


    camera.position.z =
        desiredCamera.z;


    camera.lookAt(

        pointerX
        *
        0.09,

        1.35
        -
        pointerY
        *
        0.06,

        0

    );


    /* world rotation */

    worldYaw =
        THREE.MathUtils
            .lerp(

                worldYaw,

                targetWorldYaw,

                Math.min(
                    1,
                    dt
                    *
                    7
                )

            );


    worldPitch =
        THREE.MathUtils
            .lerp(

                worldPitch,

                targetWorldPitch,

                Math.min(
                    1,
                    dt
                    *
                    7
                )

            );


    world.rotation.y =
        worldYaw;


    world.rotation.x =
        worldPitch;


    /* blossom breathing */

    blossomGroup.rotation.y =
        Math.sin(
            elapsed
            *
            0.08
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
            elapsed
            *
            1.4
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


            positions[
                i * 3
            ] =
                petal.x;


            positions[
                i * 3 + 1
            ] =
                petal.y;


            positions[
                i * 3 + 2
            ] =
                petal.z;

        }

    );


    petalGeometry
        .attributes
        .position
        .needsUpdate =
        true;


    /* =====================================================
       INTERACTIVE LANTERNS
    ===================================================== */

    interactiveLanterns
        .forEach(

            function (item) {

                const lantern =
                    item.object;


                if (
                    !lantern.visible
                ) {

                    return;

                }


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

                            lantern
                                .scale
                                .x,

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
                   Đèn có lời chúc và chưa mở:
                   nhấp nháy
                */

                if (
                    !lantern
                        .userData
                        .opened
                ) {

                    const blink =
                        (
                            Math.sin(

                                elapsed
                                *
                                2.45
                                +
                                item.phase

                            )
                            +
                            1
                        )
                        /
                        2;


                    lantern
                        .userData
                        .glowMaterial
                        .opacity =
                        0.34
                        +
                        blink
                        *
                        0.58;


                    lantern
                        .userData
                        .bodyMaterial
                        .emissiveIntensity =
                        2.05
                        +
                        blink
                        *
                        1.90;


                    if (
                        lantern
                            .userData
                            .hovered
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
                       Đã đọc:
                       giữ ánh vàng ổn định
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


    /* =====================================================
       DECORATIVE LANTERNS
    ===================================================== */

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


    /* =====================================================
       CHARACTER FLOAT / BREATHING
    ===================================================== */

    if (
        voHonDuong
    ) {

        voHonDuong.position.y =
            voHonDuong
                .userData
                .baseY
            +
            Math.sin(
                elapsed
                *
                1.15
            )
            *
            0.025;

    }


    characterName.position.y =

        (
            mobile
                ? 2.90
                : 3.42
        )

        +

        Math.sin(
            elapsed
            *
            1.15
        )
        *
        0.018;


    characterGlow
        .material
        .opacity =

        0.16

        +

        (
            Math.sin(
                elapsed
                *
                1.4
            )
            +
            1
        )
        *
        0.035;


    composer.render();

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(

    "resize",

    function () {

        camera.aspect =
            innerWidth
            /
            innerHeight;


        camera
            .updateProjectionMatrix();


        renderer.setPixelRatio(

            Math.min(

                devicePixelRatio,

                mobile
                    ? 1.5
                    : 2

            )

        );


        renderer.setSize(
            innerWidth,
            innerHeight
        );


        composer.setSize(
            innerWidth,
            innerHeight
        );

    }

);


/* ==========================================
   RESET GAME
========================================== */

function resetGame() {

    openedWishIndexes.clear();
    secretLanternRevealed =
        false;


    interactiveLanterns
        .forEach(

            function (item) {

                const lantern =
                    item.object;


                lantern.userData.opened =
                    false;


                lantern.userData.hovered =
                    false;


                lantern.visible =
                    !lantern
                        .userData
                        .isSecret;


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


                lantern
                    .userData
                    .glowMaterial
                    .opacity =
                    0.52;


                lantern.scale
                    .setScalar(

                        lantern
                            .userData
                            .baseScale

                    );

            }

        );


    finalBtn
        ?.classList
        .add(
            "hidden"
        );


    sceneSubtitle.textContent =
        "trả lời đúng 5 câu hỏi để mở khóa câu đặc biệt ✦";


    updateProgress();

}


/* =========================================================
   INIT
========================================================= */

if (
    sceneSubtitle
) {

    sceneSubtitle.textContent =
        "chạm vào những chiếc đèn nhấp nháy ✦";

}


updateProgress();


requestAnimationFrame(
    animate
);