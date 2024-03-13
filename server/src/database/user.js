import { Model, DataTypes } from "sequelize";
import Message from "./message.js";
import MessageVisibility from "./messageVisibility.js";
import Event from "./event.js";
import GroupInvite from "./groupInvite.js";
import FriendInvite from "./friendInvite.js";
import GroupMembership from "./groupMembership.js";

export default class User extends Model {
	static initialize(sequelize) {
		User.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			displayName: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: sequelize,
			modelName: "User"
		});
	}

	static async createUser(username, displayName) {
		return await User.create({ username: username, displayName: displayName });
	}

	async sendMessage(content, groupId, eventId = null) {
		// check if user is actually belongs to the group
		if (!(await this.getGroups()).find((group) => group.id === groupId))
			throw "User does not belong to group."

		const message = await Message.create({ author: this.id, username: this.username, content: content, event: eventId });
		await MessageVisibility.create({ MessageId: message.id, GroupId: groupId });
		return message;
	}

	async broadcastMessage(content, groupIds, eventId = null) {
		// check if user actually belongs to the groups
		const correctGroupIds = (await this.getGroups()).map((group) => group.id);
		if (!groupIds.every((groupId) => correctGroupIds.includes(groupId)))
			throw "User does not belong to one of the groups."

		const message = await Message.create({ author: this.id, username: this.username, content: content, event: eventId });
		const messageVisibilities = groupIds.map((groupId) => ({ MessageId: message.id, GroupId: groupId }));
		await MessageVisibility.bulkCreate(messageVisibilities);
	}

	async createEvent(name, location, startTime, endTime) {
		return await Event.create({ author: this.id, name: name, location: location, startTime: startTime, endTime: endTime });
	}

	async inviteFriend(inviteeId) {
		// check if user is trying to invite themself
		if (inviteeId === this.id)
			throw "Cannot invite yourself."

		return await FriendInvite.create({ inviter: this.id, invitee: inviteeId });
	}

	async getFriendInvites() {
		return await FriendInvite.findAll({
			where: {
				invitee: this.id
			}
		})
	}

	async getGroupInvites() {
		return await GroupInvite.findAll({
			where: {
				invitee: this.id
			}
		})
	}
}
