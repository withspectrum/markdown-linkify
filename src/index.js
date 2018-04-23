// @flow
const Linkify = require('linkify-it');

const linkifier = new Linkify(undefined, {
  fuzzyEmail: false,
});

linkifier.tlds(['chat'], true);

/**
 * Replace URLs in text with markdown links
 * (this is used in a migration script so it has to be Node-compat ES6 only)
 */
const linkify = (text /*: string*/ /*: string*/) => {
  const matches = linkifier.match(text);
  // No match, return the text
  if (!matches) return text;

  let last = 0;
  let result = [];
  // Build up the result
  matches.forEach(match => {
    // If there is text between the last match and this one add it to the result now
    if (last < match.index) {
      result.push(text.slice(last, match.index));
    }
    // Add the current link, if it is not already an inline markdown link
    if (
      text.slice(match.index - 2, match.index) !== '](' &&
      text.slice(match.lastIndex, match.lastIndex + 2) !== ']('
    ) {
      result.push(`[${match.text}](${match.url})`);
    } else {
      result.push(text.slice(match.index, match.lastIndex));
    }
    // Set the index of this match for the next round
    last = match.lastIndex;
  });
  // If there is text after the last match add it at the ned
  if (last < text.length) {
    result.push(text.slice(last));
  }
  // Turn the array into a string again
  return result.join('');
};

module.exports = linkify;
