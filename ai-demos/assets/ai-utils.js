// Shared utilities for AI demo pages
export const PRIORITY = { Critical:'Critical', High:'High', Medium:'Medium', Low:'Low' };
export const CATEGORY = { Emergency:'Emergency', Medical:'Medical', Appointment:'Appointment', Administrative:'Administrative', FollowUp:'Follow-up' };
export function classifyMessage(text){
  const t = text.toLowerCase();
  if(/heart|stroke|emergency|code blue|severe|chest pain/.test(t)) return {category:CATEGORY.Emergency, priority:PRIORITY.Critical, urgency:5};
  if(/surgery|lab|prescription|diagnosis|rx|scan/.test(t)) return {category:CATEGORY.Medical, priority:PRIORITY.High, urgency:4};
  if(/appointment|schedule|reschedule|calendar|slot/.test(t)) return {category:CATEGORY.Appointment, priority:PRIORITY.Medium, urgency:3};
  if(/invoice|billing|admin|policy|form|document/.test(t)) return {category:CATEGORY.Administrative, priority:PRIORITY.Medium, urgency:2};
  return {category:CATEGORY.FollowUp, priority:PRIORITY.Low, urgency:1};
}
export function confidenceFor(p){ return ({Critical:0.93,High:0.89,Medium:0.86,Low:0.84}[p]||0.85) }
export function badgeForPriority(p){
  const map = { Critical:'badge-ai badge-ai-critical', High:'badge-ai badge-ai-high', Medium:'badge-ai badge-ai-medium', Low:'badge-ai badge-ai-low' };
  const icon = { Critical:'ti ti-alert-triangle-filled', High:'ti ti-exclamation-circle', Medium:'ti ti-info-circle', Low:'ti ti-check-circle' };
  return `<span class="${map[p]}"><i class="${icon[p]}"></i>${p}</span>`
}
