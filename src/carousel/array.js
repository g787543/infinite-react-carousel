class CircularArray {
  constructor(n) {
    this.array = [];
    if (typeof n === 'number') {
      this.array = new Array(n);
      this.length = 0;
    } else if (typeof n === 'object' && Array.isArray(n)) {
      this.array = n;
      this.length = n.length;
    } else if (typeof n === 'object' && n.length > 0) {
      n.forEach((e) => this.array.push(e));
      this.length = n.length;
    }
  }

  toString = (array) => {
    const result = [];
    const newArray = array || this.array;
    newArray.forEach((item) => {
      if (typeof item === 'object' && item instanceof Array)result.push(`[${this.toString(item)}]`);
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
    while (i > this.length) {
      this.array[this.length % this.array.length] = undefined;
      this.length += 1;
    }
    this.array[this.getIndex(i)] = v;
    if (i === this.length) this.length += 1;
  };
}

export default CircularArray;
