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
		const group = await Group.create({ isDm: true });
		await group.addUser(this.inviter);
		await group.addUser(this.invitee);

		await this.destroy();

		return group;
	}
}
