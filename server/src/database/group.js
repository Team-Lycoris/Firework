import { Model } from "sequelize";
import GroupMembership from "./groupMembership.js";

export default class Group extends Model {
	static async createGroup(name) {
		return Group.create({ name: name });
	}

	async addUser(user) {
		await GroupMembership.create({ user: user.id, group: this.id });
	}

	async getMessages() {
		const messages = await MessageVisibility.findAll({
			where: {
				group: this.id
			}
		});

		return messages;
	}

	async getUsersInGroup() {
		const users = await GroupMembership.findAll({
			where: {
				group: this.id
			}
		});

		return users;
	}
}
