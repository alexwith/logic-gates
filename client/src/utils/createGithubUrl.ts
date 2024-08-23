export function createGithubUrl(from: string) {
  const rootURL = "https://github.com/login/oauth/authorize";

  const options = {
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID as string,
    redirect_uri: `${process.env.REACT_APP_BASE_URI as string}/api/v1/auth/login/github`,
    state: from,
  };

  return `${rootURL}?${new URLSearchParams(options).toString()}`;
}
