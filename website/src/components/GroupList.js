import { useState } from "react";

export default function GroupList({ groups, selectGroup }) {
    const [selectedGroup, setSelectedGroup] = useState(undefined);

    function changeGroup(group, index) {
        setSelectedGroup(index);
        selectGroup(group);
        console.log(group);
    }

    return (
        <div className="conversations-list">
        {groups.map((group, index) => (
            <div className="conversation" key={index}>
                <button 
                    className={
                        `button conversation-select ${
                        selectedGroup === index ?
                        'active-person' : '' }`
                    }
                    onClick={() => changeGroup(group, index)} 
                >
                {group.name}
                </button>
            </div>
        ))}
        </div>
    );
}