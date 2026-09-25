/**
 * Prototype AI Assistant
 * -----------------------------------------------------------------------
 * IMPORTANT: This assistant NEVER determines eligibility. The matching
 * engine (utils/matchingEngine.js) is the sole source of truth for
 * eligibility. This module only explains data that already exists in
 * the database (scheme records + matching engine output). It never
 * invents interest rates, loan limits, rules, or partner information.
 *
 * In this prototype, "AI" is implemented as a deterministic, grounded
 * explanation generator over verified database fields — this keeps the
 * demo self-contained (no external API key required) while satisfying
 * the constraint that nothing is fabricated. The architecture leaves a
 * clear seam (see `callExternalLLM` below) to swap in a real LLM call
 * that still only operates over the same grounded context.
 */

function explainScheme(scheme) {
  if (!scheme) {
    return "I don't have information about that scheme in the database.";
  }
  const parts = [];
  parts.push(`${scheme.name}${scheme.shortName ? ` (${scheme.shortName})` : ''} is offered by ${scheme.organization}, under ${scheme.department}.`);
  if (scheme.purpose) parts.push(`Purpose: ${scheme.purpose}`);
  if (scheme.minLoanAmount != null && scheme.maxLoanAmount != null) {
    parts.push(`Loan amount range on record: ₹${scheme.minLoanAmount.toLocaleString('en-IN')} to ₹${scheme.maxLoanAmount.toLocaleString('en-IN')}.`);
  }
  if (scheme.interestRate) parts.push(`Interest rate on record: ${scheme.interestRate}.`);
  if (scheme.repaymentPeriod) parts.push(`Repayment period on record: ${scheme.repaymentPeriod}.`);
  parts.push(`This is preliminary information sourced from ${scheme.sourceName}, last verified ${scheme.lastVerifiedAt ? new Date(scheme.lastVerifiedAt).toDateString() : 'N/A'}. Please confirm current details on the official source before applying.`);
  return parts.join(' ');
}

function explainMatch(matchResult) {
  if (!matchResult) {
    return "I don't have a match result for that scheme in this session.";
  }
  const { scheme, status, matchedRules, failedRules, warnings } = matchResult;
  const lines = [];
  lines.push(`For ${scheme.name}, the rule engine determined status: ${status.replace(/_/g, ' ')}.`);
  if (matchedRules && matchedRules.length) {
    lines.push('Matched criteria: ' + matchedRules.map((r) => r.explanation).join('; ') + '.');
  }
  if (failedRules && failedRules.length) {
    lines.push('Criteria not met: ' + failedRules.map((r) => r.explanation).join('; ') + '.');
  }
  if (warnings && warnings.length) {
    lines.push('Points to verify: ' + warnings.join('; ') + '.');
  }
  lines.push('This is a Prototype Match Indicator only, not an official eligibility decision. Final eligibility is determined by the concerned authority or channel partner.');
  return lines.join(' ');
}

function explainDocuments(scheme) {
  if (!scheme || !scheme.requiredDocuments || !scheme.requiredDocuments.length) {
    return "I don't have a required document list for that scheme in the database.";
  }
  return `Documents typically required for ${scheme.name}: ${scheme.requiredDocuments.join(', ')}. Marking these "ready" in your Document Checklist reflects your own readiness only — it is not official government verification.`;
}

function explainFinancialTerm(term) {
  const glossary = {
    emi: 'EMI (Equated Monthly Instalment) is the fixed monthly payment made toward repaying a loan, covering both principal and interest.',
    moratorium: 'A moratorium is a period during which the borrower is not required to make repayments, often used at the start of a loan for a new business.',
    subsidy: 'A subsidy is financial assistance (often a partial waiver or grant) provided to reduce the effective cost of a loan or project for the beneficiary.',
    collateral: 'Collateral is an asset pledged as security for a loan, which the lender can claim if the loan is not repaid. Many schemes covered here are collateral-free up to specified limits — check the specific scheme page.',
    'interest rate': 'The interest rate is the percentage charged by the lender on the outstanding loan amount, usually expressed as an annual rate (% p.a.).',
    'project cost': 'Project cost is the total estimated cost of setting up or running the proposed business activity, which schemes use to determine loan eligibility limits.',
  };
  const key = (term || '').toLowerCase().trim();
  return glossary[key] || `I don't have a glossary entry for "${term}" in the database.`;
}

// Seam for a real LLM integration (e.g. Anthropic API) — intentionally not
// wired to a live external call in this prototype so the app has no
// external dependency requirement. Any real integration must still only
// pass grounded database content as context and must not be permitted to
// assert eligibility.
async function callExternalLLM(/* prompt, context */) {
  throw new Error('External LLM integration not configured in this prototype.');
}

module.exports = { explainScheme, explainMatch, explainDocuments, explainFinancialTerm, callExternalLLM };
