import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/multiple-choice/lib/confetti-container.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";


export class TagQuiz extends LitElement {

    static get tag() { //get tag
        return 'tagging-question';
    }

    constructor() { //the constructor to initialize basic variables
        super();
        this.shuffledOptions = [];
        this.answerOptions =  [];
        this.correctness = {};
        this.answerBoxOptions = [];
        this.answerBoxContent = '';
        this.answerChecked = false;
    }

    connectedCallback() { //called everytime the element is added to the document
        super.connectedCallback();
        if (this.quizDataURL) {
            this.fetchData();
        }
        document.body.addEventListener('keydown', this.handleEnterKeyPress);
    
        const answerBox = this.shadowRoot.querySelector('.answerbox');
        if (answerBox) {
            answerBox.addEventListener('input', this.updateCheckButtonState.bind(this));
        }

    }

    // updateCheckButtonState() {
    //     const answerBox = this.shadowRoot.querySelector('.text');
    //     const answerText = answerBox.textContent.trim();
    //     const checkButton = this.shadowRoot.querySelector('#button'); // Assuming the check button has an id of "button"
    //     //this did not work
    //     // Check if the answer box contains any string from the answer options
    //     const answerOptionsStrings = this.answerOptions.map(option => option.tag);
    //     const containsAnswerOption = answerOptionsStrings.some(option => answerText.includes(option));
    
    //     // Enable the check button if the answer box contains any answer option
    //     checkButton.disabled = !containsAnswerOption;
    // }

    async fetchData() { //this gets the data from the json
        console.log('quizDataURL:', this.quizDataURL); // Log the quizDataURL

        try {
            const response = await fetch(this.quizDataURL);
            if (!response.ok) {
                throw new Error('Failed to fetch data'); //throws error if not found
            }
            const data = await response.json();
            this.answerOptions = data; //set the variable to the data
            console.log('Fetched data:', data); // Log the fetched data

            this.shuffleOptions(this.answerOptions); //create a function that inputs the answer options
        } catch (error) {
            console.error('Error fetching data:'. error); //catching in case of faliure
        }
    }
    

    static get styles() { //css styles with D-D-D implementation
        return css`     
        :host {
            display: flex;
        }

        .title, .question {
            min-height: var(--ddd-spacing-8);
            min-width: var(--ddd-spacing-16);
            font-family: "Montserrat", sans-serif;
            font-style: bold;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: var(--ddd-spacing-2);
            color: var(--ddd-theme-default-navy80);

        }

        .title {
            background: var(--ddd-theme-default-beaverBlue);
            color: var(--ddd-theme-default-shrineLight);
            margin: var(--ddd-spacing-4) 0; 
        }

        .paragraph {
            background: var(--ddd-theme-default-slateMaxLight);
            font-size: 2.5vw;
            color: var(--ddd-theme-default-navy80);
            margin: var(--ddd-spacing-4) 0; 
        }

        .quiz-options {
            display: inline-flex;
            padding: 2vh;
            overflow: scroll;
            max-width: 80%;
        }

        .img {
            display: block;
            margin: 0 auto;
            text-align: center;
            height: 50vw;
            border: solid 1vw var(--ddd-theme-default-slateLight);
        }

        .quiz-container {
            color: black;
            background-color: var(--ddd-theme-default-slateMaxLight);
            justify-content: center;
            align-items: center;
            text-align: center;
            font-family: "Comfortaa", sans-serif;
            width: 100%;
        }

        .answer-option, .answerbox, #button, .button {
            font-family: "Kalam", cursive;
            transition: border-color 0.3s ease;
        }
        .answer-option, #button, .button, .paragraph {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: 200;
            font-style: light;
            transition: border-color 0.3s ease;
        }

        .answer-option, .answerbox{
            color: var(--ddd-theme-default-navy80);
            background: var(--ddd-theme-default-slateMaxLight);
            border: 3px solid var(--ddd-theme-default-slateMaxLight); 
            padding: 2vh; 
            font-size: 3vw; 
            box-shadow: var(--ddd-theme-default-slateLight) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset, 0px 20px 0px var(--ddd-theme-default-slateLight);
        }

        .answer-option:hover, #button:hover, .button:hover {
            border: solid 3px var(--ddd-theme-default-navy80);
        }

        .answerbox {
            display: block;
            margin: 10px auto;
            height: 10vw;
            width: 90%;
            border: solid 3px var(--ddd-theme-default-navy65);
            color: var(--ddd-theme-default-navy65);
            text-align: center;
            background: var(--ddd-theme-default-slateMaxLight);
            box-shadow: var(--ddd-theme-default-slateLight) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset, 0px 20px 0px var(--ddd-theme-default-slateLight);
        }

        .answerbox:hover {
            border: dashed 3px var(--ddd-theme-default-navy80); 
        }

        #button, .button {
            background: var(--ddd-theme-default-slateMaxLight);
            border: 3px solid var(--ddd-theme-default-slateMaxLight); 
            padding: 10px; 
            color: var(--ddd-theme-default-navy80);
            margin: 2vh 0vh 3.5vh 0vh;
            box-shadow: var(--ddd-theme-default-slateLight) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset, 0px 20px 0px var(--ddd-theme-default-slateLight);
        }

        #button:active, .button:active {
            -webkit-box-shadow: -2px 5px 0px #00000035, 0px 3px 6px #00000035;
            position: relative;
            top: 10px;
        }

        .feedback {
            display: flex;
            padding: 2vw;
            color: grey;
            align-content: center;
            text-align: center;
            background: var(--ddd-theme-default-slateMaxLight);
            font-family: "Kalam", cursive;
            overflow: scroll;
        }
    `;
    }

    handleDragStart(event) { //handles the event of dragging
        const data = event.target.innerText; //sets the data to the text
        const answerBox = this.shadowRoot.querySelector('.answerbox'); //didn't work
        if (!answerBox.textContent.includes(data)) { //would prevent dragging in instance that the item is already in the answer box
            event.dataTransfer.setData('text/plain', data);
        } else {
            event.preventDefault(); //prevents this from happening if not
        }
    }


    handleClick(option) { //instance that click is used
        const answerBox = this.shadowRoot.querySelector('.answerbox');
        if (answerBox.textContent.trim() === 'drag into here') {
            answerBox.textContent = ''; //clears the content for the new array that is made
        }

        const options = answerBox.textContent.trim().split('\n'); //splits the array
        const index = options.indexOf(option);
        if (index !== -1) {
            options.splice(index, 1); //splices the array so that it removes or adds to the array depending if it is already there or not
            answerBox.textContent = options.join('\n');
        } else {
            answerBox.textContent += option + '\n';
        }
    }

    handleDrop(event) { //event of dropping
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const answerBox = this.shadowRoot.querySelector('.answerbox');
        if (answerBox.textContent.trim() === 'drag into here') {
            answerBox.textContent = ''; //clears when dragged
        }
        answerBox.textContent += data + '\n'; //appends the data to the box
        
    }

    
    handleDragOver(event) {
        event.preventDefault();
    }

    checkAnswer() { //the function to check the answer
        console.log('Checking answer...'); //log
        const answerBox = this.shadowRoot.querySelector('.answerbox'); //selects the text in the answer box
        const selectedOptions = answerBox.textContent.trim().split('\n'); //gets each option
        let allCorrect = true; //flag to set up makeitrain()
        selectedOptions.forEach(selectedOption => { //loop that checks whether or not the answers have true value for boolean
            const checkOption = this.answerOptions.find(option => option.tag === selectedOption);
            if (checkOption && checkOption.correct) {
                this.correctness[selectedOption] = true; //instance that it is correct

            } else {
                this.correctness[selectedOption] = false; //instance that it isn't
                allCorrect = false; //will make the flag false
            } 
            
        });
        this.answerChecked = true; //another flag to see if the answer has been checked
        this.requestUpdate(); //force a request update
        if (allCorrect){
            this.makeItRain(); //makeitrainn
        }
    }

    shuffleOptions(array) { //this array shuffles the array
        if (!this.answerChecked || !Object.values(this.correctness).every(correct => correct)) {
            this.shuffledOptions = array.map(option => option.tag);
            this.shuffleArray(array);
        }
        this.requestUpdate();
    }

    shuffleArray(array) { //the logic to shuffle the array
        for (let i = array.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i +1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    resetQuiz() { //resets the quiz
        const answerBox = this.shadowRoot.querySelector('.answerbox');
        console.log(answerBox); // Log the answer box element
        console.log(answerBox.textContent);
        this.answerChecked = false; //resets the flag
        answerBox.textContent = ''; //clears text
        this.shuffleOptions(this.answerOptions); //initializes the shuffle 
        this.correctness = {}; //resets
        this.feedback = {};
    }
    // buttonoff() { 
    //     const answerBox = this.shadowRoot.querySelector('.answerbox .text');
    //     return !answerBox || !answerBox.children.length;
    // }this did not work

    handleTabKeyPress(event) { //this is for focus state and being able to navigate using tab
        if (event.key === 'Tab') {
            const answerOptions = this.shadowRoot.querySelectorAll('.answer-option');
            if (event.shiftKey) {
                // Shift + Tab Handle backward navigation
                if (document.activeElement === answerOptions[0]) {
                    event.preventDefault();
                    answerOptions[answerOptions.length - 1].focus();
                }
            } else {
                // Tab Handle forward navigation
                if (document.activeElement === answerOptions[answerOptions.length - 1]) {
                    event.preventDefault();
                    answerOptions[0].focus();
                }
            }
        }
    }

    handleEnterKeyPress(event) { //for the enter and the return button
        if (event.key === 'Enter' || event.key === 'Return') {
            const path = event.composedPath();
            for (const element of path) {
                if (element instanceof ShadowRoot) {
                    const focusedElement = element.activeElement; //the active hover
                    if (focusedElement.classList.contains('answer-option')) {
                        const optionText = focusedElement.innerText.trim(); //getting the resulting answer option
                        const shadowRoot = focusedElement.getRootNode(); 
                        const answerBox = shadowRoot.querySelector('.answerbox');
                        if (answerBox) {
                            // Remove default text if present
                            if (answerBox.textContent.trim() === 'drag into here') {
                                answerBox.textContent = '';
                            }
                            const options = answerBox.textContent.trim().split('\n');
                            const index = options.indexOf(optionText);
                            // If option is already in answer box, remove it
                            if (index !== -1) {
                                options.splice(index, 1);
                                answerBox.textContent = options.join('\n');
                            } else {
                                // Append option to answer box
                                answerBox.textContent += optionText + '\n';
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    
    disconnectedCallback() { //diconnected callback
        super.disconnectedCallback();
        document.body.removeEventListener('keydown', this.handleEnterKeyPress);
    }


    render() { //render
        console.log('Rendering with imageURL', this.imageURL); //logs to check that everything was working correctly
        console.log('Rendering with question:', this.question);
        this.shuffleOptions(this.answerOptions); //begin with the shuffle
        return html`
            <div class="quiz-container">
                <confetti-container id="confetti">
                <div class="title">${this.title}</div>
                <div class="paragraph">${this.paragraph}</div>
                <div class="image-container">
                    <!-- <img src="https://hax.psu.edu/7d3549e0.png"> -->
                    <img class="img" src="${this.imageURL}">
                </div>
                <div class="question">${this.question}</div>
                <div class="quiz-options">
                ${this.shuffledOptions.map(option => html`
                        <div class="answer-option" tabindex="0" 
                            draggable="true" 
                            @dragover="${this.handleDragOver}"
                            @drop="${this.handleDrop}"
                            @dragstart="${this.handleDragStart}"
                            @keydown="${this.handleTabKeyPress}"
                            @click="${() => this.handleClick(option)}">
                            ${option}
                        </div>
                    `)}
                </div>
                <div class="answerbox" @drop="${this.handleDrop}" @dragover="${this.handleDragOver}">
                    <p>drag into here</p>
                </div>
                <button id="button" @click="${this.checkAnswer}">Check Answer</button>
                <button class="button" @click="${this.resetQuiz}">Reset</button>
                <div class="feedback-container">
                    ${Object.entries(this.correctness).map(([option, correct]) => html`
                        <div class="feedback" style="color: ${correct ? 'green' : 'red'}">
                            ${option}
                            :
                            ${this.answerOptions.find(item => item.tag === option)?.feedback || ''}
                        </div>
                    `)}
                </div>
                </confetti-container>
            </div>
        `;
    }

    makeItRain() { //make it rain boilerplate
        import("@lrnwebcomponents/multiple-choice/lib/confetti-container.js").then(
          (module) => {
            setTimeout(() => {
              this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
            }, 0);
          }
        );
      }

    static get properties() { 
        return {
            question: { type: String},
            imageURL: { type: String},
            quizDataURL: { type: String},
            answerBoxContent: { type: String},
            paragraph: { type: String},
        };
    }
}
globalThis.customElements.define(TagQuiz.tag, TagQuiz);

