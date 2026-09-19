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
   FLOATING BACKGROUND
========================================== */

const floatingSymbols = [
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
        Math.random() * 100
        + "vw";


    item.style.fontSize =
        14
        +
        Math.random() * 20
        +
        "px";


    item.style.color =
        Math.random() > 0.35

            ? "rgba(235,132,166,.38)"

            : "rgba(179,154,232,.33)";


    const duration =
        7
        +
        Math.random() * 5;


    item.style.animationDuration =
        duration + "s";


    floatingLayer.appendChild(item);


    setTimeout(
        () => item.remove(),
        duration * 1000
    );

}


setInterval(
    createFloatingItem,
    650
);


/* ==========================================
   NO BUTTON CONFIG
========================================== */

/*
    Mỗi lần né đúng khoảng 58px.
*/
const NO_STEP = 58;


/*
    Chuột còn cách khoảng 115px
    thì nút đã bắt đầu né.
*/
const NO_TRIGGER_DISTANCE = 115;


/*
    Nút được phép lòi ra ngoài
    card khoảng 12px.
*/
const CARD_OVERFLOW = 12;


/*
    Tuyệt đối cách mép màn hình
    ít nhất khoảng này.
*/
const SCREEN_MARGIN = 10;


/*
    Không cho chạy quá dồn dập.

    55ms + transition 70ms
    => phản ứng rất nhanh.
*/
const MOVE_COOLDOWN = 55;


/*
    Sau khi mở trang,
    nút chưa được phép chạy ngay.

    Chỉ "armed" khi chuột đã từng
    ở xa nút một chút.
*/
const ARM_DISTANCE = 155;


let noButtonArmed = false;

let lastNoMove = 0;

let transitionBusy = false;


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


    lastNoMove = now;


    const cardRect =
        mainCard.getBoundingClientRect();


    /*
        Lấy vị trí hiện tại TRƯỚC KHI
        chuyển nút ra body.
    */

    const noRect =
        noBtn.getBoundingClientRect();


    const yesRect =
        yesBtn.getBoundingClientRect();


    const centerX =
        noRect.left
        +
        noRect.width / 2;


    const centerY =
        noRect.top
        +
        noRect.height / 2;


    /*
        Góc chạy ngược khỏi chuột.
    */

    const awayAngle =
        Math.atan2(
            centerY - pointerY,
            centerX - pointerX
        );


    /*
        Bounds:

        - quanh card ±12px
        - đồng thời KHÔNG vượt màn hình.
    */

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


    /*
        Nếu hướng thẳng bị mép card chặn,
        thử nhiều hướng lệch.

        Vẫn luôn ưu tiên chạy ra xa chuột.
    */

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
            awayAngle + offset;


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


        /*
            Càng xa con trỏ càng tốt.
        */

        const distanceFromPointer =
            Math.hypot(
                newCenterX - pointerX,
                newCenterY - pointerY
            );


        /*
            Tránh vị trí bị clamp
            khiến gần như không di chuyển.
        */

        const actualMovement =
            Math.hypot(
                candidateX - noRect.left,
                candidateY - noRect.top
            );


        let score =
            distanceFromPointer
            +
            actualMovement * 0.65;


        /*
            Không cho nút Không
            che lên Cóooo nếu có lựa chọn khác.
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
        Lần đầu nút chạy:

        đưa nó ra body rồi position:fixed.

        Làm vậy tránh lỗi khi card bị transform
        trên màn hình điện thoại nhỏ.
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

        /*
            Touch xử lý riêng ở pointerdown.
        */

        if (
            event.pointerType
            ===
            "touch"
        ) {
            return;
        }


        /*
            Chỉ hoạt động ở màn câu hỏi.
        */

        if (
            !resultScreen
                .classList
                .contains("hidden")
        ) {
            return;
        }


        const rect =
            noBtn.getBoundingClientRect();


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
                event.clientX - centerX,
                event.clientY - centerY
            );


        /*
            QUAN TRỌNG:

            Khi vừa load:
            Không KHÔNG tự chạy.

            Chuột phải từng ở xa nút
            trước khi hệ thống được armed.
        */

        if (!noButtonArmed) {

            if (
                distance
                >
                ARM_DISTANCE
            ) {

                noButtonArmed = true;

            }


            return;
        }


        /*
            Sau khi armed:

            chuột còn cách 115px
            thì nút đã né.
        */

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

/*
    noBtn có pointer-events:none,
    nên ta phát hiện tap bằng document.

    Chỉ khi tap thực sự nằm trên / rất gần
    nút Không thì mới ngăn click và cho né.

    Cóooo hoàn toàn không bị ảnh hưởng.
*/

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
            noBtn.getBoundingClientRect();


        const extra =
            14;


        const tappedNo =
            event.clientX
            >=
            rect.left - extra

            &&

            event.clientX
            <=
            rect.right + extra

            &&

            event.clientY
            >=
            rect.top - extra

            &&

            event.clientY
            <=
            rect.bottom + extra;


        if (!tappedNo) {
            return;
        }


        /*
            Không cho cú tap xuyên xuống
            element phía dưới.
        */

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
   RESET NO BUTTON
========================================== */

function resetNoButton() {

    noButtonArmed =
        false;

    lastNoMove =
        0;


    /*
        Tắt animation trong lúc
        đưa nút về vị trí ban đầu.
    */

    noBtn.style.transition =
        "none";


    noBtn.style.display =
        "";


    /*
        Đưa trở lại buttonZone.
    */

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


    /*
        Force layout để trình duyệt
        áp vị trí reset ngay.
    */

    void noBtn.offsetWidth;


    requestAnimationFrame(
        () => {

            /*
                Xóa inline transition
                để dùng lại CSS 0.07s.
            */

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

        if (transitionBusy) {
            return;
        }


        transitionBusy =
            true;


        /*
            Nếu Không đang ở ngoài card,
            ẩn ngay khi bấm Có.
        */

        noBtn.style.display =
            "none";


        const questionAnimation =
            questionScreen.animate(

                [
                    {
                        opacity: 1,

                        transform:
                            "translateY(0) scale(1)"
                    },

                    {
                        opacity: 0,

                        transform:
                            "translateY(-15px) scale(.96)"
                    }
                ],

                {
                    duration: 380,

                    easing: "ease",

                    fill: "forwards"
                }

            );


        questionAnimation.onfinish =
            function () {

                questionAnimation.cancel();


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
                                opacity: 0,

                                transform:
                                    "translateY(24px) scale(.94)"
                            },

                            {
                                opacity: 1,

                                transform:
                                    "translateY(0) scale(1)"
                            }
                        ],

                        {
                            duration: 650,

                            easing:
                                "cubic-bezier(.2,.8,.2,1)",

                            fill: "forwards"
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
        "#f28dad",
        "#ffb3c7",
        "#d9b8ff",
        "#ffd87d",
        "#ff9fbc"
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
            centerX + "px";


        particle.style.top =
            centerY + "px";


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
            .appendChild(particle);


        setTimeout(
            () => particle.remove(),
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

        if (transitionBusy) {
            return;
        }


        transitionBusy =
            true;


        const resultAnimation =
            resultScreen.animate(

                [
                    {
                        opacity: 1,

                        transform:
                            "translateY(0) scale(1)"
                    },

                    {
                        opacity: 0,

                        transform:
                            "translateY(15px) scale(.96)"
                    }
                ],

                {
                    duration: 300,

                    easing: "ease",

                    fill: "forwards"
                }

            );


        resultAnimation.onfinish =
            function () {

                resultAnimation.cancel();


                resultScreen
                    .classList
                    .add("hidden");


                questionScreen
                    .classList
                    .remove("hidden");


                /*
                    Reset Không về đúng cạnh Cóooo.
                */

                resetNoButton();


                const questionAnimation =
                    questionScreen.animate(

                        [
                            {
                                opacity: 0,

                                transform:
                                    "translateY(15px) scale(.97)"
                            },

                            {
                                opacity: 1,

                                transform:
                                    "translateY(0) scale(1)"
                            }
                        ],

                        {
                            duration: 450,

                            easing:
                                "cubic-bezier(.2,.8,.2,1)",

                            fill: "forwards"
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
   RESIZE / ROTATE
========================================== */

/*
    Nếu đổi kích thước cửa sổ / xoay điện thoại,
    reset Không để chắc chắn không bao giờ
    nằm ngoài màn hình.
*/

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

/*
    Đảm bảo dù refresh / Live Server reload,
    Không luôn bắt đầu đúng cạnh Cóooo.
*/

resetNoButton();