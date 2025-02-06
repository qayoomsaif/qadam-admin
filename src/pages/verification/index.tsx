import React from 'react';
import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from './verification.module.scss';
import OTPInput from '../../components/OtpInput';
import axios from '../../utils/axios';
import { useRouter } from "next/router";


const verification = () => {
  const router = useRouter();
  const [timer, setTimer] = useState(10);
  const [otpEntered, setOTPEntered] = useState(false);

  const handleOTPChange = (otp: string) => {
    setOTPEntered(true);
  };
  
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(countdown);
          // Trigger OTP request or perform any action here when timer reaches zero
          verify();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const verify = async () => {
    const otp = localStorage.getItem('otp');
    const token = localStorage.getItem('token');

    //e.preventDefault();
    try {
      const response = await axios.put('/api/auth/verify', {
        otp: otp,
        token: token,
      });
      if (response.status === 200) {
        router.push('./home')
      } else {
        console.log('Verification Failed:', response.data);
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
    }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className={styles["container"]}>
        <h1 className={styles["heading"]}>Verification</h1>
        <h4 className={styles["small-heading"]}>Enter the 6 character verification code we sent to you at 03*****1234</h4>

        <OTPInput length={6} onChange={handleOTPChange} />

        {timer === 0 && !otpEntered ? (
        <button className={styles["small-button"]}>Resend code via SMS</button>
      ) : (
        <h4 className={styles["small-heading"]}>
        Having trouble? Request a new OTP in{' '}
        <time style={{ color: '#001662' }}>{formatTime(timer)}</time>
      </h4>
      )}
    
      <h4 className={styles["small-heading"]}>Don’t have access to your number? <button className={styles["small-button"]}>Request a new OTP at abc@123.com</button></h4>

      <button
        className={`${styles['verify-button']} ${otpEntered ? styles['button'] : ''}`}
        onClick={verify}
      >
        Verify
      </button>
    </div>
    
  );
};

export default verification;



