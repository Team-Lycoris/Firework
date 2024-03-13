import { Model, DataTypes } from "sequelize";
import Group from "./group.js";
import Message from "./message.js"

/**
 * Model for associating messages with groups.
 */
export default class MessageVisibility extends Model {
	static initialize(sequelize) {
		MessageVisibility.init({
			GroupId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Group,
					key: "id"
				}
			},
			MessageId: {
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
