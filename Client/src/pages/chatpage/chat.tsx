import MessageWindow from '../../components/Chat/MessageCard';
import ChatCard from '../../components/Chat/ChatCard';
import NoChatSelected from "../../components/Chat/NoChatSelected";
import { useState } from 'react';

const CombinedChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // State to track selected user

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <ChatCard onSelectUser={setSelectedUser} /> {/* Pass user selection handler */}
            {!selectedUser ? <NoChatSelected /> : <MessageWindow selectedUser={selectedUser} />} {/* Pass selected user to MessageWindow */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedChatPage;
  