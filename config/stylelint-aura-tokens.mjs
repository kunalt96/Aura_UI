import stylelint from 'stylelint';

const ruleName = 'aura/tokens-and-conventions';
const messages = stylelint.utils.ruleMessages(ruleName, {
  noRefToken: (token) =>
    `Do not reference "${token}" (--aura-ref-*) in component CSS. Use --aura-sys-* or --aura-comp-* instead.`,
  noRawColor: (value) =>
    `Raw color literal "${value}" is disallowed. Use var(--aura-sys-color-*) or var(--aura-comp-*).`,
  noRawDuration: (value) =>
    `Raw duration "${value}" is disallowed. Use var(--aura-sys-motion-duration-*).`,
  noRawTypographyOrRadius: (prop, value) =>
    `Raw literal "${value}" in "${prop}" is disallowed. Use a --aura-sys-* or --aura-comp-* token.`,
  noRawPxSizing: (prop, value) =>
    `Raw px literal "${value}" in "${prop}" is disallowed. Use var(--aura-sys-space-*) or var(--aura-comp-*).`,
  noPhysicalProperty: (prop) =>
    `Physical layout property "${prop}" is disallowed for RTL safety. Use logical inline/block properties.`,
  disallowedAnimatedProperty: (prop) =>
    `Animating "${prop}" is disallowed. Animate only transform, opacity, or clip-path.`,
  invalidCustomPropName: (prop) =>
    `Component custom property "${prop}" must start with "--_".`,
});

const PHYSICAL_PROPERTIES = new Set([
  'top',
  'right',
  'bottom',
  'left',
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
]);

const TOKEN_ONLY_PROPS = new Set([
  'font',
  'font-size',
  'line-height',
  'letter-spacing',
  'border-radius',
  'border-start-start-radius',
  'border-start-end-radius',
  'border-end-start-radius',
  'border-end-end-radius',
  'outline-width',
  'outline-offset',
]);

const ALLOWED_ANIMATED_PROPS = new Set(['transform', 'opacity', 'clip-path', 'none']);

const NAMED_COLORS_RE =
  /\b(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)\b/i;

function stripVarCalls(value) {
  let out = '';
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    if (value.startsWith('var(', i)) {
      depth++;
      i += 3;
      continue;
    }
    if (depth > 0) {
      if (value[i] === '(') depth++;
      else if (value[i] === ')') depth--;
      continue;
    }
    out += value[i];
  }
  return out;
}

const plugin = stylelint.createPlugin(ruleName, (primaryOption) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [true, false],
    });
    if (!validOptions || !primaryOption) {
      return;
    }

    root.walkDecls((decl) => {
      const prop = decl.prop.toLowerCase();
      const value = decl.value;

      // 1. Custom property naming inside component CSS
      if (prop.startsWith('--') && !prop.startsWith('--_')) {
        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.invalidCustomPropName(decl.prop),
        });
      }

      // 2. Disallow --aura-ref-* in component CSS
      const refMatch = /--[a-z]+-ref-[a-z0-9-]+/i.exec(value);
      if (refMatch) {
        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.noRefToken(refMatch[0]),
        });
      }

      // 3. Disallow physical layout properties
      if (PHYSICAL_PROPERTIES.has(prop)) {
        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.noPhysicalProperty(decl.prop),
        });
      }

      // 4. Inspect values outside var(...) calls
      const outsideVar = stripVarCalls(value);

      // Raw color check
      const colorFnMatch =
        /(#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\s*\()/i.exec(
          outsideVar,
        );
      if (colorFnMatch) {
        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.noRawColor(colorFnMatch[0]),
        });
      } else {
        const namedMatch = NAMED_COLORS_RE.exec(outsideVar);
        if (namedMatch && prop !== 'font-family' && prop !== 'animation-name' && prop !== 'transition-property') {
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.noRawColor(namedMatch[0]),
          });
        }
      }

      // Raw duration check
      if (
        prop === 'transition' ||
        prop === 'transition-duration' ||
        prop === 'transition-delay' ||
        prop === 'animation' ||
        prop === 'animation-duration' ||
        prop === 'animation-delay'
      ) {
        const durationMatch = /\b(\d*\.?\d+)(ms|s)\b/i.exec(outsideVar);
        if (durationMatch && Number.parseFloat(durationMatch[1]) !== 0) {
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.noRawDuration(durationMatch[0]),
          });
        }
      }

      // Animation property allowlist
      if (prop === 'transition-property') {
        for (const item of value.split(',')) {
          const trimmed = item.trim().toLowerCase();
          if (trimmed && !ALLOWED_ANIMATED_PROPS.has(trimmed)) {
            stylelint.utils.report({
              ruleName,
              result,
              node: decl,
              message: messages.disallowedAnimatedProperty(trimmed),
            });
          }
        }
      } else if (prop === 'transition') {
        for (const segment of value.split(',')) {
          const firstToken = segment.trim().split(/\s+/)[0]?.toLowerCase();
          if (firstToken && !firstToken.startsWith('var(') && !ALLOWED_ANIMATED_PROPS.has(firstToken)) {
            stylelint.utils.report({
              ruleName,
              result,
              node: decl,
              message: messages.disallowedAnimatedProperty(firstToken),
            });
          }
        }
      }

      // Raw typography / radius / outline unit checks
      if (TOKEN_ONLY_PROPS.has(prop)) {
        const unitMatch = /\b(\d*\.?\d+)(px|rem|em|pt)\b/i.exec(outsideVar);
        if (unitMatch && Number.parseFloat(unitMatch[1]) !== 0) {
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.noRawTypographyOrRadius(decl.prop, unitMatch[0]),
          });
        }
      }

      // Disallow raw px >= 2px in sizing/spacing/inset properties
      const pxMatches = outsideVar.matchAll(/\b(\d*\.?\d+)px\b/gi);
      for (const m of pxMatches) {
        const pxVal = Number.parseFloat(m[1]);
        if (pxVal > 1) {
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.noRawPxSizing(decl.prop, m[0]),
          });
        }
      }
    });
  };
});

plugin.ruleName = ruleName;
plugin.messages = messages;

export default plugin;
