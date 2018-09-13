const { AWAKE, SLEEPY, GameOfLife, FixedArray2D } = require('./index');

describe('GameOfLife', () => {
  const game = new GameOfLife(3, 3);

  describe('static getNextState', () => {
    test.each`
      currentState | numOfAdjacentCells | expected
      ${AWAKE}     | ${0}            | ${SLEEPY}
      ${AWAKE}     | ${1}            | ${SLEEPY}
      ${AWAKE}     | ${2}            | ${AWAKE}
      ${AWAKE}     | ${3}            | ${AWAKE}
      ${AWAKE}     | ${4}            | ${SLEEPY}
      ${AWAKE}     | ${5}            | ${SLEEPY}
      ${AWAKE}     | ${6}            | ${SLEEPY}
      ${AWAKE}     | ${7}            | ${SLEEPY}
      ${AWAKE}     | ${8}            | ${SLEEPY}
    `(
      `should return $expected when awake cell has $numOfAdjacentCells neighbours`,
      ({ currentState, numOfAdjacentCells, expected }) => {
        expect(GameOfLife.getNextState(currentState, numOfAdjacentCells)).toBe(
          expected
        );
      }
    );

    test.each`
      currentState | numOfAdjacentCells | expected
      ${SLEEPY}    | ${0}            | ${SLEEPY}
      ${SLEEPY}    | ${1}            | ${SLEEPY}
      ${SLEEPY}    | ${2}            | ${SLEEPY}
      ${SLEEPY}    | ${3}            | ${AWAKE}
      ${SLEEPY}    | ${4}            | ${SLEEPY}
      ${SLEEPY}    | ${5}            | ${SLEEPY}
      ${SLEEPY}    | ${6}            | ${SLEEPY}
      ${SLEEPY}    | ${7}            | ${SLEEPY}
      ${SLEEPY}    | ${8}            | ${SLEEPY}
    `(
      `should return $expected when sleepy cell has $numOfAdjacentCells neighbours`,
      ({ currentState, numOfAdjacentCells, expected }) => {
        expect(GameOfLife.getNextState(currentState, numOfAdjacentCells)).toBe(
          expected
        );
      }
    );
  });
});

describe('FixedArray2D', () => {
  describe('__indexToCoords', () => {
    const array = new FixedArray2D(3, 3);

    test.each`
      index | coordinates
      ${0}  | ${[0, 0]}
      ${1}  | ${[0, 1]}
      ${2}  | ${[0, 2]}
      ${3}  | ${[1, 0]}
      ${4}  | ${[1, 1]}
      ${5}  | ${[1, 2]}
      ${6}  | ${[2, 0]}
      ${7}  | ${[2, 1]}
      ${8}  | ${[2, 2]}
    `(
      `should return coordinates $coordinates based on the index $index in the flat array`,
      ({ index, coordinates }) => {
        expect(array.__indexToCoords(index)).toEqual(coordinates);
      }
    );
  });

  describe('__coordsToIndex', () => {
    const array = new FixedArray2D(3, 3);

    test.each`
      index | coordinates
      ${0}  | ${[0, 0]}
      ${1}  | ${[0, 1]}
      ${2}  | ${[0, 2]}
      ${3}  | ${[1, 0]}
      ${4}  | ${[1, 1]}
      ${5}  | ${[1, 2]}
      ${6}  | ${[2, 0]}
      ${7}  | ${[2, 1]}
      ${8}  | ${[2, 2]}
      ${-1} | ${[3, 0]}
      ${-1} | ${[3, 1]}
      ${-1} | ${[3, 2]}
    `(
      `should return index $index based in the coordinates $coordinates in the 2d array`,
      ({ index, coordinates }) => {
        expect(array.__coordsToIndex(coordinates)).toEqual(index);
      }
    );
  });

  describe('get', () => {
    const array = new FixedArray2D(3, 3, coords => coords[0] + coords[1]);

    test.each`
      coordinates | expected
      ${[0, 0]}   | ${0}
      ${[0, 1]}   | ${1}
      ${[0, 2]}   | ${2}
      ${[1, 0]}   | ${1}
      ${[1, 1]}   | ${2}
      ${[1, 2]}   | ${3}
      ${[2, 0]}   | ${2}
      ${[2, 1]}   | ${3}
      ${[2, 2]}   | ${4}
    `(
      `should get value $expected from coordinates $coordinates`,
      ({ coordinates, expected }) => {
        expect(array.get(coordinates)).toBe(expected);
      }
    );
  });

  describe('set', () => {
    const array = new FixedArray2D(3, 3);

    test.each`
      coordinates | expected
      ${[0, 0]}   | ${0}
      ${[0, 1]}   | ${1}
      ${[0, 2]}   | ${2}
      ${[1, 0]}   | ${3}
      ${[1, 1]}   | ${4}
      ${[1, 2]}   | ${5}
      ${[2, 0]}   | ${6}
      ${[2, 1]}   | ${7}
      ${[2, 2]}   | ${8}
    `(
      `should set value $expected for coordinates $coordinates`,
      ({ coordinates, expected }) => {
        expect(array.get(coordinates)).not.toBe(expected);
        array.set(coordinates, expected);
        expect(array.get(coordinates)).toBe(expected);
      }
    );
  });

  describe('each', () => {
    it('should mutate 2d array values', () => {
      const size = 2;
      const array = new FixedArray2D(size, size, _ => 1);
      const fn = jest.fn(value => value + 1);

      array.each(fn);

      expect(fn).toHaveBeenCalledTimes(size * 2);
      expect(array.array).toEqual([2, 2, 2, 2]);
    });
  });

  describe('getAdjacentCells', () => {
    const array = new FixedArray2D(2, 2);

    array.set([0, 0], 1);
    array.set([0, 1], 2);
    array.set([1, 0], 3);
    array.set([1, 1], 4);

    test.each`
      coordinates | expected
      ${[0, 0]}   | ${[2, 3, 4]}
      ${[0, 1]}   | ${[1, 3, 4]}
      ${[1, 0]}   | ${[1, 2, 4]}
      ${[1, 1]}   | ${[1, 2, 3]}
    `(
      `should return an array $expected of adjacent cells for coordinates $coordinates`,
      ({ coordinates, expected }) => {
        expect(array.getAdjacentCells(coordinates)).toEqual(expected);
      }
    );
  });
});
