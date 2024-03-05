import { Model } from "sequelize";
import Message from "./message.js";
import MessageVisibility from "./messageVisibility.js";

export default class User extends Model {
	async sendMessage(content, group) {
		const message = await Message.create({ author: this.id, content: content });
		await MessageVisibility.create({ message: message.id, group: group.id });
		return message;
	}
}
