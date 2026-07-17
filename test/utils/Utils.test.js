const { generateCode } = require('../../src/utils/Utils');

describe('generateCode', () => {
  it('should return 01 when the array is empty', () => {
    expect(generateCode([])).toBe('01');
  });

  it('should return the next code after the last existing code', () => {
    const items = [
      { code: '01' },
      { code: '02' },
    ];

    expect(generateCode(items)).toBe('03');
  });

  it('should use the highest code when there is a gap', () => {
    const items = [
      { code: '01' },
      { code: '03' },
    ];

    expect(generateCode(items)).toBe('04');
  });

  it('should use the last segment of hierarchical codes', () => {
    const items = [
      { code: '01.01' },
      { code: '01.02' },
    ];

    expect(generateCode(items)).toBe('03');
  });

  it('should handle trailing dots in codes', () => {
    const items = [
      { code: '01.' },
      { code: '02.' },
    ];

    expect(generateCode(items)).toBe('03');
  });

  it('should ignore items without a code', () => {
    const items = [
      { code: '01' },
      { code: null },
      {},
      { code: '02' },
    ];

    expect(generateCode(items)).toBe('03');
  });

  it('should pad the result to the given code_length', () => {
    const items = [
      { code: '001' },
      { code: '002' },
    ];

    expect(generateCode(items, 3)).toBe('003');
  });

  it('should sort codes before picking the last one', () => {
    const items = [
      { code: '03' },
      { code: '01' },
      { code: '02' },
    ];

    expect(generateCode(items)).toBe('04');
  });
});
