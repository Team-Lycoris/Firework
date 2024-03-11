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
				type: DataTypes.STRING
			},
			isDm: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, {
			sequelize: sequelize,
			modelName: "Group"
		});
	}
}
