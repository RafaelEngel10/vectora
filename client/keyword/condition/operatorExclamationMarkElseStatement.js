/**
 * ELSE Statement Handler for Vectora
 * Keyword: !!
 * 
 * Executes an action if the previous IF (??)/ELSE IF (!?) condition was false.
 * Syntax: ?? condition: action !!: elseAction; or ?? condition { actions } !! { actions };
 */

export function handleElseStatement(action) {
    try {
        // Execute the action in the else block
        executeAction(action);
        return true;
    } catch (error) {
        console.error('Error in ELSE statement:', error);
        return false;
    }
}

/**
 * Handles the complete IF-ELSE chain
 * @param {string} condition - The IF condition
 * @param {string} ifAction - Action to execute if condition is true
 * @param {string} elseAction - Action to execute if condition is false
 * @returns {boolean} - Whether any branch was executed
 */
export function handleIfElseChain(condition, ifAction, elseAction) {
    try {
        // Evaluate the condition
        if (evaluateCondition(condition)) {
            // Execute the IF action
            executeAction(ifAction);
            return true;
        } else {
            // Execute the ELSE action
            handleElseStatement(elseAction);
            return false;
        }
    } catch (error) {
        console.error('Error in IF-ELSE chain:', error);
        return false;
    }
}

/**
 * Evaluates a condition expression
 * @param {string} condition - The condition to evaluate
 * @returns {boolean} - Result of the condition
 */
function evaluateCondition(condition) {
    // Remove whitespace and parse the condition
    const trimmedCondition = condition.trim();
    
    // Handle comparison operators
    if (trimmedCondition.includes('==')) {
        return evaluateComparison(trimmedCondition, '==');
    } else if (trimmedCondition.includes('!=')) {
        return evaluateComparison(trimmedCondition, '!=');
    } else if (trimmedCondition.includes('>=')) {
        return evaluateComparison(trimmedCondition, '>=');
    } else if (trimmedCondition.includes('<=')) {
        return evaluateComparison(trimmedCondition, '<=');
    } else if (trimmedCondition.includes('>')) {
        return evaluateComparison(trimmedCondition, '>');
    } else if (trimmedCondition.includes('<')) {
        return evaluateComparison(trimmedCondition, '<');
    }
    
    return false;
}

/**
 * Evaluates a comparison expression
 * @param {string} expression - The comparison expression
 * @param {string} operator - The operator to use
 * @returns {boolean} - Result of the comparison
 */
function evaluateComparison(expression, operator) {
    const parts = expression.split(operator).map(p => p.trim());
    
    if (parts.length !== 2) return false;
    
    const left = parseValue(parts[0]);
    const right = parseValue(parts[1]);
    
    switch (operator) {
        case '==':
            return left == right;
        case '!=':
            return left != right;
        case '>=':
            return left >= right;
        case '<=':
            return left <= right;
        case '>':
            return left > right;
        case '<':
            return left < right;
        default:
            return false;
    }
}

/**
 * Parses a value (number, variable, or literal)
 * @param {string} value - The value to parse
 * @returns {*} - Parsed value
 */
function parseValue(value) {
    value = value.trim();
    
    // Check if it's a number
    if (!isNaN(value) && value !== '') {
        return Number(value);
    }
    
    // Check if it's a variable reference (starts with %%)
    if (value.startsWith('%%')) {
        return getVariableValue(value.substring(2));
    }
    
    // Otherwise return as string
    return value;
}

/**
 * Gets the value of a variable
 * @param {string} variableName - The variable name
 * @returns {*} - The variable value
 */
function getVariableValue(variableName) {
    // This should be implemented based on your Vectora context
    // Placeholder implementation
    return window[variableName] || 0;
}

/**
 * Executes an action or block of actions
 * @param {string} action - The action(s) to execute
 */
function executeAction(action) {
    // This should be implemented based on your Vectora action handler
    // Placeholder implementation
    console.log('Executing action:', action);
}
