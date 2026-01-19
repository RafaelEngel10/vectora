export class QuestionMark {
    constructor(line) {
        this.line = line;
    }

    lineTranslator() {
        // let statement
        if (this.line.startsWith('$')) {
            let newLine = this.line.split('=')[1];
            newLine = newLine.trim();
            if (newLine.includes('=')) {
                const variable = newLine.split('=')[0];
                const value = newLine.split('=')[1];
            }
        }

        // if statement
        if (this.line.startsWith('??')) {
            let newLine = this.line.split('??')[1];
            newLine = newLine.trim();
            if (newLine.includes(':')) {
                const condition = newLine.split(':')[0];
                const action = newLine.split(':')[1];
            }
            else if (newLine.includes('{')) {
                const condition = newLine.split('{')[0];
                let action = newLine.split('{')[1];
                action = action.split('}')[0];
            } else {
                console.error('Statement declarado de forma errônia.');
                return;
            }
        }

        // else statement
        else if (this.line.startsWith('!!')) {
            let newLine = this.line.split('!!')[1];
            newLine = newLine.trim();
            if (newLine.includes(':')) {
                const condition = newLine.split(':')[0];
                const action = newLine.split(':')[1];
            }
            else if (newLine.includes('{')) {
                const condition = newLine.split('{')[0];
                let action = newLine.split('{')[1];
                action = action.split('}')[0];
            } else {
                console.error('[Vectora] Statement declarado de forma errônia.');
                return;
            }
        }
    }
}