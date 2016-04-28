/**
 * createActionCreator.js
 *
 * @Author: jruif
 * @Date: 16/3/25 上午11:12
 *
 * @param {string} type
 * @param {...string} key
 * @return {function}
 *
 * @example
 * var info = createActionCreator('USER','name','age');
 * info('Jruif',25);
 *
 * ====> 等价于:
 *
 * function info(name, age){
 *      return {
 *          type: 'USER',
 *          name,
 *          age
 *      }
 * }
 */

export default function createActionCreator(type, ...key) {

    let obj = { type };
    return function (...argv) {
        key.map((elm, index) => {
            obj[elm] = argv[index];
        });
        return obj;
    }
}
