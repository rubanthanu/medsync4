import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [step, setStep] = useState(1); // 1: OTP, 2: New Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    if (!email) {
        navigate('/login');
        return null;
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.verifyForgotPasswordOtp(email, otp);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await authService.resetPassword(email, otp, newPassword);
            setSuccess('Password reset successful! You can now login.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        setResendLoading(true);
        try {
            await authService.resendOtp(email, 'Forgot Password');
            setSuccess('A new OTP has been sent to your email.');
            setTimer(30); // 30 seconds cooldown
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="row justify-content-center animate-fade-in mt-5">
            <div className="col-md-5">
                <div className="card p-3 p-sm-5">
                    <div className="text-center mb-4">
                        <div className="bg-primary-subtle rounded-circle d-inline-flex p-3 mb-3">
                            <i className={`bi ${step === 1 ? 'bi-envelope-check' : 'bi-lock'} text-primary fs-2`}></i>
                        </div>
                        <h2 className="fw-bold text-dark">{step === 1 ? 'Verify OTP' : 'New Password'}</h2>
                        <p className="text-muted">
                            {step === 1 
                                ? `Enter the 6-digit code sent to ${email}`
                                : 'Choose a strong password for your account'}
                        </p>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {step === 1 ? (
                        <>
                            <form onSubmit={handleVerifyOtp}>
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg text-center fw-bold" 
                                        placeholder="Enter OTP"
                                        value={otp}
                                        maxLength="6"
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <p className="text-muted mb-0">Didn't receive the code?</p>
                                <button 
                                    className="btn btn-link text-primary text-decoration-none fw-bold" 
                                    onClick={handleResend} 
                                    disabled={resendLoading || timer > 0}
                                >
                                    {resendLoading ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Confirm Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;