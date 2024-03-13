import { Model, DataTypes } from "sequelize"
import User from "./user.js"
import Group from "./group.js";

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

	async startFriendship() {
		const inviter = await User.findOne({ where: { id: this.inviter }});
		const invitee = await User.findOne({ where: { id: this.invitee }});
		const group = await Group.create({ name: inviter.username + " " + invitee.username, isDm: true });
		await group.addUser(inviter);
		await group.addUser(invitee);

		await this.destroy();

		return group;
	}
}
