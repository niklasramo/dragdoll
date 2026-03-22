# Coding Guidelines

## General

- Performance is top priority. It's okay to sacrifice readability for performance.
- Less code is better. Lines of code = Debt.
- Use early returns to avoid nested conditions and improve readability.
- Use descriptive names for variables and functions. Prefix event handler functions with "on" (e.g., onClick, onKeyDown).
- Focus on writing correct, best practice, DRY (Don't Repeat Yourself) code.
- Only modify sections of the code related to the task at hand. Avoid modifying unrelated pieces of code.
- Alias class properties (e.g., `const drag = this.drag;`) locally if it makes the code cleaner to read AND improves performance (even if just a little bit). However, do NOT apply this pattern if it's used for only one instance, in which case the pattern actually degrades performance.
- Order functions with those that are composing other functions appearing earlier in the file.
- If you encounter a bug in existing code, add comments starting with "TODO:" outlining the problems.

## Code Style

- Use 2-space indentation.
- Prefer single quotes for strings.
- Use semicolons at the end of statements.
- Maximum line length is 100 characters for code files (including comments).
- In Markdown files do not limit line length or comment length, unless it's a code block.
- Use TypeScript for type safety.
- Use PascalCase for class names, interfaces, and types.
- Use camelCase for variables, functions, and methods.
- Use UPPER_SNAKE_CASE for constants.
- Use kebab-case for file names.
