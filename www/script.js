/* =====================================================
   LUJI
===================================================== */


/* =====================================================
   DATOS
===================================================== */

let trainings =
    JSON.parse(
        localStorage.getItem("luji_trainings")
    ) || [];


let competitions =
    JSON.parse(
        localStorage.getItem("luji_competitions")
    ) || [];


let notifications = [];


/* =====================================================
   NAVEGACIÓN
===================================================== */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const selected =
        document.getElementById(pageId);


    if (selected) {

        selected.classList.add("active");

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");


            if (
                item.dataset.page === pageId
            ) {

                item.classList.add("active");

            }

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   TEMPORIZADOR
===================================================== */

let timerSeconds = 300;

let timerInterval = null;

let timerRunning = false;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;


    document.getElementById(
        "timerDisplay"
    ).textContent =

        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function setTimer(seconds) {

    pauseTimer();

    timerSeconds = seconds;

    updateTimerDisplay();

}


function startTimer() {

    if (timerRunning) return;

    timerRunning = true;


    timerInterval =
        setInterval(() => {

            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimerDisplay();

            } else {

                pauseTimer();

                createNotification(
                    "⏱️ Temporizador",
                    "¡Terminaste tu sesión de entrenamiento!"
                );

                alert(
                    "⏱️ ¡Terminaste tu sesión!"
                );

            }

        }, 1000);

}


function pauseTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    timerInterval = null;

}


function resetTimer() {

    pauseTimer();

    timerSeconds = 300;

    updateTimerDisplay();

}


/* =====================================================
   AUDIO
===================================================== */

function getAudio() {

    return document.getElementById(
        "lujiAudio"
    );

}


function playAudio() {

    const audio = getAudio();

    if (!audio) return;

    audio.play();

}


function pauseAudio() {

    const audio = getAudio();

    if (!audio) return;

    audio.pause();

}


function restartAudio() {

    const audio = getAudio();

    if (!audio) return;

    audio.currentTime = 0;

    audio.play();

}


/* =====================================================
   RESPIRACIÓN
===================================================== */

let breathingRunning = false;

let breathingInterval = null;

let breathingPhase = 0;

let breathingSeconds = 4;


const breathingPhases = [

    {
        name: "Inhalá",
        seconds: 4,
        className: "inhale"
    },

    {
        name: "Mantené",
        seconds: 4,
        className: "inhale"
    },

    {
        name: "Exhalá",
        seconds: 6,
        className: "exhale"
    }

];


function toggleBreathing() {

    if (breathingRunning) {

        stopBreathing();

    } else {

        startBreathing();

    }

}


function startBreathing() {

    breathingRunning = true;

    breathingPhase = 0;

    startBreathingPhase();


    document.getElementById(
        "breathingButton"
    ).textContent =
        "⏸ Detener";


    breathingInterval =
        setInterval(
            updateBreathing,
            1000
        );

}


function updateBreathing() {

    breathingSeconds--;


    document.getElementById(
        "breathingTimer"
    ).textContent =
        `${breathingSeconds} ${
            breathingSeconds === 1
            ? "segundo"
            : "segundos"
        }`;


    if (breathingSeconds <= 0) {

        breathingPhase++;


        if (
            breathingPhase >=
            breathingPhases.length
        ) {

            breathingPhase = 0;

        }


        startBreathingPhase();

    }

}


function startBreathingPhase() {

    const phase =
        breathingPhases[
            breathingPhase
        ];


    const circle =
        document.getElementById(
            "breathingCircle"
        );


    const text =
        document.getElementById(
            "breathingText"
        );


    circle.classList.remove(
        "inhale",
        "exhale"
    );


    void circle.offsetWidth;


    circle.classList.add(
        phase.className
    );


    text.textContent =
        phase.name;


    breathingSeconds =
        phase.seconds;


    document.getElementById(
        "breathingTimer"
    ).textContent =
        `${breathingSeconds} segundos`;

}


function stopBreathing() {

    breathingRunning = false;


    clearInterval(
        breathingInterval
    );


    breathingInterval = null;


    const circle =
        document.getElementById(
            "breathingCircle"
        );


    const text =
        document.getElementById(
            "breathingText"
        );


    circle.classList.remove(
        "inhale",
        "exhale"
    );


    text.textContent =
        "Preparada";


    document.getElementById(
        "breathingTimer"
    ).textContent =
        "4 segundos";


    document.getElementById(
        "breathingButton"
    ).textContent =
        "▶ Comenzar respiración";

}


/* =====================================================
   ENTRENAMIENTOS
===================================================== */

const trainingForm =
    document.getElementById(
        "trainingForm"
    );


trainingForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const training = {

            id: Date.now(),

            date:
                document.getElementById(
                    "trainingDate"
                ).value,

            time:
                document.getElementById(
                    "trainingTime"
                ).value,

            type:
                document.getElementById(
                    "trainingType"
                ).value.trim(),

            place:
                document.getElementById(
                    "trainingPlace"
                ).value.trim(),

            notes:
                document.getElementById(
                    "trainingNotes"
                ).value.trim()

        };


        trainings.push(training);


        saveTrainings();

        trainingForm.reset();

        renderTrainings();

        updateTodayTraining();

        updateNotifications();


        alert(
            "🛼 Entrenamiento agregado correctamente."
        );

    }
);


function saveTrainings() {

    localStorage.setItem(
        "luji_trainings",
        JSON.stringify(trainings)
    );

}


function deleteTraining(id) {

    if (
        !confirm(
            "¿Querés eliminar este entrenamiento?"
        )
    ) return;


    trainings =
        trainings.filter(
            training =>
                training.id !== id
        );


    saveTrainings();

    renderTrainings();

    updateTodayTraining();

    updateNotifications();

}


function formatDate(dateString) {

    if (!dateString) return "";


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "es-PY",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


function renderTrainings() {

    const container =
        document.getElementById(
            "trainingList"
        );


    if (!trainings.length) {

        container.innerHTML = `

            <div class="data-card">

                <p class="empty-text">
                    Todavía no hay entrenamientos.
                </p>

            </div>

        `;

        return;

    }


    const sorted =
        [...trainings].sort(
            (a, b) =>
                new Date(
                    a.date + "T" + a.time
                )
                -
                new Date(
                    b.date + "T" + b.time
                )
        );


    container.innerHTML =
        sorted.map(
            training => `

            <div class="data-card">

                <div class="data-card-top">

                    <div>

                        <h3>
                            🛼 ${escapeHTML(training.type)}
                        </h3>

                        <div class="data-card-info">

                            📅 ${formatDate(training.date)}

                            <br>

                            ⏰ ${training.time}

                            ${
                                training.place
                                ?
                                `<br>📍 ${escapeHTML(training.place)}`
                                :
                                ""
                            }

                        </div>

                    </div>


                    <button
                        class="delete-button"
                        onclick="deleteTraining(${training.id})">

                        🗑

                    </button>

                </div>


                ${
                    training.notes
                    ?
                    `
                    <div class="data-card-notes">

                        📝 ${escapeHTML(training.notes)}

                    </div>
                    `
                    :
                    ""
                }

            </div>

        `
        ).join("");

}


/* =====================================================
   ENTRENAMIENTO DE HOY
===================================================== */

function updateTodayTraining() {

    const container =
        document.getElementById(
            "todayTrainingCard"
        );


    const today =
        getLocalDateString(
            new Date()
        );


    const todayTrainings =
        trainings
            .filter(
                training =>
                    training.date === today
            )
            .sort(
                (a, b) =>
                    a.time.localeCompare(
                        b.time
                    )
            );


    if (!todayTrainings.length) {

        container.innerHTML = `

            <p class="empty-text">
                No hay entrenamientos programados para hoy.
            </p>

        `;

        return;

    }


    container.innerHTML =
        todayTrainings.map(
            training => `

            <div class="today-training">

                <div class="training-time">

                    ${training.time}

                </div>

                <div>

                    <h3>
                        ${escapeHTML(training.type)}
                    </h3>

                    <p class="data-card-info">

                        ${
                            training.place
                            ?
                            `📍 ${escapeHTML(training.place)}`
                            :
                            "Entrenamiento"
                        }

                    </p>

                </div>

            </div>

        `
        ).join("");

}


/* =====================================================
   COMPETENCIAS
===================================================== */

const competitionForm =
    document.getElementById(
        "competitionForm"
    );


competitionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const competition = {

            id: Date.now(),

            name:
                document.getElementById(
                    "competitionName"
                ).value.trim(),

            date:
                document.getElementById(
                    "competitionDate"
                ).value,

            time:
                document.getElementById(
                    "competitionTime"
                ).value,

            place:
                document.getElementById(
                    "competitionPlace"
                ).value.trim(),

            category:
                document.getElementById(
                    "competitionCategory"
                ).value.trim(),

            notes:
                document.getElementById(
                    "competitionNotes"
                ).value.trim()

        };


        competitions.push(
            competition
        );


        saveCompetitions();

        competitionForm.reset();

        renderCompetitions();

        updateNextCompetition();

        updateNotifications();


        alert(
            "🏆 Competencia agregada correctamente."
        );

    }
);


function saveCompetitions() {

    localStorage.setItem(
        "luji_competitions",
        JSON.stringify(competitions)
    );

}


function deleteCompetition(id) {

    if (
        !confirm(
            "¿Querés eliminar esta competencia?"
        )
    ) return;


    competitions =
        competitions.filter(
            competition =>
                competition.id !== id
        );


    saveCompetitions();

    renderCompetitions();

    updateNextCompetition();

    updateNotifications();

}


function getUpcomingCompetitions() {

    const now =
        new Date();


    return competitions
        .filter(
            competition => {

                const date =
                    new Date(
                        competition.date +
                        "T" +
                        (
                            competition.time ||
                            "23:59"
                        )
                    );


                return date >= now;

            }
        )
        .sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.date +
                        "T" +
                        (
                            a.time ||
                            "23:59"
                        )
                    );


                const dateB =
                    new Date(
                        b.date +
                        "T" +
                        (
                            b.time ||
                            "23:59"
                        )
                    );


                return dateA - dateB;

            }
        );

}


function daysUntil(
    dateString,
    time
) {

    const target =
        new Date(
            dateString +
            "T" +
            (
                time ||
                "23:59"
            )
        );


    const now =
        new Date();


    const difference =
        target - now;


    return Math.max(
        0,
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        )
    );

}


function renderCompetitions() {

    const container =
        document.getElementById(
            "competitionList"
        );


    const upcoming =
        getUpcomingCompetitions();


    if (!upcoming.length) {

        container.innerHTML = `

            <div class="data-card">

                <p class="empty-text">
                    Todavía no hay competencias próximas.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        upcoming.map(
            competition => {

                const days =
                    daysUntil(
                        competition.date,
                        competition.time
                    );


                return `

                <div class="data-card">

                    <div class="data-card-top">

                        <div>

                            <h3>
                                🏆 ${escapeHTML(competition.name)}
                            </h3>

                            <div class="data-card-info">

                                📅 ${formatDate(competition.date)}

                                ${
                                    competition.time
                                    ?
                                    `<br>⏰ ${competition.time}`
                                    :
                                    ""
                                }

                                ${
                                    competition.place
                                    ?
                                    `<br>📍 ${escapeHTML(competition.place)}`
                                    :
                                    ""
                                }

                                ${
                                    competition.category
                                    ?
                                    `<br>🥇 ${escapeHTML(competition.category)}`
                                    :
                                    ""
                                }

                            </div>

                        </div>


                        <button
                            class="delete-button"
                            onclick="deleteCompetition(${competition.id})">

                            🗑

                        </button>

                    </div>


                    <div class="countdown">

                        <strong>
                            ${days}
                        </strong>

                        <small>
                            ${days === 1 ? "día" : "días"}
                        </small>

                    </div>


                    ${
                        competition.notes
                        ?
                        `
                        <div class="data-card-notes">

                            📝 ${escapeHTML(competition.notes)}

                        </div>
                        `
                        :
                        ""
                    }

                </div>

                `;

            }
        ).join("");

}


/* =====================================================
   PRÓXIMA COMPETENCIA
===================================================== */

function updateNextCompetition() {

    const container =
        document.getElementById(
            "nextCompetitionCard"
        );


    const upcoming =
        getUpcomingCompetitions();


    if (!upcoming.length) {

        container.innerHTML = `

            <p class="empty-text">
                Todavía no agregaste ninguna competencia.
            </p>

        `;

        return;

    }


    const competition =
        upcoming[0];


    const days =
        daysUntil(
            competition.date,
            competition.time
        );


    container.innerHTML = `

        <div class="competition-highlight">

            <div>

                <span class="small-title">

                    ${formatDate(
                        competition.date
                    )}

                </span>


                <h3>

                    🏆
                    ${escapeHTML(
                        competition.name
                    )}

                </h3>


                <p class="data-card-info">

                    ${
                        competition.place
                        ?
                        `📍 ${escapeHTML(competition.place)}`
                        :
                        ""
                    }

                    ${
                        competition.category
                        ?
                        `<br>🥇 ${escapeHTML(competition.category)}`
                        :
                        ""
                    }

                </p>

            </div>


            <div class="countdown">

                <strong>
                    ${days}
                </strong>

                <small>
                    ${days === 1 ? "día" : "días"}
                </small>

            </div>

        </div>

    `;

}


/* =====================================================
   NOTIFICACIONES
===================================================== */

function createNotification(
    title,
    message
) {

    notifications.push({

        id: Date.now(),

        title,

        message

    });


    renderNotifications();

}


function updateNotifications() {

    notifications = [];


    const now =
        new Date();


    /* COMPETENCIAS */

    competitions.forEach(
        competition => {

            const target =
                new Date(
                    competition.date +
                    "T" +
                    (
                        competition.time ||
                        "23:59"
                    )
                );


            const difference =
                target - now;


            const days =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );


            if (
                days >= 0 &&
                days <= 30
            ) {

                notifications.push({

                    id:
                        "competition-" +
                        competition.id,

                    title:
                        "🏆 Próxima competencia",

                    message:
                        `${competition.name} es ${
                            days === 0
                            ?
                            "hoy"
                            :
                            `en ${days} ${
                                days === 1
                                ?
                                "día"
                                :
                                "días"
                            }`
                        }.`

                });

            }

        }
    );


    /* ENTRENAMIENTOS */

    trainings.forEach(
        training => {

            const target =
                new Date(
                    training.date +
                    "T" +
                    training.time
                );


            const difference =
                target - now;


            const hours =
                difference /
                (1000 * 60 * 60);


            if (
                hours >= 0 &&
                hours <= 24
            ) {

                notifications.push({

                    id:
                        "training-" +
                        training.id,

                    title:
                        "🛼 Entrenamiento próximo",

                    message:
                        `${training.type} ${
                            training.date ===
                            getLocalDateString(now)
                            ?
                            `hoy a las ${training.time}`
                            :
                            `el ${formatDate(training.date)}`
                        }.`

                });

            }

        }
    );


    renderNotifications();

}


function renderNotifications() {

    const container =
        document.getElementById(
            "notificationsContainer"
        );


    const badge =
        document.getElementById(
            "notificationBadge"
        );


    if (!notifications.length) {

        container.innerHTML = `

            <p class="empty-text">
                No hay notificaciones nuevas.
            </p>

        `;

        badge.style.display = "none";

        return;

    }


    badge.style.display = "block";


    container.innerHTML =
        notifications.map(
            notification => `

            <div class="notification">

                <strong>
                    ${escapeHTML(
                        notification.title
                    )}
                </strong>

                <br>

                ${escapeHTML(
                    notification.message
                )}

            </div>

        `
        ).join("");

}


function toggleNotifications() {

    const panel =
        document.getElementById(
            "notificationPanel"
        );


    panel.classList.toggle(
        "show"
    );

}


/* =====================================================
   FECHA LOCAL
===================================================== */

function getLocalDateString(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =====================================================
   SEGURIDAD
===================================================== */

function escapeHTML(value) {

    if (!value) return "";


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   INICIO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateTimerDisplay();

        renderTrainings();

        renderCompetitions();

        updateTodayTraining();

        updateNextCompetition();

        updateNotifications();

    }
);


/* =====================================================
   ACTUALIZACIÓN AUTOMÁTICA
===================================================== */

setInterval(
    () => {

        updateNotifications();

        updateNextCompetition();

        updateTodayTraining();

    },
    60000
);