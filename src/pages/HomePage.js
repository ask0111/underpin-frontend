import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import './HomePage.css';
import UserDetails from '../components/UserDetails';
import { useSocket } from '../config/SocketContext';
import Cookies from "js-cookie";

// const socket = io(process.env.REACT_APP_BACKEND_URL);

const HomePage = ({playerId}) => {
  const socket = useSocket();
  const [clickCount, setClickCount] = useState(0);
  const [users, setUsers] = useState([]);
  const token = Cookies.get("token");

  
  // Handle click
  const handleBananaClick = () => {
    // setClickCount((prevCount) => prevCount + 1);
    socket.emit('clickBanana', playerId); 
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      data.map(({_id, clickCount})=> {
        if(_id === playerId){
          setClickCount(clickCount)
        }
      })
      setUsers(data.sort((a, b) => b.clickCount - a.clickCount));
      console.log(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Real-time updates from server
  useEffect(() => {
    socket.on('userUpdated', ({user, users}) => {
      if (user.userId === playerId) {
        setClickCount(user.clickCount);
      }
      setUsers(()=> users.sort((a, b) => b.clickCount - a.clickCount))
    });

    return () => {
      socket.off('userUpdated');
    };
  }, [playerId]);

  return (
    <div className="bg-yellow-200 h-screen flex items-center justify-center">
      {/* <h1 className="text-2xl font-bold mb-4">Banana Click Game</h1> */}
      <button
        // whileTap={{ scale: 1.2 }}
        onClick={handleBananaClick}
        className=" w-[70%] relative h-full overflow-hidden"
      >
      <div className="absolute text-center w-full p-4 text-4xl font-semibold">{clickCount}</div>
      <img style={{ width: '100%', height: '100%' }} src="/banana.PNG" alt="Banana" />
      </button>
      <div className='w-[30%] h-full'>
        <UserDetails users={users} />
      </div>
    </div>
  );
};

export default HomePage;
