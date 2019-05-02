const WordClassifier = require('./super/WordClassifier')
const StreetPrefixClassification = require('../classification/StreetPrefixClassification')
const libpostal = require('../resources/libpostal/libpostal')

// dictionaries sourced from the libpostal project
// see: https://github.com/openvenues/libpostal

class StreetPrefixClassifier extends WordClassifier {
  setup () {
    // load street tokens
    this.index = {}
    libpostal.load(this.index, ['fr'], 'street_types.txt')

    // blacklist any token under 2 chars in length
    for (let token in this.index) {
      if (token.length < 2) {
        delete this.index[token]
      }
    }
  }

  each (span) {
    // skip spans which contain numbers
    if (span.contains.numerals) { return }

    // base confidence
    let confidence = 1

    // use an inverted index for full token matching as it's O(1)
    if (this.index.hasOwnProperty(span.norm)) {
      if (span.norm.length < 2) { confidence = 0.2 } // single letter streets are uncommon
      span.classify(new StreetPrefixClassification(confidence))
      return
    }

    // try again for abbreviations denoted by a period such as 'str.', also O(1)
    if (span.contains.final.period && this.index.hasOwnProperty(span.norm.slice(0, -1))) {
      if (span.norm.length < 3) { confidence = 0.2 } // single letter streets are uncommon
      span.classify(new StreetPrefixClassification(confidence))
    }
  }
}

module.exports = StreetPrefixClassifier