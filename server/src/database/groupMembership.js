import { Model, DataTypes } from "sequelize";
import User from "./user.js"
import Group from "./group.js"

export default class GroupMembership extends Model {
	static initialize(sequelize) {
		GroupMembership.init({
			user: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			},
			group: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Group,
					key: "id"
				}
			}
		}, {
			sequelize: sequelize,
			modelName: "GroupMembership"
		})
	}
}
