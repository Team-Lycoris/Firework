import { Sequelize, DataTypes } from 'sequelize';

import User from "./user.js"
import Group from "./group.js"
import Message from "./message.js"
import Event from "./event.js"
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
			},
			passwordHash: {
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

		Event.init({
			author: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			},
			name: {
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
			},
			location: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, {
			sequelize: this,
			modelName: "Event"
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
			},
			event: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: Event,
					key: "id"
				}
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
}
