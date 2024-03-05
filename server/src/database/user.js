import { Model, DataTypes } from "sequelize";
import Message from "./message.js";
import MessageVisibility from "./messageVisibility.js";
import Event from "./event.js";

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
			},
			passwordHash: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: sequelize,
			modelName: "User"
		});
	}

	static async createUser(username, displayName, passwordHash) {
		return User.create({ username: username, displayName: displayName, passwordHash: passwordHash });
	}

	async sendMessage(content, group, eventId = null) {
		const message = await Message.create({ author: this.id, content: content, event: eventId });
		await MessageVisibility.create({ message: message.id, group: group.id });
		return message;
	}

	async createEvent(name, location, startTime, endTime) {
		return await Event.create({ author: this.id, name: name, location: location, startTime: startTime, endTime: endTime });
	}
}
