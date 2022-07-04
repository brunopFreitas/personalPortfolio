(function () {

    // Global variables
    let isTrucoAlreadyCalled = false
    let matchDefaultPoint = 1
    let userCards = []
    let pcCards = []
    let gameMatch = 1
    let userMatchPoint = 0
    let pcMatchPoint = 0
    let userGamePoint = 0
    let pcGamePoint = 0
    let matchRound = 1
    let placar = "placar"
    let match = "match"
    let round = "round"
    let gameLog = "gameLog"
    let backCard = "image/cardback.jpg"
    const url = "https://deckofcardsapi.com/"
    let deckID

    //Start
    function startAGame() {
        let newGame = document.getElementById("newGame")
        newGame.onclick = callAPI
    }

    //Function that will display an image in the DOM
    function displayImage(src, id) {
        let displayCard = document.getElementById(id)
        displayCard.src = src
        displayCard.style.filter = "brightness(1)"
    }

    //Function that will display a paragraph in the DOM
    function fillBoard(element, value) {
        if (element !== gameLog) {
            let boardElement = document.getElementById(element)
            boardElement.innerHTML = value
        } else {
            let boardElement = document.getElementById(element)
            boardElement.innerHTML += value + "</br>"
            boardElement.scrollTop = boardElement.scrollHeight;
        }
    }

    //PlayTruco
    function PlayTruco(response) {
        userCards = []
        pcCards = []
        for (let i = 0; i < response.cards.length; i++) {
            if (i <= 2) {
                // Fecthing user cards
                let elementID = "uc" + i
                userCards[i] = {
                    value: response.cards[i].value,
                    suit: response.cards[i].suit,
                    position: elementID,
                    played: false,
                    image: response.cards[i].image,
                    code: response.cards[i].code
                }
                displayImage(response.cards[i].image, elementID)
            } else {
                // Fecthing pc cards
                let elementID = "pc" + (i - 3)
                pcCards[i - 3] = {
                    value: response.cards[i].value,
                    suit: response.cards[i].suit,
                    position: elementID,
                    played: false,
                    image: response.cards[i].image,
                    code: response.cards[i].code
                }
            }
        }
        fillBoard(placar, `Game Scoreboard</br>Fideles ${pcGamePoint} x ${userGamePoint} User`)
        fillBoard(match, `Game Match</br>Match ${gameMatch}</br>Fideles ${pcMatchPoint} x ${userMatchPoint} User`)
        fillBoard(round, `Game Round</br>Round ${matchRound}`)
        fillBoard(gameLog, "A new match begins")
        userChooseCard()
    }

    //Click on a card
    function userChooseCard() {
        for (let i = 0; i < userCards.length; i++) {
            document.getElementById(userCards[i].position).onclick = function () {
                playACard(userCards[i])
            }
        }
        fillBoard(gameLog, "Select a card")
    }

    //CallForTruco
    function callForTruco() {
        document.getElementById("truco").onclick = function () {
            if (isTrucoAlreadyCalled === false) {
                isTrucoAlreadyCalled = true
                fillBoard(gameLog, "You called truco")
                howFidelisWillRespond()
            } else {
                fillBoard(gameLog, "You already called for truco")
            }
        }
    }

    //FidelisResponseForTruco
    function howFidelisWillRespond() {
        let rand = Math.floor(Math.random() * 3)
        switch (rand) {
            case 0:
                fillBoard(gameLog, "Fideles accepts! Now this math is worth 3 points!")
                matchDefaultPoint = 3
                break;
            case 1:
                fillBoard(gameLog, "Fideles run away! You won this match!")
                userMatchPoint = 2
                setTimeout(() => newMatch(), 3500)
                break;
            case 2:
                fillBoard(gameLog, "Fideles is feeling confident! He doubled! Now it's a 6 points match")
                matchDefaultPoint = 6
                break;
        }
    }


    //Block click
    function noCLick() {
        for (let i = 0; i < userCards.length; i++) {
            document.getElementById(userCards[i].position).onclick = function () {}
        }
    }

    //AnimateMyCards
    function animateMyCards(card) {
        let el = "#" + card.position
        window.animatelo.flip(el)
    }


    //playACard
    function playACard(userCard) {
        if (userCard.played !== true) {
            animateMyCards(userCard)
            fillBoard(gameLog, "You played " + userCard.value + " of " + userCard.suit)
            userCard.played = true
            let removeCard = document.getElementById(userCard.position)
            hideAnElement(removeCard)
            let pcCard = pcChooseCard()
            whoWin(userCard, pcCard)
        } else {
            fillBoard(gameLog, "You have already played that card!")
        }

    }

    //WhoWin
    function whoWin(userCard, pcCard) {
        let roundPoint = normalizeMyResult(userCard, pcCard)
        if (roundPoint.userPoint > roundPoint.pcPoint) {
            userMatchPoint++
            fillBoard(gameLog, "You win!")
        } else if (roundPoint.userPoint === roundPoint.pcPoint) {
            pcMatchPoint++
            userMatchPoint++
            fillBoard(gameLog, "Draw!")
        } else {
            pcMatchPoint++
            fillBoard(gameLog, "Fideles win!")
        }
        matchRound++
        fillBoard(round, `Game Round</br>Round ${matchRound}`)
        fillBoard(match, `Game Match</br>Match ${gameMatch}</br>Fideles ${pcMatchPoint} x ${userMatchPoint} User`)
        noCLick()
        setTimeout(() => newMatch(), 3500)
    }

    //NewMatch
    function newMatch() {
        if (userMatchPoint === 2 || pcMatchPoint === 2) {
            if (userMatchPoint > pcMatchPoint) {
                fillBoard(gameLog, `User win match ${gameMatch}!`)
                userGamePoint += matchDefaultPoint
            } else if (userMatchPoint === pcMatchPoint) {
                fillBoard(gameLog, `It's a draw!`)
                userGamePoint += matchDefaultPoint
                pcGamePoint += matchDefaultPoint
            } else {
                fillBoard(gameLog, `Fideles wins match ${gameMatch}!`)
                pcGamePoint += matchDefaultPoint
            }
            gameMatch++
            userMatchPoint = 0
            pcMatchPoint = 0
            matchRound = 1
            fillBoard(placar, `Game Placar</br>Fideles ${pcGamePoint} x ${userGamePoint} User`)
            fillBoard(match, `Game Match</br>Match ${gameMatch}</br>Fideles ${pcMatchPoint} x ${userMatchPoint} User`)
            fillBoard(round, `Game Round</br>Round ${matchRound}`)
            fillBoard(gameLog, `Starting a new match!`)
            resetElement()
            setTimeout(() => callAPI(), 3500)
        } else {
            userChooseCard()
        }
    }

    //ResetElement
    function resetElement() {
        document.getElementById("pc0").attributeStyleMap.clear();
        document.getElementById("pc0").src = backCard
        document.getElementById("pc1").attributeStyleMap.clear();
        document.getElementById("pc1").src = backCard
        document.getElementById("pc2").attributeStyleMap.clear();
        document.getElementById("pc2").src = backCard
        document.getElementById("uc0").attributeStyleMap.clear();
        document.getElementById("uc0").src = backCard
        document.getElementById("uc1").attributeStyleMap.clear();
        document.getElementById("uc1").src = backCard
        document.getElementById("uc2").attributeStyleMap.clear();
        document.getElementById("uc2").src = backCard
    }

    //Normalization
    function normalizeMyResult(userCard, pcCard) {
        //Calculating points
        let userPoint = showCardPoints(userCard)
        let pcPoint = showCardPoints(pcCard)
        let pointNormalized = {
            userPoint: 0,
            pcPoint: 0
        }
        userPoint.forEach(element => {
            pointNormalized.userPoint = element
        });
        pcPoint.forEach(element => {
            pointNormalized.pcPoint = element
        });
        return pointNormalized
    }

    //ShowCardPoints
    function showCardPoints(cardObject) {
        let cardHierarchy = [{
                value: "4",
                suit: "",
                point: 50
            },
            {
                value: "7",
                suit: "HEARTS",
                point: 45
            },
            {
                value: "ACE",
                suit: "SPADES",
                point: 40
            },
            {
                value: "7",
                suit: "DIAMONDS",
                point: 35
            },
            {
                value: "3",
                suit: "",
                point: 10
            },
            {
                value: "2",
                suit: "",
                point: 9
            },
            {
                value: "ACE",
                suit: "",
                point: 8
            },
            {
                value: "KING",
                suit: "",
                point: 3
            },
            {
                value: "JACK",
                suit: "",
                point: 2
            },
            {
                value: "QUEEN",
                suit: "",
                point: 1
            }
        ]
        let sevenAndAce = cardHierarchy.filter(element => (element.value === cardObject.value && element.suit === cardObject.suit))
        let anyOtherCard = cardHierarchy.filter(element => (element.value === cardObject.value && element.suit === ""))
        if (sevenAndAce.length !== 0) {
            let point = sevenAndAce.map(element => {
                return element.point
            })
            return point
        } else if (anyOtherCard.length !== 0) {
            let point = anyOtherCard.map(element => {
                return element.point
            })
            return point
        }
    }

    //PcChooseCard
    function pcChooseCard() {
        let pcCardJustPlayed = pcPlayACard()
        if (pcCardJustPlayed!==0) {
            return pcCardJustPlayed
        } else {
            if (pcCards[0].played === false) {
                animateMyCards(pcCards[0])
                displayImage(pcCards[0].image, pcCards[0].position)
                pcCards[0].played = true
                hideAnElement(document.getElementById(pcCards[0].position))
                fillBoard(gameLog, "Fideles played " + pcCards[0].value + " of " + pcCards[0].suit)
                return pcCards[0]
            } else if (pcCards[1].played === false) {
                animateMyCards(pcCards[1])
                displayImage(pcCards[1].image, pcCards[1].position)
                pcCards[1].played = true
                hideAnElement(document.getElementById(pcCards[1].position))
                fillBoard(gameLog, "Fideles played " + pcCards[1].value + " of " + pcCards[1].suit)
                return pcCards[1]
            } else if (pcCards[2].played === false) {
                animateMyCards(pcCards[2])
                displayImage(pcCards[2].image, pcCards[2].position)
                pcCards[2].played = true
                hideAnElement(document.getElementById(pcCards[2].position))
                fillBoard(gameLog, "Fideles played " + pcCards[2].value + " of " + pcCards[2].suit)
                return pcCards[2]
            }            
        }        
    }

    // PCPlayACard
    function pcPlayACard() {
        let randPC = Math.floor(Math.random() * 3)
        switch (randPC) {
            case 0:
                if (pcCards[0].played === false) {
                    animateMyCards(pcCards[0])
                    displayImage(pcCards[0].image, pcCards[0].position)
                    pcCards[0].played = true
                    hideAnElement(document.getElementById(pcCards[0].position))
                    fillBoard(gameLog, "Fideles played " + pcCards[0].value + " of " + pcCards[0].suit)
                    return pcCards[0]
                }
                break;
            case 1:
                if (pcCards[1].played === false) {
                    animateMyCards(pcCards[1])
                    displayImage(pcCards[1].image, pcCards[1].position)
                    pcCards[1].played = true
                    hideAnElement(document.getElementById(pcCards[1].position))
                    fillBoard(gameLog, "Fideles played " + pcCards[1].value + " of " + pcCards[1].suit)
                    return pcCards[1]
                }
                break;
            case 2:
                if (pcCards[2].played === false) {
                    animateMyCards(pcCards[2])
                    displayImage(pcCards[2].image, pcCards[2].position)
                    pcCards[2].played = true
                    hideAnElement(document.getElementById(pcCards[2].position))
                    fillBoard(gameLog, "Fideles played " + pcCards[2].value + " of " + pcCards[2].suit)
                    return pcCards[2]
                }
                break;
        }
        return 0
    }

    //RemoveAnElement
    function hideAnElement(element) {
        element.style.filter = "brightness(0.3)"
    }

    //drawCards
    function drawCards(deckID) {
        const contextDrawCard = "api/deck/"
        const cardQuantity = "/draw/?count=6"
        const drawCard = url + contextDrawCard + deckID + cardQuantity
        fetch(drawCard)
            .then(data => {
                if (data.ok) {
                    return data.json()
                } else {
                    console.log("Can't fetch a deck!")
                }
            })
            .then(response => {
                callForTruco()
                PlayTruco(response)
            })
    }

    //Function that fetch an api
    function callAPI() {
        //URL to fetch
        if (userGamePoint <= 11 && pcGamePoint <= 11) {
            isTrucoAlreadyCalled = false
            matchDefaultPoint = 1
            const contextNewDeck = "api/deck/new/shuffle/?"
            const cards = "cards=JS,JC,JH,JD,QS,QC,QH,QD,KS,KC,KH,KD,AC,AH,AD,2S,2C,2H,2D,3S,3C,3H,3D,7D,AS,7H,4C"
            const newDeck = url + contextNewDeck + cards
            fetch(newDeck)
                .then(data => {
                    if (data.ok) {
                        return data.json()
                    } else {
                        console.log("Can't fetch a deck!")
                    }
                })
                .then(response => {
                    deckID = response.deck_id
                    drawCards(deckID)
                })

        } else {
            if (userGamePoint >= 12) {
                fillBoard(gameLog, `User won the game!</br></br>`)
            } else {
                fillBoard(gameLog, `Fideles won the game!</br></br>`)
            }
            userGamePoint = 0
            pcGamePoint = 0
            gameMatch = 1
        }
    }
    startAGame()
})()