/**
 * Disha Matching Engine
 * -----------------------------------------------------------------------
 * This is the SOLE source of truth for preliminary eligibility matching.
 * No eligibility logic exists on the frontend, and the AI assistant does
 * not determine eligibility — it may only explain results produced here.
 *
 * Output statuses:
 *   POTENTIALLY_ELIGIBLE   - all mandatory rules passed
 *   NEEDS_MORE_INFORMATION - a mandatory rule could not be evaluated
 *                            because required input was missing
 *   NOT_MATCHED            - one or more mandatory rules failed
 *
 * The numeric "matchPercentage" is explicitly a "Prototype Match
 * Indicator" and must never be presented as an official eligibility
 * score.
 */

const Scheme = require('../models/Scheme');
const EligibilityRule = require('../models/EligibilityRule');

function getField(input, field) {
  return input[field];
}

function evaluateRule(rule, input) {
  const fieldValue = getField(input, rule.field);

  if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
    return { outcome: 'MISSING_INFO' };
  }

  const { operator, value } = rule;
  let passed = false;

  switch (operator) {
    case '==':
      passed = String(fieldValue).toLowerCase() === String(value).toLowerCase();
      break;
    case '!=':
      passed = String(fieldValue).toLowerCase() !== String(value).toLowerCase();
      break;
    case '>':
      passed = Number(fieldValue) > Number(value);
      break;
    case '>=':
      passed = Number(fieldValue) >= Number(value);
      break;
    case '<':
      passed = Number(fieldValue) < Number(value);
      break;
    case '<=':
      passed = Number(fieldValue) <= Number(value);
      break;
    case 'IN':
      passed = Array.isArray(value) && value.map(String).map((v) => v.toLowerCase()).includes(String(fieldValue).toLowerCase());
      break;
    case 'NOT_IN':
      passed = Array.isArray(value) && !value.map(String).map((v) => v.toLowerCase()).includes(String(fieldValue).toLowerCase());
      break;
    case 'BETWEEN':
      passed = Array.isArray(value) && value.length === 2 && Number(fieldValue) >= Number(value[0]) && Number(fieldValue) <= Number(value[1]);
      break;
    default:
      passed = false;
  }

  return { outcome: passed ? 'PASSED' : 'FAILED' };
}

async function matchUserToSchemes(input) {
  const schemes = await Scheme.find({ status: 'active' }).lean();
  const results = [];

  for (const scheme of schemes) {
    const rules = await EligibilityRule.find({ schemeId: scheme._id, active: true }).sort({ priority: -1 }).lean();

    const matchedRules = [];
    const failedRules = [];
    const warnings = [];
    const reasons = [];

    let mandatoryTotal = 0;
    let mandatoryPassed = 0;
    let hasMissingMandatoryInfo = false;
    let hasFailedMandatory = false;

    for (const rule of rules) {
      const { outcome } = evaluateRule(rule, input);

      if (rule.ruleType === 'mandatory') {
        mandatoryTotal += 1;
        if (outcome === 'PASSED') {
          mandatoryPassed += 1;
          matchedRules.push({ field: rule.field, explanation: rule.explanation, ruleType: rule.ruleType });
          reasons.push(rule.explanation);
        } else if (outcome === 'MISSING_INFO') {
          hasMissingMandatoryInfo = true;
          warnings.push(`Missing information for "${rule.field}" — needed to fully evaluate this scheme.`);
        } else {
          hasFailedMandatory = true;
          failedRules.push({ field: rule.field, explanation: rule.explanation, ruleType: rule.ruleType });
        }
      } else if (rule.ruleType === 'conditional') {
        if (outcome === 'PASSED') {
          matchedRules.push({ field: rule.field, explanation: rule.explanation, ruleType: rule.ruleType });
        } else if (outcome === 'FAILED') {
          warnings.push(rule.explanation);
        } else {
          warnings.push(`Additional detail needed for "${rule.field}" to refine this match.`);
        }
      } else {
        // informational — never blocks eligibility, just surfaced as a note
        warnings.push(rule.explanation);
      }
    }

    let status;
    if (hasFailedMandatory) {
      status = 'NOT_MATCHED';
    } else if (hasMissingMandatoryInfo) {
      status = 'NEEDS_MORE_INFORMATION';
    } else {
      status = 'POTENTIALLY_ELIGIBLE';
    }

    const matchPercentage = mandatoryTotal > 0 ? Math.round((mandatoryPassed / mandatoryTotal) * 100) : 0;

    // Only include schemes that are at least plausible — hide clear non-matches
    // with zero mandatory passes and no matched rules at all, unless there were
    // no rules configured (in which case we still surface it as needing info).
    results.push({
      scheme,
      status,
      matchPercentage, // "Prototype Match Indicator" — not an official score
      matchedRules,
      failedRules,
      warnings,
      reasons,
    });
  }

  // Sort: potentially eligible first, then needs-more-info, then not matched;
  // within each group, higher prototype match indicator first.
  const statusOrder = { POTENTIALLY_ELIGIBLE: 0, NEEDS_MORE_INFORMATION: 1, NOT_MATCHED: 2 };
  results.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    return b.matchPercentage - a.matchPercentage;
  });

  return results;
}

module.exports = { matchUserToSchemes, evaluateRule };
