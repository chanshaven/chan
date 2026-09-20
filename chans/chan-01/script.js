/* ==========================================
   ELEMENTS
========================================== */

const mainCard =
    document.getElementById("card");

const questionScreen =
    document.getElementById("questionScreen");

const resultScreen =
    document.getElementById("resultScreen");

const buttonZone =
    document.getElementById("buttonZone");

const yesBtn =
    document.getElementById("yesBtn");

const noBtn =
    document.getElementById("noBtn");

const againBtn =
    document.getElementById("againBtn");

const floatingLayer =
    document.getElementById("floatingLayer");


/* ==========================================
   FLOATING HEARTS / STARS
========================================== */

const floatingSymbols = [
    "♡",
    "♡",
    "♡",
    "♡",
    "✦",
    "✧",
    "⋆"
];


function createFloatingItem() {

    const item =
        document.createElement("div");


    item.className =
        "float-item";


    item.textContent =
        floatingSymbols[
        Math.floor(
            Math.random()
            *
            floatingSymbols.length
        )
        ];


    item.style.left =
        Math.random()
        *
        100
        +
        "vw";


    item.style.fontSize =
        15
        +
        Math.random()
        *
        23
        +
        "px";


    item.style.color =
        Math.random() > 0.30

            ? "rgba(232, 91, 139, .64)"

            : "rgba(138, 178, 232, .60)";


    const duration =
        7
        +
        Math.random()
        *
        5;


    item.style.animationDuration =
        duration
        +
        "s";


    floatingLayer
        .appendChild(item);


    setTimeout(
        () => item.remove(),

        duration * 1000
    );

}


setInterval(
    createFloatingItem,
    480
);


/* ==========================================
   NO BUTTON SETTINGS
========================================== */

const NO_STEP =
    58;


const NO_TRIGGER_DISTANCE =
    115;


const CARD_OVERFLOW =
    12;


const SCREEN_MARGIN =
    10;


const MOVE_COOLDOWN =
    55;


const ARM_DISTANCE =
    155;


let noButtonArmed =
    false;


let lastNoMove =
    0;


let transitionBusy =
    false;


/* ==========================================
   HELPERS
========================================== */

function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,

        Math.min(
            value,
            max
        )
    );

}


function rectanglesOverlap(
    a,
    b,
    margin = 0
) {

    return !(
        a.right + margin < b.left
        ||
        a.left - margin > b.right
        ||
        a.bottom + margin < b.top
        ||
        a.top - margin > b.bottom
    );

}


/* ==========================================
   MOVE NO BUTTON
========================================== */

function moveNoButton(
    pointerX,
    pointerY
) {

    const now =
        performance.now();


    if (
        now - lastNoMove
        <
        MOVE_COOLDOWN
    ) {
        return;
    }


    lastNoMove =
        now;


    const cardRect =
        mainCard
            .getBoundingClientRect();


    const noRect =
        noBtn
            .getBoundingClientRect();


    const yesRect =
        yesBtn
            .getBoundingClientRect();


    const centerX =
        noRect.left
        +
        noRect.width / 2;


    const centerY =
        noRect.top
        +
        noRect.height / 2;


    const awayAngle =
        Math.atan2(
            centerY - pointerY,
            centerX - pointerX
        );


    /* card ±12px, but never outside screen */

    const minX =
        Math.max(
            SCREEN_MARGIN,

            cardRect.left
            -
            CARD_OVERFLOW
        );


    const rawMaxX =
        Math.min(

            window.innerWidth
            -
            noRect.width
            -
            SCREEN_MARGIN,

            cardRect.right
            -
            noRect.width
            +
            CARD_OVERFLOW

        );


    const maxX =
        Math.max(
            minX,
            rawMaxX
        );


    const minY =
        Math.max(
            SCREEN_MARGIN,

            cardRect.top
            -
            CARD_OVERFLOW
        );


    const rawMaxY =
        Math.min(

            window.innerHeight
            -
            noRect.height
            -
            SCREEN_MARGIN,

            cardRect.bottom
            -
            noRect.height
            +
            CARD_OVERFLOW

        );


    const maxY =
        Math.max(
            minY,
            rawMaxY
        );


    const angleOffsets = [
        0,
        0.38,
        -0.38,
        0.72,
        -0.72,
        1.05,
        -1.05,
        1.40,
        -1.40
    ];


    let bestX =
        noRect.left;


    let bestY =
        noRect.top;


    let bestScore =
        -Infinity;


    for (
        const offset
        of angleOffsets
    ) {

        const angle =
            awayAngle
            +
            offset;


        let candidateX =
            noRect.left
            +
            Math.cos(angle)
            *
            NO_STEP;


        let candidateY =
            noRect.top
            +
            Math.sin(angle)
            *
            NO_STEP;


        candidateX =
            clamp(
                candidateX,
                minX,
                maxX
            );


        candidateY =
            clamp(
                candidateY,
                minY,
                maxY
            );


        const candidateRect = {

            left:
                candidateX,

            right:
                candidateX
                +
                noRect.width,

            top:
                candidateY,

            bottom:
                candidateY
                +
                noRect.height

        };


        const newCenterX =
            candidateX
            +
            noRect.width / 2;


        const newCenterY =
            candidateY
            +
            noRect.height / 2;


        const distanceFromPointer =
            Math.hypot(

                newCenterX
                -
                pointerX,

                newCenterY
                -
                pointerY

            );


        const actualMovement =
            Math.hypot(

                candidateX
                -
                noRect.left,

                candidateY
                -
                noRect.top

            );


        let score =
            distanceFromPointer
            +
            actualMovement
            *
            0.65;


        /*
           Don't cover YES.
        */

        if (
            rectanglesOverlap(
                candidateRect,
                yesRect,
                8
            )
        ) {

            score -= 350;

        }


        if (
            score > bestScore
        ) {

            bestScore =
                score;

            bestX =
                candidateX;

            bestY =
                candidateY;

        }

    }


    /*
       Move NO to body after first escape.
    */

    if (
        noBtn.parentElement
        !==
        document.body
    ) {

        document.body
            .appendChild(noBtn);

    }


    noBtn.style.position =
        "fixed";


    noBtn.style.right =
        "auto";


    noBtn.style.left =
        `${bestX}px`;


    noBtn.style.top =
        `${bestY}px`;


    noBtn.style.zIndex =
        "9999";

}


/* ==========================================
   DESKTOP
========================================== */

document.addEventListener(
    "pointermove",

    function (event) {

        if (
            event.pointerType
            ===
            "touch"
        ) {
            return;
        }


        if (
            !resultScreen
                .classList
                .contains("hidden")
        ) {
            return;
        }


        const rect =
            noBtn
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
           No automatic movement on load.
        */

        if (
            !noButtonArmed
        ) {

            if (
                distance
                >
                ARM_DISTANCE
            ) {

                noButtonArmed =
                    true;

            }


            return;
        }


        if (
            distance
            <
            NO_TRIGGER_DISTANCE
        ) {

            moveNoButton(
                event.clientX,
                event.clientY
            );

        }

    }
);


/* ==========================================
   MOBILE
========================================== */

document.addEventListener(
    "pointerdown",

    function (event) {

        if (
            event.pointerType
            !==
            "touch"
            &&
            event.pointerType
            !==
            "pen"
        ) {
            return;
        }


        if (
            !resultScreen
                .classList
                .contains("hidden")
        ) {
            return;
        }


        const rect =
            noBtn
                .getBoundingClientRect();


        const extra =
            16;


        const tappedNo =
            event.clientX
            >=
            rect.left
            -
            extra

            &&

            event.clientX
            <=
            rect.right
            +
            extra

            &&

            event.clientY
            >=
            rect.top
            -
            extra

            &&

            event.clientY
            <=
            rect.bottom
            +
            extra;


        if (
            !tappedNo
        ) {
            return;
        }


        event.preventDefault();

        event.stopPropagation();


        noButtonArmed =
            true;


        moveNoButton(
            event.clientX,
            event.clientY
        );

    },

    true
);


/* ==========================================
   RESET NO
========================================== */

function resetNoButton() {

    noButtonArmed =
        false;


    lastNoMove =
        0;


    noBtn.style.transition =
        "none";


    noBtn.style.display =
        "";


    buttonZone
        .appendChild(noBtn);


    noBtn.style.position =
        "absolute";


    noBtn.style.left =
        "auto";


    noBtn.style.right =
        "8px";


    noBtn.style.top =
        "10px";


    noBtn.style.zIndex =
        "";


    void noBtn.offsetWidth;


    requestAnimationFrame(
        () => {

            noBtn.style.transition =
                "";

        }
    );

}


/* ==========================================
   YES
========================================== */

yesBtn.addEventListener(
    "click",

    function () {

        if (
            transitionBusy
        ) {
            return;
        }


        transitionBusy =
            true;


        noBtn.style.display =
            "none";


        const questionAnimation =
            questionScreen.animate(

                [
                    {
                        opacity:
                            1,

                        transform:
                            "translateY(0) scale(1)"
                    },

                    {
                        opacity:
                            0,

                        transform:
                            "translateY(-15px) scale(.96)"
                    }
                ],

                {
                    duration:
                        380,

                    easing:
                        "ease",

                    fill:
                        "forwards"
                }

            );


        questionAnimation.onfinish =
            function () {

                questionAnimation
                    .cancel();


                questionScreen
                    .classList
                    .add("hidden");


                resultScreen
                    .classList
                    .remove("hidden");


                const resultAnimation =
                    resultScreen.animate(

                        [
                            {
                                opacity:
                                    0,

                                transform:
                                    "translateY(24px) scale(.94)"
                            },

                            {
                                opacity:
                                    1,

                                transform:
                                    "translateY(0) scale(1)"
                            }
                        ],

                        {
                            duration:
                                650,

                            easing:
                                "cubic-bezier(.2,.8,.2,1)",

                            fill:
                                "forwards"
                        }

                    );


                resultAnimation.onfinish =
                    function () {

                        resultAnimation
                            .cancel();


                        transitionBusy =
                            false;

                    };


                heartExplosion();

            };

    }
);


/* ==========================================
   CONFETTI
========================================== */

function heartExplosion() {

    const colors = [
        "#e65a89",
        "#ff9dbd",
        "#9dc7ff",
        "#ffd46f",
        "#c49cff"
    ];


    const centerX =
        window.innerWidth / 2;


    const centerY =
        window.innerHeight / 2;


    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const particle =
            document.createElement("div");


        particle.className =
            "confetti";


        particle.style.left =
            centerX
            +
            "px";


        particle.style.top =
            centerY
            +
            "px";


        particle.style.background =
            colors[
            Math.floor(
                Math.random()
                *
                colors.length
            )
            ];


        const angle =
            Math.random()
            *
            Math.PI
            *
            2;


        const distance =
            120
            +
            Math.random()
            *
            240;


        particle.style.setProperty(
            "--x",

            Math.cos(angle)
            *
            distance
            +
            "px"
        );


        particle.style.setProperty(
            "--y",

            Math.sin(angle)
            *
            distance
            +
            "px"
        );


        particle.style.setProperty(
            "--r",

            Math.random()
            *
            720
            +
            "deg"
        );


        document.body
            .appendChild(
                particle
            );


        setTimeout(
            () =>
                particle.remove(),

            1400
        );

    }

}


/* ==========================================
   PLAY AGAIN
========================================== */

againBtn.addEventListener(
    "click",

    function () {

        if (
            transitionBusy
        ) {
            return;
        }


        transitionBusy =
            true;


        const resultAnimation =
            resultScreen.animate(

                [
                    {
                        opacity:
                            1,

                        transform:
                            "translateY(0) scale(1)"
                    },

                    {
                        opacity:
                            0,

                        transform:
                            "translateY(15px) scale(.96)"
                    }
                ],

                {
                    duration:
                        300,

                    easing:
                        "ease",

                    fill:
                        "forwards"
                }

            );


        resultAnimation.onfinish =
            function () {

                resultAnimation
                    .cancel();


                resultScreen
                    .classList
                    .add("hidden");


                questionScreen
                    .classList
                    .remove("hidden");


                resetNoButton();


                const questionAnimation =
                    questionScreen.animate(

                        [
                            {
                                opacity:
                                    0,

                                transform:
                                    "translateY(15px) scale(.97)"
                            },

                            {
                                opacity:
                                    1,

                                transform:
                                    "translateY(0) scale(1)"
                            }
                        ],

                        {
                            duration:
                                450,

                            easing:
                                "cubic-bezier(.2,.8,.2,1)",

                            fill:
                                "forwards"
                        }

                    );


                questionAnimation.onfinish =
                    function () {

                        questionAnimation
                            .cancel();


                        transitionBusy =
                            false;

                    };

            };

    }
);


/* ==========================================
   RESIZE
========================================== */

window.addEventListener(
    "resize",

    function () {

        if (
            resultScreen
                .classList
                .contains("hidden")
        ) {

            resetNoButton();

        }

    }
);


/* ==========================================
   INITIAL STATE
========================================== */

resetNoButton();