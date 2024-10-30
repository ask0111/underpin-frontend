import React from 'react';

const UserDetails = ({users=[]}) => {

    return (
        <div className="h-[100vh] p-2 ">
            <h2 className="text-2xl font-bold text-center mb-4">User Details</h2>
            <div className=" overflow-y-auto border-gray-300 rounded-l shadow-l ">
                <ul className="h-[85vh] divide-gray-200">
                    {users.map((user, index) => (
                        <li
                            key={index}
                            className="flex w-[90%] mx-auto justify-between items-center p-6 border hover:bg-gray-100 mt-1 hover: rounded-full transform  hover:scale-105"
                        >
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <span className="font-bold">{user.clickCount}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDetails;
