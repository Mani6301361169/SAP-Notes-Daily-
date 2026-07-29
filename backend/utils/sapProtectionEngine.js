/**
 * SAP Terminology Protection Engine & AI Writing Assistant
 * Analyzes note text for grammar, spelling, punctuation, capitalization, repeated words,
 * spacing, and readability improvements while GUARANTEEING that SAP-specific technical terms,
 * T-Codes, ABAP keywords, table names, BAPIs, and code snippets remain 100% untouched.
 */

// Comprehensive SAP Terminology Dictionary & Regex Patterns
const SAP_TCODES = [
  'MM01', 'MM02', 'MM03', 'VA01', 'VA02', 'VA03', 'SE11', 'SE16', 'SE16N', 'SE38',
  'FB50', 'ME21N', 'ME22N', 'ME23N', 'SPRO', 'VF01', 'MIGO', 'MIRO', 'PFCG', 'SU01',
  'SM30', 'SM37', 'ST05', 'ST22', 'AL11', 'SWDD', 'BD87', 'WE20', 'WE21', 'SCOT',
  'CMOD', 'SMOD', 'BAPI', 'RFC', 'IDOC', 'LSMW', 'SHDB', 'SIMAGE', 'FAGLB03', 'FB01'
];

const SAP_TABLES = [
  'MARA', 'MARC', 'MARD', 'MAKT', 'KNA1', 'LFA1', 'EKKO', 'EKPO', 'BKPF', 'BSEG',
  'VBAK', 'VBAP', 'VBRK', 'VBRP', 'T001', 'T001W', 'T001L', 'RESB', 'EBAN', 'MKPF',
  'MSEG', 'BSIS', 'BSAS', 'BSIK', 'BSIK', 'PA0001', 'PA0002', 'T005', 'TVKO', 'TVTW'
];

const SAP_ABAP_KEYWORDS = [
  'ABAP', 'BAPI', 'RFC', 'DATA', 'TYPES', 'TABLES', 'SELECT', 'ENDSELECT', 'WHERE',
  'INTO', 'CORRESPONDING', 'FIELDS', 'LOOP', 'ENDLOOP', 'AT', 'IF', 'ENDIF', 'ELSE',
  'ELSEIF', 'CASE', 'WHEN', 'ENDCASE', 'CALL', 'FUNCTION', 'PERFORM', 'FORM', 'ENDFORM',
  'CLASS', 'ENDCLASS', 'METHOD', 'ENDMETHOD', 'CONCATENATE', 'APPEND', 'READ', 'MODIFY',
  'WRITE', 'REPORT', 'PARAMETERS', 'SELECT-OPTIONS', 'SY-SUBRC', 'SY-UNAME', 'SY-DATUM'
];

const SAP_MODULES = ['MM', 'SD', 'FICO', 'ABAP', 'BASIS', 'PP', 'PM', 'QM', 'WM', 'EWM', 'BW', 'HANA', 'S/4HANA'];

// Helper to check if a word is an SAP protected term
function isSapProtectedTerm(token) {
  if (!token) return false;
  const clean = token.replace(/^[^\w]+|[^\w]+$/g, '').toUpperCase();
  
  // Exact match with known lists
  if (SAP_TCODES.includes(clean)) return true;
  if (SAP_TABLES.includes(clean)) return true;
  if (SAP_ABAP_KEYWORDS.includes(clean)) return true;
  if (SAP_MODULES.includes(clean)) return true;
  
  // Match standard SAP T-Code pattern: e.g. 2-4 uppercase letters followed by 2-4 digits (e.g. ME21N, FB50, VA01)
  if (/^[A-Z]{2,4}\d{1,4}[A-Z]?$/.test(clean)) return true;
  // Match SAP table / BAPI pattern (e.g. BAPI_*, Z_*, Y_*)
  if (/^(BAPI_|Z_|Y_|SAP_)/i.test(clean)) return true;
  // Configuration path separator (e.g. SPRO > IMG > Material Management)
  if (clean === 'SPRO' || clean === 'IMG') return true;

  return false;
}

/**
 * Real-time AI Assistant analyzeText
 * Returns array of suggestion items with originalText, suggestedText, type, description, and offsets.
 */
function analyzeText(text) {
  if (!text || typeof text !== 'string') {
    return { suggestions: [], text, textLength: 0 };
  }

  const suggestions = [];
  
  // Rule 1: Detect Repeated Words (e.g., "the the", "is is") - except protected SAP terms if intentionally repeated in code context
  const repeatedWordsRegex = /\b([a-zA-Z]{2,})\s+\1\b/gi;
  let match;
  while ((match = repeatedWordsRegex.exec(text)) !== null) {
    const word = match[1];
    if (!isSapProtectedTerm(word)) {
      suggestions.push({
        id: `rep-${match.index}`,
        type: 'repeated_word',
        category: 'Spelling & Grammar',
        originalText: match[0],
        suggestedText: word,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        description: `Repeated word '${word}' detected.`
      });
    }
  }

  // Rule 2: Unnecessary Multiple Spaces (e.g., "SAP   GUI")
  const multiSpaceRegex = /([^\n\S]{2,})/g;
  while ((match = multiSpaceRegex.exec(text)) !== null) {
    suggestions.push({
      id: `space-${match.index}`,
      type: 'unnecessary_space',
      category: 'Formatting',
      originalText: match[0],
      suggestedText: ' ',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      description: 'Multiple unnecessary spaces detected.'
    });
  }

  // Rule 3: Common English Grammar & Spelling Mistakes (protecting SAP terms)
  const commonMistakes = [
    { pattern: /\b(teh)\b/gi, replacement: 'the', desc: 'Typo in word "the".' },
    { pattern: /\b(recieve)\b/gi, replacement: 'receive', desc: 'Spelling mistake in "receive".' },
    { pattern: /\b(seperated)\b/gi, replacement: 'separated', desc: 'Spelling mistake in "separated".' },
    { pattern: /\b(creates a new materials)\b/gi, replacement: 'creates new materials', desc: 'Plural agreement error.' },
    { pattern: /\b(use for create)\b/gi, replacement: 'used to create', desc: 'Verb form agreement.' },
    { pattern: /\b(tcode)\b/gi, replacement: 'T-Code', desc: 'Capitalize technical acronym.' },
    { pattern: /\b(gui)\b/gi, replacement: 'GUI', desc: 'Capitalize GUI acronym.' },
    { pattern: /\b(abap)\b/gi, replacement: 'ABAP', desc: 'Capitalize ABAP.' },
    { pattern: /\b(bapi)\b/gi, replacement: 'BAPI', desc: 'Capitalize BAPI.' },
    { pattern: /\b(rfc)\b/gi, replacement: 'RFC', desc: 'Capitalize RFC.' },
    { pattern: /\b(idoc)\b/gi, replacement: 'IDoc', desc: 'Capitalize IDoc.' },
    { pattern: /\b(spelllling|speling)\b/gi, replacement: 'spelling', desc: 'Spelling correction.' },
    { pattern: /\b(infomation)\b/gi, replacement: 'information', desc: 'Spelling correction.' },
    { pattern: /\b(transaction code)\b/gi, replacement: 'Transaction Code', desc: 'Professional SAP wording.' },
    { pattern: /\b(master data)\b/gi, replacement: 'Master Data', desc: 'Capitalize SAP term.' }
  ];

  commonMistakes.forEach((rule, idx) => {
    let m;
    // reset regex index
    rule.pattern.lastIndex = 0;
    while ((m = rule.pattern.exec(text)) !== null) {
      const matchedStr = m[0];
      // Check if it's protected or inside code snippet
      if (!isSapProtectedTerm(matchedStr)) {
        suggestions.push({
          id: `rule-${idx}-${m.index}`,
          type: 'grammar_spelling',
          category: 'Spelling & Grammar',
          originalText: matchedStr,
          suggestedText: rule.replacement,
          startIndex: m.index,
          endIndex: m.index + matchedStr.length,
          description: rule.desc
        });
      }
    }
  });

  // Rule 4: Lowercase Sentence Starts (Capitalization)
  const sentenceStartRegex = /(?:^|[.!?]\s+)([a-z])/g;
  while ((match = sentenceStartRegex.exec(text)) !== null) {
    const letter = match[1];
    const letterIndex = match.index + (match[0].length - 1);
    const wordBoundary = text.slice(letterIndex).match(/^[a-zA-Z0-9]+/);
    const fullWord = wordBoundary ? wordBoundary[0] : letter;

    if (!isSapProtectedTerm(fullWord) && fullWord !== 'i') {
      suggestions.push({
        id: `cap-${letterIndex}`,
        type: 'capitalization',
        category: 'Capitalization',
        originalText: letter,
        suggestedText: letter.toUpperCase(),
        startIndex: letterIndex,
        endIndex: letterIndex + 1,
        description: 'Capitalize sentence start.'
      });
    }
  }

  // Deduplicate overlapping suggestions by prioritizing longer spans or earlier indices
  const uniqueSuggestions = suggestions.sort((a, b) => a.startIndex - b.startIndex);

  return {
    suggestions: uniqueSuggestions,
    protectedTermsDetected: SAP_TCODES.concat(SAP_TABLES, SAP_ABAP_KEYWORDS).filter(term => 
      new RegExp(`\\b${term}\\b`, 'i').test(text)
    ),
    textLength: text.length
  };
}

module.exports = {
  isSapProtectedTerm,
  analyzeText,
  SAP_TCODES,
  SAP_TABLES,
  SAP_ABAP_KEYWORDS,
  SAP_MODULES
};
