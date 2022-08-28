import { extname } from 'path';
import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface IOpts {
  flag?: string;
}

const CSS_EXT_NAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

/**
 * @see https://github.com/umijs/umi/blob/v3.5.33/packages/babel-plugin-auto-css-modules/src/index.ts
 * @see https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md
 */
export default function autoCssModule() {
  return {
    visitor: {
      ImportDeclaration(
        path: traverse.NodePath<t.ImportDeclaration>,
        { opts }: { opts: IOpts },
      ) {
        const {
          specifiers,
          source,
          source: { value },
        } = path.node;
        if (specifiers.length && CSS_EXT_NAMES.includes(extname(value))) {
          source.value = `${value}?${opts.flag || 'modules'}`;
        }
      },

      // e.g.
      // const styles = await import('./index.less');
      VariableDeclarator(
        path: traverse.NodePath<t.VariableDeclarator>,
        { opts }: { opts: IOpts },
      ) {
        const { node } = path;
        if (
          t.isAwaitExpression(node.init) &&
          t.isCallExpression(node.init.argument) &&
          t.isImport(node.init.argument.callee) &&
          node.init.argument.arguments.length === 1 &&
          t.isStringLiteral(node.init.argument.arguments[0]) &&
          CSS_EXT_NAMES.includes(extname(node.init.argument.arguments[0].value))
        ) {
          node.init.argument.arguments[0].value = `${
            node.init.argument.arguments[0].value
          }?${opts.flag || 'modules'}`;
        }
      },
    } as traverse.Visitor,
  };
}
