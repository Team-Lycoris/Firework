import { Sequelize, DataTypes } from 'sequelize';

import User from "./user.js"
import Group from "./group.js"
import Message from "./message.js"
import GroupMembership from "./groupMembership.js"
import MessageVisibility from "./messageVisibility.js"

export default class FireworkDatabase extends Sequelize {
	constructor(dialect, storage) {
		// database to connect to
		super({
			dialect: dialect,
			storage: storage
		});

		// define tables
		User.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: this,
			modelName: "User"
		});

		Group.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: this,
			modelName: "Group"
		});

		Message.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			author: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			},
			content: {
				type: DataTypes.STRING(2000), // max length 2000
				allowNull: false
			}
		}, {
			sequelize: this,
			modelName: "Message"
		});

		GroupMembership.init({
			user: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			},
			group: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Group,
					key: "id"
				}
			}
		}, {
			sequelize: this,
			modelName: "GroupMembership"
		})

		MessageVisibility.init({
			group: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Group,
					key: "id"
				}
			},
			message: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Message,
					key: "id"
				}
			}
		}, {
			sequelize: this,
			modelName: "MessageVisibility"
		})
	}

	async createUser(name) {
		return User.create({ name: name });
	}

	async createGroup(name) {
		return Group.create({ name: name });
	}
}
