# How to Contribute

Thanks for reading this, because we really need everyone to follow some collaboration guidelines to make our codebase
maintainable, clean and concise.

The standard workflow to contribute to the project is as follows:

1. Create an issue to track the things (feature, bug or something else) you are working on. This also allows other
   contributors to know what you are working on, and to potentially offer suggestions or help.
2. On the right hand side of the issue page, there is a button that allows you to create a new branch for the issue.
   This will automatically create a new branch with the issue number and title. I strongly recommend you to use this
   feature instead of creating a branch manually, because it will make it easier to track the issue that you are working
   on.
3. Make your changes in the new branch. Ideally, your commit messages should follow
   the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. We will rebase your PR
   later if your commits are well-organized and the messages are well-formatted. Otherwise, we may ask you to fix them,
   or we will simply squash merge your PR with as a new commit.
4. Open a PR to the `main` branch. If you haven't done it yet, you may create a draft PR. Otherwise, please create a
   regular PR and request someone to review your PR.
5. We (mainly I, but other contributors are also welcome) will review your PR. Ideally, we will ask some small questions
   to clarify some points, or to suggest some improvements. Please don't feel bad if we ask you to change something,
   that's just because we're trying to make the codebase better.
6. After the PR is approved, we will merge it.

## Style Guide

This section is about the style of programming / coding paradigms that we follow in this project, not the formatting of
the code (we simply use `prettier` for that).

We want to follow the principles of _functional programming_. This is not to say we have to make everything functional,
but we will try our best to achieve the following goals:

- Use immutable objects whenever possible.
- Use iterative methods on collections instead of loops whenever possible.
- Avoid side effects in a function as much as possible.

That's not only because functional programming is cool, but also because it reduces the complexity of the code, and
makes it easier to reason about the code. For example, you should _never_ do:

```typescript
const numbers = [1, 2, 3]
const squares = []
for (const n of numbers) {
  squares.push(n * n)
}
```

This violates all rules above. `squares` is a mutable array, and we are keep mutating it; there exist side effects in
the loop body, which change the state of the `squares` array; and we are using a loop instead of an iterative method.
Instead, we should simply write:

```typescript
const numbers = [1, 2, 3]
const squares = numbers.map(n => n * n)
```

Further reading
on [iterative methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods).

## Code Review Process

During the PR review process, we make use of GitHub comments to track suggestions and clarification requests.

The general principles are the following:

- If the comment is a change suggestion...

    - If it's clear and uncontroversial how to apply the suggestion, you should resolve the comment after you have made
      the corresponding changes to the PR.

    - If you are not 100% sure that you have applied the suggestion correctly, leave a comment asking it. Do not resolve
      the comment in this case.

    - If you don't fully understand or agree with the suggestion, reply to the comment with your questions and
      rebuttals. Do not resolve the comment in this case.

- If the comment is a clarification request, answer it. Do not resolve the comment in this case. We will either come
  back with further questions or suggestions, or close the comment ourselves if we find your answer satisfactory.

Essentially, a comment that we made must either receive an answer from you and left unresolved or be 100% addressed in
your code and marked resolved.

## Etiquette

Please make sure your code passes all automated CI tests (unless under special circumstances) before submitting a PR.
You may trigger them by simply pushing your commits to a branch, or by opening a PR. Reviewing a PR that doesn't pass
tests is a waste of time for everyone involved.

During code review, it is not supposed to happen that we have to keep coming back to your PR, continually finding more
problems more unpolished changes, and having to go through lots of back-and-forth interactions this way. This will only
lead to growing frustration on both ends.


