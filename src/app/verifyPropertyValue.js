
export class Verify {
    constructor(action) {
        this.act = action;
    }

    CheckList() {

    }

    verifyInterpol() {

    }

    verifySumConcat() {
        if (action.includes('++')) {
            let functionAnim = [];
            functionAnim[0] = action.split('++')[0];
        }
    }

    verifyInduceConcat() {

    }

    verifyTilde() {

    }

    verifyCounter() {

    }

    verifyDelayer() {

    }

    verifyInterpolProperty() {

    }
}