import { Model, Op, DataTypes } from "sequelize";
import User from "./user.js";

export default class Event extends Model {
	static initialize(sequelize) {
		Event.init({
			author: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			startTime: {
				type: DataTypes.BIGINT,
				allowNull: false
			},
			endTime: {
				type: DataTypes.BIGINT,
				allowNull: false
			},
			location: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: sequelize,
			modelName: "Event"
		});
	}
}