import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties } from "./basics.js";
import { macron } from "./console.js";
import { attachHandlerForEvent } from "./src/events/commonEvents.js";
import { AsyncEvents } from "./global/element/asyncEvents.js";
import { AsyncTester } from "./global/element/asyncElementTester.js";
import { parseAsyncElement } from "./global/resolver/asyncParse.js";


/********** parser (stack-safe for nested blocks 1 level) **********/

export function parseVectora(code) {
  code = removeComments(code);
  let i = 0, n = code.length, blocks = [];
  
  function skipWhitespace() {
    while (i < n && /\s/.test(code[i])) i++;
  }

  while (i < n) {
    skipWhitespace();
    if (i >= n) break;
    // read selector up to first '{'
    let selStart = i;
    while (i < n && code[i] !== '{') i++;
    if (i >= n) break;
    let selector = code.slice(selStart, i).trim();
    i++; // skip '{'
    
    // read until matching '}' for selector block (brace matching)
    let brace = 1, innerStart = i;
    while (i < n && brace > 0) {
      if (code[i] === '{') brace++;
      else if (code[i] === '}') brace--;
      i++;
    }
    const inner = code.slice(innerStart, i - 1);
    
    // parse events inside inner
    const events = [];
    let j = 0, m = inner.length;
    
    while (j < m) {
      // skip whitespace
      while (j < m && /\s/.test(inner[j])) j++;
      if (j >= m) break;
      
      // read event name up to '{'
      let nameStart = j;
      while (j < m && inner[j] !== '{') j++;
      if (j >= m) break;
      let eventName = inner.slice(nameStart, j).trim();
      j++; // skip '{'
      
      // read event block until matching '}'
      let b = 1, contentStart = j;
      while (j < m && b > 0) {
        if (inner[j] === '{') b++;
        else if (inner[j] === '}') b--;
        j++;
      }
      const content = inner.slice(contentStart, j - 1);
      
      // skip optional whitespace and semicolon after event block
      while (j < m && /\s/.test(inner[j])) j++;
      if (j < m && inner[j] === ';') j++;
      
      // parse properties inside content: prop: value;
      const actions = [];
      const propRegex = /([a-zA-Z\-]+)\s*:\s*([^;]+);/g;
      let pm;
      while ((pm = propRegex.exec(content)) !== null) {
        actions.push({
          prop: pm[1].trim(),
          value: pm[2].trim()
        });
      }
      
      events.push({ name: eventName, actions });
    }
    
    blocks.push({ selector, events });
  }

  return blocks;
}


/********** process code (blocks -> bind) **********/
export function processVectora(code) {
  try {
    const blocks = parseVectora(code);
    const asyncBlock = parseAsyncElement(code);
    
    blocks.forEach(b => {
      b.events.forEach(e => {
        attachHandlerForEvent(b.selector, e.name, e.actions);
      });
    });
    
    runAsyncTester(asyncBlock);
    
  } catch (err) {
    macron('error', err);
  }
}

function runAsyncTester(block) {
  block.forEach(ab => {
    AsyncTester(ab.selector, ab.actions);
  })
}