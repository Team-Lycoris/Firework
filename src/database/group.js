import { Model } from "sequelize";
import GroupMembership from "./groupMembership.js";

export default class Group extends Model {
	async addUser(user) {
		await GroupMembership.create({ user: user.id, group: this.id });
	}
}
