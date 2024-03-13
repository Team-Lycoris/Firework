import { Model, DataTypes } from "sequelize";
import User from "./user.js";

/**
 * Stores information about when a user shares a location.
 */
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
			/*name: {
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
			},*/
			latitude: {
				type: DataTypes.DOUBLE,
				allowNull: true

			},
			longitude: {
				type: DataTypes.DOUBLE,
				allowNull: false
			}
			
		}, {
			sequelize: sequelize,
			modelName: "Event"
		});
	}
}
