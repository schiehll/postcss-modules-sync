import Parser from './Parser'
import scopeGenerator from './scopeGenerator'
import localByDefault from 'postcss-modules-local-by-default'
import scope from 'postcss-modules-scope'
import postcss from 'postcss'

scope.generateScopedName = scopeGenerator

export default postcss.plugin('postcss-css-modules', (opts = {}) => {
  const plugins = [localByDefault, scope]
  const parser = new Parser()
  
  return (css, result) => {
    const styles = postcss(plugins.concat(parser.plugin)).process(css).css
    opts.getTokens(parser.exportTokens)
  }
})