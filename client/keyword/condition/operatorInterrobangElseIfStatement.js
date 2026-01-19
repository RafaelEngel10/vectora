/**
 * ELSE IF Statement Handler for Vectora
 * Keyword: !?
 * 
 * Executes an action if the previous IF (??)/ELSE IF (!?) condition was false and a new condition is true.
 * Syntax: ?? condition: action !? condition2: action2; or ?? condition { } !? condition2 { };
 */

export function handleElseIfStatement(condition, action) {
    try {
        // Evaluate the else-if condition
        if (evaluateCondition(condition)) {
            // Execute the action
            executeAction(action);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error in ELSE IF statement:', error);
        return false;
    }
}

/**
 * Handles the complete IF-ELSE IF chain
 * @param {string} ifCondition - The IF condition
 * @param {string} ifAction - Action to execute if IF condition is true
 * @param {Array} elseIfChain - Array of {condition, action} pairs
 * @param {string} elseAction - Action to execute if all conditions are false (optional)
 * @returns {boolean} - Whether any branch was executed
 */
export function handleIfElseIfChain(ifCondition, ifAction, elseIfChain, elseAction = null) {
    try {
        // Evaluate the IF condition
        if (evaluateCondition(ifCondition)) {
            executeAction(ifAction);
            return true;
        }
        
        // Evaluate each ELSE IF condition
        if (elseIfChain && Array.isArray(elseIfChain)) {
            for (const elseIf of elseIfChain) {
                if (handleElseIfStatement(elseIf.condition, elseIf.action)) {
                    return true;
                }
            }
        }
        
        // Execute ELSE action if no conditions were met
        if (elseAction) {
            executeAction(elseAction);
            return false;
        }
        
        return false;
    } catch (error) {
        console.error('Error in IF-ELSE IF chain:', error);
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
