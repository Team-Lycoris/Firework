import '../pages css/messages.css';
import axios from 'axios';
import { createGroupRoute } from '../utils/apiRoutes';
import { useState } from 'react';

const MIN_NAME_LENGTH = 2, MAX_NAME_LENGTH = 30;

export default function CreateGroupModal({showModal, setShowModal, setGroups, setSelectedGroup}) {
    const [newGroupName, setNewGroupName] = useState('');
    const [error, setError] = useState('');

    function validateGroupName() {
        let regex = /[a-zA-Z]/;
        if (!regex.test(newGroupName)) {
            setError('Your group name must contain a letter');
            return false;
        }
        
        if (newGroupName.length < 2) {
            setError('Your group name must be at least ' + MIN_NAME_LENGTH + ' characters long');
            return false;
        }
        if (newGroupName.length > 30) {
            setError('Your group name can be at most ' + MAX_NAME_LENGTH + ' characters long');
            return false;
        }

        return true;
    }

    async function handleCreateGroup(e) {
        try {
            setError('');
            if (!validateGroupName()) {
                return;
            }

            const res = await axios.post(createGroupRoute, {
                groupName: newGroupName,
                userIds: []
            });

            if (res.data.status) {
                let newGroups;
                setGroups((groups) => {
                    newGroups = [...groups, res.data.group]
                    return newGroups;
                });
                setNewGroupName('');
                setShowModal(false);
                setSelectedGroup(newGroups[newGroups.length-1]);
            } else {
                setError(res.data.msg);
                console.error(res.data.msg);
            }
        } catch(ex) {
            setError(ex);
            console.error("Error creating group:", ex);
        }
    }

    return (
        <>
            {showModal && (
                <div className="group-modal">
                    <div className='group-modal-content'>
                        <input
                            type="text"
                            placeholder="Enter your group's name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <button onClick={handleCreateGroup}>Create Group</button>
                        <button onClick={() => {
                            setShowModal(false);
                            setNewGroupName('');
                        }}>Cancel</button>
                        {error &&
                            <div className="error">{error}</div>
                        }
                    </div>
                </div>
            )}
        </>
    );
}