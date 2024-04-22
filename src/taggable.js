import { LitElement, html, css } from 'lit';
// import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TagQuiz extends LitElement {

    static get tag() {
        return 'tag-quiz';
    }

    constructor() {
        super();
        this.shuffledOptions = [];
        this.correctInput = 'Tiger Shark';
        this.answerOptions =  ['Goblin Shark', 'Tiger Shark', 'East Blue Shark'];
        this.shuffleOptions();
    }

    

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .quiz-container {
                color: black;
                background-color: whitesmoke;
                font-family: monospace;
            }
            .answer-option {     
                margin: 5px;
                border: solid 1px white;
            }
            .answerbox {
                display: inline-block;
                margin: 10px;
                border: solid 3px grey;
                color: grey;
            }
            .answer-option:hover {
                border: solid 1px black;
            }
            .answerbox:hover {
                border: dashed 3px grey; 
            }
    `;
    }

    handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.innerText);
    }

    handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        event.target.textContent = data;
    }
    handleDragOver(event) {
        event.preventDefault();
    }

    checkAnswer() {
        const answerBox = this.shadowRoot.querySelector('.answerbox');
        const selectedOption = answerBox.textContent.trim();
        if (selectedOption === this.correctInput) {
            alert('Correct answer!');
        } else {
            alert('Incorrect answer. Try again!');
        }
    }

    shuffleOptions(array) {
        this.shuffledOptions = this.shuffleArray(this.answerOptions.slice());
        this.requestUpdate();
    }

    shuffleArray(array) {
        for (let i = array.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i +1));
            [array[i], array[j] = array[j], array[i]];
        }
        return array;
    }

    render() {
        return html`
            <div class="quiz-container">
                <div class="image-container">
                    <!-- <img src="https://hax.psu.edu/7d3549e0.png"> -->
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Tiger_shark.jpg/640px-Tiger_shark.jpg">
                </div>
                <p>What type of shark is this?</p>
                <div class="quiz-options">
                    ${this.shuffledOptions.map(option => html`
                        <div class="answer-option" draggable="true" @dragstart="${this.handleDragStart}">${option}</div>
                    `)}
                </div>
                <div class="answerbox" @drop="${this.handleDrop}" @dragover="${this.handleDragOver}">
                    <p>Drop the answer here!</p>
                </div>
                <button @click="${this.checkAnswer}">Check Answer</button>
            </div>
        `;
    }
    static get properties() {
        return {
            blocks: {type: Array}
        };
    }
}
globalThis.customElements.define(TagQuiz.tag, TagQuiz);
