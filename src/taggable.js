import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TagQuiz extends DDD {

    static get tag() {
        return 'tag-quiz';
    }

    constructor() {
        super();
        this.blocks = [];
        this.correctInput = ["Correct"];
    }

    

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .answerbox {
                display: inline-block;
                height: 100px;
                width: 400px;
                margin: 10px;
                border: solid 3px grey;
            }
            .hovered {
                background: grey;
                border-style: dashed; 
            }
    `;
    }
    render() {
        return html`
        <div class="quiz-container">
            <div class="image-container">
                <img src="https://hax.psu.edu/7d3549e0.png">
            </div>
        </div>

        <div class="quiz-options">
            <div class="answer-option" draggable="true">wrong answer</div>
            <div class="answer-option" draggable="true">right answer</div>
            <div class="answer-option" draggable="true">another wrong answer</div>
        </div>

        <div class="answerbox" @drop="${this.handleDrop}" @dragover="${this.handleDragOver}">
        <p>correct answer here!</p>
        </div>
        `;
    }
    static get properties() {
        return {
            blocks: {type: array}
        };
    }
}
