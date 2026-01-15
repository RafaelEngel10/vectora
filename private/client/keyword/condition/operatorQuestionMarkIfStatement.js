/**
 * IF Statement Handler for Vectora
 * Keyword: ??
 * 
 * Executes an action if a condition is true.
 * Syntax: ?? condition: action; or ?? condition { actions };
 */

export function handleIfStatement(condition, action) {
    try {
        // Evaluate the condition
        if (evaluateCondition(condition)) {
            // Execute the action
            executeAction(action);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error in IF statement:', error);
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
