const AddressParser = require('../parser/AddressParser')

// test cases from libpostal
// https://github.com/openvenues/libpostal/issues

const testcase = (test, common) => {
  let parser = new AddressParser()
  let assert = common.assert.bind(null, test, parser)

  // https://github.com/openvenues/libpostal/issues/382
  assert('3360 Grand Ave Oakland 94610-2737 CA', [
    [{ housenumber: '3360' }, { street: 'Grand Ave' }, { postcode: '94610-2737' }]
  ])
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`functional: ${name}`, testFunction)
  }

  testcase(test, common)
}