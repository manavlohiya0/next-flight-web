import { Octokit } from "@octokit/rest";

const githubToken = process.env.GITHUB_PAT_TOKEN || "";
const owner = process.env.GITHUB_REPO_OWNER || "";
const repo = process.env.GITHUB_REPO_NAME || "";

export interface InviteResult {
  success: boolean;
  status: "invited" | "already_collaborator" | "user_not_found" | "error";
  message: string;
  repoUrl?: string;
}

export async function inviteGithubCollaborator(
  username: string
): Promise<InviteResult> {
  const cleanUsername = username.trim().replace(/^@/, "");

  if (!cleanUsername) {
    return {
      success: false,
      status: "error",
      message: "GitHub username cannot be empty.",
    };
  }

  if (!githubToken || !owner || !repo) {
    console.warn(
      "[GitHub Access] GITHUB_PAT_TOKEN, GITHUB_REPO_OWNER, or GITHUB_REPO_NAME is missing. Mocking invitation for:",
      cleanUsername
    );
    return {
      success: true,
      status: "invited",
      message: `[Dev Mode] Collaborator invite simulated for @${cleanUsername}. Check environment variables for production.`,
      repoUrl: `https://github.com/${owner || "org"}/${repo || "repo"}`,
    };
  }

  const octokit = new Octokit({ auth: githubToken });

  try {
    // 1. Verify that the GitHub user actually exists
    try {
      await octokit.users.getByUsername({ username: cleanUsername });
    } catch (userErr: any) {
      if (userErr.status === 404) {
        return {
          success: false,
          status: "user_not_found",
          message: `GitHub user "@${cleanUsername}" was not found. Please double-check your username.`,
        };
      }
      throw userErr;
    }

    // 2. Check if the user is already a collaborator
    try {
      const isCollab = await octokit.repos.checkCollaborator({
        owner,
        repo,
        username: cleanUsername,
      });

      if (isCollab.status === 204) {
        return {
          success: true,
          status: "already_collaborator",
          message: `@${cleanUsername} already has access to the repository!`,
          repoUrl: `https://github.com/${owner}/${repo}`,
        };
      }
    } catch {
      // 404 means not yet a collaborator, continue to invite
    }

    // 3. Add collaborator with "pull" permission (read/clone access only)
    const response = await octokit.repos.addCollaborator({
      owner,
      repo,
      username: cleanUsername,
      permission: "pull", // Gives clone/read rights without altering your master repository
    });

    const repoUrl = `https://github.com/${owner}/${repo}`;

    if (response.status === 201) {
      return {
        success: true,
        status: "invited",
        message: `Invitation successfully sent to @${cleanUsername}! Check your email or notifications at github.com to accept.`,
        repoUrl,
      };
    } else if (response.status === 204) {
      return {
        success: true,
        status: "already_collaborator",
        message: `@${cleanUsername} already has direct access to the repository.`,
        repoUrl,
      };
    }

    return {
      success: true,
      status: "invited",
      message: `Invitation processed for @${cleanUsername}.`,
      repoUrl,
    };
  } catch (error: any) {
    console.error("[GitHub Invite Error]:", error?.message || error);
    return {
      success: false,
      status: "error",
      message:
        error?.message ||
        "An unexpected error occurred while granting GitHub access.",
    };
  }
}
