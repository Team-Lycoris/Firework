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
        <h1 className="title">Firework</h1>
        {groups.map((group, index) => (
            <div key={index}>
                <button 
                    className="conversation-select"
                    onClick={() => changeGroup(group, index)} 
                >
                {group.name}
                </button>
            </div>
        ))}
        </div>
    );
}
