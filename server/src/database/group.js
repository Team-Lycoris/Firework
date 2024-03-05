import { Model, Op, DataTypes } from "sequelize";
import GroupMembership from "./groupMembership.js";
import MessageVisibility from "./messageVisibility.js";
import Message from "./message.js";
import User from "./user.js";

export default class Group extends Model {
	static initialize(sequelize) {
		Group.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: sequelize,
			modelName: "Group"
		});
	}

	static async createGroup(name) {
		return Group.create({ name: name });
	}

	async addUser(user) {
		await GroupMembership.create({ user: user.id, group: this.id });
	}

	async getMessages() {
		const messageVisibilites = await MessageVisibility.findAll({
			attributes: ["message"],
			where: {
				group: this.id
			}
		});

		const messageIds = messageVisibilites.map(x => x.message);

		return await Message.findAll({
			where: {
				id: {
					[Op.or]: messageIds
				}
			}
		});
	}

	async getUsers() {
		const groupMemberships = await GroupMembership.findAll({
			attributes: ["user"],
			where: {
				group: this.id
			}
		});

		const userIds = groupMemberships.map(x => x.user);

		return await User.findAll({
			where: {
				id: {
					[Op.or]: userIds
				}
			}
		});
	}
}
