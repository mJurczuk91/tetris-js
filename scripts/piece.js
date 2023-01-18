const SHAPES = {
    0: [
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]],

        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]],

        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]]],

    1: [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]]],

    2: [
        [
            [0, 0, 1, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]]],

    3: [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 1, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]]],

    4: [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 1, 0, 0],
            [0, 0, 0, 0]],

        [
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 1],
            [0, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]]],

    5: [
        [
            [0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 0]]],

    6: [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]]],

    7: [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]],

        [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]]],
};

class Piece {
    constructor(py = 0, px = 0, rotation = 0, shape = Math.floor(Math.random() * 8)){
        this.py = py;
        this.px = px;
        this.rotation = rotation;
        this.shape = shape;
    }

    rotate(piece){
        let rotation = (piece.rotation +1) % 4;
        return new Piece(piece.py, piece.px, rotation, piece.shape);
    }

    get(y, x){
        let value = SHAPES[this.shape][this.rotation][y][x];
        return Boolean(value);
    }

    moveLeft(piece){
        return new Piece(piece.py, piece.px -1, piece.rotation, piece.shape);
    }

    moveRight(piece){
        return new Piece(piece.py, piece.px +1, piece.rotation, piece.shape);
    }

    moveDown(piece){
        return new Piece(piece.py +1, piece.px, piece.rotation, piece.shape);
    }
}

export {Piece};