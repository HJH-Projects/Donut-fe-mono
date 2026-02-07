import { describe, it, expect } from 'vitest';
import { CACHE_TAGS } from './cache-tags';

describe('CACHE_TAGS', () => {
  it('should have all required cache tag keys', () => {
    expect(CACHE_TAGS.CLOTHES).toBe('clothes');
    expect(CACHE_TAGS.LOOKS).toBe('looks');
    expect(CACHE_TAGS.LOCATIONS).toBe('locations');
    expect(CACHE_TAGS.USER).toBe('user');
    expect(CACHE_TAGS.USER_STATS).toBe('user-stats');
  });

  it('should have unique values', () => {
    const values = Object.values(CACHE_TAGS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});
