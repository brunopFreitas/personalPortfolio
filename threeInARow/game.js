(function(){
    //const urlSample = 'https://threeinarowpuzzle.herokuapp.com/sample'
    const urlRandom = 'https://threeinarowpuzzle.herokuapp.com/random'
    let resultList = []
    let hint = 3
    fetch(urlRandom)
        .then(data=>{return data.json()})
        .then(json=>{
            buildMeATable(json)
            buildMeACheckResultButton(json)
            buildMeACheckbox(json)
            buildMeAHintButton(json)
        })

    const buildMeAHintButton = (json) => {
        const newButton = document.createElement('button')
        newButton.id='hintPuzzleButton'
        newButton.innerText=`Click me for a hint`
        append(document.body,newButton)
        addEventHint(newButton, json)
        }

    const addEventHint = (newButton, json) => {
        newButton.addEventListener('click', function(){
            fillMyList (json)
            switch (hint) {
                case 3:
                    alert("First hint")
                    hintMe()
                    hint--
                    break;
                case 2:
                    alert("Second hint")
                    hintMe()
                    hint--
                    break;
                case 1:
                    alert("Third hint")
                    hintMe()
                    hint--
                    break;
                case 0:
                    alert("You don't have more hints")
                    break;
                }                
            })  
        }

    const hintMe = () => {
        let hintCellId
        let hintCellCorrectColor
        if(resultList.some(element => {
            if(element.currentState!==element.correctState) {
                hintCellId = element.id
                hintCellCorrectColor = element.correctState
                return true
            }
        })) {
            let hintCell = document.getElementById(hintCellId)
            hintCell.setAttribute('cantoggle',false)
            switch (hintCellCorrectColor) {
                    case '1':
                        hintCell.style.backgroundColor='blue'
                        hintCell.setAttribute('currentstate',hintCellCorrectColor)
                        break;
                    case '2':
                        hintCell.style.backgroundColor='white'
                        hintCell.setAttribute('currentstate',hintCellCorrectColor)
                        break;
                }
            
        }
    }

    const buildMeACheckbox = (json) => {
        //Source of inspiration because I was struggling with labeling: https://www.geeksforgeeks.org/html-dom-input-checkbox-object/
        let newChekbox = document.createElement('input')
        newChekbox.type = "checkbox";
        newChekbox.name = "checkPuzzle";
        newChekbox.id = "checkpuzzlecheckbox";
        let newLabel = document.createElement('label');
        newLabel.htmlFor = "checkpuzzlecheckbox";
        append(newLabel,document.createTextNode('Check Incorrect Squares'))
        append(document.body,newChekbox)
        append(document.body,newLabel)
        addEventCheckAccuracy(newChekbox, json)
        }
    
    const addEventCheckAccuracy = (newChekbox,json) => {
        newChekbox.addEventListener('click', function(){ 
            if(newChekbox.checked===true) {
                fillMyList (json)
                let checkSquares = resultList.map(element => {
                    if(element.currentState!==element.correctState) {
                        return document.getElementById(`cell ${element.row}-${element.column}`)
                    }
            })
            let wrongSquares = checkSquares.map(element => {
                if(element!==undefined) {
                    let newText = document.createElement('p')
                    newText.id='cellText'
                    newText.innerText="Wrong Color"
                    newText.style.textAlign="center"
                    newText.style.color='darkred'
                    append(element,newText)
                }
            })
            } else {
                let removeP = document.querySelectorAll('#cellText')
                //removeP.remove() and parentnode.removechild() is not working!
                //Inspiration https://www.designcise.com/web/tutorial/how-to-remove-all-elements-returned-by-javascripts-queryselectorall-method
                removeP.forEach(element => {
                    element.remove()
                });
            }
        })        
    }

    const buildMeACheckResultButton = (json) => {
        const newButton = document.createElement('button')
        newButton.id='checkPuzzleButton'
        newButton.innerText='Check Puzzle'
        append(document.body,newButton)
        addEventCheckResult(newButton, json)
    }

    const addEventCheckResult = (newButton, json) => {
        newButton.addEventListener('click', function(){
            fillMyList (json)
            checkMyResult()
        })  
    }

    const fillMyList = (json) => {
        const cellArray = document.querySelectorAll('.cell')
        resultList=[]
        cellArray.forEach(element => {
            let i = element.attributes["data-row"].value
            let j = element.attributes["data-column"].value
            let currentState = element.attributes.currentstate.value
            let correctState = String(json.rows[i][j].correctState)
            let id = element.id
            if(currentState===correctState) {
                resultList.push({
                    row: i,
                    column: j,
                    currentState: currentState,
                    correctState: correctState,
                    correct: true,
                    id: id
                })
            } else {
                resultList.push({
                    row: i,
                    column: j,
                    currentState: currentState,
                    correctState: correctState,
                    correct: false,
                    id: id
                })
            }
        });
    }

    const checkMyResult = () => {
        if(resultList.length!==0) {
            let onlyColoredSquare = resultList.map(element => {
                if(element.currentState!=='0') {
                    if(element.currentState===element.correctState) {
                        return 'Correct'
                    } else {
                        return 'Incorrect'
                    }
                }
            })
            if(onlyColoredSquare.some(element => element === 'Incorrect')) {
                buildMeAnAlert('Something is wrong')
            } else if (!onlyColoredSquare.some(element => element === 'Incorrect') && onlyColoredSquare.some(element => element === undefined)) {
                buildMeAnAlert('So far so good')
            } else if (onlyColoredSquare.every(element => element === 'Correct')) {
                buildMeAnAlert('You did it!!')
            }
        }
    }

    const buildMeAnAlert = (text) => {
        alert(text)
    }
    
    const buildMeATable = (json) => {
        const theDiv = document.querySelector('#theGame')
        const theTable = document.createElement('table')
        theTable.id='mainTable'
        append(theDiv, theTable)
        const size = json.rows.length
        for(let i=0;i<size;i++) {
            const newRow = document.createElement('tr')
            newRow.id=`row ${i}`
            newRow.className=`row` 
            for(let j=0;j<size;j++) {
                const newCell = document.createElement('td')
                newCell.id=`cell ${i}-${j}`
                newCell.className=`cell`
                newCell.setAttribute('data-row', i)
                newCell.setAttribute('data-column', j)
                newCell.setAttribute('currentstate', json.rows[i][j].currentState)
                newCell.setAttribute('cantoggle', json.rows[i][j].canToggle)
                append(newRow, newCell)
                defaultColor(newCell)
                addEventColor(newCell)    
            }    
            append(theTable, newRow)
        }
    }

    const append = (parent, child) => {
        parent.appendChild(child)
    }

    const addEventColor = (newCell) => {
        newCell.addEventListener('click', function(){
            if(newCell.getAttribute('cantoggle')==="true") {
                const state = newCell.getAttribute('currentstate')
                switch (state) {
                    case '0':
                        newCell.style.backgroundColor='blue'
                        newCell.setAttribute('currentstate','1')
                        break;
                    case '1':
                        newCell.style.backgroundColor='white'
                        newCell.setAttribute('currentstate','2')
                        break;
                    case '2':
                        newCell.style.backgroundColor='grey'
                        newCell.setAttribute('currentstate','0')
                        break;
                }
            }
        })
    }

    const defaultColor = (newCell) => {
        const state = newCell.getAttribute('currentState')
        switch (state) {
            case '0':
                newCell.style.backgroundColor='grey'
                break;
            case '1':
                newCell.style.backgroundColor='blue'
                break;
            case '2':
                newCell.style.backgroundColor='white'
                break;
        }
    }
    
})()