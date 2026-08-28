import { describe, expect, it } from 'vitest';
import { scrubPreview } from './demo';

describe('browser preview', () => {
  it('removes common values while preserving repeated correlation', () => {
    const result = scrubPreview('a=x@example.com b=x@example.com ip=10.0.0.7 password=hunter2');
    expect(result.text).not.toContain('x@example.com');
    expect(result.text).not.toContain('10.0.0.7');
    expect(result.text).not.toContain('hunter2');
    expect(result.text.match(/<EMAIL:[A-F0-9]{8}>/g)).toHaveLength(2);
    expect(new Set(result.text.match(/<EMAIL:[A-F0-9]{8}>/g)).size).toBe(1);
  });
  it('returns an unchanged empty value', () => {
    expect(scrubPreview('')).toEqual({ text: '', counts: {} });
  });
});
