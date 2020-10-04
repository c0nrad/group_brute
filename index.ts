import { Matrix, Identity } from './matrix'

function random3(): Matrix {
    let d = []
    for (let i = 0; i < 9; i++) {
        d.push(Math.floor(Math.random() * 3) - 1)
    }
    let out = new Matrix(3)
    out.load(d)
    return out
}

var I3 = Identity(3)
var Zero3 = new Matrix(3)

// console.log(I3.equals(I3))

var J1 = new Matrix(3)
J1.load([0, 0, 0, 0, 0, -1, 0, 1, 0])
var J2 = new Matrix(3)
J2.load([0, 0, 1, 0, 0, 0, -1, 0, 0])
var J3 = new Matrix(3)
J3.load([0, -1, 0, 1, 0, 0, 0, 0, 0])

J1.pprint()
J1.add(J2).pprint()

// let sum = J1.add(J2).add(J3)
// console.log("J1 + J2 + J3", sum.det())
// sum.pprint()
// printCycle(J1)
// console.log(cycleSize(sum))
// console.log(printCycle(sum))
var known: Matrix[] = []

// throw new Error("lol")

while (known.length != 27) {
    let a = random3()
    if (a.transpose().add(a).equals(Zero3) && a.trace() == 0) {

        let isKnown = false
        for (let k of known) {
            if (a.equals(k)) {
                isKnown = true
                break
            }
        }

        if (!isKnown) {
            known.push(a)

            // if (isCyclic4(a)) {
            a.pprint()
            console.log(cycleSize(a))
            console.log(known.length)
            // }
        }
    }
}

let linearSets = []

// for (let j1 = 0; j1 < 27; j1++) {
//     for (let j2 = j1 + 1; j2 < 27; j2++) {
//         for (let j3 = j2 + 1; j3 < 27; j3++) {
//             if (known[j1].add(known[j2]).add(known[j3]).det() == 0) {
//                 console.log(j1, j2, j3)
//                 console.log(known[j3].det())
//             }

//         }
//     }
// }
function cycleSize(m: Matrix): number {
    let curr = m.mul(m)
    let count = 1
    for (let e = 0; e < 1000; e++) {
        if (curr.equals(m)) {
            return count
        } else {
            curr = curr.mul(m)
            count++
        }
    }
    return -1
}

function printCycle(m: Matrix) {
    for (let p = 0; p < 10; p++) {
        let curr = m.pow(p)
        console.log("J^" + p, "= \\begin{pmatrix}")
        for (let y = 0; y < 3; y++) {
            console.log(curr.get(y, 0) + " & " + curr.get(y, 1) + " & " + curr.get(y, 2) + " \\\\\\  ")
        }
        console.log("\\end{pmatrix}")
    }
}

printCycle(J1.add(J2).scale(1 / Math.sqrt(2)))