import React from 'react';
import CircularArray from '../src/carousel/array';

describe('CircularArray', () => {
  describe('[Number]', () => {
    const items = new CircularArray(5);
    expect(items.array.length).toEqual(5);
    it('CircularArray.set', () => {
      items.set(8, undefined);
      expect(items.length).toEqual(9);
      expect(items.get(8)).toEqual(undefined);
      for (let i = 0; i < items.array.length; i += 1) {
        expect(items.get(i)).toEqual(undefined);
        items.set(i, i);
      }
      items.array.forEach((item, index) => {
        expect(typeof item).toEqual('number');
        expect(item).toEqual(index);
      });
      try {
        items.set(-1, -1);
      } catch (error) {
        expect(error.message).toEqual('can not set index < 0');
      }
    });
    it('CircularArray.get', () => {
      for (let i = -10; i <= 10; i += 1) {
        expect(items.array[items.getIndex(i)]).toEqual(items.get(i));
      }
    });
    it('CircularArray.getIndex', () => {
      for (let i = -10; i <= 10; i += 1) {
        if (i < 0) {
          expect(
            items.getIndex(i)
          ).toEqual(
            i % items.length < 0
              ? items.length + (i % items.length)
              : 0
          );
        } else {
          expect(items.getIndex(i)).toEqual(i % items.length);
        }
      }
    });
    it('CircularArray.toString', () => {
      expect(items.toString()).toEqual(items.array.join(','));
    });
  });
  describe('[Array]', () => {
    const array = [[0, 1], [2, 3], 4];
    const items = new CircularArray(array);
    expect(items.array.length).toEqual(3);
    it('check constructor', () => {
      expect(items.array).toEqual(array);
    });
    it('CircularArray.get', () => {
      for (let i = -10; i <= 10; i += 1) {
        expect(items.array[items.getIndex(i)]).toEqual(items.get(i));
      }
    });
    it('CircularArray.getIndex', () => {
      for (let i = -10; i <= 10; i += 1) {
        if (i < 0) {
          expect(
            items.getIndex(i)
          ).toEqual(
            i % items.length < 0
              ? items.length + (i % items.length)
              : 0
          );
        } else {
          expect(items.getIndex(i)).toEqual(i % items.length);
        }
      }
    });
    it('CircularArray.toString', () => {
      const result = [];
      for (let i = 0; i < items.array.length; i += 1) {
        const item = items.array[i];
        if (typeof item === 'object' && Array.isArray(item)) {
          result.push(`[${item.join(',')}]`);
        } else {
          result.push(item);
        }
      }
      expect(items.toString()).toEqual(result.join(','));
    });
    it('CircularArray.set', () => {
      for (let i = 0; i < items.array.length; i += 1) {
        expect(items.get(i)).toEqual(items.array[i]);
        items.set(i, items.length);
      }
      items.array.forEach((item) => {
        expect(typeof item).toEqual('number');
        expect(item).toEqual(items.length);
      });
    });
  });
  describe('[Element]', () => {
    const array = [<div>0</div>, <div>1</div>, <div>2</div>, <div>3</div>, <div>4</div>];
    const array1 = [<span>0</span>, <span>1</span>, <span>2</span>, <span>3</span>, <span>4</span>];
    const items = new CircularArray(array);
    expect(items.array.length).toEqual(5);
    it('check constructor', () => {
      expect(items.array).toEqual(array);
    });
    it('CircularArray.get', () => {
      for (let i = -10; i <= 10; i += 1) {
        expect(items.array[items.getIndex(i)]).toEqual(items.get(i));
      }
    });
    it('CircularArray.getIndex', () => {
      for (let i = -10; i <= 10; i += 1) {
        if (i < 0) {
          expect(
            items.getIndex(i)
          ).toEqual(
            i % items.length < 0
              ? items.length + (i % items.length)
              : 0
          );
        } else {
          expect(items.getIndex(i)).toEqual(i % items.length);
        }
      }
    });
    it('CircularArray.toString', () => {
      expect(items.toString()).toEqual('{"type":"div","key":null,"ref":null,"props":{"children":"0"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"children":"1"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"children":"2"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"children":"3"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"children":"4"},"_owner":null,"_store":{}}');
    });
    it('CircularArray.set', () => {
      for (let i = 0; i < items.array.length; i += 1) {
        expect(items.get(i)).toEqual(array[i]);
        items.set(i, array1[i]);
      }
      items.array.forEach((item, index) => {
        expect(typeof item).toEqual('object');
        expect(item).toEqual(array1[index]);
      });
    });
  });
});