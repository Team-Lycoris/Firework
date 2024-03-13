import { Model, DataTypes } from "sequelize";

/**
 * Manually add an entry to the database to invalidate a JWT
 * In case a user gets hacked or something and their token is stolen
 */
export default class InvalidJwt extends Model {
	static initialize(sequelize) {
		InvalidJwt.init({
			jwt: {
				type: DataTypes.STRING, // the exact string representing the token
				allowNull: false,
				unique: true
			}
		}, {
			sequelize: sequelize,
			modelName: "InvalidJWT"
		})
	}
}
