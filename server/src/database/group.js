import { Model, Op, DataTypes } from "sequelize";

/**
 * Represents a conversation between users.
 * Can be a DM or a proper group of more than 2 users.
 */
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
