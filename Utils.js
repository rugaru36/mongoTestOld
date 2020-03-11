class Utils {
  isOperator (char) {
    const operators = ['&', '|','=', '>', '<', '!']
    return Boolean(operators.indexOf(char) + 1) 
  }
  isRelationalOperator (char) {
    const operators = ['=', '>', '<', '!']
    return Boolean(operators.indexOf(char) + 1) 
  }
  isLogicalOperator (char) {
    const operators = ['&', '|']
    return Boolean(operators.indexOf(char) + 1)
  }
}

module.exports = new Utils()