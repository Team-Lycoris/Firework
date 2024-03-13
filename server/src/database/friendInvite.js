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
			},
			// hack to just get friend requests working nicely on the frontend
			inviterName: {
				type: DataTypes.STRING
			},
			inviteeName: {
				type: DataTypes.STRING
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
		const inviter = await User.findOne({ where: { id: this.inviter }});
		const invitee = await User.findOne({ where: { id: this.invitee }});
		const group = await Group.create({ name: inviter.username + " " + invitee.username, isDm: true });
		await group.addUser(inviter);
		await group.addUser(invitee);

		await this.destroy(); // it appears this only deletes the entry in the DB, not the actual JS object.

		return group;
	}
}
