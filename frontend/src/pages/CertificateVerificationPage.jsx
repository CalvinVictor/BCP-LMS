import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/apiService'; // We'll add the new function here
import Layout from '../Components/Layout';

const CertificateVerificationPage = () => {
    const { verificationCode } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyCertificate = async () => {
            try {
                const data = await apiService.verifyCertificate(verificationCode);
                setCertificate(data);
            } catch (err) {
                setError("This certificate is not valid or could not be found.");
            } finally {
                setIsLoading(false);
            }
        };
        verifyCertificate();
    }, [verificationCode]);

    if (isLoading) return <Layout><div className="text-center text-white py-20">Verifying Certificate...</div></Layout>;
    if (error) return <Layout><div className="text-center text-red-400 py-20">{error}</div></Layout>;
    if (!certificate) return null;

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white text-gray-800 p-10 rounded-lg w-full max-w-4xl text-center shadow-2xl border-8 border-blue-900" style={{ fontFamily: "'Times New Roman', serif" }}>
                    <img src="https://stjosephs.edu/images/sju-logo.png" alt="St. Joseph's University Logo" className="h-20 mx-auto mb-8"/>
                    <p className="text-2xl mb-8">This is to certify that</p>
                    <p className="text-5xl font-bold text-purple-700 mb-8" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                        {certificate.student.username}
                    </p>
                    <p className="text-2xl mb-8">has successfully completed the course</p>
                    <p className="text-4xl font-semibold text-blue-900 mb-10">"{certificate.course.title}"</p>
                    <p className="text-md text-gray-600 mb-10">an online learning program authorized by St. Joseph’s University on {new Date(certificate.issueDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">
                        Verify at: https://stjosephs.edu/verify/{certificate.verificationCode}
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default CertificateVerificationPage;