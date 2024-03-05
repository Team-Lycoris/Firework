import { Model } from "sequelize";
import Message from "./message.js";
import MessageVisibility from "./messageVisibility.js";
import Event from "./event.js";

export default class User extends Model {
	static async createUser(name, passwordHash) {
		return User.create({ name: name, passwordHash: passwordHash });
	}

	static async findOrCreateUser(name, passwordHash) {
		// Create user if it doesn't already exist
		const [user, created] = await User.findOrCreate({
			where: { name: name },
			defaults: {
				passwordHash: passwordHash
			}
		});

		return created;
	}

	static async getUserByName(name) {
		const user = await User.findOne({ where: { name: name } });

		if (user === null) {
			return Promise.reject("User does not exist");
		}

		return {
			type: 'user',
			id: user.dataValues.id,
			name: user.dataValues.name,
			passwordHash: user.dataValues.passwordHash
		};
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
