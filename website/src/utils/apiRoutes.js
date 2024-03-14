const host = 'http://localhost:8080';

export const loginRoute = host + '/api/auth/login';
export const registerRoute = host + '/api/auth/register';

export const acceptFriendInviteRoute = host + '/api/user/acceptFriendInvite';
export const declineFriendInviteRoute = host + '/api/user/declineFriendInvite';
export const sendFriendInviteRoute = host + '/api/user/sendFriendInvite';
export const getSelfInfoRoute = host + '/api/user/getSelfInfo';
export const createDMRoute = host + '/api/user/createDM';
export const createGroupRoute = host + '/api/user/createGroup';
export const getGroupsRoute = host + '/api/user/getGroups';
export const sendMessageRoute = host + '/api/user/sendMessage';
export const getMessagesRoute = host + '/api/user/getMessages';
export const getIncomingFriendInvitesRoute = host + '/api/user/getIncomingFriendInvites';
export const getOutgoingFriendInvitesRoute = host + '/api/user/getOutgoingFriendInvites';
export const addUserToGroupRoute = host + '/api/user/addUserToGroup';
