# NodeSecure authors

![version](https://img.shields.io/badge/dynamic/json.svg?style=for-the-badge&url=https://raw.githubusercontent.com/NodeSecure/authors/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/NodeSecure/authors/graphs/commit-activity)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/NodeSecure/authors/badge?style=for-the-badge)](https://api.securityscorecards.dev/projects/github.com/NodeSecure/authors)
[![mit](https://img.shields.io/github/license/NodeSecure/authors.svg?style=for-the-badge)](https://github.com/NodeSecure/authors/blob/master/LICENSE)
![build](https://img.shields.io/github/actions/workflow/status/NodeSecure/authors/main.yml?style=for-the-badge)
NodeSecure (npm) authors analysis package

## Requirements

- [Node.js](https://nodejs.org/en/) v18 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @nodesecure/authors
# or
$ yarn add @nodesecure/authors
```

## Usage example

```js
import { extractAllAuthorsFromLibrary } from "@nodesecure/authors";

const flaggedAuthors = [{ name: "Blake Embrey", email: "hello@blakeembrey.com" }];

const authors = extractAllAuthorsFromLibrary(library, flaggedAuthors);
// Expect authors to be following this schema
// [
//   {
//     name: "Blake Embrey",
//     email: "hello@blakeembrey.com",
//     flagged: true,
//     packages: [
//       {
//         homepage: "https://github.com/blakeembrey/array-flatten",
//         spec: "array-flatten",
//         versions: "3.0.0",
//         isPublishers: false
//       },
//       {
//         homepage: "https://github.com/pillarjs/path-to-regexp#readme",
//         spec: "path-to-regexp",
//         versions: "6.2.0",
//         isPublishers: true
//       }
//   }
// ]
```

## API

TBC

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Kawacrepe"><img src="https://avatars.githubusercontent.com/u/40260517?v=4?s=100" width="100px;" alt="Vincent Dhennin"/><br /><sub><b>Vincent Dhennin</b></sub></a><br /><a href="https://github.com/NodeSecure/authors/commits?author=Kawacrepe" title="Code">💻</a> <a href="https://github.com/NodeSecure/authors/pulls?q=is%3Apr+reviewed-by%3AKawacrepe" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/NodeSecure/authors/commits?author=Kawacrepe" title="Documentation">📖</a> <a href="https://github.com/NodeSecure/authors/issues?q=author%3AKawacrepe" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/nicolas-hallaert/"><img src="https://avatars.githubusercontent.com/u/39910164?v=4?s=100" width="100px;" alt="Nicolas Hallaert"/><br /><sub><b>Nicolas Hallaert</b></sub></a><br /><a href="https://github.com/NodeSecure/authors/pulls?q=is%3Apr+reviewed-by%3ARossb0b" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fabnguess"><img src="https://avatars.githubusercontent.com/u/72697416?v=4?s=100" width="100px;" alt="Kouadio Fabrice Nguessan"/><br /><sub><b>Kouadio Fabrice Nguessan</b></sub></a><br /><a href="#maintenance-fabnguess" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT
