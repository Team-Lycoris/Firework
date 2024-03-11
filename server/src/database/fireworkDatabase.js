import { Sequelize, DataTypes } from 'sequelize';

import User from "./user.js"
import Group from "./group.js"
import Message from "./message.js"
import Event from "./event.js"
import GroupMembership from "./groupMembership.js"
import MessageVisibility from "./messageVisibility.js"
import GroupInvite from './groupInvite.js';
import FriendInvite from './friendInvite.js';

export default class FireworkDatabase extends Sequelize {
	constructor(dialect, storage) {
		// database to connect to
		super({
			dialect: dialect,
			storage: storage
		});

		// define tables
		User.initialize(this);
		Group.initialize(this);
		Event.initialize(this);
		Message.initialize(this);
		GroupMembership.initialize(this);
		MessageVisibility.initialize(this);
		GroupInvite.initialize(this);
		FriendInvite.initialize(this);

		User.belongsToMany(Group, { through: GroupMembership });
		Group.belongsToMany(User, { through: GroupMembership });

		Message.belongsToMany(Group, { through: MessageVisibility });
		Group.belongsToMany(Message, { through: MessageVisibility });
	}
}
