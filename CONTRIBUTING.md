# Contributing to DragDoll

Thanks for the interest in contributing to DragDoll! Here you will find some instructions on how to create an issue or a pull request.

## Creating an issue

Please [create an issue](https://github.com/niklasramo/dragdoll/issues/new) and explain the it in detail. If possible create a [reduced test case](https://css-tricks.com/reduced-test-cases/) and share a link to it.

## Creating a pull request

1. **Discuss first.**
   - The first step should always be [creating a new issue](https://github.com/niklasramo/dragdoll/issues/new) and discussing your pull request suggestion with the authors and the community.
   - After you get green light it's time to get coding.
2. **Fork the repo and create a new branch for your pull request.**
   - [Fork DragDoll](https://github.com/niklasramo/dragdoll#fork-destination-box).
   - Create a new branch for your pull request from the master branch. The name of the pull request branch should start with the id of the issue you opened for the pull request, e.g. `#123-fix-something`.
3. **Setup the development environment.**
   - Run `npm ci` in the root to install dependencies for all workspaces.
   - You can now run the following commands in the _root_:
     - `npm run build`
       - Builds the library (`dragdoll`), test suite (`dragdoll-tests`), and docs examples (`dragdoll-docs`), in that order.
     - `npm run format`
       - Formats all files in all workspaces with Prettier.
     - `npm run lint`
       - Lints all files in all workspaces with Prettier and validates TS types.
     - `npm run test:browserstack`
       - Runs tests (from `dragdoll-tests`) in Browserstack.
       - To make this work you need to create an `.env` file the project root, which should contain `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` variables.
     - `npm run test:local`
       - Runs tests (from `dragdoll-tests`) locally in Chrome and Firefox. You have to have them both installed.
4. **Do the updates.**
   - Remember scope. Don't refactor things that are not related to the pull request.
   - After you're done update tests (`dragdoll-tests`) and docs (`dragdoll-docs`) if necessary.
5. **Build and test changes.**
   - Run `npm run build` to build the lib after the changes and then run `npm run test:browserstack` (or `npm run test:local`) to make sure the changes didn't cause regressions.
6. **Create the pull request.**
   - Do your best to explain what the pull request fixes.
   - Mention which issue(s) will be closed by the pull request, e.g. `Closes #123`.
   - Request a review from [@niklasramo](https://github.com/niklasramo).
7. **You made it! Thank you so much for contributing to DragDoll!**
