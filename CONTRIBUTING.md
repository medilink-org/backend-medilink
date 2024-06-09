# Contribution Guidelines

Thank you for considering contributing to MediLink! Here are the guidelines to help you get started.

## Table of Contents

- [How to Contribute](#how-to-contribute)
  - [Fork the Repository](#fork-the-repository)
  - [Clone Your Fork](#clone-your-fork)
  - [Create a Branch](#create-a-branch)
  - [Make Changes](#make-changes)
  - [Commit Your Changes](#commit-your-changes)
  - [Push to Your Fork](#push-to-your-fork)
  - [Open a Pull Request](#open-a-pull-request)
- [Code Style Guidelines](#code-style-guidelines)
- [Reporting Issues](#reporting-issues)
- [Additional Notes](#additional-notes)

## How to Contribute

### Fork the Repository

- Navigate to the repository on GitHub.
- Click the "Fork" button in the upper right corner.

### Clone Your Fork

```sh
git clone git@github.com:your-username/repository-name.git
```

## Create a Branch

```sh
git checkout -b feature/your-feature-name
```

## Make Changes
- Implement the changes or features in your branch.
- Ensure your code follows the repository’s style and guidelines.
- Test your changes locally to verify everything works as expected.

## Commit Your Changes
```sh
git add .
git commit -m "Description of your changes"
```

## Push to Your Fork
```sh
git push origin feature/your-feature-name
```

## Open a Pull Request
- Navigate to your fork on GitHub.
- Click the "Compare & pull request" button.
- Provide a detailed description of your changes.
- Click "Create pull request".

### Some things to keep in mind when making a pull request:

- The target branch in our repository is `main`.
- Fill out the PR template accordingly.
- The name of the PR should:
  - Start with one of the following prefixes:
    - `feat`: A non-breaking change which adds functionality.
    - `fix`: A non-breaking change which fixes an issue.
    - `refactor`: A change that neither fixes a bug nor adds a feature.
    - `docs`: A change only to in-code or markdown documentation.
    - `test`: A change that adds missing tests.
    - `chore`: A change that is likely none of the above.
  - Be in all lowercase.
  - Start with a verb (ie: "add ...", "implement ...", "update ...").
- Please check the
  ["allow edits from maintainers option"](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork)
  when creating your PR. This allows us to more easily collaborate with you on
  your work.
- Most PRs should be attached to an issue, so be sure to add this to the PR
  description:
  ```
  Closes #<ISSUE_NUMBER>.
  ```
  See more about
  [linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
- A PR can only be merged (by a maintainer) if:
  - A maintainer has reviewed and approved it.
  - All branches are up to date before merging.
  - All conversations are resolved.


## Code Style Guidelines
- Follow the existing coding style.
- Write clear and concise commit messages.
- Document your code thoroughly.

## Reporting Issues
- Check if the issue has already been reported.
- Provide a clear and detailed description of the issue.
- Include steps to reproduce the issue, if applicable.

## Additional Notes
- Ensure that your contributions do not introduce new bugs or issues.
- Regularly sync your fork with the upstream repository to stay updated.

Thank you for your contributions!
