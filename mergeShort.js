const unsortedArray = [3, 2, 1, 13, 8, 5, 0, 1, 11, 23, 69, 100, 4]

function merge(left, right) {
    let sortedArray = []
    // iterate through the elements in the array 
    while (left.length && right.length) {
        // compare the first element of each array
        if (left[0] < right[0]) {
            // will remove and add to sortedArray if true
            sortedArray.push(left.shift())
        } else {
            // if false the right will be removed and added to the sortedArray
            sortedArray.push(right.shift())
        }
    }
    // create new array from the left and right - spread operator
    return [...sortedArray, ...left, ...right]
}

function mergeSort(array) {
    // base case
    if (array.length <= 1) return array;

    // divide the array in half
    let mid = Math.floor(array.length / 2)

    // called recursively on both sides to sort them
    let left = mergeSort(array.slice(0, mid))
    let right = mergeSort(array.splice(mid))

    // combine the sorted halves
    return merge(left, right)

}

console.log(mergeSort(unsortedArray))