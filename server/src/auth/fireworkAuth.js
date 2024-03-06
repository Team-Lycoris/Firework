import { Sequelize, DataTypes } from "sequelize";
import UserHash from "./userHash.js";

import jwt from "jsonwebtoken";
import Config from "../config.json" with { type: "json" };
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export default class FireworkAuth extends Sequelize {
	constructor(dialect, storage) {
		super({
			dialect: dialect,
			storage: storage
		});

		UserHash.initialize(this);
	}

	async registerUser(user, password) {
		const hash = await bcrypt.hash(password, SALT_ROUNDS);
		UserHash.create({ user: user, hash: hash });
	}

	// returns (JWT, error)
	// returns a JWT if the provided credentials are valid, otherwise null
	// if an error occured, it's returned as a string, otherwise null
	async issueJWT(user, password) {
		const userHash = await UserHash.findOne({
			where: {
				user: user
			}
		})

		if (userHash === null)
			return (null, "Missing user")

		const match = await bcrypt.compare(password, userHash.hash);
		if (!match)
			return (null, "Incorrect password");

		return jwt.sign({
			user: user,
			iat: Date.now(),
			exp: Date.now() + 60 * 60 * 24 * 30 // expires in one month
		}, Config.auth.jwtKey);
	}

	verifyJWT(token) {
		return jwt.verify(token, Config.auth.jwtKey);
	}
}
