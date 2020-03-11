class Utils {
  isOperator (char) {
    char.toLowerCase() != char.toUpperCase() || isNaN(char)
  }
  isRelationalOperator (char) {
    const operators = ['=', '>', '<', '!']
    return Boolean(operators.indexOf(char) + 1) 
  }
  isLogicalOperator () {
    const operators = ['&', '|']
    return Boolean(operators.indexOf(char) + 1)
  }
}

module.exports = new Utils()