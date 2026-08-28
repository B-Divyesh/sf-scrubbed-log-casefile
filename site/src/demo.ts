export type DemoResult = { text: string; counts: Record<string, number> };
type Rule = { name: string; kind: string; regex: RegExp };

const rules: Rule[] = [
  { name: 'authorization header', kind: 'AUTH', regex: /authorization\s*[:=]\s*["']?([^\s"',;&}]+(?:\s+[^\s"',;&}]+)?)/gi },
  { name: 'credential', kind: 'SECRET', regex: /["']?(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token)["']?\s*[:=]\s*["']?([^\s"',;&}]+)/gi },
  { name: 'JWT', kind: 'JWT', regex: /(eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{3,}\.[A-Za-z0-9_-]{3,})/g },
  { name: 'email', kind: 'EMAIL', regex: /([A-Za-z0-9.!#$%&'*+/?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g },
  { name: 'IPv4', kind: 'IPV4', regex: /\b((?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3})\b/g },
];

export function createCaseSalt(): string {
  const bytes = new Uint32Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(8, '0')).join('');
}

function token(kind: string, value: string, salt: string): string {
  let hash = 2166136261;
  const salted = `${salt}:${value}`;
  for (let i = 0; i < salted.length; i += 1) {
    hash ^= salted.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `<${kind}:${(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}>`;
}

export function scrubPreview(input: string, salt = 'browser-preview-test-salt'): DemoResult {
  let text = input;
  const counts: Record<string, number> = {};
  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    text = text.replace(rule.regex, (whole, value: string) => {
      counts[rule.name] = (counts[rule.name] ?? 0) + 1;
      return whole.replace(value, token(rule.kind, value, salt));
    });
  }
  return { text, counts };
}
