import { Model, DataTypes } from "sequelize";
import Message from "./message.js";
import MessageVisibility from "./messageVisibility.js";
import Event from "./event.js";
import GroupInvite from "./groupInvite.js";
import FriendInvite from "./friendInvite.js";

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
		const message = await Message.create({ author: this.id, content: content, event: eventId });
		await MessageVisibility.create({ MessageId: message.id, GroupId: groupId });
		return message;
	}

	async createEvent(name, location, startTime, endTime) {
		return await Event.create({ author: this.id, name: name, location: location, startTime: startTime, endTime: endTime });
	}

	async inviteFriend(inviteeId) {
		return await FriendInvite.create({ inviter: this.id, invitee: inviteeId });
	}

	async getInvites() {
		return await GroupInvite.findAll({
			where: {
				invitee: this.id
			}
		})
	}
}
