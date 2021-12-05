function separateWord(word) {
  const separators = [",", " ", "."];
  let separatorFound = "";
  let indexSeparator = -1;
  for (const sep of separators) {
    indexSeparator = word.indexOf(sep);

    if (indexSeparator !== -1) {
      separatorFound = sep;
      break;
    }
  }

  return indexSeparator === -1 ? word : word.split(separatorFound);
}

function isSimilar(word1, word2, isWordSeparated = false) {
  if (isWordSeparated) {
    const word1Splitted = separateWord(word1);
    const word2Splitted = separateWord(word2);

    const firstWords = isSimilar(word1Splitted[0], word2Splitted[0] ? word2 : null);
    const secondWord = isSimilar(word1Splitted[1], word2Splitted[1] ? word2 : null);

    return firstWords > secondWord ? secondWord : firstWords;
  }

  const track = Array(word2.length + 1)
    .fill(null)
    .map(() => Array(word1.length + 1)
      .fill(null));

  for (let index1 = 0; index1 <= word1.length; index1 += 1) {
    track[0][index1] = index1;
  }
  for (let index2 = 0; index2 <= word2.length; index2 += 1) {
    track[index2][0] = index2;
  }
  for (let index2 = 1; index2 <= word2.length; index2 += 1) {
    for (let index1 = 1; index1 <= word1.length; index1 += 1) {
      const indicator = word1[index1 - 1] === word2[index2 - 1] ? 0 : 1;
      track[index2][index1] = Math.min(
        track[index2][index1 - 1] + 1,
        track[index2 - 1][index1] + 1,
        track[index2 - 1][index1 - 1] + indicator
      );
    }
  }

  return track[word2.length][word1.length];
}

export function useLevenshtein(authors) {
  const authorsResponse = [authors[0]];

  iterationAuthor:
  for (let index = 1; index < authors.length; index++) {
    const currAuthor = authors[index];

    for (const author of authorsResponse) {
      if (isSimilar(author.email.toLowerCase(), currAuthor.email.toLowerCase()) < 2
      || isSimilar(author.name.toLowerCase(), currAuthor.name.toLowerCase(), true) < 2) {
        author.email = author.email.length > currAuthor.email.length ? author.email : currAuthor.email;
        author.name = author.name.length > currAuthor.name.length ? author.name : currAuthor.name;
        continue iterationAuthor;
      }
    }

    authorsResponse.push(currAuthor);
  }

  return authorsResponse;
}
