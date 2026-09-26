// The model's answer, checked. Strings are plain text with caps; arrays have
// caps; evidence citations must resolve to something the model was shown.
// The output of this module is the only model-derived thing the renderer
// ever sees.

const SECTION_KINDS = ['intent', 'behaviour', 'structure', 'impact', 'verification'];
const FINDING_STATUS = ['verified', 'inferred', 'unverified'];

export class ReportValidationError extends Error {
  constructor(errors) {
    super(`The model's report failed validation: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`);
    this.name = 'ReportValidationError';
    this.errors = errors;
  }
}

// Pull the first JSON object out of the model's text: bare, or in a fence.
export function extractJson(text) {
  const source = String(text ?? '');
  const fence = source.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1] : source;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start < 0 || end <= start) throw new ReportValidationError(['no JSON object found in the answer']);
  const slice = candidate.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch (error) {
    throw new ReportValidationError([`the answer is not valid JSON: ${error.message}`]);
  }
}

const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

function str(value, path, max, errors, { required = true } = {}) {
  if (value === null || value === undefined) {
    if (required) errors.push(`${path} is required`);
    return null;
  }
  if (typeof value !== 'string') { errors.push(`${path} must be a string`); return null; }
  const clean = value.replace(CONTROL, '').replace(/\s+/g, ' ').trim();
  if (!clean) { if (required) errors.push(`${path} must not be empty`); return null; }
  if (/<[a-z!\/]/i.test(clean)) errors.push(`${path} must be plain text without HTML tags`);
  if (clean.length > max) errors.push(`${path} exceeds ${max} characters (${clean.length})`);
  return clean.slice(0, max);
}

function list(value, path, { min = 0, max, errors, item, optional = false }) {
  if (value === null || value === undefined) {
    if (min > 0 && !optional) errors.push(`${path} is required`);
    return optional ? null : [];
  }
  if (!Array.isArray(value)) { errors.push(`${path} must be an array`); return optional ? null : []; }
  if (value.length < min) errors.push(`${path} needs at least ${min} items`);
  if (value.length > max) errors.push(`${path} has more than ${max} items`);
  return value.slice(0, max).map((v, i) => item(v, `${path}[${i}]`)).filter((v) => v !== null);
}

function oneOf(value, path, allowed, errors) {
  if (typeof value !== 'string' || !allowed.includes(value)) { errors.push(`${path} must be one of ${allowed.join(', ')}`); return null; }
  return value;
}

export function validateReport(raw, index) {
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new ReportValidationError(['the answer must be a JSON object']);

  const report = {};
  report.title = str(raw.title, 'title', 80, errors);
  report.standfirst = str(raw.standfirst, 'standfirst', 300, errors);
  const hero = raw.hero && typeof raw.hero === 'object' ? raw.hero : {};
  if (!raw.hero) errors.push('hero is required');
  report.hero = {
    before: str(hero.before, 'hero.before', 60, errors),
    after: str(hero.after, 'hero.after', 60, errors),
    unit: str(hero.unit, 'hero.unit', 80, errors, { required: false }),
  };

  const seenKinds = new Set();
  report.sections = list(raw.sections, 'sections', { min: 1, max: 6, errors, item: (s, path) => {
    if (!s || typeof s !== 'object') { errors.push(`${path} must be an object`); return null; }
    const kind = oneOf(s.kind, `${path}.kind`, SECTION_KINDS, errors);
    if (kind && seenKinds.has(kind)) errors.push(`${path}.kind ${kind} appears twice`);
    if (kind) seenKinds.add(kind);
    const section = {
      kind,
      lead: str(s.lead, `${path}.lead`, 200, errors),
      paragraphs: list(s.paragraphs, `${path}.paragraphs`, { max: 4, errors, item: (p, q) => str(p, q, 600, errors) }),
      compare: null,
      flow: null,
      facts: null,
      evidence: [],
      caveat: str(s.caveat, `${path}.caveat`, 400, errors, { required: false }),
    };
    if (s.compare !== null && s.compare !== undefined) {
      if (typeof s.compare !== 'object') errors.push(`${path}.compare must be an object or null`);
      else {
        const side = (v, q) => {
          if (!v || typeof v !== 'object') { errors.push(`${q} must be an object`); return null; }
          return { title: str(v.title, `${q}.title`, 60, errors), items: list(v.items, `${q}.items`, { min: 1, max: 6, errors, item: (x, r) => str(x, r, 200, errors) }) };
        };
        section.compare = { before: side(s.compare.before, `${path}.compare.before`), after: side(s.compare.after, `${path}.compare.after`) };
        if (!section.compare.before || !section.compare.after) section.compare = null;
      }
    }
    if (s.flow !== null && s.flow !== undefined) {
      section.flow = list(s.flow, `${path}.flow`, { min: 2, max: 6, errors, optional: true, item: (step, q) => {
        if (!step || typeof step !== 'object') { errors.push(`${q} must be an object`); return null; }
        return { name: str(step.name, `${q}.name`, 40, errors), detail: str(step.detail, `${q}.detail`, 160, errors, { required: false }) };
      } });
      if (section.flow && section.flow.length < 2) section.flow = null;
    }
    if (s.facts !== null && s.facts !== undefined) {
      section.facts = list(s.facts, `${path}.facts`, { min: 1, max: 8, errors, optional: true, item: (fact, q) => {
        if (!fact || typeof fact !== 'object') { errors.push(`${q} must be an object`); return null; }
        return { term: str(fact.term, `${q}.term`, 60, errors), definition: str(fact.definition, `${q}.definition`, 240, errors) };
      } });
      if (section.facts && !section.facts.length) section.facts = null;
    }
    section.evidence = list(s.evidence, `${path}.evidence`, { max: 12, errors, item: (ref, q) => {
      if (typeof ref !== 'string') { errors.push(`${q} must be a string`); return null; }
      const resolved = index.resolve(ref);
      if (!resolved) { errors.push(`${q} cites ${JSON.stringify(ref.slice(0, 80))}, which is not a changed file path or a listed commit`); return null; }
      return resolved;
    } });
    return section;
  } });

  report.findings = list(raw.findings, 'findings', { min: 1, max: 12, errors, item: (f, path) => {
    if (!f || typeof f !== 'object') { errors.push(`${path} must be an object`); return null; }
    return { status: oneOf(f.status, `${path}.status`, FINDING_STATUS, errors), text: str(f.text, `${path}.text`, 240, errors) };
  } });
  report.migration = list(raw.migration, 'migration', { max: 8, errors, item: (m, path) => str(m, path, 240, errors) });

  if (errors.length) throw new ReportValidationError(errors);
  return report;
}
