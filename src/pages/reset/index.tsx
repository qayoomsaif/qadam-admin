// pages/LoginPage.tsx
import React from 'react';
import { useState } from 'react';
import Image from "next/image";
import styles from '../reset-password/reset-password.module.scss';
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const reset = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    //login logic to authenticate the user
  };

  return (
    <div className={styles["container"]}>

      <div>
      <h1 className={styles["heading"]}>Welcome!</h1>
      <h4 className={styles["small-heading"]}>Please sign in  to your account</h4>
      </div>

      <form className={styles["form"]} onSubmit={handleLogin}>

      <label className={styles["label"]}>Old Password</label>
        
          <input
          className={styles["input"]}
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Old Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        <label className={styles["label"]}>Password</label>
        <div style={{ position: 'relative' }} className={styles["input"]}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              border: "none",
              background: 'none',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handlePasswordToggle}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
      </div>

      <label className={styles["label"]}>Confirm Password</label>

        <div style={{ position: 'relative' }} className={styles["input"]}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              border: "none",
              background: 'none',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handlePasswordToggle}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
      </div>
    
        <button type="submit" className={styles["button"]}>Reset Password</button>

      </form>
    </div>
    
  );
};

export default reset;
