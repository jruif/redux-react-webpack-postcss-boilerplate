/**
 * reduceHandle.js
 *
 * @Author: jruif
 * @Date: 16/5/19 下午11:28
 */

export function updateArray(current, index, value){
    return [
        ...current.slice(0, index),
        value,
        ...current.slice(index + 1)
    ]
}