import { handleIfStatement } from "../../private/client/keyword/condition/operatorQuestionMarkIfStatement.js";
import { handleElseStatement, handleIfElseChain } from "../../private/client/keyword/condition/operatorExclamationMarkElseStatement.js";
import { handleElseIfStatement, handleIfElseIfChain } from "../../private/client/keyword/condition/operatorInterrobangElseIfStatement.js";
import { macron } from "../console.js";

/**
 * Detects and processes Vectora conditional keywords (??, !!, !?)
 * These keywords allow conditional logic within style properties
 */

/**
 * Checks if an action string contains conditional keywords
 * @param {string} actionString - The action string to check
 * @returns {boolean} - True if keywords are found
 */
export function hasConditionalKeywords(actionString) {
  return /\?\?|!!|\!\?/.test(actionString);
}

/**
 * Filters and processes conditional keywords in an action string
 * @param {string} actionString - The action string containing keywords
 * @param {HTMLElement} element - The element to apply the action to
 * @param {Function} executeAnimationAction - Function to execute animations
 * @returns {Promise<boolean>} - True if a keyword action was executed
 */
export async function filterKeywordActions(actionString, element, executeAnimationAction) {
  try {
    // Check for IF (??) statement
    const ifPattern = /\?\?\s*([^:{}!]+?)(?::|\{)([^}!]*?)(?:!!|!?\}|$)/g;
    const elseIfPattern = /!?\s*([^:{}]+?)(?::|\{)([^}!]*?)(?:!!|\}|$)/g;
    const elsePattern = /!!\s*(?::|\{)([^}]*?)(?:\}|$)/g;

    // Parse the complete conditional structure
    const conditionalStructure = parseConditionalStructure(actionString);

    if (!conditionalStructure) {
      return false;
    }

    macron('log', `Processando palavras-chave condicionais: ${actionString}`);

    // Process the IF-ELSE IF-ELSE chain
    return await processConditionalChain(conditionalStructure, element, executeAnimationAction);

  } catch (error) {
    macron('error', `Erro ao processar palavras-chave: ${error.message}`);
    return false;
  }
}

/**
 * Parses the conditional structure from an action string
 * @param {string} actionString - The action string
 * @returns {Object|null} - Parsed structure or null if no valid structure found
 */
function parseConditionalStructure(actionString) {
  const trimmed = actionString.trim();

  // Pattern to match: ?? condition: action !!: else || ?? condition { actions } !!: { else }
  const fullPattern = /\?\?\s*([^:{}]+?)(?::([^!]+)|{([^}]+)})\s*(?:(!!|!?)\s*(?::([^!]+)|{([^}]+)})|(?=!!|!?|$))(.*)/;

  const match = trimmed.match(fullPattern);

  if (!match) {
    // Try simple IF pattern without ELSE/ELSE IF
    const simpleIfPattern = /\?\?\s*([^:{}]+?)(?::([^!]+)|{([^}]+)})/;
    const simpleMatch = trimmed.match(simpleIfPattern);

    if (simpleMatch) {
      return {
        type: 'if',
        condition: simpleMatch[1].trim(),
        action: (simpleMatch[2] || simpleMatch[3] || '').trim(),
        elseIfChain: [],
        elseAction: null
      };
    }

    return null;
  }

  const structure = {
    type: 'if',
    condition: match[1].trim(),
    action: (match[2] || match[3] || '').trim(),
    elseIfChain: [],
    elseAction: null
  };

  // Check for ELSE IF or ELSE
  const remainder = match[8] || '';

  if (remainder.includes('!?')) {
    // Parse ELSE IF statements
    const elseIfMatches = remainder.matchAll(/!?\s*([^:{}]+?)(?::([^!]+)|{([^}]+)})/g);

    for (const elseIfMatch of elseIfMatches) {
      structure.elseIfChain.push({
        condition: elseIfMatch[1].trim(),
        action: (elseIfMatch[2] || elseIfMatch[3] || '').trim()
      });
    }
  }

  if (remainder.includes('!!')) {
    // Parse ELSE statement
    const elseMatch = remainder.match(/!!\s*(?::([^!]+)|{([^}]+)})/);
    if (elseMatch) {
      structure.elseAction = (elseMatch[1] || elseMatch[2] || '').trim();
    }
  }

  return structure;
}

/**
 * Processes the conditional chain
 * @param {Object} structure - The parsed conditional structure
 * @param {HTMLElement} element - The element to apply to
 * @param {Function} executeAnimationAction - Function to execute animations
 * @returns {Promise<boolean>} - True if a branch was executed
 */
async function processConditionalChain(structure, element, executeAnimationAction) {
  try {
    // Create a custom evaluate function that uses the context of the element
    const evaluateWithContext = (condition) => {
      return evaluateConditionInContext(condition, element);
    };

    // Check the IF condition
    if (evaluateWithContext(structure.condition)) {
      macron('log', `Condição IF verdadeira. Executando ação: ${structure.action}`);
      
      if (structure.action) {
        await executeAnimationAction(structure.action, element);
      }
      return true;
    }

    // Check ELSE IF conditions
    if (structure.elseIfChain && structure.elseIfChain.length > 0) {
      for (const elseIf of structure.elseIfChain) {
        if (evaluateWithContext(elseIf.condition)) {
          macron('log', `Condição ELSE IF verdadeira. Executando ação: ${elseIf.action}`);
          
          if (elseIf.action) {
            await executeAnimationAction(elseIf.action, element);
          }
          return true;
        }
      }
    }

    // Execute ELSE action if no conditions were met
    if (structure.elseAction) {
      macron('log', `Nenhuma condição verdadeira. Executando ELSE: ${structure.elseAction}`);
      
      if (structure.elseAction) {
        await executeAnimationAction(structure.elseAction, element);
      }
      return false;
    }

    return false;

  } catch (error) {
    macron('error', `Erro ao processar cadeia condicional: ${error.message}`);
    return false;
  }
}

/**
 * Evaluates a condition in the context of an element
 * Handles comparison operators: ==, !=, >=, <=, >, <
 * 
 * @param {string} condition - The condition to evaluate
 * @param {HTMLElement} element - The element context
 * @returns {boolean} - Result of the condition
 */
function evaluateConditionInContext(condition, element) {
  const trimmed = condition.trim();

  // Extract the operator and operands
  let operator = null;
  let operands = null;

  if (trimmed.includes('==')) {
    operator = '==';
    operands = trimmed.split('==').map(s => s.trim());
  } else if (trimmed.includes('!=')) {
    operator = '!=';
    operands = trimmed.split('!=').map(s => s.trim());
  } else if (trimmed.includes('>=')) {
    operator = '>=';
    operands = trimmed.split('>=').map(s => s.trim());
  } else if (trimmed.includes('<=')) {
    operator = '<=';
    operands = trimmed.split('<=').map(s => s.trim());
  } else if (trimmed.includes('>')) {
    operator = '>';
    operands = trimmed.split('>').map(s => s.trim());
  } else if (trimmed.includes('<')) {
    operator = '<';
    operands = trimmed.split('<').map(s => s.trim());
  }

  if (!operator || !operands || operands.length !== 2) {
    macron('warn', `Condição inválida: ${condition}`);
    return false;
  }

  const left = parseValueInContext(operands[0], element);
  const right = parseValueInContext(operands[1], element);

  // Perform comparison
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
 * Parses a value in the context of an element
 * Supports: numbers, variables (%%), element attributes
 * 
 * @param {string} value - The value to parse
 * @param {HTMLElement} element - The element context
 * @returns {*} - Parsed value
 */
function parseValueInContext(value, element) {
  value = value.trim();

  // Check if it's a number
  if (!isNaN(value) && value !== '') {
    return Number(value);
  }

  // Check if it's a variable reference (%%)
  if (value.startsWith('%%')) {
    const varName = value.substring(2);
    
    // Try to get from global scope first
    if (window[varName] !== undefined) {
      return window[varName];
    }

    // Try to get from element dataset
    if (element && element.dataset && element.dataset[varName] !== undefined) {
      const dataValue = element.dataset[varName];
      return isNaN(dataValue) ? dataValue : Number(dataValue);
    }

    return 0;
  }

  // Check if it's a string literal in quotes
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  // Otherwise return as string
  return value;
}

export {
  parseConditionalStructure,
  processConditionalChain,
  evaluateConditionInContext,
  parseValueInContext
};
