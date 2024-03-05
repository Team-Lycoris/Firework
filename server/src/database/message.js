import { Model, DataTypes } from "sequelize";
import Event from "./event.js"
import User from "./user.js"

export default class Message extends Model {
	static initialize(sequelize) {
		Message.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			author: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			},
			content: {
				type: DataTypes.STRING(2000), // max length 2000
				allowNull: false
			},
			event: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: Event,
					key: "id"
				}
			}
		}, {
			sequelize: sequelize,
			modelName: "Message"
		});
	}
}
