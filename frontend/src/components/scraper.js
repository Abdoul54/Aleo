import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const checkUsers = async () => {
    try {
      const response = await fetch('/api/check-users');
      const data = await response.json();
      // Append new user information to the existing list
      setUsers((prevUsers) => [...prevUsers, ...data]);
    } catch (error) {
      console.error('Error checking users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(checkUsers, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setIsLoading(false);
    }
  }, [users]);

  return (
    <div>
      <h2>User List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((userData, index) => (
            <li key={index}>
              {userData.user.name} - {userData.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
