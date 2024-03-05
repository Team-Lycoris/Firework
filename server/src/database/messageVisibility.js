import { Model, DataTypes } from "sequelize";
import Group from "./group.js";
import Message from "./message.js"

export default class MessageVisibility extends Model {
	static initialize(sequelize) {
		MessageVisibility.init({
			group: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Group,
					key: "id"
				}
			},
			message: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Message,
					key: "id"
				}
			}
		}, {
			sequelize: sequelize,
			modelName: "MessageVisibility"
		})
	}
}
