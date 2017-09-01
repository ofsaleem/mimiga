## Documentation

You can see below the API reference of this module.

### `sameTime(arr, cb, store)`
Calls functions in parallel and stores the results.

#### Params
- **Array** `arr`: An array of functions getting the callback parameter in the first argument.
- **Function** `cb`: The callback function called with:
 - first parameter: `null` if there were no errors or an array containing the error values
 - `1 ... n` parameters: arrays containing the callback results
- **Array** `store`: An optional array to store the data in. If `null`, data won't be stored.

#### Return
- **sameTime** The `sameTime` function.

