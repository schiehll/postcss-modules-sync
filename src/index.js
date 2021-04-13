import Parser from './Parser'
import scopeGenerator from './scopeGenerator'
import localByDefault from 'postcss-modules-local-by-default'
import scope from 'postcss-modules-scope'
import postcss from 'postcss'
import camelCase from 'lodash.camelcase'
import genericNames from 'generic-names';

function getScopedNameGenerator(opts) {
  const scopedNameGenerator = opts.generateScopedName || scopeGenerator;

  if (typeof scopedNameGenerator === 'function') return scopedNameGenerator;
  return genericNames(scopedNameGenerator, {context: process.cwd()});
}

function dashesCamelCase(string) {
  return string.replace(/-+(\w)/g, (_, firstLetter) =>
    firstLetter.toUpperCase()
  );
}

export default postcss.plugin('postcss-css-modules', (opts = {}) => {
  const plugins = [localByDefault, scope];
  const parser = new Parser();

  scope.generateScopedName = getScopedNameGenerator(opts);

  return (css, result) => {
    const styles = postcss(plugins.concat(parser.plugin)).process(css).css;

    if (opts.localsConvention) {
      const isFunc = typeof opts.localsConvention === "function";

      parser.exportTokens = Object.entries(parser.exportTokens).reduce(
        (tokens, [className, value]) => {
          if (isFunc) {
            tokens[opts.localsConvention(className, value, inputFile)] = value;

            return tokens;
          }

          switch (opts.localsConvention) {
            case "camelCase":
              tokens[className] = value;
              tokens[camelCase(className)] = value;

              break;
            case "camelCaseOnly":
              tokens[camelCase(className)] = value;

              break;
            case "dashes":
              tokens[className] = value;
              tokens[dashesCamelCase(className)] = value;

              break;
            case "dashesOnly":
              tokens[dashesCamelCase(className)] = value;

              break;
          }

          return tokens;
        },
        {}
      );
    }
    
    if (opts.getJSON != undefined) {
      opts.getJSON(parser.exportTokens)
    }
  }
})
