import { pop, push, reverse, shift, sort, splice, unshift, merge, get, set } from '../src/index';

const orderAsc = (a, b) =>
  a > b
    ? 1
    : (a === b ? 0 : -1);

const orderDesc = (a, b) =>
  a < b
    ? 1
    : (a === b ? 0 : -1);

describe('modify array', () => {
  const array = [1, 22, 3];

  test('pop', () => {
    expect(pop(array)).toEqual([1, 22]);
    expect(array).toEqual([1, 22, 3]);
  });

  test('push', () => {
    expect(push(array, 4, 5)).toEqual([1, 22, 3, 4, 5]);
    expect(array).toEqual([1, 22, 3]);
  });

  test('reverse', () => {
    expect(reverse(array)).toEqual([3, 22, 1]);
    expect(array).toEqual([1, 22, 3]);
  });

  test('shift', () => {
    expect(shift(array)).toEqual([22, 3]);
    expect(array).toEqual([1, 22, 3]);
  });

  test('sort', () => {
    expect(sort(array, orderAsc)).toEqual([1, 3, 22]);
    expect(sort(array, orderDesc)).toEqual([22, 3, 1]);
    expect(array).toEqual([1, 22, 3]);
  });

  // splice(array, startIndex, deleteCount, item1, item2, ...)
  test('splice', () => {
    expect(splice(array, 1, 1, 1.9, 2.1)).toEqual([1, 1.9, 2.1, 3]);
    expect(array).toEqual([1, 22, 3]);
  });

  test('unshift', () => {
    expect(unshift(array, -1, 0)).toEqual([-1, 0, 1, 22, 3]);
    expect(array).toEqual([1, 22, 3]);
  });
});

describe('modify object', () => {
  test('merge', () => {
    const obj = { a: { b: 3 }, c: 4 };
    const mod = { a: { z: true }, c: 5 };
    expect(merge(obj, mod)).toEqual({ a: { b: 3, z: true }, c: 5 });
    expect(obj).toEqual({ a: { b: 3 }, c: 4 });
    expect(mod).toEqual({ a: { z: true }, c: 5 });
  });

  test('get', () => {
    const obj = { a: { b: 3 }, c: { d: [ 1, ['!', '?'], 3, { x: { y: true } } ] } };
    expect(get(obj, 'a')).toEqual({ b: 3 });
    expect(get(obj, 'a.b')).toEqual(3);
    expect(get(obj, 'c.d[3].x.y')).toEqual(true);
    expect(get(obj, 'c.d[1][0]')).toEqual('!');
    expect(get(['@', '#'], '[1]')).toEqual('#');
    expect(get(['@', [ { a: 'ok' } ]], '[1][0].a')).toEqual('ok');
    expect(get(obj, 'c.d[10][0]')).toEqual(undefined);
    expect(get(obj, 'c.e.f')).toEqual(undefined);
    expect(get(obj, 'no')).toEqual(undefined);
  });

  describe('mutate an object (set)', () => {
    const obj = { a: { b: 3 }, c: true, list: ['ok'] };

    expect(set(obj, 'a', false)).toEqual({ a: false, c: true, list: ['ok'] });
    expect(set(obj, 'd', 0)).toEqual({ a: { b: 3 }, c: true, d: 0, list: ['ok'] });
    expect(set(obj, 'a.b', 1)).toEqual({ a: { b: 1 }, c: true, list: ['ok'] });
    expect(set(obj, 'd.e', 3)).toEqual({ a: { b: 3 }, c: true, d: { e: 3 }, list: ['ok'] });
    expect(set(obj, 'a.b.x', 1)).toEqual({ a: { b: { x: 1 } }, c: true, list: ['ok'] });
    expect(set(obj, 'a.b.x.y.z', 1)).toEqual({ a: { b: { x: { y: { z: 1 } } } }, c: true, list: ['ok'] });
    expect(set(obj, 'a.d[0]', 1)).toEqual({ a: { b: 3, d: [1] }, c: true, list: ['ok'] });
    expect(set(obj, 'd[1]', 2)).toEqual({ a: { b: 3 }, c: true, d: [undefined, 2], list: ['ok'] });
    expect(set(obj, 'd[0][0]', 3)).toEqual({ a: { b: 3 }, c: true, d: [[3]], list: ['ok'] });
    expect(set(obj, 'list[0]', 'ko')).toEqual({ a: { b: 3 }, c: true, list: ['ko'] });
    expect(set(obj, 'list[1]', 'ko')).toEqual({ a: { b: 3 }, c: true, list: ['ok', 'ko'] });

    // the original object is not mutated
    expect(obj).toEqual({ a: { b: 3 }, c: true, list: ['ok'] });
  });

  describe('mutate an array (set)', () => {
    const array = [true, 123, ['!', '?'], { msg: 'hi' }];

    expect(set(array, '[2]', true)).toEqual([true, 123, true, { msg: 'hi' }]);
    expect(set(array, '[5]', 'end')).toEqual([true, 123, ['!', '?'], { msg: 'hi' }, undefined, 'end']);
    expect(set(array, '[1]', 124)).toEqual([true, 124, ['!', '?'], { msg: 'hi' }]);
    expect(set(array, '[2][1]', '#')).toEqual([true, 123, ['!', '#'], { msg: 'hi' }]);
    expect(set(array, '[2][1].test', 'ok')).toEqual([true, 123, ['!', { test: 'ok' }], { msg: 'hi' }]);

    // the original array is not mutated
    expect(array).toEqual([true, 123, ['!', '?'], { msg: 'hi' }]);
  });
});

describe('doc examples', () => {
  test('general', () => {
    const source = {
      a: [1, 2, 30],
      b: {
        c: { d: true },
        e: { f: false }
      }
    };
    const mutated = set(source, 'b.c.d', false);

    expect(source).toEqual({a: [1, 2, 30], b: {c: {d: true}, e: {f: false}}});
    expect(mutated).toEqual({a: [1, 2, 30], b: {c: {d: false}, e: {f: false}}});
    expect(source === mutated).toBeFalsy();
    expect(source.a === mutated.a).toBeTruthy();
    expect(source.b === mutated.b).toBeFalsy();
    expect(source.b.c === mutated.b.c).toBeFalsy();
    expect(source.b.c.d === mutated.b.c.d).toBeFalsy();
    expect(source.b.e === mutated.b.e).toBeTruthy();
    expect(source.b.e.f === mutated.b.e.f).toBeTruthy();
  });

  test('merge', () => {
    const a = { a: 12, b: 23, c: 34 };
    const b = { a: 1, d: 4, e: 5 };
    const c = { b: 2, e: 6, f: 7 };
    const mutated = merge(a, b, c);

    expect(a).toEqual({ a: 12, b: 23, c: 34 });
    expect(b).toEqual({ a: 1, d: 4, e: 5 });
    expect(c).toEqual({ b: 2, e: 6, f: 7 });
    expect(mutated).toEqual({ a: 1, b: 2, c: 34, d: 4, e: 6, f: 7 });
  });

  test('get', () => {
    const source = { a: 12, b: [ { c: 34 } ] };

    expect(get(source, 'a')).toEqual(12);
    expect(get(source, 'b[0].c')).toEqual(34);
    expect(get(source, 'b[0].d')).toEqual(undefined);
    expect(get(source, 'b[1].c')).toEqual(undefined);
  });

  test('set', () => {
    const source = { a: 12, b: [ { c: 34 } ] };

    expect(set(source, 'a', 2)).toEqual({ a: 2, b: [ { c: 34 } ] });
    expect(set(source, 'b[0].c', 3)).toEqual({ a: 12, b: [ { c: 3 } ] });
    expect(set(source, 'b[0].d', 4)).toEqual({ a: 12, b: [ { c: 34, d: 4 } ] });
    expect(set(source, 'b[1].c', 5)).toEqual({ a: 12, b: [ { c: 34 }, { c: 5 } ] });
  });

  test('pop', () => {
    const source = [1, 2, 3];
    const updated = pop(source);

    expect(source).toEqual([1, 2, 3]);
    expect(updated).toEqual([1, 2]);
  });

  test('push', () => {
    const source = [1, 2, 3];
    const updated = push(source, 4, 5);

    expect(source).toEqual([1, 2, 3]);
    expect(updated).toEqual([1, 2, 3, 4, 5]);
  });

  test('reverse', () => {
    const source = [1, 22, 3];
    const updated = reverse(source);

    expect(source).toEqual([1, 22, 3]);
    expect(updated).toEqual([3, 22, 1]);
  });

  test('shift', () => {
    const source = [1, 2, 3];
    const updated = shift(source);

    expect(source).toEqual([1, 2, 3]);
    expect(updated).toEqual([2, 3]);
  });

  test('unshift', () => {
    const source = [1, 2, 3];
    const updated = unshift(source, -1, 0);

    expect(source).toEqual([1, 2, 3]);
    expect(updated).toEqual([-1, 0, 1, 2, 3]);
  });

  test('sort', () => {
    const source = ['this', 'is', 'a', 'test'];
    const updatedA = sort(source);
    const updatedB = sort(source, (a, b) => a < b ? 1 : -1);

    expect(source).toEqual(['this', 'is', 'a', 'test']);
    expect(updatedA).toEqual(['a', 'is', 'test', 'this']);
    expect(updatedB).toEqual(['this', 'test', 'is', 'a']);
  });

  test('splice', () => {
    const source = [100, 2, 33, 82];
    const updatedA = splice(source, 1, 2);
    const updatedB = splice(source, 1, 0, 22, 23);
    const updatedC = splice(source, 1, 1, 21);

    expect(source).toEqual([100, 2, 33, 82]);
    expect(updatedA).toEqual([100, 82]);
    expect(updatedB).toEqual([100, 22, 23, 2, 33, 82]);
    expect(updatedC).toEqual([100, 21, 33, 82]);
  });
});
