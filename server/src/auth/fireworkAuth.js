import { Sequelize, DataTypes } from "sequelize";
import UserHash from "./userHash.js";

import jwt from "jsonwebtoken";
import Config from "../config.json" with { type: "json" };
import bcrypt from "bcrypt";
import InvalidJwt from "./invalidJwt.js";

const SALT_ROUNDS = 10;

export default class FireworkAuth extends Sequelize {
	constructor(dialect, storage) {
		super({
			dialect: dialect,
			storage: storage
		});

		UserHash.initialize(this);
		InvalidJwt.initialize(this);
	}

	async registerUser(userId, username, password) {
		const hash = await bcrypt.hash(password, SALT_ROUNDS);
		UserHash.create({ userId: userId, username: username, hash: hash });
	}

	async issueJWT(userId) {
		return jwt.sign({
			userId: userId,
			iat: Date.now(),
			exp: Date.now() + 60 * 60 * 24 * 30 // expires in one month
		}, Config.auth.jwtKey);
	}

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

	async invalidateJWT(token) {
		await InvalidJwt.create({ jwt: token });
	}
}
