import { DataTypes, Model } from "sequelize";

/**
 * Information needed for user authentication
 */
export default class UserHash extends Model {
	static initialize(sequelize) {
		UserHash.init({
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			hash: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: sequelize,
			modelName: "UserHash"
		});
	}
}
