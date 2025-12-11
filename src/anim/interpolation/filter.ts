export function animFilter(action: string): any {
    let animationSplits: string[] = []
    const status = interpolSpliter(action);

    // interpolation signal attempt
    if (status === true){
        animationSplits = action.split('=>');

        const firstPart: string = animationSplits[0] ?? '';
        const firstAnim = firstPart.split('++')[0] || firstPart.split('+-')[0] || '';
        const secondAnim = firstPart.split('++')[1] || firstPart.split('+-')[1] || '';

        const lastPart: string = animationSplits[1] ?? '';
        const operator: string = firstPart.includes('++') ? '++' : (firstPart.includes('+-') ? '+-' : '');
        try {
            const falseSplit: string[] = lastPart.split('++') || lastPart.split('+-');
            const firstSplit = falseSplit[0] || '';
            const secondSplit = falseSplit[1] || '';
            const secondOperator: string = firstPart.includes('++') ? '++' : (firstPart.includes('+-') ? '+-' : ''); 
            
            const returnString = [firstAnim, secondAnim, firstSplit, secondSplit, operator, secondOperator]
            return returnString;  
        } catch {
            const returnString = [firstAnim, secondAnim, lastPart, operator]
            return returnString;
        }
    }

    else {
        const newStatus = sumSpliter(action);
        // concatenation attempt
        if (newStatus === true) {
            animationSplits = action.split('++') || action.split('+-');
            const returnString = [animationSplits[0] || '', animationSplits[1] || ''];
            return returnString;
        } else {
            // common animation
            console.log(`[Vectora]: Animação comum -> executando diretamente`);
        }
    }

    const returnString = ['none'];
    return returnString;
}


function interpolSpliter(action: string): boolean {
    if (typeof action !== 'string' || action.length === 0) return false;

    // Split using the interpolation delimiter
    const splited = action.split('=>');

    // If delimiter not present, split returns single-element array
    if (splited.length < 2) return false;

    // Trim both sides and ensure they contain meaningful content
    const left = (splited[0] ?? '').trim();
    const right = (splited[1] ?? '').trim();

    return left.length > 0 && right.length > 0;
}


function sumSpliter(action: string): boolean {
    if (typeof action !== 'string' || action.length === 0) return false;

    // Split using the interpolation delimiter
    const splited = action.split('++') || action.split('+-');

    // If delimiter not present, split returns single-element array
    if (splited.length < 2) return false;

    // Trim both sides and ensure they contain meaningful content
    const left = (splited[0] ?? '').trim();
    const right = (splited[1] ?? '').trim();

    return left.length > 0 && right.length > 0;
}


