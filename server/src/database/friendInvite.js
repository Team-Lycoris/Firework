import { Model, DataTypes } from "sequelize"
import User from "./user.js"
import Group from "./group.js";

/**
 * Represents a friend request.
 */
export default class FriendInvite extends Model {
	static initialize(sequelize) {
		FriendInvite.init({
			inviter: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			},
			invitee: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id"
				}
			}
		}, {
			sequelize: sequelize,
			modelName: "FriendInvite"
		})
	}

	/**
	 * Use when a friend request in accepted.
	 * Removes the request from the database and creates a DM with the two users.
	 */
	async startFriendship() {
		const group = await Group.create({ isDm: true });
		await group.addUser(this.inviter);
		await group.addUser(this.invitee);

		await this.destroy(); // it appears this only deletes the entry in the DB, not the actual JS object.

		return group;
	}
}
