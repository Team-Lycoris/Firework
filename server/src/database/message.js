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
			username: {
				type: DataTypes.STRING,
				references: {
					model: User,
					key: "username"
				}
			},
			content: {
				type: DataTypes.STRING(2000), // max length 2000
				allowNull: false
			},
			latitude: {
				type: DataTypes.DOUBLE,
				allowNull: true
			},
			longitude: {
				type: DataTypes.DOUBLE,
				allowNull: true
			}
		}, {
			sequelize: sequelize,
			modelName: "Message"
		});
	}
}
