export function createGithubUrl(from: string) {
  const rootURL = "https://github.com/login/oauth/authorize";

  const options = {
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID as string,
    redirect_uri: process.env.REACT_APP_GITHUB_REDIRECT_URI as string,    
    state: from
  };

  return `${rootURL}?${new URLSearchParams(options).toString()}`;
}
