const host = 'http://localhost:8080';

export const loginRoute = host + '/api/auth/login';
export const registerRoute = host + '/api/auth/register';

export const createDMRoute = host + '/api/user/createDM';
export const createGroupRoute = host + '/api/user/createGroup';
export const getGroupsRoute = host + '/api/user/getGroups';
export const sendMessageRoute = host + '/api/user/sendMessage';
export const getMessagesRoute = host + '/api/user/getMessages';