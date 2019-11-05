class CircularArray {
  array = [];

  get length() {
    return this.array.length;
  }

  constructor(n) {
    this.array = [];
    if (typeof n === 'number') {
      this.array = new Array(n);
    } else if (typeof n === 'object' && Array.isArray(n)) {
      this.array = n;
    } else if (typeof n === 'object' && n.length > 0) {
      n.forEach((e) => this.array.push(e));
    }
  }

  toString = (array) => {
    const result = [];
    const newArray = array || this.array;
    newArray.forEach((item) => {
      if (typeof item === 'object' && item instanceof Array) result.push(`[${this.toString(item)}]`);
      else if (typeof item === 'object') result.push(JSON.stringify(item));
      else result.push(item.toString());
    });
    return result.join(',');
  };

  get = (i) => {
    let result;
    if (i < 0 || i < this.length - this.array.length) {
      result = this.array[
        -i % this.array.length === 0
          ? 0
          : this.array.length + (i % this.array.length)
      ];
    } else {
      result = this.array[i % this.array.length];
    }
    return result;
  };

  getIndex = (i) => {
    let result;
    if (i < 0 || i < this.length - this.array.length) {
      result = -i % this.array.length === 0
        ? 0
        : this.array.length + (i % this.array.length);
    } else {
      result = i % this.array.length;
    }
    return result;
  }

  set = (i, v) => {
    if (i < 0 || i < this.length - this.array.length) {
      throw new Error('can not set index < 0');
    }
    if (i >= this.length) {
      const newArr = new Array(i - this.length + 1);
      this.array = this.array.concat(newArr);
      this.array.splice(i, 1, v);
    } else {
      this.array[this.getIndex(i)] = v;
    }
  };
}

export default CircularArray;
