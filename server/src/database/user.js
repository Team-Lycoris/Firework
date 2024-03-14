import { Model, DataTypes } from "sequelize";
import Message from "./message.js";
import MessageVisibility from "./messageVisibility.js";
import Event from "./event.js";
import GroupInvite from "./groupInvite.js";
import FriendInvite from "./friendInvite.js";
import GroupMembership from "./groupMembership.js";

/**
 * Represents a user in the service.
 */
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

	/**
	 * There's not really a reason why function exists.
	 * You could just call the Sequelize function and it does exactly
	 * the same thing.
	 *
	 * Literally only keeping this here because it's used elsewhere
	 */
	static async createUser(username, displayName) {
		return await User.create({ username: username, displayName: displayName });
	}

	/**
	 * Create a new message with the user as the author
	 * and make it visible in the supplied group.
	 *
	 * Throws if user does not belong to the supplied group.
	*/
	async sendMessage(content, groupId, latitude = null, longitude = null) {
		// check if user is actually belongs to the group
		if (!(await this.getGroups()).find((group) => group.id === groupId))
			throw "User does not belong to group."
		const message = await Message.create({ author: this.id, username: this.username, content: content, latitude: latitude, longitude: longitude });
		await MessageVisibility.create({ MessageId: message.id, GroupId: groupId });
		return message;
	}

	/**
	 * Create a new message with the user as the author
	 * and make it visible in all the supplied groups.
	 *
	 * Throws if the user does not belong to all the supplied groups.
	 */
	async broadcastMessage(content, groupIds, latitude = null, longitude = null) {
		// check if user actually belongs to the groups
		const correctGroupIds = (await this.getGroups()).map((group) => group.id);
		if (!groupIds.every((groupId) => correctGroupIds.includes(groupId)))
			throw "User does not belong to one of the groups."

		const message = await Message.create({ author: this.id, username: this.username, content: content, latitude: null, longitude: null });
		const messageVisibilities = groupIds.map((groupId) => ({ MessageId: message.id, GroupId: groupId }));
		await MessageVisibility.bulkCreate(messageVisibilities);
	}

	/**
	 * Create a new event with the user as the auther.
	 * This also doesn't really need to be its own function.
	 */
	async createEvent(name, location, startTime, endTime) {
		return await Event.create({ author: this.id, name: name, location: location, startTime: startTime, endTime: endTime });
	}

	/**
	 * Create a new friend request inviting another user.
	 *
	 * Throws if trying to invite yourself.
	 */
	async inviteFriend(inviteeId) {
		// check if user is trying to invite themself
		if (inviteeId === this.id)
			throw "Cannot invite yourself."

		return await FriendInvite.create({ inviter: this.id, invitee: inviteeId });
	}

	/**
	 * Get all friend requests that name this user as the invitee.
	 */
	async getFriendInvites() {
		return await FriendInvite.findAll({
			where: {
				invitee: this.id
			}
		})
	}

	/**
	 * Get all group invites that name this user as the invitee.
	 */
	async getGroupInvites() {
		return await GroupInvite.findAll({
			where: {
				invitee: this.id
			}
		})
	}
}
