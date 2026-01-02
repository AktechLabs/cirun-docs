# Teams

Cirun supports teams so multiple users can view and manage runner resources and permissions together.
A team in Cirun is linked to a single GitHub organization. When you create a team you connect it to a GitHub organization and give the team a custom name. Team membership is restricted to users who:

- belong to the linked GitHub organization, and
- have an existing Cirun account.
There is no external invitation workflow: if a user is a member of the linked GitHub organization and already has a Cirun account, they can be added directly to the team.

## Roles
Teams use three roles to control who can view and manage resources:

- **Owner**: Full control over the team. Owners can manage members, repositories, and team settings.
- **Admin**: Can manage repositories assigned to the team (add/remove repositories) and perform other administrative tasks for the team.
- **Viewer**: Read-only. Can view runners, events, and analytics for repositories assigned to the team.

When a user is added to a team they receive the **Viewer** role by default. Roles can be changed by team Owners.
A single user may be a member of multiple teams.

## Creating a Team
To create a team you must provide:

- the GitHub organization name to link the team to, and
- a custom team display name used inside Cirun.
Only administrators of the specified GitHub organization may create teams for that organization.

## Access Granted by Team Membership
Members of a team gain access to the following for repositories that belong to the linked GitHub organization (and are assigned to the team):

- list and view runners,
- view runner events and
- access analytics and usage data for the assigned runners.

Membership grants access only to resources for repositories of the linked GitHub organization that are explicitly assigned to the team (see "Managing repositories" below).
## Managing Repositories (Admin role)

Users with the **Admin** role on a team can add or remove repositories that the team has access to. To manage repositories:
1. Open the **Repositories** tab in the Cirun UI.
2. Use the team selector in the top-right to choose the target team.
3. Add or remove repositories for that team using the available controls.
When a repository is added to a team, team members immediately gain visibility into the repository's runners, events, and analytics according to their role.

## Managing Members and Roles
- To add members: go to the Teams page, select the team, and add users by their GitHub username. Users are added only if they belong to the linked GitHub organization and have a Cirun account.
- To change a member's role: a team Owner can edit the member's role and choose between **Admin**, and **Viewer**.
- To remove a member: Only a team Owner can remove the user from the team.
