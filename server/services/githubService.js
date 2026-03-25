import { Octokit } from '@octokit/rest';

const githubToken = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: githubToken,
});

const getUserProfile = async (username) => {
  const { data } = await octokit.rest.users.getByUsername({
    username,
  });

  return data;
};

const getUserRepos = async (username) => {
  const { data } = await octokit.rest.repos.listForUser({
    username,
    per_page: 100,
    sort: 'updated',
  });

  return data;
};

const getUserEvents = async (username) => {
  const { data } = await octokit.rest.activity.listPublicEventsForUser({
    username,
    per_page: 100,
  });

  return data;
};

export { getUserProfile, getUserRepos, getUserEvents };
