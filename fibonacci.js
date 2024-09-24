// each number is the sum of the two preceding ones

function iterateFibs(num) {
    let fib_array = []
    // initialize sequence  
    currentNumber = 1
    let previousNumber = 0;

    // calculate Fibonacci number
    for (let i = 0; i < num; i++) {
        if (i === 0) {
            fib_array.push(previousNumber)
        } else if (i === 1) {
            fib_array.push(currentNumber)
        } else {
            // calculate the next Fibonacci number
            let nextNumber = previousNumber + currentNumber;
            fib_array.push(nextNumber);
            previousNumber = currentNumber
            currentNumber = nextNumber
        }
        console.log(`Calculating fib(${i})`);
    }
    return fib_array;

}

console.log(iterateFibs(5))

function recursiveFibs(num) {
    let fib_array = []
    function fib(n) {
        if (n < 2) {
            return n
        }
        // call recursive function
        return fib(n - 1) + fib(n - 2);

    }
    

    for (let i = 0; i < num; i++) {
        console.log(`Calculating fib(${i})`);
        fib_array.push(fib(i))
    }

    return fib_array

}

console.log(recursiveFibs(5))