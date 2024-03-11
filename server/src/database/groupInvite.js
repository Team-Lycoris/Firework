import { Model, DataTypes } from "sequelize";
import User from "./user.js";
import Group from "./group.js";

export default class GroupInvite extends Model {
	static initialize(sequelize) {
		GroupInvite.init({
			group: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Group,
					key: "id"
				}
			},
			user: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			}
		}, {
			sequelize: sequelize,
			modelName: "GroupInvite"
		})
	}
}
