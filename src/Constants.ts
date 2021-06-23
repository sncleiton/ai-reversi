export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const DIR: number[] = [-9, -8, -7, -1, 1, 7, 8, 9];

export const GRID_SIZE = 100;

export const BIMAGE = "assets/images/bpiece.png";
export const WIMAGE = "assets/images/wpiece.png";
export const CIMAGE = `assets/images/cw.png`;

export const EASY = 6;

export function samePosition(p1: Position, p2: Position) {
  return p1.x === p2.x && p1.y === p2.y;
}

export interface Position {
  x: number;
  y: number;
}

export enum PieceType {
  BLACK,
  WHITE,
  CANDIDATE,
  NONE,
}

export enum TeamType {
  OPPONENT,
  OUR,
  NONE,
}

export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
}

let arr = new Array<Piece>(64);

arr.fill({
    image: `null`,
    position: {
      x: 9,
      y: 9,
    },
    type: PieceType.NONE,
    team: TeamType.NONE,
  }
)

arr[3+HORIZONTAL_AXIS.length*3] = {
  image: BIMAGE,
  position: {
    x: 3,
    y: 3,
  },
  type: PieceType.BLACK,
  team: TeamType.OPPONENT,
}

arr[3+HORIZONTAL_AXIS.length*4] = {
  image: WIMAGE,
  position: {
    x: 3,
    y: 4,
  },
  type: PieceType.WHITE,
  team: TeamType.OUR,
}

arr[4+HORIZONTAL_AXIS.length*3] = {
  image: WIMAGE,
  position: {
    x: 4,
    y: 3,
  },
  type: PieceType.WHITE,
  team: TeamType.OUR,
}

arr[4+HORIZONTAL_AXIS.length*4] = {
  image: BIMAGE,
  position: {
    x: 4,
    y: 4,
  },
  type: PieceType.BLACK,
  team: TeamType.OPPONENT,
}

arr[4+HORIZONTAL_AXIS.length*5] = {
  image: CIMAGE,
  position: {
    x: 4,
    y: 5,
  },
  type: PieceType.CANDIDATE,
  team: TeamType.NONE,
}

export const initialBoardState: Array<Piece> = arr;