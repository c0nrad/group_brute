export class Matrix {
    D: number[][]
    L: number

    constructor(l: number) {
        this.D = []
        this.L = l
        for (let i = 0; i < this.L; i++) {
            let arr = []
            for (let j = 0; j < this.L; j++) {
                arr.push(0)
            }
            this.D.push(arr)
        }
    }

    load(data: number[]) {
        if (data.length != this.L * this.L) {
            console.error("invalid size")
        }

        let c = 0;
        for (let x = 0; x < this.L; x++) {
            for (let y = 0; y < this.L; y++) {
                this.set(x, y, data[c])
                c++
            }
        }
    }

    dump(): number[] {
        let out = []
        for (let x = 0; x < this.L; x++) {
            for (let y = 0; y < this.L; y++) {
                out.push(this.get(x, y))
            }
        }
        return out
    }

    pprint() {
        for (let x = 0; x < this.L; x++) {
            let lineStr = ""
            if (x == 0) {
                lineStr += "[ "
            } else {
                lineStr += "  "
            }
            for (let y = 0; y < this.L; y++) {
                lineStr += this.get(x, y)
                if (y + 1 != this.L) {
                    lineStr += ", "
                } else {
                    lineStr += " "
                }
            }
            if (x == this.L - 1) {
                console.log(lineStr + "]")
            } else {
                console.log(lineStr)
            }
        }
    }

    set(x: number, y: number, d: number) {
        if (x >= this.L || y >= this.L) {
            console.error("Out of bounds", x, y, this.L)
        }
        this.D[x][y] = d
    }

    get(x: number, y: number): number {
        if (x >= this.L || y >= this.L) {
            console.error("Out of bounds", x, y, this.L)
        }
        return this.D[x][y]
    }

    trace(): number {
        let out = 0
        for (let i = 0; i < this.L; i++) {
            out += this.get(i, i)
        }
        return out
    }

    mul(m: Matrix): Matrix {
        if (m.L != this.L) {
            console.log("Invalid sizes")
            return
        }

        let out = new Matrix(this.L)
        for (let outX = 0; outX < this.L; outX++) {
            for (let outY = 0; outY < this.L; outY++) {

                let sum = 0
                for (let i = 0; i < this.L; i++) {
                    sum += this.get(outX, i) * m.get(i, outY)
                }
                out.set(outX, outY, sum)
            }
        }

        return out
    }

    pow(n: number): Matrix {
        let out = Identity(this.L)
        for (let i = 0; i < n; i++) {
            out = out.mul(this)
        }
        return out
    }

    clone(): Matrix {
        let out = new Matrix(this.L)
        out.load(this.dump())
        return out
    }

    splice(row: number, col: number): Matrix {
        let out = new Matrix(this.L - 1)
        let newX = 0
        for (let x = 0; x < this.L; x++) {
            if (x == row) {
                continue
            }

            let newY = 0
            for (let y = 0; y < this.L; y++) {
                if (y == col) {
                    continue
                }
                out.set(newX, newY, this.get(x, y))
                newY++
            }
            newX++
        }
        return out
    }

    det(): number {
        if (this.L == 2) {
            return (this.get(0, 0) * this.get(1, 1)) - (this.get(0, 1) * this.get(1, 0))
        }

        let out = 0;
        for (let x = 0; x < this.L; x++) {
            let s = this.splice(x, 0)

            let step = s.det() * this.get(x, 0)
            if (x % 2 == 1) {
                step *= -1
            }
            out += step
        }
        return out
    }

    transpose(): Matrix {
        let out = new Matrix(this.L)
        for (let x = 0; x < this.L; x++) {
            for (let y = 0; y < this.L; y++) {
                out.set(y, x, this.get(x, y))
            }
        }
        return out
    }

    cofactor(): Matrix {
        let out = new Matrix(this.L)

        let i = 0;
        for (let x = 0; x < this.L; x++) {
            for (let y = 0; y < this.L; y++) {
                let s = this.splice(x, y).det()
                if (i % 2 == 1) {
                    s *= -1
                }
                out.set(x, y, s)
                i++
            }
        }
        return out
    }

    adj(): Matrix {
        return this.cofactor().transpose()
    }

    scale(a: number): Matrix {
        let out = new Matrix(this.L)
        for (let x = 0; x < this.L; x++) {
            for (let y = 0; y < this.L; y++) {
                out.set(x, y, this.get(x, y) * a)
            }
        }
        return out
    }

    inverse(): Matrix {
        return this.adj().scale(1 / this.det())
    }

    equals(a: Matrix): boolean {
        if (this.L != a.L) {
            return false
        }

        for (let x = 0; x < this.L; x++) {
            for (let y = 0; y < this.L; y++) {
                if (this.get(x, y) != a.get(x, y)) {
                    return false
                }
            }
        }
        return true
    }

    add(a: Matrix): Matrix {
        if (this.L != a.L) {
            console.log("invalid matrix sizes")
        }

        let out = new Matrix(a.L)
        for (let x = 0; x < this.L; x++) {
            for (let y = 0; y < this.L; y++) {
                out.set(x, y, this.get(x, y) + a.get(x, y))
            }
        }
        return out
    }
}

export function Identity(n: number): Matrix {
    let out = new Matrix(n)
    for (let i = 0; i < n; i++) {
        out.set(i, i, 1)
    }
    return out
}
