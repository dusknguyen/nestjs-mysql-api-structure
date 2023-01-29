const branchName = require('current-git-branch');

if (branchName() === 'develop' || branchName() === 'master') {
  throw Error(`Can't commit to develop or master branch`);
}
