import { Sequelize, DataTypes } from "sequelize";
import UserHash from "./userHash.js";

import jwt from "jsonwebtoken";
import Config from "../config.json" with { type: "json" };
import bcrypt from "bcrypt";
import InvalidJwt from "./invalidJwt.js";

/**
 * Affects how computationally expensive it is to calculate a hash.
 * More expensive means harder to brute force the original password,
 * in case we get hacked.
*/
const SALT_ROUNDS = 10;

/**
 * Database for user authentication
 * Separate from the main database in case we want to separate the systems in the future
 */
export default class FireworkAuth extends Sequelize {
	constructor(dialect, storage) {
		super({
			dialect: dialect,
			storage: storage
		});

		UserHash.initialize(this);
		InvalidJwt.initialize(this);
	}

	/**
	 * Add a new user to the auth db.
	 * Create a user in the main db first to get a user ID.
	 */
	async registerUser(userId, username, password) {
		const hash = await bcrypt.hash(password, SALT_ROUNDS);
		UserHash.create({ userId: userId, username: username, hash: hash });
	}

	/**
	 * Create a JSON Web Token that the user can provide to the server
	 * to show that they are them.
	 *
	 * Use basic authentication first to verify that a user is themself
	 * before issuing them a JWT.
	 */
	async issueJWT(userId) {
		return jwt.sign({
			userId: userId,
			iat: Date.now(),
			exp: Date.now() + 60 * 60 * 24 * 30 // expires in one month
		}, Config.auth.jwtKey);
	}

	/**
	 * Verify that a JWT is valid (made by the server using the correct key).
	 * Also makes sure the token has not been manually marked to be invalidated.
	 *
	 * After verifying that the JWT is valid, make sure to verify that
	 * the user specified in the JWT matches the user supplying it.
	 */
	async verifyJWT(token) {
		const invalid = await InvalidJwt.findOne({
			where: {
				jwt: token
			}
		});

		if (invalid !== null)
			throw "JWT has been invalidated";

		return jwt.verify(token, Config.auth.jwtKey);
	}

	/**
	 * Use this to manually invalidate a specific JWT
	 * (for cases when a user gets their token stolen or something).
	 *
	 * If our own key for signing JWTs is leaked,
	 * do use this this. Change the key in config instead and
	 * all previously issued JWTs will become invalid.
	 */
	async invalidateJWT(token) {
		await InvalidJwt.create({ jwt: token });
	}
}
