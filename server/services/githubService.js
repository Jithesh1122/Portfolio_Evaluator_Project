import { Octokit } from '@octokit/rest';

const getOctokitClient = () => {
  const githubToken = process.env.GITHUB_TOKEN;

  return new Octokit({
    auth: githubToken,
  });
};

const getUserProfile = async (username) => {
  const octokit = getOctokitClient();
  const { data } = await octokit.rest.users.getByUsername({
    username,
  });

  return data;
};

const getUserRepos = async (username) => {
  const octokit = getOctokitClient();
  const { data } = await octokit.rest.repos.listForUser({
    username,
    per_page: 100,
    sort: 'updated',
  });

  return data;
};

const getUserEvents = async (username) => {
  const octokit = getOctokitClient();
  const { data } = await octokit.rest.activity.listPublicEventsForUser({
    username,
    per_page: 100,
  });

  return data;
};

const getRepoContents = async (owner, repo) => {
  const octokit = getOctokitClient();

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: '',
    });

    return Array.isArray(data) ? data : [data];
  } catch (error) {
    if (error.status === 404 || error.status === 403 || error.status === 429) {
      return [];
    }

    throw error;
  }
};

const getUserStarredRepos = async (username) => {
  const octokit = getOctokitClient();

  try {
    const { data } = await octokit.rest.activity.listReposStarredByUser({
      username,
      per_page: 100,
    });

    return data;
  } catch (error) {
    if (error.status === 403 || error.status === 429) {
      return [];
    }

    throw error;
  }
};

export {
  getRepoContents,
  getUserEvents,
  getUserProfile,
  getUserRepos,
  getUserStarredRepos,
};
