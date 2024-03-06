import { Model, DataTypes } from "sequelize";

export default class InvalidJwt extends Model {
	static initialize(sequelize) {
		InvalidJwt.init({
			jwt: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			}
		}, {
			sequelize: sequelize,
			modelName: "InvalidJWT"
		})
	}
}
