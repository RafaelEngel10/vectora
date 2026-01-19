

export class Reversor {
    constructor(el, action) {
        this.el = el;
        this.action = action;
        this.func = action.split('~')[1];
    }

    handler() {
        switch (this.func.split('(')[0]) {
            case 'land':
                this.catalogedReversedAnimations(this.el, this.action);
                break;
            case 'rise':
                this.catalogedReversedAnimations(this.el, this.action);
                break;
            default:
                this.unCatalogedReversedAnimations(this.el, this.action);
                break
        }
    }

    catalogedReversedAnimations() {
        
    }

    unCatalogedReversedAnimations() {
        
    }
}