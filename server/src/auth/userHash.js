import { DataTypes, Model } from "sequelize";

export default class UserHash extends Model {
	static initialize(sequelize) {
		UserHash.init({
			user: {
				type: DataTypes.INTEGER,
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
